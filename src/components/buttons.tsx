import React from "react"
import { api } from "~/utils/api"
import { useRouter } from "next/router"

type PostButtonProps = {
  onClick?: (event: React.MouseEvent) => void
  children: React.ReactNode
}
const PostActionButton: React.FC<PostButtonProps> = ({
  onClick,
  children,
}: PostButtonProps) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        if (onClick) {
          onClick(e)
        }
      }}
      className={
        "rounded-sm p-1 text-xs text-gray-400 hover:bg-gray-700 focus:bg-gray-700"
      }
    >
      {children}
    </button>
  )
}

interface CommentsButtonProps {
  postId: string
  subbenditName: string
}

export const CommentsButton: React.FC<CommentsButtonProps> = ({
  postId,
  subbenditName,
}: CommentsButtonProps) => {
  const router = useRouter()
  const commentsNum = api.commentRouter.getCommentsNum.useQuery({
    postId: postId,
  })
  return (
    <PostActionButton
      onClick={(e) => {
        e.stopPropagation()
        router
          .push("/b/" + subbenditName + "/posts/" + postId)
          .then((r) => console.log(r))
      }}
    >
      {commentsNum.data} Comments
    </PostActionButton>
  )
}
export const ShareButton: React.FC = () => {
  return <PostActionButton>Share</PostActionButton>
}
export const SaveButton: React.FC = () => {
  return <PostActionButton>Save</PostActionButton>
}
export const HideButton: React.FC = () => {
  return <PostActionButton>Hide</PostActionButton>
}
export const ReportButton: React.FC = () => {
  return <PostActionButton>Report</PostActionButton>
}
export const AwardButton: React.FC = () => {
  return <PostActionButton>Award</PostActionButton>
}

interface VoteButtonProps {
  itemId: string
  itemType: "post" | "comment"
  changeScore: (change: number) => void
  voted: "UPVOTE" | "DOWNVOTE" | null
  setVoted: (value: "UPVOTE" | "DOWNVOTE" | null) => void
}

export const UpvoteButton: React.FC<VoteButtonProps> = ({
  itemId,
  itemType,
  changeScore,
  voted,
  setVoted,
}: VoteButtonProps) => {
  const mutation = api.voteRouter.vote.useMutation()

  const handleUpvote = () => {
    if (voted == "UPVOTE") {
      changeScore(-1)
      setVoted(null)
    } else if (voted == "DOWNVOTE") {
      changeScore(2)
      setVoted("UPVOTE")
    } else {
      changeScore(1)
      setVoted("UPVOTE")
    }
    mutation.mutate({
      type: "UPVOTE",
      itemType: itemType,
      itemId: itemId,
    })
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        handleUpvote()
      }}
      className={
        (voted == "UPVOTE" ? "text-orange-400" : "") +
        "rounded-sm hover:bg-gray-700"
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    </button>
  )
}

export const DownvoteButton: React.FC<VoteButtonProps> = ({
  itemId,
  itemType,
  changeScore,
  voted,
  setVoted,
}: VoteButtonProps) => {
  const mutation = api.voteRouter.vote.useMutation()
  const handleDownvote = () => {
    if (voted == "DOWNVOTE") {
      changeScore(1)
      setVoted(null)
    } else if (voted == "UPVOTE") {
      changeScore(-2)
      setVoted("DOWNVOTE")
    } else {
      changeScore(-1)
      setVoted("DOWNVOTE")
    }
    mutation.mutate({
      type: "DOWNVOTE",
      itemType: itemType,
      itemId: itemId,
    })
  }
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        handleDownvote()
      }}
      className={
        voted == "DOWNVOTE"
          ? "text-blue-400"
          : "" + "rounded-sm hover:bg-gray-700"
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </button>
  )
}
