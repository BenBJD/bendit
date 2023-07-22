import { type NextPage } from "next"
import Head from "next/head"
import { api } from "~/utils/api"
import { PostRow } from "~/components/posts"
import { CreatePost } from "~/components/misc"
import { useRouter } from "next/router"
import { SubbenditHeader } from "~/components/subbendit"
import { SubbenditSideBar } from "~/components/sidebar"

const SubbenditHome: NextPage = () => {
  const router = useRouter()
  const subbenditData = api.subbenditRouter.getSubbenditFromName.useQuery({
    name: router.query.subbenditName as string,
  })

  // get all posts
  const posts = api.postRouter.getPosts.useQuery({
    sort: "hot",
    subbenditId: subbenditData.data?.id,
    page: 1,
  })

  if (!subbenditData.data) {
    return <div>Subbendit not found</div>
  }

  return (
    <>
      <Head>
        <title>{subbenditData.data.name} - Bendit</title>
        <meta name="description" content="The back-alley of the internet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={"mt-20 flex flex-col space-y-3 p-4"}>
        <SubbenditHeader id={subbenditData.data.id} />
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
          <SubbenditSideBar />
        </div>
      </main>
    </>
  )
}

export default SubbenditHome
