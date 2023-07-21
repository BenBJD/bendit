import React, { useState, useEffect } from "react"
import type { PostsWithNames } from "~/types"
import Link from "next/link"
import {
  AwardButton,
  CommentsButton,
  DownvoteButton,
  HideButton,
  ReportButton,
  SaveButton,
  ShareButton,
  UpvoteButton,
} from "~/components/buttons"
import { api } from "~/utils/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import TimeAgo from "react-timeago"
import Image from "next/image"

interface PostRowProps {
  postData: PostsWithNames
}

export const PostButtons: React.FC<PostRowProps> = ({ postData }) => {
  return (
    <div className={"flex flex-row space-x-2"}>
      <CommentsButton
        postId={postData.id}
        subbenditName={postData.subbenditName}
      />
      <ShareButton />
      <SaveButton />
      <HideButton />
      <ReportButton />
      <AwardButton />
    </div>
  )
}

export const PostVotes: React.FC<PostRowProps> = ({ postData }) => {
  // Get vote status
  const vote = api.voteRouter.getVoteStatus.useQuery({
    itemId: postData.id,
    itemType: "post",
  })

  let originalVote = vote.data
  if (originalVote == undefined) {
    originalVote = null
  }

  useEffect(() => {
    if (vote.data !== undefined) {
      setVoted(vote.data)
    }
  }, [vote.data])

  const [voted, setVoted] = useState(originalVote)

  // Score tracking
  const [score, setScore] = useState(postData.upvotes - postData.downvotes)
  const changeScore = (change: number) => {
    setScore(score + change)
  }

  return (
    <div className={"w-1/10 flex flex-col items-center"}>
      <UpvoteButton
        itemId={postData.id}
        itemType={"post"}
        changeScore={changeScore}
        voted={voted}
        setVoted={setVoted}
      />
      <p className={"text-sm"}>{score}</p>
      <DownvoteButton
        itemId={postData.id}
        itemType={"post"}
        changeScore={changeScore}
        voted={voted}
        setVoted={setVoted}
      />
    </div>
  )
}

export const GuestPostVotes: React.FC<PostRowProps> = ({ postData }) => {
  return (
    <div className={"w-1/10 flex flex-col items-center"}>
      <UpvoteButton
        itemId={postData.id}
        itemType={"post"}
        changeScore={() => null}
        voted={null}
        setVoted={() => null}
      />
      <p className={"text-sm"}>{postData.upvotes - postData.downvotes}</p>
      <DownvoteButton
        itemId={postData.id}
        itemType={"post"}
        changeScore={() => null}
        voted={null}
        setVoted={() => null}
      />
    </div>
  )
}
export const PostRow: React.FC<PostRowProps> = ({ postData }: PostRowProps) => {
  const session = useSession()
  const router = useRouter()

  const handlePostClick = async () => {
    await router.push("/b/" + postData.subbenditName + "/posts/" + postData.id)
    window.scrollTo(0, 0)
  }

  return (
    <li>
      <div
        className={
          "flex flex-row space-x-2 border border-gray-700 p-1 transition-colors ease-in-out hover:border-fuchsia-700"
        }
        onClick={handlePostClick}
        role="button"
      >
        {session.status === "authenticated" ? (
          <PostVotes postData={postData} />
        ) : (
          <GuestPostVotes postData={postData} />
        )}
        {postData.ogImage && postData.url && (
          <div className={"relative w-1/12"}>
            <Link
              href={postData.url}
              className="aspect-w-16 aspect-h-9 rounded-md"
            >
              {postData.ogImage && (
                <Image
                  src={postData.ogImage}
                  alt="Preview image"
                  fill={true}
                  style={{ objectFit: "cover" }}
                />
              )}
            </Link>
          </div>
        )}
        <div className={"flex flex-auto flex-col"}>
          <Link href={"/b/" + postData.subbenditName + "/posts/" + postData.id}>
            <p className={"text-md"}>{postData.title}</p>
          </Link>
          <div className={"flex flex-row space-x-1"}>
            <Link
              href={"/b/" + postData.subbenditName}
              className={"text-xs text-gray-400 hover:text-fuchsia-500"}
            >
              <p>b/{postData.subbenditName}</p>
            </Link>
            <Link
              href={"/u/" + postData.userName}
              className={" text-xs text-gray-400 hover:text-fuchsia-500"}
            >
              <p>Posted by u/{postData.userName}</p>
            </Link>
            <p className={"text-xs text-gray-400"}>
              <TimeAgo date={postData.createdAt} />
            </p>
          </div>
          <PostButtons postData={postData} />
        </div>
      </div>
    </li>
  )
}
