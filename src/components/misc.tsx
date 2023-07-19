import Image from "next/image"
import React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"

export const CreatePost = () => {
  const session = useSession()
  const router = useRouter()
  let imageLink
  let username
  if (!!session.data?.user) {
    imageLink = session.data.user.image as string
    username = session.data.user.name as string
  } else {
    imageLink =
      "https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg"
  }
  return (
    <div
      className={
        "flex flex-row space-x-6 rounded-lg border border-gray-700 bg-gray-800 p-2"
      }
    >
      <Link href={"/u/" + username} className={"relative w-11"}>
        <Image
          src={imageLink as string}
          alt={"Profile Picture"}
          className={"ml-4 rounded-full border border-fuchsia-400"}
          fill={true}
        />
      </Link>
      <button
        className={
          "flex w-full rounded-xl bg-gray-800 p-2 outline-none ring-1 ring-fuchsia-800"
        }
        onClick={() => router.push("/post")}
      >
        <p className={"text-md"}>Create post</p>
      </button>
      <button className={"rounded-md px-2 hover:bg-gray-700"}>
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
      <button className={"rounded-md px-2 hover:bg-gray-700"}>
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
