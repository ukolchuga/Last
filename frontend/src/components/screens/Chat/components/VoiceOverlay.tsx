import { Mic } from "lucide-react";

type VoiceOverlayProps = {
  isRecording: boolean;
  billingData: any;
  voiceExtractedFields: string[];
  onStop: () => void;
};

export function VoiceOverlay({
  isRecording,
  billingData,
  voiceExtractedFields,
  onStop
}: VoiceOverlayProps) {
  return (
    <div className="fixed inset-0 z-[130] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${isRecording ? 'bg-red-500 animate-pulse scale-110 shadow-[0_0_50px_rgba(239,68,68,0.5)]' : 'bg-accent shadow-[0_0_50px_rgba(80,29,255,0.5)]'}`}>
        <Mic className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-white text-3xl font-bold mb-10">{isRecording ? "Listening... Please dictate your details" : "Analyzing your voice..."}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl w-full">
        {[ 
          { label: 'First Name', key: 'firstName' }, 
          { label: 'Last Name', key: 'lastName' }, 
          { label: 'Email', key: 'email' }, 
          { label: 'Phone', key: 'phone' }, 
          { label: 'Address', key: 'address' }, 
          { label: 'City', key: 'city' }, 
          { label: 'ZIP', key: 'zip' }, 
          { label: 'Country', key: 'country' }, 
          { label: 'Company', key: 'companyName' }, 
          { label: 'VAT Number', key: 'vatNumber' }, 
        ].map(f => (
          <div key={f.key} className={`p-5 rounded-2xl border-2 transition-all duration-500 ${voiceExtractedFields.includes(f.key) ? 'bg-green-500/30 border-green-500 scale-105 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-white/20 border-white/20'}`}>
            <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${voiceExtractedFields.includes(f.key) ? 'text-green-400' : 'text-white/60'}`}>{f.label}</div>
            <div className="text-white font-bold text-base truncate">{/* @ts-ignore */}{billingData[f.key] || '---'}</div>
          </div>
        ))}
      </div>
      {isRecording && <button onClick={onStop} className="mt-12 bg-white text-ink font-bold px-12 py-4 rounded-2xl hover:scale-105 transition shadow-2xl">Stop Recording</button>}
    </div>
  );
}
