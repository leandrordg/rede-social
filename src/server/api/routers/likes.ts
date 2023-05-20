import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const likesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { postId } = input;
      const userId = session.user.id;

      await prisma.like.create({
        data: {
          post: {
            connect: {
              id: postId,
            },
          },
          user: {
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
      const { prisma, session } = ctx;
      const { postId } = input;

      const userId = session.user.id;

      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
    }),
});
