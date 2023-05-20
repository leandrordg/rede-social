import { Dialog, Transition } from "@headlessui/react";
import type { Follows, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { IoMdClose } from "react-icons/io";

const FollowersModal = ({
  title,
  data,
  type,
}: {
  title: string;
  data: Follows &
    {
      following: User;
      follower: User;
    }[];
  type: "follower" | "following";
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="font-semibold text-gray-500 outline-none"
      >
        {data?.length === 1
          ? `${data?.length} ${type === "follower" ? "seguidor" : "seguindo"}`
          : `${data?.length} ${
              type === "follower" ? "seguidores" : "seguindo"
            }`}
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
                  <div className="flex items-center justify-between">
                    <Dialog.Title
                      as="span"
                      className="text-lg font-medium leading-6 text-gray-600"
                    >
                      {title}
                    </Dialog.Title>
                    <button onClick={() => setIsOpen(false)}>
                      <IoMdClose className="h-6 w-6 text-gray-600" />
                      <span className="sr-only">Fechar modal</span>
                    </button>
                  </div>

                  <div className="mt-4">
                    {type === "follower"
                      ? data?.map((profile) => (
                          <Link
                            href={`/profile/${profile.follower.id}`}
                            key={profile.follower.id}
                            onClick={() => setIsOpen(false)}
                            className="flex items-start gap-2 rounded-md p-2 hover:bg-neutral-50/50"
                          >
                            <Image
                              src={profile.follower.image!}
                              alt={profile.follower.name!}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                            <div className="flex flex-col items-start">
                              <span className="font-semibold">
                                {profile.follower.name}
                              </span>
                              <button className="text-sm text-gray-500">
                                Ver mais
                              </button>
                            </div>
                          </Link>
                        ))
                      : data?.map((profile) => (
                          <Link
                            href={`/profile/${profile.following.id}`}
                            key={profile.following.id}
                            onClick={() => setIsOpen(false)}
                            className="flex items-start gap-2 rounded-md p-2 hover:bg-neutral-50/50"
                          >
                            <Image
                              src={profile.following.image!}
                              alt={profile.following.name!}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                            <div className="flex flex-col items-start">
                              <span className="font-semibold">
                                {profile.following.name}
                              </span>
                              <button className="text-sm text-gray-500">
                                Ver mais
                              </button>
                            </div>
                          </Link>
                        ))}
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

export default FollowersModal;
