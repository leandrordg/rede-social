import { Tab } from "@headlessui/react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { HiArrowUp } from "react-icons/hi";
import CreatePost from "~/components/CreatePost";
import Header from "~/components/Header";
import Loading from "~/components/Loading";
import Post from "~/components/Post";

import { api } from "~/utils/api";

const limit = 10; // LIMITE DE POSTS POR FETCH NA QUERY

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  function handleScroll() {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const windowScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const scrolled = (windowScroll / height) * 100;

    setScrollPosition(scrolled);
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollPosition;
};

const Home: NextPage = () => {
  const { data: session } = useSession();

  const scrollPosition = useScrollPosition();

  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.posts.findInfinite.useInfiniteQuery(
      { limit },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  const {
    data: followingData,
    hasNextPage: hasFollowingNextPage,
    fetchNextPage: fetchFollowingNextPage,
    isFetching: isFollowingFetching,
  } = api.posts.findInfiniteFollowing.useInfiniteQuery(
    { limit },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];
  const followingPosts =
    followingData?.pages.flatMap((page) => page.posts) ?? [];

  const hasMore = hasNextPage || hasFollowingNextPage;

  useEffect(() => {
    if (scrollPosition > 90 && hasMore && !isFetching) {
      fetchNextPage().catch((err) => console.log(err));
      fetchFollowingNextPage().catch((err) => console.log(err));
    }
  }, [
    scrollPosition,
    hasMore,
    isFetching,
    fetchNextPage,
    fetchFollowingNextPage,
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4">
      <Header />

      <CreatePost />

      <section className="mb-4 flex flex-col space-y-4">
        <Tab.Group>
          <Tab.List className="sticky top-12 flex items-center bg-white">
            <Tab className="flex-1 border-b p-2 text-xs outline-none ui-selected:border-blue-500 ui-selected:text-blue-500 sm:p-4 sm:text-base">
              Ver tudo
            </Tab>
            <Tab className="flex-1 border-b p-2 text-xs outline-none ui-selected:border-blue-500 ui-selected:text-blue-500 sm:p-4 sm:text-base">
              Ver quem sigo
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel className="flex flex-col gap-y-2 p-0.5">
              {isFetching && <Loading />}
              {posts.length ? (
                <>
                  {posts.map((post) => {
                    return <Post key={post.id} post={post} />;
                  })}
                  {!hasNextPage && (
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        className="group flex items-center gap-2 rounded-full px-6 py-2 font-semibold text-gray-600 transition hover:bg-neutral-50"
                      >
                        <span>Voltar ao início</span>
                        <HiArrowUp className="h-4 w-4 transition group-hover:scale-110" />
                      </button>
                      <span className="text-center text-sm text-gray-500">
                        Não existem mais publicações para ser exibidas
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-neutral-500">
                  <span className="font-semibold">
                    Parece que não existe nenhuma publicação.
                  </span>
                  <span className="text-sm">
                    Você pode criar uma agora para deixar este lugar mais legal
                    :)
                  </span>
                </div>
              )}
            </Tab.Panel>
            <Tab.Panel className="flex flex-col gap-y-2 p-0.5">
              {session ? (
                <>
                  {isFollowingFetching && <Loading />}
                  {followingPosts.length ? (
                    <>
                      {followingPosts.map((post) => {
                        return <Post key={post.id} post={post} />;
                      })}
                      {!hasFollowingNextPage && (
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() =>
                              window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                            className="group flex items-center gap-2 rounded-full px-6 py-2 font-semibold text-gray-600 transition hover:bg-neutral-50"
                          >
                            <span>Voltar ao início</span>
                            <HiArrowUp className="h-4 w-4 transition group-hover:scale-110" />
                          </button>
                          <span className="text-center text-sm text-gray-500">
                            Não existem mais publicações para ser exibidas
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center text-neutral-500">
                      <span className="font-semibold">
                        Você não segue ninguém no momento.
                      </span>
                      <span className="text-sm">
                        Que tal seguir alguém para ver as publicações que você
                        quer?
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-neutral-500">
                  <span className="font-semibold">
                    Entre na sua conta para começar.
                  </span>
                  <span className="text-sm">
                    Faça o login para poder aproveitar ao máximo a plataforma.
                  </span>
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </section>
    </div>
  );
};

export default Home;
