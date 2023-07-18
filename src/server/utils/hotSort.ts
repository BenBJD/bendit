import { PrismaClient, VoteType } from "@prisma/client"

export const calculateHotness = (
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

export async function updatePostHotness(prisma: PrismaClient, postId: string) {
  // Update upvotes and downvotes
  const [upvotes, downvotes] = await Promise.all([
    prisma.vote.count({
      where: { postId: postId, type: VoteType.UPVOTE },
    }),
    prisma.vote.count({
      where: { postId: postId, type: VoteType.DOWNVOTE },
    }),
  ])

  // Update post with new votes
  await prisma.post.update({
    where: { id: postId },
    data: { upvotes: upvotes, downvotes: downvotes },
  })

  // Fetch post creation date
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { createdAt: true },
  })

  if (!post) throw new Error("Post not found")

  // Calculate hotness
  const hotness = calculateHotness(upvotes, downvotes, post.createdAt)

  // Update post
  await prisma.post.update({
    where: { id: postId },
    data: { hotness: hotness },
  })
}

export async function updateCommentHotness(
  prisma: PrismaClient,
  commentId: string
) {
  // Count upvotes and downvotes
  const [upvotes, downvotes] = await Promise.all([
    prisma.vote.count({
      where: { commentId: commentId, type: VoteType.UPVOTE },
    }),
    prisma.vote.count({
      where: { commentId: commentId, type: VoteType.DOWNVOTE },
    }),
  ])

  // Update comment with new votes
  await prisma.comment.update({
    where: { id: commentId },
    data: { upvotes: upvotes, downvotes: downvotes },
  })

  // Fetch comment creation date
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { createdAt: true },
  })

  if (!comment) throw new Error("Comment not found")

  // Calculate hotness
  const hotness = calculateHotness(upvotes, downvotes, comment.createdAt)

  // Update comment
  await prisma.comment.update({
    where: { id: commentId },
    data: { hotness: hotness },
  })
}
