import { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { api } from "~/utils/api"
import { PostRow } from "~/components/posts"
import { CreatePost } from "~/components/misc"

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
      <main className="mt-14 flex flex-col space-y-3 p-4">
        <h1 className="text-2xl font-bold">Welcome to {username}'s Profile</h1>
        {user.data ? (
          <div className="flex items-center space-x-2">
            <img
              src={user.data.image as string}
              alt={`${username}'s Profile Picture`}
              className="h-8 w-8 rounded-full"
            />
            <p className="text-gray-400">{user.data.name}</p>
          </div>
        ) : (
          <p className="text-gray-400">Loading user profile...</p>
        )}
        <div className="flex h-max w-screen space-x-4">
          <div className="w-3/4 rounded-lg border border-gray-700 bg-gray-800">
            <ul>
              {userPosts.data?.map((post) => (
                <PostRow postData={post} key={post.id} />
              ))}
            </ul>
          </div>
          <div className="w-1/4 rounded-lg border border-gray-700 bg-gray-800 p-2">
            sidebar
          </div>
        </div>
      </main>
    </>
  )
}

export default UserProfile
