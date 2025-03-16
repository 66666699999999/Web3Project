import { useState } from "react";
import Info from "./modal_info";
import AirDrop from "./modal_airdrop";
import Generating from "./modal_generating";
import { useContractContext } from "./Contents";

export default function BodyCenter() {
  const {
    isResultModalOpen,
    isConfigModalOpen,
    setIsConfigModalOpen,
    isConnected,
  } = useContractContext();

  const [successMsg, setSuccessMsg] = useState("");
  const [isProofOpen, setIsProofOpen] = useState(false);

  const [merkleData, setMerkleData] = useState({ root: "", proofs: [] });

  const [formData, setFormData] = useState({
    address: "",
    amount: "",
    merkleProof: "",
  });

  return (
    <div className="flex-grow flex flex-col justify-center items-center w-full">
      {/* Button Control */}
      {isConnected ? (
        <div>
          {!isConfigModalOpen && !isResultModalOpen && (
            <div className="flex flex-col justify-center items-center">
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="mt-20 bg-pink-800 text-white px-6 py-2 rounded-md shadow-lg hover:bg-pink-600 transition duration-300"
              >
                构造 Merkle Tree
              </button>
              <button
                onClick={() => setIsProofOpen(true)}
                className="mt-20 bg-pink-800 text-white px-6 py-2 rounded-md shadow-lg hover:bg-pink-600 transition duration-300"
              >
                领取空投
              </button>
            </div>
          )}
        </div>
      ) : (
        <p
          className="bg-gray-400/40 text-white text-center text-3xl mt-30 mb-20 h-30 w-150
        flex items-center justify-center rounded-md shadow-lg animate-fade-in-up"
        >
          Welcome to CCC3 AirDrop !
        </p>
      )}
      {/* Modal Merkle Generating */}
      {isConfigModalOpen && <Generating setMerkleData={setMerkleData} />}
      {/* Modal Merkle Info */}
      {isResultModalOpen && <Info merkleData={merkleData} />}
      {/* Modal AirDrop */}
      {isProofOpen && (
        <AirDrop
          formData={formData}
          setFormData={setFormData}
          setSuccessMsg={setSuccessMsg}
          setIsProofOpen={setIsProofOpen}
        />
      )}
    </div>
  );
}
