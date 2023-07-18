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
      })
    }),
  getSubbenditFromName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.subbendit.findUnique({
        where: { name: input.name.toLowerCase() },
      })
    }),
  createSubreddit: protectedProcedure
    .input(z.object({ name: z.string(), ownerId: z.string() }))
    .mutation(({ ctx, input }) => {
      ctx.prisma.subbendit.create({
        data: {
          name: input.name,
          ownerId: input.ownerId,
        },
      })
    }),
})
