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
        {post.url && (
          <Link
            href={post.url}
            className="relative flex w-64 items-center justify-center overflow-hidden rounded-3xl border border-neutral-400"
          >
            {post.ogImage ? (
              <Image
                src={post.ogImage as string}
                alt="Preview image"
                layout="fill"
                objectFit={"cover"}
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
            )}
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
          "h-10 w-full rounded-lg bg-neutral-900 p-2 ring-1 ring-gray-600 transition-colors ease-in-out hover:bg-neutral-800 focus:bg-neutral-800 focus:outline-none focus:outline-2 focus:ring-fuchsia-700"
        }
        placeholder={"Enter comment..."}
      />
      <input
        className={"rounded-lg bg-neutral-800 p-2 hover:bg-neutral-700"}
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
                "h-max w-3/4 rounded-lg border border-neutral-800 bg-neutral-900"
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
                "w-1/4 rounded-lg border border-neutral-800 bg-neutral-900 p-2"
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
