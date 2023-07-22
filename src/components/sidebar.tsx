import React from "react"
import Link from "next/link"

const CreatePostAndCommunity: React.FC = () => {
  return (
    <div
      className={
        "space-y-2 rounded-lg border border-neutral-800 bg-neutral-900 p-2"
      }
    >
      <div
        className={"border-b border-fuchsia-700 text-center text-2xl font-bold"}
      >
        <p>Front Page</p>
      </div>
      <div className={"flex flex-col space-y-2"}>
        <Link
          href={"/post"}
          className={"rounded-2xl bg-neutral-800 p-1 text-center"}
        >
          <p>Create Post</p>
        </Link>
        <Link
          href={"/b/new"}
          className={"rounded-2xl bg-neutral-800 p-1 text-center"}
        >
          <p>Create Community</p>
        </Link>
      </div>
    </div>
  )
}

const BenditIntro: React.FC = () => {
  return (
    <div className={"rounded-lg border border-neutral-800 bg-neutral-900 p-2"}>
      <div
        className={"border-b border-fuchsia-700 text-center text-xl font-bold"}
      >
        <p>Bendit</p>
      </div>
      <div>
        <p>
          Welcome to Bendit! Bendit is a Reddit clone that is currently in
          development. It is being developed by a single person, so it may take
          a while to get to a usable state. If you would like to contribute, go
          to GitHub.
        </p>
      </div>
    </div>
  )
}

export const FrontPageSideBar: React.FC = () => {
  return (
    <div className={"w-1/4 space-y-2"}>
      <CreatePostAndCommunity />
      <BenditIntro />
    </div>
  )
}

export const SubbenditSideBar: React.FC = () => {
  return (
    <div className={"w-1/4 space-y-2"}>
      <CreatePostAndCommunity />
      <BenditIntro />
    </div>
  )
}

// At the moment this is the same as FrontPageSideBar
export const PostSideBar: React.FC = () => {
  return <SubbenditSideBar />
}