import ErrorWindow from "./errorWindow";
import { ethers } from "ethers";
import { useContractContext } from "./Contents";

export default function AirDrop({
  formData,
  setFormData,
  setSuccessMsg,
  setIsProofOpen,
}) {
  const { airdropContract, error, setError } = useContractContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClaim = async () => {
    setError(null);
    setSuccessMsg("");

    if (!formData.address || !formData.amount || !formData.merkleProof) {
      setError("");
      return;
    }
    try {
      const proofArray = formData.merkleProof.split(",").map((s) => {
        const hexValue = s.trim();
        if (!/^0x[a-fA-F0-9]{64}$/.test(hexValue)) {
          throw new Error(`无效的Merkle Proof格式: ${hexValue}`);
        }
        return hexValue;
      });

      const amountParsed = ethers.parseUnits(
        formData.amount.toString(),
        "ether"
      );

      const tx = await airdropContract.Claim(
        formData.address,
        amountParsed,
        proofArray
      );
      await tx.wait();
      setSuccessMsg("领取成功，交易已确认！");
      setFormData({ address: "", amount: "", merkleProof: "" });
    } catch (err) {
      setError(err.message || "领取失败，请重试！");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md z-[998] flex items-center justify-center p-4">
      <div className="bg-gray-200 rounded-xl p-6 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => {
              setIsProofOpen(false);
              setFormData({
                address: "",
                amount: "",
                merkleProof: "",
              });
            }}
            className="px-2 py-1 bg-red-600/30 hover:bg-red-700/40 rounded-lg text-red-300
                      transition-all border border-red-600/50"
          >
            x
          </button>
        </div>
        <div className="flex flex-col items-center space-y-6">
          {[
            {
              name: "address",
              placeholder: " 输入你的地址",
              type: "text",
            },
            {
              name: "amount",
              placeholder: " 输入数量",
              type: "number",
            },
            {
              name: "merkleProof",
              placeholder: " 输入Proof，逗号分割",
              type: "text",
            },
          ].map(({ name, placeholder, type }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className="px-4 py-2 border-3 bg-white rounded-lg border-black text-black placeholder-black"
            />
          ))}
        </div>
        <div className="flex justify-center items-center">
          <button onClick={handleClaim} className="rounded-md">
            领取
          </button>
        </div>
      </div>
      {error && <ErrorWindow message={error} onClose={() => setError(null)} />}
    </div>
  );
}
