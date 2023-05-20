import { VscLoading } from "react-icons/vsc";

const Loading = () => {
  return (
    <div className="flex items-center justify-center p-20">
      <VscLoading className="h-10 w-10 animate-spin transition text-gray-400" />
    </div>
  );
};

export default Loading;
