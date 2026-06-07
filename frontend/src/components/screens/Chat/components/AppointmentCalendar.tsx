type AppointmentCalendarProps = {
  appointmentData: { date: string; time: string };
  setAppointmentData: (data: any) => void;
  onConfirm: () => void;
};

export function AppointmentCalendar({
  appointmentData,
  setAppointmentData,
  onConfirm
}: AppointmentCalendarProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white shadow-2xl rounded-3xl p-6 border border-ink/5 space-y-6">
      <div className="text-xl font-bold text-ink text-center">Select Appointment</div>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <button className="p-1 hover:bg-gray-200 rounded-lg transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div className="font-bold text-ink">June 2026</div>
            <button className="p-1 hover:bg-gray-200 rounded-lg transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
              <div key={d} className="text-[10px] font-bold text-ink/40 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1;
              const isSelected = appointmentData.date === `2026-06-${day.toString().padStart(2, '0')}`;
              return (
                <button 
                  key={i}
                  onClick={() => setAppointmentData({...appointmentData, date: `2026-06-${day.toString().padStart(2, '0')}`})}
                  className={`h-9 rounded-xl text-sm font-medium transition-all ${isSelected ? 'bg-accent text-white shadow-md scale-105' : 'hover:bg-accent/10 text-ink/80'}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {appointmentData.date && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="text-xs font-bold text-ink/40 uppercase tracking-widest mb-3">Available Times (CET)</div>
            <div className="grid grid-cols-3 gap-2">
              {['09:00', '10:30', '13:00', '14:30', '16:00', '17:30'].map(t => {
                const isSelected = appointmentData.time === t;
                return (
                  <button 
                    key={t}
                    onClick={() => setAppointmentData({...appointmentData, time: t})}
                    className={`py-2 rounded-xl text-sm font-bold border transition-all ${isSelected ? 'bg-accent border-accent text-white' : 'bg-white border-ink/10 text-ink/70 hover:border-accent'}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <button 
        disabled={!appointmentData.date || !appointmentData.time}
        onClick={onConfirm}
        className="w-full bg-accent text-white font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 transition disabled:opacity-30 disabled:pointer-events-none"
      >
        Confirm Appointment
      </button>
    </div>
  );
}
