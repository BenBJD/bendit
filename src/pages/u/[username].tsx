import { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { api } from "~/utils/api"
import { PostRow } from "~/components/posts"
import Image from "next/image"

const UserProfile: NextPage = () => {
  const router = useRouter()
  const { username } = router.query as { username: string }

  // Get user data
  const user = api.userRouter.getFromName.useQuery({ name: username })

  // Get user's posts
  const userPosts = api.postRouter.getPosts.useQuery({
    sort: "hot",
    page: 1,
    userId: user.data?.id,
  })
  console.log(user.data?.image)

  return (
    <>
      <Head>
        <title>Bendit - {username}'s Profile</title>
        <meta name="description" content={`${username}'s profile on Bendit`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-24 flex flex-col space-y-3 p-4">
        {user.data ? (
          <div className={"flex h-10 flex-row space-x-2 pl-5"}>
            <div className="relative flex w-10 space-x-2">
              <Image
                src={user.data.image as string}
                alt={`${username}'s Profile Picture`}
                className="h-8 w-8 rounded-full"
                fill={true}
              />
            </div>
            <h1 className="text-2xl font-bold">
              Welcome to {username}'s Profile
            </h1>
          </div>
        ) : (
          <p className="text-gray-400 ">Loading user profile...</p>
        )}
        <div className="flex h-max w-screen space-x-4">
          <div className="w-3/4 rounded-lg border border-neutral-800 bg-neutral-900">
            <ul>
              {!userPosts.data || userPosts.data.length > 0 ? (
                userPosts.data?.map((post) => (
                  <PostRow postData={post} key={post.id} />
                ))
              ) : (
                <p className={"p-2"}>User has no posts yet.</p>
              )}
            </ul>
          </div>
          <div className="w-1/4 rounded-lg border border-neutral-800 bg-neutral-900 p-2">
            sidebar
          </div>
        </div>
      </main>
    </>
  )
}

export default UserProfile
