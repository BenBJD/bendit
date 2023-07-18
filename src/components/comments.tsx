import React, { useEffect, useState } from "react"
import { api } from "~/utils/api"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  AwardButton,
  DownvoteButton,
  HideButton,
  ReportButton,
  SaveButton,
  ShareButton,
  UpvoteButton,
} from "~/components/buttons"
import { CommentWithChildren } from "~/types"
import TimeAgo from "react-timeago"
import { PostButtons } from "~/components/posts"
import { useSession } from "next-auth/react"

interface CommentsButtonsProps {
  commentData: CommentWithChildren
}

export const CommentButtons: React.FC<CommentsButtonsProps> = ({
  commentData,
}: CommentsButtonsProps) => {
  return (
    <div className={"flex flex-row space-x-2"}>
      <ShareButton />
      <SaveButton />
      <HideButton />
      <ReportButton />
      <AwardButton />
    </div>
  )
}

interface CommentVotesProps {
  commentData: CommentWithChildren
}

const CommentVotes: React.FC<CommentVotesProps> = ({
  commentData,
}: CommentVotesProps) => {
  // Get vote status
  const vote = api.voteRouter.getVoteStatus.useQuery({
    itemId: commentData.id,
    itemType: "comment",
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
  const [score, setScore] = useState(
    commentData.upvotes - commentData.downvotes
  )
  const changeScore = (change: number) => {
    setScore(score + change)
  }

  return (
    <div className={"flex flex-row items-center space-x-1"}>
      <UpvoteButton
        itemId={commentData.id}
        itemType={"post"}
        changeScore={changeScore}
        voted={voted}
        setVoted={setVoted}
      />
      <p className={"text-sm"}>{score}</p>
      <DownvoteButton
        itemId={commentData.id}
        itemType={"post"}
        changeScore={changeScore}
        voted={voted}
        setVoted={setVoted}
      />
    </div>
  )
}

const GuestCommentVotes: React.FC<CommentVotesProps> = ({
  commentData,
}: CommentVotesProps) => {
  return (
    <div className={"flex flex-row items-center space-x-1"}>
      <UpvoteButton
        itemId={commentData.id}
        itemType={"post"}
        changeScore={() => null}
        voted={null}
        setVoted={() => null}
      />
      <p className={"text-sm"}>{commentData.upvotes - commentData.downvotes}</p>
      <DownvoteButton
        itemId={commentData.id}
        itemType={"post"}
        changeScore={() => null}
        voted={null}
        setVoted={() => null}
      />
    </div>
  )
}

interface CommentProps {
  commentId: string
}

export const Comment: React.FC<CommentProps> = ({
  commentId,
}: CommentProps) => {
  const comment = api.commentRouter.getChildComment.useQuery({
    commentId: commentId,
  })

  if (!comment.data) {
    return <>Error</>
  }

  const commentData = comment.data

  return (
    <div className={"ml-3 mt-4"}>
      <div className={"mb-2 flex h-5 w-5 flex-row space-x-2 rounded-full"}>
        <div>
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
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div className={"flex flex-row space-x-2"}>
          <Link className={"text-sm"} href={"/u/" + commentData.userId}>
            u/{commentData.users.name}
          </Link>
          <p className={"my-auto flex w-max text-xs text-gray-500"}>
            <TimeAgo date={commentData.createdAt.getTime()} />
          </p>
        </div>
      </div>
      <div className={"mb-2 ml-4 border-l border-gray-300 pb-1"}>
        <div className="ml-3 p-1">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {commentData.content}
          </ReactMarkdown>
        </div>
        <div className={" ml-4 flex flex-row space-x-2"}>
          <GuestCommentVotes commentData={commentData} />
        </div>
        {commentData.otherComments.map((comment) => (
          <Comment key={comment.id} commentId={comment.id} />
        ))}
      </div>
    </div>
  )
}
