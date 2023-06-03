import { z } from "zod"
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc"

export const postRouter = createTRPCRouter({
  getInSubreddit: publicProcedure
    .input(
      z.object({ subreddit: z.string(), sort: z.string(), page: z.number() })
    )
    .query(() => {}),
  getAll: publicProcedure
    .input(z.object({ sort: z.string(), page: z.number() }))
    .query(() => {}),
  getByUser: publicProcedure
    .input(z.object({ username: z.string(), page: z.number() }))
    .query(() => {}),
})
