import { Upload } from "lucide-react";

type DocumentStatusProps = {
  docsNotReady: boolean;
  setDocsNotReady: (val: boolean) => void;
  needHelpDrafting: boolean;
  setNeedHelpDrafting: (val: boolean) => void;
  onUploadClick: () => void;
  onContinue: () => void;
};

export function DocumentStatus({
  docsNotReady,
  setDocsNotReady,
  needHelpDrafting,
  setNeedHelpDrafting,
  onUploadClick,
  onContinue
}: DocumentStatusProps) {
  const canContinue = docsNotReady || needHelpDrafting;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col gap-3 bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
      <button 
        onClick={canContinue ? onContinue : onUploadClick}
        className="w-full bg-accent text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2"
      >
        {!canContinue && <Upload className="w-4 h-4" />}
        {canContinue ? "Continue without document" : "Upload my document"}
      </button>
      
      <div className="space-y-2 mt-1">
        <label className="flex items-center gap-3 p-3 rounded-xl bg-white/60 cursor-pointer hover:bg-white transition group">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${docsNotReady ? 'bg-accent border-accent' : 'border-ink/20 group-hover:border-accent'}`}>
            {docsNotReady && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><path d="M20 6L9 17L4 12"/></svg>}
          </div>
          <input type="checkbox" className="hidden" checked={docsNotReady} onChange={() => {
            setDocsNotReady(!docsNotReady);
            if (!docsNotReady && needHelpDrafting) setNeedHelpDrafting(false);
          }} />
          <span className="text-sm font-medium text-ink/80">Documents are not ready yet</span>
        </label>

        <label className="flex items-center gap-3 p-3 rounded-xl bg-white/60 cursor-pointer hover:bg-white transition group">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${needHelpDrafting ? 'bg-accent border-accent' : 'border-ink/20 group-hover:border-accent'}`}>
            {needHelpDrafting && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><path d="M20 6L9 17L4 12"/></svg>}
          </div>
          <input type="checkbox" className="hidden" checked={needHelpDrafting} onChange={() => {
            setNeedHelpDrafting(!needHelpDrafting);
            if (!needHelpDrafting && docsNotReady) setDocsNotReady(false);
          }} />
          <span className="text-sm font-medium text-ink/80">I need help drafting documents</span>
        </label>
      </div>
    </div>
  );
}
