import { Like, Prisma, User } from "@prisma/client";
import moment from "moment";
import "moment/locale/pt-br";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaComments } from "react-icons/fa";
import LeaveLike from "./LeaveLike";
import DeletePost from "./Modal/DeletePost";
import PostOptions from "./Modal/PostOptions";

export interface PostProps {
  post: {
    id: string;
    author: User;
    authorId: string;
    likes: Like[];
    text: string;
    createdAt: Date;
    updatedAt: Date;
    _count: Prisma.PostCountOutputType;
  };
}

const Post = ({ post }: PostProps) => {
  const { data: session } = useSession();

  const isMyPost = post.authorId === session?.user.id;

  return (
    <div className="flex items-start gap-2 break-all rounded-md p-4 shadow">
      {post.author?.image && (
        <Link href={`/profile/${post.author.id}`}>
          <img
            src={post.author.image}
            alt={post.author.name!}
            className="h-10 w-10 rounded-full object-cover"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col">
        <Link href={`/profile/${post.author?.id}`}>
          <span className="font-semibold">{post.author?.name}</span>
        </Link>
        <span className="text-sm font-light">
          {moment(post.createdAt).fromNow()}
        </span>

        <Link href={`/post/${post.id}`}>
          <p className="my-2">{post.text}</p>
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <Link href={`/post/${post.id}`}>
            <button className="flex items-center gap-1">
              <FaComments className="h-5 w-5 text-neutral-200" />
              <span className="text-sm text-neutral-500">
                {post._count?.comments}
              </span>
            </button>
          </Link>

          <LeaveLike post={post} />
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        {isMyPost && <DeletePost post={post} />}
        <PostOptions post={post} />
      </div>
    </div>
  );
};

export default Post;
