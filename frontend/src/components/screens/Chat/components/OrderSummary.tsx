type OrderSummaryProps = {
  selectedProduct: any;
  finalAmount: number;
  onConfirm: () => void;
};

export function OrderSummary({
  selectedProduct,
  finalAmount,
  onConfirm
}: OrderSummaryProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white shadow-2xl rounded-3xl p-8 border border-ink/5 space-y-6 text-center">
      <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#501dff" strokeWidth="2.5"><path d="M20 6L9 17L4 12"/></svg>
      </div>
      <div>
        <div className="text-2xl font-bold text-ink">Order Summary</div>
        <p className="text-ink/50 text-sm mt-1">Review your total amount before final confirmation</p>
      </div>
      
      <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-ink/60 font-medium">{selectedProduct?.title}</span>
          <span className="text-ink font-bold">Included</span>
        </div>
        <div className="flex justify-between items-center text-sm border-t border-ink/5 pt-4">
          <span className="text-ink/60 font-medium">Service Fee & Notarization</span>
          <span className="text-ink font-bold">€{finalAmount}.00</span>
        </div>
        <div className="flex justify-between items-center text-xl border-t border-ink/10 pt-4">
          <span className="text-ink font-bold">Total</span>
          <span className="text-accent font-black">€{finalAmount}.00</span>
        </div>
      </div>

      <button 
        onClick={onConfirm}
        className="w-full bg-accent text-white font-bold py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-all duration-300"
      >
        Confirm & Submit
      </button>
    </div>
  );
}
