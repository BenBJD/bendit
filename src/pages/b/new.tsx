import React, { useState, useEffect } from "react"
import { api } from "~/utils/api"
import Head from "next/head"
import { FrontPageSideBar } from "~/components/sidebar"

const CreateSubbendit: React.FC = () => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const subbenditMutation = api.subbenditRouter.createSubbendit.useMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await subbenditMutation.mutate({
      name,
      description,
    })
    setName("")
    setDescription("")

    if (subbenditMutation.error) {
      alert(subbenditMutation.error)
    } else {
      window.location.href = "/b/" + name
      window.scrollTo(0, 0)
    }
  }
  return (
    <>
      <Head>
        <title>New Community - Bendit</title>
        <meta name="description" content="Make a new subbendit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={"mt-20"}>
        <div className="mx-auto flex h-full w-full space-x-4 p-4">
          <div
            className={
              "w-3/4 rounded-lg border border-neutral-800 bg-neutral-900 p-4"
            }
          >
            <h2 className="mb-4 text-2xl font-bold">Create a New Subbendit</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-lg font-medium text-gray-200"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-neutral-900 p-2 text-gray-200 outline-none ring-1 ring-gray-600 transition-colors hover:bg-neutral-800 focus:ring-fuchsia-700"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="content"
                  className="block text-lg font-medium text-gray-200"
                >
                  Description
                </label>
                <textarea
                  id="content"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-neutral-900 p-2 text-gray-200 outline-none ring-1 ring-gray-600 transition-colors hover:bg-neutral-800 focus:ring-fuchsia-700"
                  required
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-white"
              >
                Create Community
              </button>
            </form>
          </div>
          <FrontPageSideBar />
        </div>
      </main>
    </>
  )
}

export default CreateSubbendit
