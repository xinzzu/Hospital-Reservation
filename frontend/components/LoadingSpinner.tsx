// SVG Icons
const Icons = {
  Loading: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
};

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-blue-500/30">
          <Icons.Loading />
        </div>
        <p className="text-slate-600 font-medium">Memuat...</p>
      </div>
    </div>
  );
}