import { useRouter } from "next/router";
import { IoArrowBackOutline } from "react-icons/io5";
import Comment from "~/components/Comment";
import CreateComment from "~/components/CreateComment";
import Header from "~/components/Header";
import Post from "~/components/Post";
import { api } from "~/utils/api";

const PostPage = () => {
  const router = useRouter();
  const postId = router.query.postId as string;

  const { data } = api.posts.findById.useQuery({ postId });
  const { data: comments } = api.comments.findById.useQuery({ postId });

  return (
    <div className="mx-auto max-w-2xl px-4">
      <Header />

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <IoArrowBackOutline className="h-6 w-6" />
            <span className="sr-only">Voltar</span>
          </button>
          <span className="text-2xl font-semibold">Publicação</span>
        </div>

        {data?.post && <Post post={data.post} />}

        <div className="flex flex-col gap-4">
          <span className="text-xl font-semibold">
            Comentários{" "}
            <span className="text-gray-500">{comments?.comments.length}</span>
          </span>

          {data && <CreateComment postId={data.post!.id} />}

          {comments?.comments.map((comment) => {
            return <Comment key={comment.id} comment={comment} />;
          })}
        </div>
      </section>
    </div>
  );
};

export default PostPage;
