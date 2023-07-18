import { z } from "zod"
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc"

export const userRouter = createTRPCRouter({
  getFromId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      // include subscribed subbendits
      return ctx.prisma.user.findUnique({
        where: { id: input.id },
        include: { userSubbendits: true },
      })
    }),
  getFromName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: { name: input.name },
        include: { userSubbendits: true },
      })
    }),
})
