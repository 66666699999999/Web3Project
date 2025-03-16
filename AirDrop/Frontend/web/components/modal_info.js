import { useContractContext } from "./Contents";

export default function Info({ merkleData }) {
  const { setIsResultModalOpen } = useContractContext();

  const formatProof = (proof) => {
    return proof.map((p) => `${p}`).join(",\n");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[998] flex items-center justify-center p-4">
      <div className="bg-gray-200 rounded-xl border-2 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl text-black">Merkle生成结果</h3>
            <button
              onClick={() => setIsResultModalOpen(false)}
              className="px-2 py-1 bg-red-600/30 hover:bg-red-700/40 rounded-lg text-red-300
                      transition-all border border-red-600/50"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-black block mb-2">Merkle Root:</label>
              <code className="block break-words p-4 bg-blue-900/20 rounded border border-blue-600">
                {merkleData.root}
              </code>
            </div>

            <div className="border-t border-blue-600/50 pt-4">
              <h4 className="text-xl text-black mb-4">
                空投详情 ({merkleData.proofs.length}个地址)
              </h4>
              <div className="space-y-6">
                {merkleData.proofs.map((item, index) => (
                  <div
                    key={index}
                    className="bg-blue-800/10 p-4 rounded border border-blue-600/30"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-black">地址:</span>
                        <code className="block break-words">
                          {item.address}
                        </code>
                      </div>
                      <div>
                        <span className="text-black">数量:</span>
                        <span className="block">{item.amount} ETH</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-black">Merkle Proof:</span>
                      <pre className="mt-2 p-4 bg-blue-900/20 rounded overflow-x-auto text-sm">
                        {formatProof(item.proof)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
