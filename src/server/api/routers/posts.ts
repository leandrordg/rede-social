import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  findInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma, session } = ctx;
      const { cursor, limit } = input;

      const userId = session?.user?.id;

      const posts = await prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          likes: {
            where: {
              userId,
            },
          },
          _count: { select: { comments: true, likes: true } },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (posts.length > limit) {
        const nextItem = posts.pop() as (typeof posts)[number];

        nextCursor = nextItem.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),
  findInfiniteFollowing: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { cursor, limit } = input;

      const userId = session?.user?.id;

      const posts = await prisma.post.findMany({
        where: {
          author: {
            followers: {
              some: {
                followerId: userId,
              },
            },
          },
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          likes: {
            where: {
              userId,
            },
          },
          _count: { select: { comments: true, likes: true } },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (posts.length > limit) {
        const nextItem = posts.pop() as (typeof posts)[number];

        nextCursor = nextItem.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),
  findById: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { postId } = input;

      const userId = session?.user.id;

      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: true,
          likes: {
            where: {
              userId,
            },
          },
          _count: { select: { comments: true, likes: true } },
        },
      });

      return {
        post,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        text: z.string({ required_error: "Digite pelomenos algum texto" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { text } = input;

      const userId = session.user.id;

      await prisma.post.create({
        data: {
          text,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { postId } = input;

      await prisma.post.delete({
        where: {
          id: postId,
        },
      });
    }),
});
