type CountrySelectorProps = {
  selectedCountry: string;
  isChangingCountry: boolean;
  setIsChangingCountry: (val: boolean) => void;
  countrySearch: string;
  setCountrySearch: (val: string) => void;
  allCountries: string[];
  onSelect: (country: string) => void;
};

export function CountrySelector({
  selectedCountry,
  isChangingCountry,
  setIsChangingCountry,
  countrySearch,
  setCountrySearch,
  allCountries,
  onSelect
}: CountrySelectorProps) {
  if (isChangingCountry) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white/90 backdrop-blur shadow-2xl rounded-3xl p-6 border border-ink/5 space-y-4">
        <div className="text-xl font-bold text-ink">Change Country</div>
        <input
          autoFocus
          type="text"
          placeholder="Search country..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-accent text-sm"
          value={countrySearch}
          onChange={(e) => setCountrySearch(e.target.value)}
        />
        <div className="max-h-[200px] overflow-y-auto space-y-1 pr-2 scrollbar-hide">
          {allCountries
            .filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()))
            .map(country => (
              <button
                key={country}
                onClick={() => onSelect(country)}
                className="w-full text-left px-4 py-2 rounded-xl hover:bg-accent/10 hover:text-accent font-medium transition text-sm"
              >
                {country}
              </button>
            ))}
        </div>
        <button 
          onClick={() => setIsChangingCountry(false)}
          className="w-full py-2 text-ink/40 font-bold text-[10px] uppercase tracking-widest hover:text-ink transition"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-white/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 animate-in fade-in slide-in-from-bottom-1">
      <div className="text-xs font-medium text-ink/60 flex items-center gap-2">
        <span>Destination country:</span>
        <span className="text-accent font-bold">{selectedCountry}</span>
      </div>
      <button 
        onClick={() => setIsChangingCountry(true)}
        className="text-[10px] font-bold text-accent uppercase tracking-wider hover:underline"
      >
        Change
      </button>
    </div>
  );
}
