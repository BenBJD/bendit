import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import Image from "next/image"
import { api } from "~/utils/api"
import Link from "next/link"

interface SubbenditHeaderProps {
  id: string
}

export const SubbenditHeader: React.FC<SubbenditHeaderProps> = ({
  id,
}: SubbenditHeaderProps) => {
  const router = useRouter()

  const subbendit = api.subbenditRouter.getSubbendit.useQuery({ id: id })
  let subbenditData
  if (!subbendit.data) {
    return <></>
  } else {
    subbenditData = subbendit.data
  }

  const links = [
    { link: "https://google.com", name: "Google" },
    { link: "https://facebook.com", name: "Facebook" },
    { link: "https://twitter.com", name: "Twitter" },
  ]
  return (
    <div className="relative">
      <Link href={"/b/" + subbenditData.name}>
        <Image
          src="https://styles.redditmedia.com/t5_2qh0s/styles/bannerBackgroundImage_7eod37wtj6881.png"
          alt={subbenditData.name}
          width={1920}
          height={384}
          className="object-cover"
        />
      </Link>
      <Link
        href={"/b/" + subbenditData.name}
        className="absolute left-14 top-1/3 flex -translate-y-1/2 transform flex-row space-x-4 text-white"
      >
        <div className={"rounded-full"}>
          <Image
            src={
              "https://cdn.discordapp.com/avatars/223837788125134848/7f518e6474f02c652943c2f05396ccf8.png"
            }
            alt={"Profile Picture"}
            width={64}
            height={64}
            className={"rounded-full"}
          />
        </div>
        <p className="my-auto text-2xl">r/{subbenditData.name}</p>
      </Link>
      <div className="mb-1 flex flex-row justify-center space-x-2 border-b border-gray-700 bg-gray-800 p-1">
        {links.map((link, index) => (
          <button
            key={index}
            className="border-b-2 border-gray-400 bg-gray-800 p-1"
            onClick={() => router.push(link.link)}
          >
            {link.name}
          </button>
        ))}
      </div>
    </div>
  )
}