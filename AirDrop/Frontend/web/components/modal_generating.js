import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { useContractContext } from "./Contents";
import { ethers } from "ethers";
import { useState } from "react";

export default function Generating({ merkleData, setMerkleData }) {
  const { setIsResultModalOpen, setIsConfigModalOpen, setError } =
    useContractContext();

  const [entries, setEntries] = useState([{ address: "", amount: "" }]);

  const addEntry = () => {
    setEntries([...entries, { address: "", amount: "" }]);
  };

  const removeEntry = (index) => {
    if (entries.length === 1) return;
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
  };

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleGenerate = () => {
    try {
      const validEntries = entries.map((entry, index) => {
        if (!ethers.isAddress(entry.address)) {
          throw new Error(`第 ${index + 1} 地址错误`);
        }

        if (isNaN(entry.amount) || Number(entry.amount) <= 0) {
          throw new Error(`第 ${index + 1} 无效`);
        }
        return [entry.address, ethers.parseUnits(entry.amount, 18).toString()];
      });
      const tree = StandardMerkleTree.of(validEntries, ["address", "uint256"]);
      const proofs = validEntries.map(([address], index) => ({
        address,
        proof: tree.getProof(index),
        amount: entries[index].amount,
      }));
      setMerkleData({
        root: tree.root,
        proofs: proofs.sort((a, b) => a.address.localeCompare(b.address)),
      });
      setIsConfigModalOpen(false);
      setIsResultModalOpen(true);
    } catch (err) {
      setError({
        title: "fault",
        message: err.message,
        details: err.stack,
      });
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md z-[998] flex items-center justify-center p-4">
      <div className="bg-gray-200 rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-center text-black mb-4">配置空投名单</h2>
          <button
            onClick={() => setIsConfigModalOpen(false)}
            className="px-2 py-1 bg-red-600/30 hover:bg-red-700/40 rounded-lg text-red-300
                      transition-all border border-red-600/50"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div key={index} className="flex gap-4 items-start group">
              <div className="flex-1 grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="钱包地址 (0x...)"
                  className="w-full px-4 py-2 bg-white border-2 border-black rounded-lg
                        text-black placeholder-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                        transition-all duration-300 font-mono text-sm"
                  value={entry.address}
                  onChange={(e) =>
                    handleEntryChange(index, "address", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="数量 (ETH)"
                  className="w-full px-4 py-2 bg-white border-2 border-black rounded-lg
                        text-black placeholder-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                        transition-all duration-300"
                  value={entry.amount}
                  onChange={(e) =>
                    handleEntryChange(index, "amount", e.target.value)
                  }
                  step="0.1"
                />
              </div>

              <button
                onClick={() => removeEntry(index)}
                className="px-2 py-1 bg-red-600/30 hover:bg-red-700/40 rounded-lg text-red-300
                      opacity-0 group-hover:opacity-100 transition-all border border-red-600/50"
                disabled={entries.length === 1}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={addEntry}
            className="px-6 py-2 bg-blue-600/50 hover:bg-blue-700/60 rounded-lg
                  border-2 border-blue-600 transition-all text-blue-100"
          >
            + 添加地址
          </button>
          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-green-600/50 hover:bg-green-700/60 rounded-lg
                  border-2 border-green-600 transition-all text-green-100
                  disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!entries.every((e) => e.address && e.amount)}
          >
            🌳 生成Merkle树
          </button>
        </div>
      </div>
    </div>
  );
}
