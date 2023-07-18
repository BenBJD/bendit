import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { VoteType } from "@prisma/client"
import { updateCommentHotness, updatePostHotness } from "~/server/utils/hotSort"

export const voteRouter = createTRPCRouter({
  getVoteStatus: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        itemType: z.enum(["post", "comment"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      if (input.itemType === "post") {
        const vote = await ctx.prisma.vote.findFirst({
          where: {
            userId,
            postId: input.itemId,
          },
        })
        if (!vote) return null
        return vote.type
      } else {
        const vote = await ctx.prisma.vote.findFirst({
          where: {
            userId,
            commentId: input.itemId,
          },
        })
        if (!vote) return null
        return vote.type
      }
    }),
  vote: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        itemType: z.enum(["post", "comment"]),
        type: z.enum([VoteType.UPVOTE, VoteType.DOWNVOTE]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      // Get the vote if it exists
      let vote
      if (input.itemType === "post") {
        vote = await ctx.prisma.vote.findFirst({
          where: {
            userId,
            postId: input.itemId,
          },
        })
      } else {
        vote = await ctx.prisma.vote.findFirst({
          where: {
            userId,
            commentId: input.itemId,
          },
        })
      }
      // Check if a vote was found and update, delete or create a new vote
      if (vote) {
        if (vote.type === input.type) {
          await ctx.prisma.vote.delete({
            where: {
              id: vote.id,
            },
          })
        } else {
          await ctx.prisma.vote.update({
            where: {
              id: vote.id,
            },
            data: {
              type: input.type,
            },
          })
        }
      } else {
        if (input.itemType === "post") {
          await ctx.prisma.vote.create({
            data: {
              type: input.type,
              userId: userId,
              postId: input.itemId,
            },
          })
        } else {
          await ctx.prisma.vote.create({
            data: {
              type: input.type,
              userId: userId,
              commentId: input.itemId,
            },
          })
        }
      }
      // recalculate votes and hotness
      if (input.itemType === "post") {
        await updatePostHotness(ctx.prisma, input.itemId)
      } else {
        await updateCommentHotness(ctx.prisma, input.itemId)
      }
    }),
})
