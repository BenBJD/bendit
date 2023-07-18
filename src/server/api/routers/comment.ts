import { z } from "zod"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import { CommentWithChildren } from "~/types"

export const commentRouter = createTRPCRouter({
  getTopLevelComments: publicProcedure
    .input(z.object({ postId: z.string(), page: z.number() }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: { postId: input.postId, parentCommentId: null },
        skip: (input.page - 1) * 50,
        take: 50,
        orderBy: { createdAt: "desc" },
        include: {
          users: {
            select: {
              name: true,
            },
          },
          otherComments: {
            select: {
              id: true,
            },
          },
        },
      })
      return comments.map((comment) => {
        return {
          ...comment,
          users: comment.users,
          otherComments: comment.otherComments,
        } as CommentWithChildren
      })
    }),

  getChildComment: publicProcedure
    .input(z.object({ commentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.findUnique({
        where: { id: input.commentId },
        include: {
          users: {
            select: {
              name: true,
            },
          },
          otherComments: {
            select: {
              id: true,
            },
          },
        },
      })
      if (!comment) {
        return null
      } else {
        return {
          ...comment,
          users: comment.users,
          otherComments: comment.otherComments,
        } as CommentWithChildren
      }
    }),

  getCommentsNum: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.comment.count({
        where: { postId: input.postId },
      })
    }),

  createComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        parentCommentId: z.string().optional(),
        content: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (input.postId === undefined && input.parentCommentId === undefined) {
        throw new Error("postId or parentCommentId must be defined")
      }
      if (input.parentCommentId === undefined) {
        return ctx.prisma.comment.create({
          data: {
            userId: ctx.session.user.id,
            content: input.content,
            postId: input.postId,
          },
        })
      } else {
        return ctx.prisma.comment.create({
          data: {
            userId: ctx.session.user.id,
            content: input.content,
            postId: input.postId,
            parentCommentId: input.parentCommentId,
          },
        })
      }
    }),
})
