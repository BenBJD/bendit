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
        itemType={"comment"}
        changeScore={changeScore}
        voted={voted}
        setVoted={setVoted}
      />
      <p className={"text-sm"}>{score}</p>
      <DownvoteButton
        itemId={commentData.id}
        itemType={"comment"}
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
        itemType={"comment"}
        changeScore={() => null}
        voted={null}
        setVoted={() => null}
      />
      <p className={"text-sm"}>{commentData.upvotes - commentData.downvotes}</p>
      <DownvoteButton
        itemId={commentData.id}
        itemType={"comment"}
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

const CommentReplyBox = (props: {
  postId: string
  commentId: string
  hidden: boolean
}) => {
  const [replyValue, setReplyValue] = useState<string>("")

  const commentMutation = api.commentRouter.createComment.useMutation()
  const voteMutation = api.voteRouter.vote.useMutation()

  const handleSubmit = async () => {
    await commentMutation.mutateAsync({
      content: replyValue,
      parentCommentId: props.commentId,
      postId: props.postId,
    })
    await voteMutation.mutateAsync({
      itemId: props.commentId,
      itemType: "comment",
      type: "UPVOTE",
    })
    window.location.reload()
  }

  return (
    <div className={"ml-3 mt-4 " + (props.hidden ? "hidden" : "")}>
      <div className={"mb-2 ml-4 border-l border-neutral-300 pb-1"}>
        <div className="ml-3 p-1">
          <textarea
            className={
              "h-24 w-1/2 rounded-lg bg-neutral-900 p-2 ring-1 ring-gray-600 transition-colors ease-in-out hover:bg-neutral-800 focus:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-700"
            }
            placeholder={"Enter Comment Reply..."}
            value={replyValue}
            onChange={(event) => setReplyValue(event.target.value)}
          />
        </div>
        <button
          className="ml-3 rounded-lg bg-neutral-800 p-2 hover:bg-neutral-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export const Comment: React.FC<CommentProps> = ({
  commentId,
}: CommentProps) => {
  const session = useSession()

  const { data: comment, status: commentStatus } =
    api.commentRouter.getChildComment.useQuery({
      commentId: commentId,
    })

  const [replyHidden, setReplyHidden] = useState<boolean>(true)

  if (!comment) {
    return <>Loading Comment...</>
  } else {
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
            <Link className={"text-sm"} href={"/u/" + comment.userId}>
              u/{comment.users.name}
            </Link>
            <p className={"my-auto flex w-max text-xs text-gray-500"}>
              <TimeAgo date={comment.createdAt.getTime()} />
            </p>
          </div>
        </div>
        <div className={"mb-2 ml-4 border-l border-neutral-300 pb-1"}>
          <div className="ml-3 p-1">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {comment.content}
            </ReactMarkdown>
          </div>
          <div className={" ml-4 flex flex-row space-x-2"}>
            {session.status === "authenticated" ? (
              <CommentVotes commentData={comment} />
            ) : (
              <GuestCommentVotes commentData={comment} />
            )}
            <button
              onClick={(event) => setReplyHidden((prevState) => !prevState)}
            >
              Reply
            </button>
          </div>
          <CommentReplyBox
            postId={comment.postId}
            hidden={replyHidden}
            commentId={comment.id}
          />
          {comment.otherComments.map((subcomment) => (
            <Comment key={subcomment.id} commentId={subcomment.id} />
          ))}
        </div>
      </div>
    )
  }
}
