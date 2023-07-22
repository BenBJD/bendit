import { NextPage } from "next"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { api } from "~/utils/api"
import Head from "next/head"

type OptionType = {
  value: string
  label: string
}

const NewPost: NextPage = () => {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [url, setUrl] = useState("")

  const postMutation = api.postRouter.createPost.useMutation()
  const voteMutation = api.voteRouter.vote.useMutation()

  const { data: subbendits, status: subbenditsStatus } =
    api.subbenditRouter.getSubbendits.useQuery() || [
      {
        id: "",
        name: "",
        description: null,
        createdAt: Date,
        updatedAt: Date,
        userId: null,
      },
    ]

  const [selectedSub, setSelectedSub] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Call your API endpoint to create the post
    const post = await postMutation.mutateAsync({
      title,
      content,
      url,
      subbenditName: selectedSub,
    })
    // Upvote the post
    await voteMutation.mutateAsync({
      type: "UPVOTE",
      itemId: post.id,
      itemType: "post",
    })
    // Handle the response and redirect to the post page or show a success message
    await console.log("New post created:", post)
    await router.push(`/b/${selectedSub}/posts/${post.id}`)
  }

  if (!subbendits) {
    return <>Loading...</>
  } else {
    return (
      <>
        <Head>
          <title>New Post - Bendit</title>
          <meta name="description" content="Make a new post" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={"mt-14"}>
          <div className="mx-auto flex h-[calc(100vh-3.5rem)] w-3/4 space-x-4 p-2">
            <div
              className={
                "w-3/4 rounded-lg border border-neutral-800 bg-neutral-900 p-4"
              }
            >
              <h2 className="mb-4 text-2xl font-bold">Create a New Post</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-lg font-medium text-gray-200"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl bg-neutral-900 p-2 text-gray-200 outline-none ring-1 ring-gray-600 transition-colors hover:bg-neutral-800 focus:ring-fuchsia-700"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="content"
                    className="block text-lg font-medium text-gray-200"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 w-full rounded-xl bg-neutral-900 p-2 text-gray-200 outline-none ring-1 ring-gray-600 transition-colors hover:bg-neutral-800 focus:ring-fuchsia-700"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="url"
                    className="block text-lg font-medium text-gray-200"
                  >
                    URL
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="border-1 mt-1 w-full rounded-xl bg-neutral-900 p-2 text-gray-200 outline-none ring-1 ring-gray-600 transition-colors hover:bg-neutral-800 focus:ring-fuchsia-700"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="subbendit"
                    className="block text-lg font-medium text-gray-200"
                  >
                    Subbendit
                  </label>
                  <select
                    id="subbendit"
                    value={selectedSub}
                    onChange={(e) => setSelectedSub(e.target.value as string)}
                    className="mt-1 w-full rounded-xl bg-neutral-900 p-2 text-gray-200 outline-none ring-1 ring-gray-600 transition-colors hover:bg-neutral-800 focus:ring-fuchsia-700"
                  >
                    {subbendits.map((option) => (
                      <option key={option.name} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white"
                >
                  Create Post
                </button>
              </form>
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

export default NewPost
