import Image from "next/image"
import React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"

export const CreatePost = () => {
  const session = useSession()
  const router = useRouter()

  return (
    <div
      className={
        "flex flex-row space-x-6 rounded-lg border border-neutral-800 bg-neutral-900 p-2"
      }
    >
      {!!session.data?.user && (
        <Link
          href={("/u/" + session.data.user.name) as string}
          className={"relative w-11"}
        >
          {session.data.user.image ? (
            <Image
              src={session.data.user.image}
              alt={"Profile Picture"}
              className={"ml-4 rounded-full border border-fuchsia-700"}
              fill={true}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="ml-4 rounded-full border border-fuchsia-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          )}
        </Link>
      )}
      <button
        className={
          "flex w-full rounded-xl bg-neutral-900 p-2 outline-none ring-1 ring-fuchsia-800"
        }
        onClick={() => router.push("/post")}
      >
        <p className={"text-md"}>Create post</p>
      </button>
      <button className={"rounded-md px-2 hover:bg-neutral-800"}>
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
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </button>
      <button className={"rounded-md px-2 hover:bg-neutral-800"}>
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
      </button>
    </div>
  )
}
