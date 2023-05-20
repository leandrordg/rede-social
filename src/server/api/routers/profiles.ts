import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const profilesRouter = createTRPCRouter({
  findById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { userId } = input;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          posts: {
            orderBy: { createdAt: "desc" },
            include: {
              author: true,
              likes: true,
              comments: true,
              _count: { select: { comments: true, likes: true } },
            },
          },
          followers: {
            where: {
              NOT: { followerId: userId },
            },
            include: {
              follower: true,
            },
          },
          following: {
            where: {
              NOT: { followingId: userId },
            },
            include: {
              following: true,
            },
          },
        },
      });

      return {
        user,
      };
    }),
  follow: protectedProcedure
    .input(
      z.object({
        userToFollowId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { userToFollowId } = input;

      const userId = session.user.id;

      await prisma.follows.create({
        data: {
          follower: { connect: { id: userId } },
          following: { connect: { id: userToFollowId } },
        },
      });
    }),
  unfollow: protectedProcedure
    .input(z.object({ userToUnfollowId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { userToUnfollowId } = input;

      const userId = session.user.id;

      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: userToUnfollowId,
          },
        },
      });
    }),
});
