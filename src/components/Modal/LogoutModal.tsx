import { Dialog, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import { Fragment, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoExitOutline } from "react-icons/io5";

const LogoutModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLogout = () => {
    setIsOpen(true);

    setTimeout(() => {
      setIsOpen(false);
      signOut().catch((err) => console.log(err));
    }, 2000);
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 rounded-full p-2 transition hover:bg-neutral-100"
      >
        <IoExitOutline className="h-5 w-5 text-neutral-500" />
        <span className="sr-only">Sair</span>
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
                  <div className="relative flex items-center justify-center">
                    <Dialog.Title
                      as="span"
                      className="text-lg font-medium leading-6 text-gray-700"
                    >
                      Desconectando...
                    </Dialog.Title>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="absolute right-4"
                    >
                      <IoMdClose className="h-6 w-6 text-gray-700" />
                      <span className="sr-only">Fechar modal</span>
                    </button>
                  </div>

                  <div className="mt-2 flex items-center">
                    <span className="text-center text-sm text-gray-500">
                      Você ainda poderá voltar a utilizar a plataforma novamente
                      fazendo o login.
                    </span>
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

export default LogoutModal;
