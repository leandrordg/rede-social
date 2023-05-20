import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoAlertCircle } from "react-icons/io5";

const CommentOptions = () => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2">
        <HiOutlineDotsVertical className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only text-xs">Opções</span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="flex flex-col gap-y-2 p-2">
            {/* <Menu.Item>
              <button className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-neutral-100/50">
                <IoBookmark className="h-5 w-5 text-gray-500" />
                <span className="text-sm md:text-base">Favoritar</span>
              </button>
            </Menu.Item> */}

            <Menu.Item>
              <button className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-neutral-100/50">
                <IoAlertCircle className="h-5 w-5 text-gray-500" />
                <span className="text-sm md:text-base">Denunciar</span>
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default CommentOptions;
