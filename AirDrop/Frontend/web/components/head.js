import { useContractContext } from "./Contents";

export default function Head() {
  const { isConnected, setAccounts } = useContractContext();

  function disconnectAccount() {
    setAccounts([]);
  }

  async function connectAccount() {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccounts(accounts);
      } else {
        console.error("ethernum not found");
      }
    } catch (e) {
      console.error("failed to connect to accounts: ", e);
    }
  }

  return (
    <div className="flex justify-end items-center w-full h-20">
      {isConnected ? (
        <button
          onClick={disconnectAccount}
          className="mr-5 px-5 py-2.5 relative rounded-lg group overflow-hidden font-medium bg-pink-800 text-white"
        >
          <span className="absolute left-0 top-0 h-full w-0 transition-all duration-200 ease-out bg-white group-hover:w-full opacity-90"></span>
          <span className="relative group-hover:text-black text-base font-semibold z-10">
            断开连接
          </span>
        </button>
      ) : (
        <button
          onClick={connectAccount}
          className="mr-5 px-5 py-2.5 relative rounded-lg group overflow-hidden font-medium bg-pink-800 text-white"
        >
          <span className="absolute left-0 top-0 h-full w-0 transition-all duration-200 ease-out bg-white group-hover:w-full opacity-90"></span>
          <span className="relative group-hover:text-black text-base font-semibold z-10">
            连接钱包
          </span>
        </button>
      )}
    </div>
  );
}
