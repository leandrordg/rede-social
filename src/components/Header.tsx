import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { IoEnterOutline, IoMailOutline } from "react-icons/io5";
import LogoutModal from "./Modal/LogoutModal";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header
      className={`sticky top-0 flex w-full items-center justify-between bg-white py-2`}
    >
      <Link href="/">
        <span className="text-sm font-semibold text-gray-500 sm:block md:text-base">
          Rede Social
        </span>
      </Link>

      {session ? (
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center gap-2 rounded-full p-2 transition hover:bg-neutral-100">
            <IoMailOutline className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Notificações</span>
          </button>
          <Link href={`/profile/${session.user.id}`}>
            <Image
              src={session.user.image!}
              alt={session.user.name!}
              width={32}
              height={32}
              className="rounded-full object-cover ring-2"
            />
          </Link>
          <LogoutModal />
        </div>
      ) : (
        <button
          onClick={() => {
            signIn().catch((err) => console.log(err));
            return;
          }}
          className="flex items-center justify-center gap-2 rounded-full p-2 transition hover:bg-neutral-100"
        >
          <IoEnterOutline className="h-5 w-5 text-neutral-500" />
          <span className="sr-only">Entrar</span>
        </button>
      )}
    </header>
  );
};

export default Header;
