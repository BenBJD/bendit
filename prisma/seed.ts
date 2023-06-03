import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Creating users
  const user1 = await prisma.user.create({
    data: {
      name: "alice",
      email: "alice@example.com",
      image:
        "https://cdn.discordapp.com/avatars/223837788125134848/6293f3711057e9b33ca970262a83f8b8.png",
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: "bob",
      email: "bob@example.com",
      image:
        "https://cdn.discordapp.com/avatars/223837788125134848/6293f3711057e9b33ca970262a83f8b8.png",
    },
  })

  // Creating Subbendits
  const subbendit1 = await prisma.subbendit.create({
    data: {
      name: "technology",
      description: "Discuss about latest technology",
    },
  })

  const subbendit2 = await prisma.subbendit.create({
    data: {
      name: "nature",
      description: "Share your love for nature",
    },
  })

  // Creating Posts
  const post1 = await prisma.post.create({
    data: {
      title: "Latest AI trends",
      content: "Here are some latest AI trends...",
      userId: user1.id,
      subbenditId: subbendit1.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      title: "Beautiful Mountain",
      url: "https://google.com",
      userId: user2.id,
      subbenditId: subbendit2.id,
    },
  })

  // Creating Comments
  const comment1 = await prisma.comment.create({
    data: {
      content: "Nice post!",
      userId: user2.id,
      postId: post1.id,
    },
  })

  const comment2 = await prisma.comment.create({
    data: {
      content: "I love mountains!",
      userId: user1.id,
      postId: post2.id,
    },
  })

  // a subcomment of comment2
  const comment3 = await prisma.comment.create({
    data: {
      content: "I love mountains too!",
      userId: user2.id,
      postId: post2.id,
      parentCommentId: comment2.id,
    },
  })

  // Creating Votes
  await prisma.vote.create({
    data: {
      userId: user1.id,
      postId: post2.id,
      type: "UPVOTE",
    },
  })

  await prisma.vote.create({
    data: {
      userId: user2.id,
      postId: post1.id,
      type: "DOWNVOTE",
    },
  })

  // Creating User-Subbendit relations
  await prisma.userSubbendit.create({
    data: {
      userId: user1.id,
      subbenditId: subbendit1.id,
    },
  })

  await prisma.userSubbendit.create({
    data: {
      userId: user2.id,
      subbenditId: subbendit2.id,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
