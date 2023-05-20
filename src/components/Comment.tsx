import { User } from "@prisma/client";
import moment from "moment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaCommentDots } from "react-icons/fa";
import { IoIosThumbsUp } from "react-icons/io";
import CommentOptions from "./Modal/CommentOptions";
import DeleteComment from "./Modal/DeleteComment";

interface CommentProps {
  comment: {
    id: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    postId: string | null;
    author: User;
  };
}

const Comment = ({ comment }: CommentProps) => {
  const { data: session } = useSession();

  const isMyComment = comment.authorId === session?.user?.id;

  return (
    <div className="flex items-start gap-2 break-all rounded-md p-4 shadow">
      {comment.author.image && (
        <Link href={`/${comment.author.id}`}>
          <img
            src={comment.author.image}
            alt={comment.author.name!}
            className="h-10 w-10 rounded-full object-cover"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col">
        <Link href={`/${comment.author.id}`}>
          <span className="font-semibold">{comment.author.name}</span>
        </Link>
        <span className="text-sm font-light">
          {moment(comment.createdAt).fromNow()}
        </span>

        <p className="my-2">{comment.text}</p>

        <div className="flex flex-wrap items-center gap-4">
          <button className="flex items-center gap-1">
            <FaCommentDots className="h-5 w-5 text-neutral-200" />
            <span className="text-sm text-neutral-500">{0}</span>
          </button>
          <button className="flex items-center gap-1">
            <IoIosThumbsUp className="h-5 w-5 text-neutral-200" />
            <span className="text-sm text-neutral-500">{0}</span>
          </button>
        </div>
      </div>

      {isMyComment && <DeleteComment comment={comment} />}
      <CommentOptions />
    </div>
  );
};

export default Comment;
