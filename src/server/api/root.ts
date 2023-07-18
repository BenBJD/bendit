import { commentRouter } from "~/server/api/routers/comment"
import { postRouter } from "~/server/api/routers/post"
import { subbenditRouter } from "~/server/api/routers/subbendit"
import { userRouter } from "~/server/api/routers/user"
import { voteRouter } from "~/server/api/routers/vote"
import { createTRPCRouter } from "~/server/api/trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  commentRouter: commentRouter,
  postRouter: postRouter,
  subbenditRouter: subbenditRouter,
  userRouter: userRouter,
  voteRouter: voteRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
