import { Post } from "@prisma/client"

interface PostWithVotes extends Post {
  upvotes: number
  downvotes: number
}

function calculateScore(post: Post): number {
  const s = post.upvotes
  const ns = post.upvotes + post.downvotes

  // Reddit's algorithm uses Unix time, let's get the post's age in seconds
  const t = post.date.getTime() / 1000 - 1134028003

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

function sortPosts(posts: Post[]): Post[] {
  return posts.sort((a, b) => calculateScore(b) - calculateScore(a))
}
