import { z } from "zod"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import { type Post, VoteType } from "@prisma/client"
import { type PostsWithNames } from "~/types"
import ogs from "open-graph-scraper"

/*
 * Gets posts from a subbendit or user or all posts
 * If both subbenditId and userId are undefined, gets all posts
 *
 * @param subbenditId - The id of the subbendit to get posts from (optional)
 * @param userId - The id of the user to get posts from (optional)
 * @param sort - The sort method to use (hot, top, new, (TODO: controversial))
 * @param page - The page to get posts from
 *
 * @returns An array of posts
 */
export const postRouter = createTRPCRouter({
  getPosts: publicProcedure
    .input(
      z.object({
        subbenditId: z.string().optional(),
        userId: z.string().optional(),
        sort: z.enum(["hot", "top", "new"]),
        page: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Get posts based on sort
      let posts: Post[]
      let orderBy = {}
      switch (input.sort) {
        case "hot":
          orderBy = { hotness: "desc" }
          break
        case "top":
          orderBy = { upvotes: "desc" }
          break
        case "new":
          orderBy = { createdAt: "desc" }
          break
      }
      if (input.subbenditId !== undefined) {
        posts = await ctx.prisma.post.findMany({
          where: { subbenditId: input.subbenditId },
          skip: (input.page - 1) * 50,
          take: 50,
          orderBy: orderBy,
        })
      } else if (input.userId !== undefined) {
        posts = await ctx.prisma.post.findMany({
          where: { userId: input.userId },
          skip: (input.page - 1) * 50,
          take: 50,
          orderBy: orderBy,
        })
      } else {
        posts = await ctx.prisma.post.findMany({
          skip: (input.page - 1) * 50,
          take: 50,
          orderBy: orderBy,
        })
      }

      // Add the subreddit name and username to each post
      const postsWithNames = posts.map(async (post) => {
        const subbendit = await ctx.prisma.subbendit.findUnique({
          where: { id: post.subbenditId },
          select: { name: true },
        })
        const user = await ctx.prisma.user.findUnique({
          where: { id: post.userId },
          select: { name: true },
        })
        if (subbendit === null || user === null) {
          throw new Error("Subbendit or user not found")
        }
        return {
          ...post,
          subbenditName: subbendit.name,
          userName: user.name,
        }
      })

      const resolvedPostsWithNames: PostsWithNames[] = await Promise.all(
        postsWithNames
      )

      return resolvedPostsWithNames
    }),

  getPost: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Get post
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.id },
      })
      if (post == null) {
        return null
      }

      // Get posting user
      const user = await ctx.prisma.user.findUnique({
        where: { id: post.userId },
      })
      if (user == null) {
        throw new Error("Post OP not found")
      }

      // Get subbendit
      const subbenditName = await ctx.prisma.subbendit.findUnique({
        where: { id: post.subbenditId },
        select: { name: true },
      })
      if (subbenditName == null) {
        throw new Error("Subbendit posted in not found")
      }

      // Add to final object
      const postWithVotesAndPosterName: PostsWithNames = {
        ...post,
        userName: user.name,
        subbenditName: subbenditName.name,
      }
      return postWithVotesAndPosterName
    }),

  createPost: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string().optional(),
        subbenditName: z.string().optional(),
        subbenditId: z.string().optional(),
        url: z.string().optional(),
      })
    )
    .mutation<Promise<Post>>(async ({ ctx, input }): Promise<Post> => {
      if (input.url === undefined && input.content === undefined) {
        throw new Error("Must have url and/or content")
      }
      if (
        input.subbenditId === undefined &&
        input.subbenditName === undefined
      ) {
        throw new Error("Must have subbendit id and/or name")
      }
      let subbenditId: string
      if (input.subbenditId === undefined) {
        const subbendit = await ctx.prisma.subbendit.findUnique({
          where: { name: input.subbenditName },
        })
        if (subbendit === null) {
          throw new Error("Subbendit not found")
        }
        subbenditId = subbendit.id
      } else {
        subbenditId = input.subbenditId
      }

      let post: Post
      if (input.url !== undefined) {
        const ogImage = (await ogs({ url: input.url })).result.ogImage?.at(0)
          ?.url as string
        post = await ctx.prisma.post.create({
          data: {
            title: input.title,
            content: input.content,
            subbenditId: subbenditId,
            url: input.url,
            ogImage: ogImage,
            userId: ctx.session.user.id,
          },
        })
      } else {
        post = await ctx.prisma.post.create({
          data: {
            title: input.title,
            content: input.content,
            subbenditId: subbenditId,
            userId: ctx.session.user.id,
          },
        })
      }
      return post
    }),
})
