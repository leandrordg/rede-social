import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { api } from "~/utils/api";

const CreatePost = () => {
  const { data: session } = useSession();

  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const utils = api.useContext();
  const { mutateAsync } = api.posts.create.useMutation({
    onSuccess: () => {
      utils.posts.findInfinite.invalidate().catch((err) => console.log(err));
    },
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    mutateAsync({ text: text }).catch((err) => console.log(err));

    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
      <div className="flex flex-col overflow-hidden rounded-md border">
        <ReactTextareaAutosize
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!session}
          placeholder={
            session
              ? `O que está pegando ${session.user.name!}?`
              : "Entre para publicar algo."
          }
          className="resize-none p-4 outline-none"
        />
      </div>

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

export default CreatePost;
