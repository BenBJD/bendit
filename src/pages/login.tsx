import { signIn, useSession } from "next-auth/react"
import { NextPage } from "next"
import { useRouter } from "next/router"

const LoginPage: NextPage = () => {
  const session = useSession()
  const router = useRouter()
  if (session.data?.user) {
    router.push("/").then((r) => console.log("Redirected to /"))
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div>
          <button
            onClick={() => signIn("discord")}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Log in with Discord
          </button>
          <button
            onClick={() => signIn("spotify")}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Log in with Spotify
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
