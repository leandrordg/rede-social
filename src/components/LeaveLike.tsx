import { useSession } from "next-auth/react";
import { IoIosThumbsUp } from "react-icons/io";
import { api } from "~/utils/api";
import { PostProps } from "./Post";

const LeaveLike = ({ post }: PostProps) => {
  const { data: session } = useSession();
  const utils = api.useContext();

  const leaveLike = api.likes.create.useMutation({
    onSuccess: () => {
      utils.posts.findInfinite.invalidate().catch((err) => {
        console.log(err);
      });
      utils.posts.findById.invalidate().catch((err) => {
        console.log(err);
      });
      utils.posts.findInfiniteFollowing.invalidate().catch((err) => {
        console.log(err);
      });
      utils.profiles.findById.invalidate().catch((err) => {
        console.log(err);
      });
    },
  }).mutateAsync;
  const leaveUnlike = api.likes.delete.useMutation({
    onSuccess: () => {
      utils.posts.findInfinite.invalidate().catch((err) => {
        console.log(err);
      });
      utils.posts.findById.invalidate().catch((err) => {
        console.log(err);
      });
      utils.posts.findInfiniteFollowing.invalidate().catch((err) => {
        console.log(err);
      });
      utils.profiles.findById.invalidate().catch((err) => {
        console.log(err);
      });
    },
  }).mutateAsync;

  const hasLiked = session ? post.likes.length > 0 : false;

  return (
    <button
      onClick={() => {
        if (hasLiked) {
          leaveUnlike({ postId: post.id }).catch((err) => {
            console.log(err);
          });
          return;
        }
        leaveLike({ postId: post.id }).catch((err) => {
          console.log(err);
        });
      }}
      className="flex items-center gap-1"
    >
      <IoIosThumbsUp
        className={`h-5 w-5 text-neutral-200 ${hasLiked ? "text-primary" : ""}`}
      />
      <span className="text-sm text-neutral-500">{post._count?.likes}</span>
    </button>
  );
};

export default LeaveLike;
