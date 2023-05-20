import { Dialog, Transition } from "@headlessui/react";
import { User } from "@prisma/client";
import { Fragment, useState } from "react";
import { IoMdClose, IoMdTrash } from "react-icons/io";
import { api } from "~/utils/api";

interface CommentProps {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  postId: string | null;
  author: User;
}

const DeleteComment = ({ comment }: { comment: CommentProps }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const utils = api.useContext();
  const deleteComment = api.comments.delete.useMutation({
    onSuccess: () => {
      utils.comments.findById.invalidate().catch((err) => console.log(err));
      utils.posts.findById.invalidate().catch((err) => console.log(err));
      setIsOpen(false);
    },
  }).mutateAsync;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <IoMdTrash className="h-5 w-5 text-gray-500" />
        <span className="sr-only text-sm md:text-base">Excluir</span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="relative flex">
                    <Dialog.Title
                      as="span"
                      className="text-lg font-medium leading-6 text-gray-700"
                    >
                      Excluir comentário
                    </Dialog.Title>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="absolute right-4"
                    >
                      <IoMdClose className="h-6 w-6 text-gray-700" />
                      <span className="sr-only">Fechar modal</span>
                    </button>
                  </div>

                  <div className="mt-2 flex flex-col gap-y-4">
                    <span className="text-sm text-gray-500">
                      Se confirmar, não poderá ver o comentário futuramente.
                    </span>

                    <button
                      onClick={() => {
                        deleteComment({ commentId: comment.id }).catch((err) =>
                          console.log(err)
                        );
                        return;
                      }}
                      className="rounded-md border bg-neutral-100 px-6 py-2 text-gray-500 transition hover:bg-neutral-200"
                    >
                      Confirmar exclusão
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DeleteComment;
