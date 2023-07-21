import React, { ChangeEvent, useEffect, useState } from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import TimeAgo from "react-timeago"

import { api } from "~/utils/api"
import { Comment } from "~/components/comments"
import { GuestPostVotes, PostButtons, PostVotes } from "~/components/posts"
import { SubbenditHeader } from "~/components/subbendit"
import { useSession } from "next-auth/react"
import { set } from "zod"

const PostHeader: React.FC<{ postId: string }> = ({ postId }) => {
  const session = useSession()

  const { data: post, status: postStatus } = api.postRouter.getPost.useQuery({
    id: postId,
  })

  if (!post) {
    return <>Loading Post Data...</>
  } else {
    return (
      <div className={"flex flex-row justify-between space-x-2 p-2"}>
        <div className={"flex"}>
          <div className={"my-1"}>
            {session.status === "authenticated" ? (
              <PostVotes postData={post} />
            ) : (
              <GuestPostVotes postData={post} />
            )}
          </div>
          <div className={"ml-2 flex-col space-y-2"}>
            <div className={"flex flex-row space-x-2"}>
              <p>r/{post.subbenditName}</p>
              <Link
                href={"/u/" + post.userName}
                className={"my-auto flex text-xs text-gray-500"}
              >
                Posted by u/{post.userName}
              </Link>
              <p className={"my-auto flex text-xs text-gray-500"}>
                <TimeAgo date={post.createdAt} />
              </p>
            </div>
            <p className={"text-xl"}>{post.title}</p>
            {post.url && (
              <Link className={"text-xs text-blue-600"} href={post.url}>
                {post.url}
              </Link>
            )}
            <p>{post.content}</p>
            <PostButtons postData={post} />
          </div>
        </div>
        {post.url && post.ogImage && (
          <Link
            href={post.url}
            className="relative w-64 overflow-hidden rounded-3xl border border-gray-400"
          >
            <Image
              src={post.ogImage as string}
              alt="Preview image"
              layout="fill"
              objectFit={"cover"}
            />
          </Link>
        )}
      </div>
    )
  }
}

const CreateComment: React.FC<{ postId: string }> = ({ postId }) => {
  const createCommentMutation = api.commentRouter.createComment.useMutation()
  const [comment, setComment] = useState<string>("")

  const handleCreateComment = () => {
    createCommentMutation.mutate({
      postId: postId,
      content: comment,
    })
    setComment("")
    if (createCommentMutation.status !== "error") {
      window.location.reload()
    } else {
      alert("Failed to create comment" + createCommentMutation.error)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setComment(event.target.value)
  }

  return (
    <div className={"m-4 flex space-x-2 rounded-2xl p-1"}>
      <input
        value={comment}
        onChange={handleChange}
        type="text"
        className={
          "h-10 w-full rounded-lg bg-gray-800 p-2 ring-1 ring-gray-600 transition-colors ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:outline-2 focus:ring-fuchsia-700"
        }
        placeholder={"Enter comment..."}
      />
      <input
        className={"rounded-lg bg-gray-700 p-2 hover:bg-gray-600"}
        type={"submit"}
        onClick={handleCreateComment}
      />
    </div>
  )
}

const PostPage: NextPage = () => {
  const router = useRouter()

  const postId = router.query.postId

  const { data: post, status: postStatus } = api.postRouter.getPost.useQuery(
    {
      id: (!!postId ? postId : "") as string,
    },
    { enabled: !!postId }
  )

  // Get top level comments
  const { data: topLevelComments, status: topLevelCommentsStatus } =
    api.commentRouter.getTopLevelComments.useQuery(
      {
        postId: (!!postId ? postId : "") as string,
        page: 1,
      },
      { enabled: !!postId }
    )

  if (postStatus === "loading" || topLevelCommentsStatus === "loading") {
    return <>Loading...</>
  } else if (!post || !topLevelComments || !postId) {
    return <>Missing some data...</>
  } else {
    return (
      <>
        <Head>
          <title>{post.title}</title>
          <meta name="description" content={post.title} />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={"mt-14"}>
          <SubbenditHeader id={post.subbenditId} />
          <div className="mx-auto flex h-[calc(100vh-3.5rem)] w-3/4 space-x-4 p-2">
            <div
              className={
                "h-max w-3/4 rounded-lg border border-gray-700 bg-gray-800"
              }
            >
              <PostHeader postId={(!!postId ? postId : "") as string} />
              <CreateComment postId={(!!postId ? postId : "") as string} />
              <div>
                {topLevelComments.map((comment) => (
                  <Comment key={comment.id} commentId={comment.id} />
                ))}
              </div>
            </div>
            <div
              className={
                "w-1/4 rounded-lg border border-gray-700 bg-gray-800 p-2"
              }
            >
              sidebar
            </div>
          </div>
        </main>
      </>
    )
  }
}

export default PostPage
