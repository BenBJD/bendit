import { z } from "zod"
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc"

export const subbenditRouter = createTRPCRouter({
  getSubbendit: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.subbendit.findUnique({
        where: { id: input.id },
      } as any)
    }),
  getSubbenditFromName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.subbendit.findUnique({
        where: { name: input.name.toLowerCase() },
      } as any)
    }),
  getSubbendits: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.subbendit.findMany()
  }),
  createSubbendit: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.subbendit.create({
        data: {
          name: input.name.toLowerCase(),
          description: input.description,
          userId: ctx.session.user.id as string,
        } as any,
      })
    }),
})
