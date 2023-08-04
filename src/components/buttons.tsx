import React, { useState } from "react"
import {
  RedditShareButton,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  FacebookIcon,
  RedditIcon,
} from "react-share"
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
        "rounded-sm p-1 text-xs text-gray-400 hover:bg-neutral-800 focus:bg-neutral-800"
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

interface ShareButtonProps {
  postId: string
  subbenditName: string
}
export const ShareButton: React.FC<ShareButtonProps> = ({
  postId,
  subbenditName,
}) => {
  const [hidden, setHidden] = useState<boolean>(true)
  return (
    <PostActionButton
      onClick={(e) => {
        e.stopPropagation()
        setHidden(!hidden)
      }}
    >
      <p>Share</p>
      <div
        className={
          "fixed inset-x-0 bottom-0 flex items-end justify-center " +
          (hidden ? "hidden" : "")
        }
      >
        <div className="w-1/3 rounded-lg border border-fuchsia-700 bg-neutral-800 p-3">
          <div className="items center flex justify-between border-b border-fuchsia-700 py-2">
            <div className="flex items-center justify-center">
              <p className="text-xl font-bold text-gray-200">Share</p>
            </div>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 font-sans text-gray-300 hover:bg-neutral-600">
              X
            </button>
          </div>
          <div className="my-2">
            <p className="text-sm">Share this link via</p>
            <div className="my-2 flex justify-around">
              <div className="flex h-12 w-12 items-center justify-center rounded-full fill-gray-200 hover:bg-neutral-700">
                <RedditShareButton
                  url={
                    window.location.origin +
                    "/b/" +
                    subbenditName +
                    "/posts/" +
                    postId
                  }
                >
                  <RedditIcon round={true} size={48} />
                </RedditShareButton>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full fill-gray-200 hover:bg-neutral-700">
                <TwitterShareButton
                  url={
                    window.location.origin +
                    "/b/" +
                    subbenditName +
                    "/posts/" +
                    postId
                  }
                >
                  <TwitterIcon round={true} size={48} />
                </TwitterShareButton>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full fill-gray-200 hover:bg-neutral-700">
                <FacebookShareButton
                  url={
                    window.location.origin +
                    "/b/" +
                    subbenditName +
                    "/posts/" +
                    postId
                  }
                >
                  <FacebookIcon round={true} size={48} />
                </FacebookShareButton>
              </div>
            </div>

            <p className="text-sm">Or copy link</p>
            <div className="mt-4 flex items-center justify-between rounded-lg border border-fuchsia-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="ml-2 fill-gray-500"
              >
                <path d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-.943-.944-2.199-1.465-3.535-1.465s-2.592.521-3.535 1.465L4.929 12a5.008 5.008 0 0 0 0 7.071 4.983 4.983 0 0 0 3.535 1.462A4.982 4.982 0 0 0 12 19.071l.707-.707-1.414-1.414-.707.707a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.122-2.121z"></path>
                <path d="m12 4.929-.707.707 1.414 1.414.707-.707a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.122 2.121c-1.133 1.133-3.109 1.133-4.242 0L10.586 12l-1.414 1.414.707.707c.943.944 2.199 1.465 3.535 1.465s2.592-.521 3.535-1.465L19.071 12a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0z"></path>
              </svg>

              <input
                className="w-full bg-transparent outline-none"
                type="text"
                placeholder="link"
                value={
                  window.location.origin +
                  "/b/" +
                  subbenditName +
                  "/posts/" +
                  postId
                }
              />

              <button
                className=" rounded bg-fuchsia-800 px-4 py-2 text-sm text-white hover:bg-fuchsia-700"
                onClick={() => {
                  navigator.clipboard
                    .writeText(
                      window.location.origin +
                        "/b/" +
                        subbenditName +
                        "/posts/" +
                        postId
                    )
                    .then(() => {
                      setHidden(true)
                    })
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </PostActionButton>
  )
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
        "rounded-sm hover:bg-neutral-800"
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
          : "" + "rounded-sm hover:bg-neutral-800"
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
