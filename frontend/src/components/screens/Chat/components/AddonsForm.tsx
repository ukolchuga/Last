type AddonsFormProps = {
  selectedProduct: any;
  addApostille: boolean;
  setAddApostille: (val: boolean) => void;
  addProofOfRepresentation: boolean;
  setAddProofOfRepresentation: (val: boolean) => void;
  onProceed: () => void;
};

export function AddonsForm({
  selectedProduct,
  addApostille,
  setAddApostille,
  addProofOfRepresentation,
  setAddProofOfRepresentation,
  onProceed
}: AddonsFormProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white/90 backdrop-blur shadow-2xl rounded-3xl p-6 border border-ink/5 space-y-4">
      <div className="text-lg font-bold text-ink">Customise your service</div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 p-3 rounded-xl bg-white/60 cursor-pointer hover:bg-white transition group">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${addApostille ? 'bg-accent border-accent' : 'border-ink/20 group-hover:border-accent'}`}>
            {addApostille && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><path d="M20 6L9 17L4 12"/></svg>}
          </div>
          <input type="checkbox" className="hidden" checked={addApostille} onChange={() => setAddApostille(!addApostille)} /><span className="text-sm font-medium text-ink/80">+ Apostille</span>
        </label>
        {(selectedProduct.title?.en || selectedProduct.title || "").toLowerCase().includes("signature notarisation") && (
          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/60 cursor-pointer hover:bg-white transition group">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${addProofOfRepresentation ? 'bg-accent border-accent' : 'border-ink/20 group-hover:border-accent'}`}>
              {addProofOfRepresentation && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><path d="M20 6L9 17L4 12"/></svg>}
            </div>
            <input type="checkbox" className="hidden" checked={addProofOfRepresentation} onChange={() => setAddProofOfRepresentation(!addProofOfRepresentation)} /><span className="text-sm font-medium text-ink/80">+ Proof of Representation</span>
          </label>
        )}
      </div>
      <button onClick={onProceed} className="w-full bg-accent text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-90 transition">Proceed</button>
    </div>
  );
}
