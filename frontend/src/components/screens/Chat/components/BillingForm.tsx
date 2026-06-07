import { Mic } from "lucide-react";

type BillingFormProps = {
  billingData: any;
  setBillingData: (data: any) => void;
  voiceExtractedFields: string[];
  onVoiceClick: () => void;
  onProceed: () => void;
};

export function BillingForm({
  billingData,
  setBillingData,
  voiceExtractedFields,
  onVoiceClick,
  onProceed
}: BillingFormProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white shadow-2xl rounded-3xl p-6 border border-ink/5 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide relative">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-ink">Billing Information</div>
        <button 
          onClick={onVoiceClick}
          className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all shadow-sm"
          title="Fill with voice"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">First Name</label>
          <input type="text" className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm transition-colors duration-1000 ${voiceExtractedFields.includes('firstName') ? 'border-green-500 bg-green-50' : 'border-gray-200'}`} placeholder="John" value={billingData.firstName} onChange={e => setBillingData({...billingData, firstName: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Last Name</label>
          <input type="text" className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm transition-colors duration-1000 ${voiceExtractedFields.includes('lastName') ? 'border-green-500 bg-green-50' : 'border-gray-200'}`} placeholder="Doe" value={billingData.lastName} onChange={e => setBillingData({...billingData, lastName: e.target.value})} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Email Address</label>
          <input type="email" className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm transition-colors duration-1000 ${voiceExtractedFields.includes('email') ? 'border-green-500 bg-green-50' : 'border-gray-200'}`} placeholder="john@example.com" value={billingData.email} onChange={e => setBillingData({...billingData, email: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Phone Number</label>
          <input type="tel" className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm transition-colors duration-1000 ${voiceExtractedFields.includes('phone') ? 'border-green-500 bg-green-50' : 'border-gray-200'}`} placeholder="+1..." value={billingData.phone} onChange={e => setBillingData({...billingData, phone: e.target.value})} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Street Address</label>
          <input type="text" className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm transition-colors duration-1000 ${voiceExtractedFields.includes('address') ? 'border-green-500 bg-green-50' : 'border-gray-200'}`} placeholder="Main St 123" value={billingData.address} onChange={e => setBillingData({...billingData, address: e.target.value})} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">City</label>
            <input type="text" className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm transition-colors duration-1000 ${voiceExtractedFields.includes('city') ? 'border-green-500 bg-green-50' : 'border-gray-200'}`} placeholder="Vienna" value={billingData.city} onChange={e => setBillingData({...billingData, city: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">ZIP</label>
            <input type="text" className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm transition-colors duration-1000 ${voiceExtractedFields.includes('zip') ? 'border-green-500 bg-green-50' : 'border-gray-200'}`} placeholder="1010" value={billingData.zip} onChange={e => setBillingData({...billingData, zip: e.target.value})} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Country</label>
          <input type="text" className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm transition-colors duration-1000 ${voiceExtractedFields.includes('country') ? 'border-green-500 bg-green-50' : 'border-gray-200'}`} placeholder="Austria" value={billingData.country} onChange={e => setBillingData({...billingData, country: e.target.value})} />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${billingData.isCompany ? 'bg-accent border-accent' : 'border-ink/20 group-hover:border-accent'}`}>
            {billingData.isCompany && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><path d="M20 6L9 17L4 12"/></svg>}
          </div>
          <input type="checkbox" className="hidden" checked={billingData.isCompany} onChange={() => setBillingData({...billingData, isCompany: !billingData.isCompany})} />
          <span className="text-sm font-semibold text-ink/70">I am a company/organization</span>
        </label>

        {billingData.isCompany && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Company Name</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm" placeholder="Acme Inc." value={billingData.companyName} onChange={e => setBillingData({...billingData, companyName: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">VAT Number</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm" placeholder="ATU12345678" value={billingData.vatNumber} onChange={e => setBillingData({...billingData, vatNumber: e.target.value})} />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-ink/5 pt-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${billingData.sameAsBilling ? 'bg-accent border-accent' : 'border-ink/20 group-hover:border-accent'}`}>
            {billingData.sameAsBilling && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><path d="M20 6L9 17L4 12"/></svg>}
          </div>
          <input type="checkbox" className="hidden" checked={billingData.sameAsBilling} onChange={() => setBillingData({...billingData, sameAsBilling: !billingData.sameAsBilling})} />
          <span className="text-sm font-semibold text-ink/70">Contact details are same as billing</span>
        </label>
      </div>

      {!billingData.sameAsBilling && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 pt-2">
          <div className="text-lg font-bold text-ink">Contact Details</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">First Name</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm" placeholder="Jane" value={billingData.contactFirstName} onChange={e => setBillingData({...billingData, contactFirstName: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Last Name</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm" placeholder="Doe" value={billingData.contactLastName} onChange={e => setBillingData({...billingData, contactLastName: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Email</label>
              <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm" placeholder="jane@example.com" value={billingData.contactEmail} onChange={e => setBillingData({...billingData, contactEmail: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Phone</label>
              <input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm" placeholder="+1..." value={billingData.contactPhone} onChange={e => setBillingData({...billingData, contactPhone: e.target.value})} />
            </div>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Street Address</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm" placeholder="Contact St 456" value={billingData.contactAddress} onChange={e => setBillingData({...billingData, contactAddress: e.target.value})} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">City</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm" placeholder="Berlin" value={billingData.contactCity} onChange={e => setBillingData({...billingData, contactCity: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">ZIP</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm" placeholder="10115" value={billingData.contactZip} onChange={e => setBillingData({...billingData, contactZip: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Country</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm" placeholder="Germany" value={billingData.contactCountry} onChange={e => setBillingData({...billingData, contactCountry: e.target.value})} />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${billingData.contactIsCompany ? 'bg-accent border-accent' : 'border-ink/20 group-hover:border-accent'}`}>
              {billingData.contactIsCompany && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><path d="M20 6L9 17L4 12"/></svg>}
            </div>
            <input type="checkbox" className="hidden" checked={billingData.contactIsCompany} onChange={() => setBillingData({...billingData, contactIsCompany: !billingData.contactIsCompany})} />
            <span className="text-sm font-semibold text-ink/70">Is company/organization</span>
          </label>
          {billingData.contactIsCompany && (
            <div className="space-y-1 animate-in fade-in zoom-in-95 duration-200">
              <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Contact Company Name</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-accent text-sm" placeholder="Acme Logistics" value={billingData.contactCompanyName} onChange={e => setBillingData({...billingData, contactCompanyName: e.target.value})} />
            </div>
          )}
        </div>
      )}

      <button 
        onClick={onProceed}
        className="w-full bg-accent text-white font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 transition mt-4"
      >
        Proceed to Summary
      </button>
    </div>
  );
}
