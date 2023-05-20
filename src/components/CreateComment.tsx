import { useSession } from "next-auth/react";
import { useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { api } from "~/utils/api";

const CreateComment = ({ postId }: { postId: string }) => {
  const { data: session } = useSession();

  const utils = api.useContext();
  const { mutateAsync } = api.comments.create.useMutation({
    onSuccess: () => {
      utils.posts.findById.invalidate({ postId }).catch((err) => {
        console.log(err);
      });
      utils.comments.findById.invalidate({ postId }).catch((err) => {
        console.log(err);
      });
    },
  });

  const [text, setText] = useState("");

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    mutateAsync({ text, postId }).catch((err) => console.log(err));

    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <ReactTextareaAutosize
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!session}
        placeholder={
          session
            ? `Comente o que achou disso, ${session.user.name!}`
            : "Entre para comentar na publicação."
        }
        className="resize-none rounded-md border p-4 outline-none"
      />
      <button
        type="submit"
        disabled={!text.length}
        className={`w-fit rounded-md bg-gray-200 px-6 py-2 text-gray-500 ${
          text.length && "bg-primary text-white"
        }`}
      >
        Publicar
      </button>
    </form>
  );
};

export default CreateComment;
