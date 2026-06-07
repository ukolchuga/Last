type ParticipantFormProps = {
  addSigner: boolean;
  setAddSigner: (val: boolean) => void;
  signerEmail: string;
  setSignerEmail: (val: string) => void;
  signerWillSign: boolean;
  setSignerWillSign: (val: boolean) => void;
  onContinue: () => void;
};

export function ParticipantForm({
  addSigner,
  setAddSigner,
  signerEmail,
  setSignerEmail,
  signerWillSign,
  setSignerWillSign,
  onContinue
}: ParticipantFormProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white shadow-2xl rounded-3xl p-6 border border-ink/5 space-y-4">
      <div className="text-xl font-bold text-ink">Additional Participant</div>
      <p className="text-sm text-ink/60">You can add another person to this booking. They will receive an invitation email.</p>
      
      <div className="space-y-4">
        <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition group">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${addSigner ? 'bg-accent border-accent' : 'border-ink/20 group-hover:border-accent'}`}>
            {addSigner && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><path d="M20 6L9 17L4 12"/></svg>}
          </div>
          <input type="checkbox" className="hidden" checked={addSigner} onChange={() => setAddSigner(!addSigner)} />
          <span className="text-sm font-medium text-ink/80">Add another participant</span>
        </label>

        {addSigner && (
          <div className="space-y-3 p-3 bg-accent/5 rounded-xl border border-accent/10 animate-in fade-in zoom-in-95 duration-200">
            <input 
              type="email" 
              placeholder="Participant's email" 
              className="w-full bg-white border border-ink/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent"
              value={signerEmail}
              onChange={(e) => setSignerEmail(e.target.value)}
            />
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${signerWillSign ? 'bg-accent border-accent' : 'border-ink/20 group-hover:border-accent'}`}>
                {signerWillSign && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><path d="M20 6L9 17L4 12"/></svg>}
              </div>
              <input type="checkbox" className="hidden" checked={signerWillSign} onChange={() => setSignerWillSign(!signerWillSign)} />
              <span className="text-[11px] font-medium text-ink/60">This person will sign on the document</span>
            </label>
          </div>
        )}
      </div>

      <button 
        onClick={onContinue}
        className="w-full bg-accent text-white font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 transition"
      >
        Continue to Billing
      </button>
    </div>
  );
}
