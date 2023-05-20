import { createTRPCRouter } from "~/server/api/trpc";
import { commentsRouter } from "./routers/comments";
import { likesRouter } from "./routers/likes";
import { postsRouter } from "./routers/posts";
import { profilesRouter } from "./routers/profiles";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profiles: profilesRouter,
  posts: postsRouter,
  comments: commentsRouter,
  likes: likesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
