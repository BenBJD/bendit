import React from "react"
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

const PostPage: NextPage = () => {
  const router = useRouter()
  const session = useSession()

  const post = api.postRouter.getPost.useQuery({
    id: router.query.postId as string,
  })

  const subbenditData = api.subbenditRouter.getSubbenditFromName.useQuery({
    name: router.query.subbenditName as string,
  })

  // Get top level comments
  const topLevelComments = api.commentRouter.getTopLevelComments.useQuery({
    postId: router.query.postId as string,
    page: 1,
  })

  if (
    post.status === "loading" ||
    subbenditData.status == "loading" ||
    topLevelComments.status == "loading"
  ) {
    return <>Loading...</>
  } else if (!post.data || !subbenditData.data || !topLevelComments.data) {
    return <>Missing some data...</>
  } else if (
    post.status === "error" ||
    subbenditData.status === "error" ||
    topLevelComments.status === "error"
  ) {
    return <>Error: {post.error || subbenditData.error}</>
  } else {
    return (
      <>
        <Head>
          <title>{post.data.title}</title>
          <meta name="description" content={post.data.title} />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={"mt-14"}>
          <SubbenditHeader id={post.data.subbenditId} />
          <div className="mx-auto flex h-[calc(100vh-3.5rem)] w-3/4 space-x-4 p-2">
            <div
              className={"w-3/4 rounded-lg border border-gray-700 bg-gray-800"}
            >
              <div className={"flex flex-row justify-between space-x-2 p-2"}>
                <div className={"flex"}>
                  <div className={"my-1"}>
                    {session.status === "authenticated" ? (
                      <PostVotes postData={post.data} />
                    ) : (
                      <GuestPostVotes postData={post.data} />
                    )}
                  </div>
                  <div className={"ml-2 flex-col space-y-2"}>
                    <div className={"flex flex-row space-x-2"}>
                      <p>r/{post.data.subbenditName}</p>
                      <Link
                        href={"/u/" + post.data.userName}
                        className={"my-auto flex text-xs text-gray-500"}
                      >
                        Posted by u/{post.data.userName}
                      </Link>
                      <p className={"my-auto flex text-xs text-gray-500"}>
                        <TimeAgo date={post.data.createdAt} />
                      </p>
                    </div>
                    <p className={"text-xl"}>{post.data.title}</p>
                    {post.data.url && (
                      <Link
                        className={"text-xs text-blue-600"}
                        href={post.data.url}
                      >
                        {post.data.url}
                      </Link>
                    )}
                    <p>{post.data.content}</p>
                    <PostButtons postData={post.data} />
                  </div>
                </div>
                {post.data.url && (
                  <div className="relative w-64 overflow-hidden rounded-3xl border border-gray-400">
                    <Image
                      src={post.data.ogImage as string}
                      alt="Preview image"
                      // width={640}
                      // height={360}
                      layout="fill"
                      objectFit={"cover"}
                    />
                  </div>
                )}
              </div>
              <div>
                {topLevelComments.data.map((comment) => (
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
