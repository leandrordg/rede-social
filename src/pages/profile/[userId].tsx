import { Tab } from "@headlessui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  IoArrowBackOutline,
  IoLockClosed,
  IoSettingsSharp,
} from "react-icons/io5";
import Header from "~/components/Header";
import FollowersModal from "~/components/Modal/FollowersModal";
import Post from "~/components/Post";
import { api } from "~/utils/api";

const UserPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const userId = router.query.userId as string;

  const utils = api.useContext();
  const { data } = api.profiles.findById.useQuery({ userId });
  const followUser = api.profiles.follow.useMutation({
    onSuccess: () => {
      utils.profiles.findById.invalidate().catch((err) => console.log(err));
    },
  }).mutateAsync;
  const unfollowUser = api.profiles.unfollow.useMutation({
    onSuccess: () => {
      utils.profiles.findById.invalidate().catch((err) => console.log(err));
    },
  }).mutateAsync;

  const isMyProfile = data?.user?.id === session?.user.id;

  const isFollowing = data?.user?.followers?.find(
    (follower) => follower.followerId === session?.user.id
  );

  return (
    <div className="mx-auto max-w-2xl px-4">
      <Header />

      {data && (
        <>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <IoArrowBackOutline className="h-6 w-6" />
              <span className="sr-only">Voltar</span>
            </button>
            <span className="text-2xl font-semibold">Perfil</span>
          </div>

          <section className="flex flex-col gap-4 py-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div className="relative">
                <Image
                  src={data.user!.image!}
                  alt={data.user!.name!}
                  width={172}
                  height={172}
                  quality={100}
                  className="rounded-full object-cover"
                />
                {isMyProfile && (
                  <Link
                    href={`/profile/edit-profile`}
                    className="absolute left-0 top-0 flex items-center gap-2 rounded-full bg-neutral-50 p-2 text-gray-500 shadow transition hover:bg-neutral-100"
                  >
                    <IoSettingsSharp className="h-6 w-6" />
                    <span className="sr-only text-sm">Editar perfil</span>
                  </Link>
                )}
              </div>
              <div className="flex w-full flex-col items-center sm:items-start">
                <div className="flex gap-2">
                  <span className="text-2xl font-semibold ">
                    {data.user!.name}
                  </span>

                  {!isMyProfile && (
                    <button
                      onClick={() => {
                        if (isFollowing) {
                          unfollowUser({ userToUnfollowId: userId }).catch(
                            (err) => console.log(err)
                          );
                          return;
                        }

                        followUser({ userToFollowId: userId }).catch((err) =>
                          console.log(err)
                        );
                      }}
                      className={`font-semibold ${
                        isFollowing ? "text-blue-500" : "text-gray-500"
                      }`}
                    >
                      {isFollowing ? "Seguindo" : "Seguir"}
                    </button>
                  )}
                </div>

                <span className="text-center text-neutral-500">
                  Entrou em{" "}
                  {data.user &&
                    new Date(data.user.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}
                </span>

                {/* Arrumar depois */}
                
                {/* {data.user && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <FollowersModal
                      type="follower"
                      data={data.user.followers}
                      title="Seguidores"
                    />
                    <FollowersModal
                      type="following"
                      data={data.user.following}
                      title="Seguindo"
                    />
                  </div>
                )} */}
              </div>
            </div>
          </section>

          <section className="relative flex flex-col gap-4">
            <Tab.Group>
              <Tab.List className="flex items-center overflow-x-scroll scrollbar-thin">
                <Tab className="flex-1 border-b p-4 text-gray-500 outline-none ui-selected:border-blue-500 ui-selected:text-blue-500">
                  <span>Publicações</span>
                </Tab>
                <Tab className="flex-1 border-b p-4 text-gray-500 outline-none ui-selected:border-blue-500 ui-selected:text-blue-500">
                  <span>Fotos/Vídeos</span>
                </Tab>
                <Tab className="flex-1 border-b p-4 text-gray-500 outline-none ui-selected:border-blue-500 ui-selected:text-blue-500">
                  <span>Compartilhou</span>
                </Tab>
                {isMyProfile && (
                  <Tab className="flex flex-1 items-center gap-2 border-b p-4 text-gray-500 outline-none ui-selected:border-blue-500 ui-selected:text-blue-500">
                    <span>Arquivadas</span>
                    <IoLockClosed />
                  </Tab>
                )}
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel className="flex flex-col gap-y-2 p-0.5">
                  {data?.user?.posts.length ? (
                    data.user.posts.map((post) => {
                      return <Post key={post.id} post={post} />;
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center text-neutral-500">
                      {isMyProfile ? (
                        <>
                          <span className="font-semibold">
                            Você não publicou nada até o momento.
                          </span>
                          <p className="text-sm">
                            Adicione uma publicação para ficar mais legal :)
                          </p>
                        </>
                      ) : (
                        <>
                          <span className="font-semibold">
                            {data?.user?.name} não publicou nada até o momento.
                          </span>
                          <span className="text-sm">
                            Siga {data?.user?.name} para saber quando houver uma
                            nova publicação.
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </section>
        </>
      )}
    </div>
  );
};

export default UserPage;

{
  /* <Tab.Group>
  <Tab.List className="flex items-center">
    <Tab className="flex-1 border-b p-4 outline-none ui-selected:border-blue-500 ui-selected:text-blue-500">
      <span>Publicações</span>
    </Tab>
    <Tab className="flex-1 border-b p-4 outline-none ui-selected:border-blue-500 ui-selected:text-blue-500">
      Seguidores
    </Tab>
  </Tab.List>
  <Tab.Panels>
    <Tab.Panel className="flex flex-col gap-2">
      
    </Tab.Panel>
    <Tab.Panel
      className={`${
        data?.user?.followers.length &&
        "grid grid-cols-1 sm:grid-cols-2"
      }`}
    >
      {data?.user?.followers.length ? (
        data?.user?.followers.map((follower) => (
          <Link
            key={follower.follower.id}
            href={`${follower.follower.id}`}
          >
            <div className="group flex items-start gap-2 rounded-md p-4 shadow hover:bg-neutral-50/30">
              <Image
                src={follower.follower.image!}
                alt={follower.follower.name!}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="font-semibold">
                  {follower.follower.name}
                </span>
                <div className="flex items-center gap-1 text-gray-500">
                  <span className="text-sm">Ver perfil</span>
                  <FaArrowRight className="h-3 w-3 transform transition group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="flex flex-col text-center text-neutral-500">
          <span className="text-center font-semibold">
            {data?.user?.name} ainda não tem nenhum seguidor!
          </span>
          <span className="text-sm">
            Você pode seguí-lo para começar uma amizade :)
          </span>
        </div>
      )}
    </Tab.Panel>
  </Tab.Panels>
</Tab.Group> */
}
