import {
  PrismaClient,
  type VoteType,
  type Subbendit,
  type User,
  type Post,
  type Comment,
} from "@prisma/client"

import ogs from "open-graph-scraper"
import { isNotNonNullAssertionPunctuator } from "@typescript-eslint/utils/dist/ast-utils"

const prisma = new PrismaClient()

const calculateHotness = (
  upvotes: number,
  downvotes: number,
  createdAt: Date
): number => {
  const s = upvotes
  const ns = upvotes + downvotes

  // Reddit's algorithm uses Unix time, let's get the post's age in seconds
  const t =
    createdAt.getTime() / 1000 -
    Math.floor(new Date("2023-06-01T00:00:00Z").getTime() / 1000)

  // If there are no votes yet, return a score of 0
  if (ns === 0) {
    return 0
  }

  // Else calculate the hotness using Reddit's algorithm
  const z = 1.96 // 1.96 corresponds to a 95% confidence interval
  const p = s / ns
  const left = p + (z * z) / (2 * ns)
  const right = z * Math.sqrt((p * (1 - p)) / ns + (z * z) / (4 * ns * ns))
  const under = 1 + (z * z) / ns
  const score = (left - right) / under

  return score + t / 45000
}

async function main() {
  const numberOfUsers = 400
  const numberOfSubbendits = 5
  const numberOfSubsPerUser = 4
  const numberOfPosts = 300
  const numberOfTopComments = 900
  const commentDepth = 3
  const numberOfCommentVotes = 2500
  const commentVotePositivity = 0.8
  const numberOfPostVotes = 250
  const postVotePositivity = 0.8

  // Generate users and subbendits
  const usersData: { name: string; email: string; image: string }[] = []
  const subbenditsData: { name: string; description: string }[] = []
  // Generate users and subbendits
  for (let i = 0; i < numberOfUsers; i++) {
    usersData.push({
      name: `user${i + 1}`,
      email: `user${i + 1}@domain.com`,
      image:
        "https://cdn.discordapp.com/avatars/223837788125134848/6293f3711057e9b33ca970262a83f8b8.png",
    })
  }
  for (let i = 0; i < numberOfSubbendits; i++) {
    subbenditsData.push({
      name: `subbendit${i + 1}`,
      description: `Description for subbendit${i + 1}`,
    })
  }

  // Users and subbendits are created in parallel but both have to be done before creating the relations
  await Promise.all([
    prisma.user.createMany({
      data: usersData,
    }),
    prisma.subbendit.createMany({
      data: subbenditsData,
    }),
  ])
  console.log("Created users and subbendits")

  // Get all users and subbendits
  const users = await prisma.user.findMany()
  const subbendits = await prisma.subbendit.findMany()

  // Create random User-Subbendit relations
  const userSubbendits = []
  for (let user of users) {
    let subsDone: Subbendit[] = []
    for (let i = 0; i < numberOfSubsPerUser; i++) {
      const randomSubbendit = subbendits[
        Math.floor(Math.random() * subbendits.length)
      ] as Subbendit

      if (subsDone.includes(randomSubbendit)) {
        i--
        continue
      } else {
        subsDone.push(randomSubbendit)
      }

      userSubbendits.push({
        userId: user.id,
        subbenditId: randomSubbendit.id,
      })
    }
  }

  // Creating posts
  const postData: any[] = []
  for (let i = 0; i < numberOfPosts; i++) {
    const subbendit = subbendits[i % subbendits.length] as Subbendit
    const user = users[i % users.length] as User
    // Randomly make a post a link post
    postData.push({
      title: `Post ${i + 1}`,
      content: `Content for Post ${i + 1}`,
      userId: user.id,
      subbenditId: subbendit.id,
      url: Math.round(Math.random())
        ? "https://kaydee.net/blog/open-graph-image/"
        : null,
    })
  }

  // Create posts and user-subbendit relations in parallel
  await Promise.all([
    prisma.post.createMany({
      data: postData,
    }),
    prisma.userSubbendit.createMany({
      data: userSubbendits,
    }),
  ])
  console.log("Created posts and user-subbendit relations")

  const posts = await prisma.post.findMany()

  // Create some random comments
  const commentsText = [
    "Great post!",
    "This is very interesting.",
    "I love this!",
    "Awesome!",
    "Thanks for sharing.",
    "I agree with this.",
    "Very insightful!",
    "This is amazing!",
    "fr",
    "this",
    "This is very cool.",
    "I like this.",
    "I don't like this.",
    "I don't agree with this.",
    "I disagree with this.",
    "I don't think this is true.",
    "I think this is true.",
    "I think this is false.",
    "I don't think this is false.",
  ]

  // A function to create a random comment
  const createRandomComment = (parentId: string | null = null) => {
    const randomUser = users[Math.floor(Math.random() * users.length)] as User
    const randomPost = posts[Math.floor(Math.random() * posts.length)] as Post
    const randomComment = commentsText[
      Math.floor(Math.random() * commentsText.length)
    ] as string

    return {
      content: randomComment,
      userId: randomUser.id,
      postId: randomPost.id,
      parentCommentId: parentId,
    }
  }

  // Create random top-level comments
  const topLevelComments = []
  for (let i = 0; i < numberOfTopComments; i++) {
    topLevelComments.push(createRandomComment())
  }
  await prisma.comment.createMany({
    data: topLevelComments,
  })

  // Every time this loop runs, it creates sub-comments for random comments
  // It loads all the comments (including sub-comments created so far), then for each comment it has a 50% chance to create a sub-comment
  // It does this for commentDepth times as this should be enough to create a lot of comments up to a certain depth
  for (let i = 0; i < commentDepth; i++) {
    const subComments = []
    const allComments = await prisma.comment.findMany()
    for (let j = 0; j < allComments.length; j++) {
      // 50% chance to create a sub-comment
      if (Math.round(Math.random())) {
        const comment = allComments[j]
        subComments.push(createRandomComment(comment?.id))
      }
    }
    // Create the sub-comments
    await prisma.comment.createMany({
      data: subComments,
    })
  }
  console.log("Created sub-comments")

  const comments = await prisma.comment.findMany()
  console.log(comments.length)

  // Creating post and comment votes
  const voteTypes: VoteType[] = ["UPVOTE", "DOWNVOTE"]

  const postVotesAsync = async () => {
    // Make sure the same user doesn't vote on the same post twice
    const postVotes = []
    for (let user of users) {
      const postsDone: Post[] = []
      for (let i = 0; i < numberOfPostVotes; i++) {
        const randomPost = posts[
          Math.floor(Math.random() * posts.length)
        ] as Post

        if (postsDone.includes(randomPost)) {
          continue
        }

        postsDone.push(randomPost)

        const randomVoteType = voteTypes[
          Math.floor(Math.random() * postVotePositivity * voteTypes.length)
        ] as VoteType

        postVotes.push({
          userId: user.id,
          postId: randomPost.id,
          type: randomVoteType,
        })
      }
    }
    return postVotes
  }

  const commentVotesAsync = async () => {
    // Do the same for comments
    const commentVotes = []
    for (let user of users) {
      const commentsDone: Comment[] = []
      for (let i = 0; i < numberOfCommentVotes; i++) {
        const randomComment = comments[
          Math.floor(Math.random() * comments.length)
        ] as Comment

        if (commentsDone.includes(randomComment)) {
          continue
        }

        commentsDone.push(randomComment)

        const randomVoteType = voteTypes[
          Math.floor(Math.random() * commentVotePositivity * voteTypes.length)
        ] as VoteType

        commentVotes.push({
          userId: user.id,
          commentId: randomComment.id,
          type: randomVoteType,
        })
      }
    }
    return commentVotes
  }

  // Run the generators in parallel
  const [postVotes, commentVotes] = await Promise.all([
    postVotesAsync(),
    commentVotesAsync(),
  ])

  // Create post and comment votes in parallel
  await Promise.all([
    prisma.vote.createMany({
      data: postVotes,
    }),
    prisma.vote.createMany({
      data: commentVotes,
    }),
  ])
  console.log("Created post and comment votes")

  // Calculations

  // OpenGraph image
  const prismaUpdates = []
  for (let post of posts) {
    if (post.url) {
      prismaUpdates.push(
        prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            ogImage: (await ogs({ url: post.url })).result.ogImage?.at(0)?.url,
          },
        })
      )
    }
  }

  // Calculate upvotes, downvotes and hotness
  for (let post of posts) {
    const upvotes = await prisma.vote.count({
      where: {
        postId: post.id,
        type: "UPVOTE",
      },
    })

    const downvotes = await prisma.vote.count({
      where: {
        postId: post.id,
        type: "DOWNVOTE",
      },
    })

    const hotness = calculateHotness(upvotes, downvotes, post.createdAt)

    prismaUpdates.push(
      prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          upvotes,
          downvotes,
          hotness,
        },
      })
    )
  }
  await Promise.all(prismaUpdates)
  console.log("Calculated upvotes, downvotes and hotness")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
