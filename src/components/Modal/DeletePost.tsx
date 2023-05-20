import { Dialog, Transition } from "@headlessui/react";
import type { Post } from "@prisma/client";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { IoMdClose, IoMdTrash } from "react-icons/io";
import { api } from "~/utils/api";

const DeletePost = ({ post }: { post: Post }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const utils = api.useContext();
  const deletePost = api.posts.delete.useMutation({
    onSuccess: () => {
      utils.posts.findInfinite.invalidate().catch((err) => console.log(err));
      utils.posts.findInfiniteFollowing
        .invalidate()
        .catch((err) => console.log(err));
      utils.profiles.findById.invalidate().catch((err) => console.log(err));

      if (router.pathname.includes("/post")) {
        router.push("/").catch((err) => console.log(err));
      }
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
                      Excluir a publicação
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
                      Você também pode{" "}
                      <span className="font-semibold">
                        arquivar a publicação
                      </span>{" "}
                      se deseja vê-la mais tarde.
                    </span>

                    <button
                      onClick={() => {
                        deletePost({ postId: post.id }).catch((err) =>
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

export default DeletePost;
