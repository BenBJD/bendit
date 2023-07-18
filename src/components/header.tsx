import React, { FC, useState, ChangeEvent, KeyboardEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"
import { Session } from "next-auth"

const LoginButtons: FC = () => {
  return (
    <nav className={"w-1/4"}>
      <ul className="flex space-x-6">
        <li>
          <Link href={"/login"}>Login</Link>
        </li>
        <li>
          <Link
            href={"/login"}
            className="rounded-full  bg-fuchsia-800 px-4 py-2"
          >
            Sign Up
          </Link>
        </li>
      </ul>
    </nav>
  )
}

interface ProfileButtonsProps {
  session: Session
}

const ProfileButtons: FC<ProfileButtonsProps> = ({
  session,
}: ProfileButtonsProps) => {
  return (
    <nav className={"flex w-1/4 justify-center"}>
      <ul className="flex space-x-6">
        <li className={"flex items-center rounded-md px-3 hover:bg-gray-700"}>
          <Link href={"/u/" + session.user.name}>{session.user.name}</Link>
        </li>
        <li>
          <button
            onClick={() => {
              signOut().then((r) => console.log("Signed out"))
            }}
            className="rounded-md bg-fuchsia-800 px-3 py-1"
          >
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  )
}

export const Header: FC = () => {
  const [search, setSearch] = useState<string>("")
  const { data: session } = useSession()

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value)
  }

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      event.preventDefault()
      //TODO: Search
      console.log("searching...")
    }
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-gray-700 bg-gray-800 p-2">
      <div className="flex w-1/4 items-center">
        <Link href={"/"} className={"ml-5"}>
          <h1 className="text-2xl">bendit</h1>
        </Link>
      </div>

      <form className="w-1/4">
        <input
          className="w-full rounded-2xl bg-gray-800 px-4 py-2 ring-1 ring-fuchsia-800 transition duration-300 hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
          type="search"
          placeholder="Search..."
          value={search}
          onChange={handleChange}
          onKeyDown={handleSearch}
          onKeyDownCapture={handleSearch}
        />
      </form>
      {session ? <ProfileButtons session={session} /> : <LoginButtons />}
    </header>
  )
}
