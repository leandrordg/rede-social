import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { HiPencil } from "react-icons/hi";
import { IoArrowBackOutline } from "react-icons/io5";
import Header from "~/components/Header";

const EditProfilePage = () => {
  const [modifiedProfile, setModifiedProfile] = useState({ bio: "" });

  const { data: session } = useSession();
  const router = useRouter();

  const haveModifiedProfile = modifiedProfile.bio.length > 0;

  if (!session) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center p-4">
        <span className="text-2xl font-bold uppercase text-gray-700">
          Você não está conectado
        </span>
        <p className="max-w-2xl text-gray-500">
          Para editar sua conta, entre ou crie uma agora mesmo clicando no botão
          abaixo
        </p>

        <button className="my-4 rounded-md border bg-gray-100 px-6 py-2 text-gray-600 transition hover:bg-gray-200 md:w-fit">
          Entrar ou criar conta
        </button>

        <Link href="/" className="w-fit text-sm text-blue-500 hover:underline">
          Ou continue navegando
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4">
      <Header />

      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <IoArrowBackOutline className="h-6 w-6" />
          <span className="sr-only">Voltar</span>
        </button>
        <span className="text-2xl font-semibold">Editar perfil</span>
      </div>

      <section className="flex flex-col items-center gap-8 py-8 sm:flex-row sm:items-start">
        <div className="relative h-fit w-fit">
          <Image
            src={session.user.image!}
            alt={session.user.name!}
            quality={100}
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
          <button className="absolute bottom-0 right-0 flex items-center gap-2 rounded-full bg-neutral-50 p-2 text-gray-500 shadow transition hover:bg-neutral-100">
            <HiPencil className="h-6 w-6" />
            <span className="sr-only text-sm">Editar imagem</span>
          </button>
        </div>
        <div className="flex w-full flex-1 flex-col">
          <span className="mb-2 text-xs text-gray-500">
            ID do usuário: {session.user.id}
          </span>

          <span className="font-semibold text-gray-600">Nome Completo</span>
          <input
            type="text"
            value={session.user.name!}
            className="pointer-events-none mb-4 border-b-2 bg-gray-50 p-2 font-light text-gray-500 outline-none"
          />
          <span className="font-semibold text-gray-600">
            Endereço de e-mail
          </span>
          <input
            type="text"
            value={session.user.email!}
            className="pointer-events-none mb-4 border-b-2 bg-gray-50 p-2 font-light text-gray-500 outline-none"
          />

          <span className="font-semibold text-gray-600">Biografia</span>
          <input
            type="text"
            placeholder="Adicione aqui sua biografia"
            onChange={(e) =>
              setModifiedProfile((prev) => ({ ...prev, bio: e.target.value }))
            }
            className="mb-4 border-b-2 p-2 font-light text-gray-500 outline-none"
          />

          <span className="font-semibold text-gray-600">Privacidade</span>
          <p className="text-xs text-gray-500">Selecione se deseja que sua conta seja pública ou privada.</p>
          <select
            placeholder="Adicione aqui sua biografia"
            onChange={(e) =>
              setModifiedProfile((prev) => ({ ...prev, bio: e.target.value }))
            }
            className="mb-4 border-b-2 p-2 font-light text-gray-500 outline-none"
          >
            <option value="public">Pública</option>
            <option value="private">Privada</option>
          </select>

          {haveModifiedProfile && (
            <button className="rounded-md bg-blue-500 px-6 py-2 text-white shadow transition hover:bg-blue-600">
              Salvar alterações
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfilePage;
