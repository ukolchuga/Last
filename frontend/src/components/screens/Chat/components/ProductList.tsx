type ProductListProps = {
  products: any[];
  onSelect: (product: any) => void;
  onNoneOfThese: () => void;
};

export function ProductList({ products, onSelect, onNoneOfThese }: ProductListProps) {
  if (products.length === 0) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="text-xs font-bold text-ink/40 uppercase tracking-widest">Recommended Services</div>
        <button onClick={onNoneOfThese} className="text-[10px] font-bold text-accent uppercase tracking-wider hover:underline">None of these</button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {products.map((p, i) => (
          <div key={i} className="min-w-[240px] bg-white/80 backdrop-blur shadow-sm border border-ink/5 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="text-ink font-bold leading-tight">{p.title?.en || p.title || "Product"}</div>
              <div className="text-xs text-ink/60 mt-1 line-clamp-2">{p.description?.en || p.description || ""}</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button onClick={() => onSelect(p)} className="text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent px-2 py-1 rounded">Select</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
