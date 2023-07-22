import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { api } from "~/utils/api"
import { PostRow } from "~/components/posts"
import { CreatePost } from "~/components/misc"
import { FrontPageSideBar } from "~/components/sidebar"

const Home: NextPage = () => {
  // get all posts
  const posts = api.postRouter.getPosts.useQuery({
    sort: "hot",
    page: 1,
  })

  return (
    <>
      <Head>
        <title>Bendit - The back-alley of the internet</title>
        <meta name="description" content="The back-alley of the internet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={"mt-20 flex flex-col space-y-3 p-4"}>
        <CreatePost />
        <div className="flex h-max w-full space-x-4">
          <div
            className={
              "h-max w-3/4 rounded-lg border border-neutral-800 bg-neutral-900"
            }
          >
            <ul>
              {posts.data?.map((post) => (
                <PostRow postData={post} key={post.id} />
              ))}
            </ul>
          </div>
          <FrontPageSideBar />
        </div>
      </main>
    </>
  )
}

export default Home
