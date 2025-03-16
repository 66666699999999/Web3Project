import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import CCC3AirDrop from "../../../Contract/out/merkleTree.sol/CCC3AirDrop.json";
import C3 from "../../../Contract/out/CCC3.sol/CCC3.json";

const ContractContext = createContext();

export const useContractContext = () => useContext(ContractContext);

export const ContractContextProvider = ({ children }) => {
  const [airdropAddress, setAirdropAddress] = useState(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  );

  const [airdropContract, setAirDropContract] = useState(null);
  const [C3Contract, setLC3Contract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const isConnected = Boolean(accounts[0]);

  const initContract = useEffect(() => {
    const initContract = async () => {
      if (isConnected && typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          const airdropInstance = new ethers.Contract(
            airdropAddress,
            CCC3AirDrop.abi,
            signer
          );
          setAirDropContract(airdropInstance);

          const C3Address = await airdropInstance.getAirDropTokenAddress();
          const C3Instance = new ethers.Contract(C3Address, C3.abi, signer);
          setLC3Contract(C3Instance);
        } catch (err) {
          console.error("创建合约实例失败:", err);
          setError("创建合约实例失败: " + err.message);
        }
      } else {
        setAirDropContract(null);
        setLC3Contract(null);
      }
    };

    initContract();
  }, [isConnected, airdropAddress]);

  return (
    <ContractContext.Provider
      value={{
        isConnected,
        accounts,
        setAccounts,
        error,
        setError,
        airdropAddress,
        airdropContract,
        C3Contract,
        isResultModalOpen,
        setIsResultModalOpen,
        isConfigModalOpen,
        setIsConfigModalOpen,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
