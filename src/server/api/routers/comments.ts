import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const commentsRouter = createTRPCRouter({
  findById: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { postId } = input;

      const comments = await prisma.comment.findMany({
        include: {
          author: true,
        },
        where: { postId },
        orderBy: { createdAt: "desc" },
      });

      return {
        comments,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        text: z.string({ required_error: "Digite algum comentário" }),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { text, postId } = input;

      const userId = session.user.id;

      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          comments: {
            create: {
              text,
              author: {
                connect: {
                  id: userId,
                },
              },
            },
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { commentId } = input;

      await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
    }),
});
