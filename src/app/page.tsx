import Link from "next/link";
import { ArrowRight, Sparkles, Monitor, Tv, UserCheck, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const modules = [
    {
      title: "Kiosk Pasien",
      desc: "Layar cetak mandiri nomor antrian per poli & dokter dengan layout cetak thermal 58mm",
      href: "/kiosk",
      badge: "Kiosk Mode",
      icon: <Monitor className="w-5 h-5 text-blue-600" />,
      color: "border-blue-200 bg-blue-50/50 text-blue-900",
      status: "Siap Digunakan",
      isReady: true,
    },
    {
      title: "Display Antrian TV",
      desc: "Layar informasi pemanggilan antrian TV 1080p dengan Text-to-Speech bahasa Indonesia",
      href: "/display",
      badge: "TV Display",
      icon: <Tv className="w-5 h-5 text-indigo-600" />,
      color: "border-indigo-200 bg-indigo-50/50 text-indigo-900",
      status: "Tahap Berikutnya",
      isReady: false,
    },
    {
      title: "Ruang Dokter & Loket",
      desc: "Antarmuka pemanggil antrian dokter (Panggil, Layani, Selesai, Lewati)",
      href: "/counter",
      badge: "Dokter / Loket",
      icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
      color: "border-emerald-200 bg-emerald-50/50 text-emerald-900",
      status: "Tahap Berikutnya",
      isReady: false,
    },
    {
      title: "Admin Panel & Kuota",
      desc: "Manajemen dokter, kuota harian, jadwal sesi, dan pengguna sistem",
      href: "/admin",
      badge: "Admin",
      icon: <ShieldCheck className="w-5 h-5 text-slate-600" />,
      color: "border-slate-200 bg-slate-50/50 text-slate-900",
      status: "Tahap Berikutnya",
      isReady: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between">
      <header className="border-b border-slate-200 bg-[#1A3673] text-white py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-xl text-white">
              +
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Klinik Pratama Kahatex</h1>
              <p className="text-xs text-blue-200">Sistem Antrian & Manajemen Pasien</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Prisma Ready
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1A3673] bg-blue-100 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Kiosk Pasien Telah Aktif
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Sistem Antrian & Manajemen Kuota Pasien
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Pilih modul di bawah ini untuk melihat tampilan atau mengoperasikan sistem antrian.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {modules.map((mod) => (
            <Link
              key={mod.title}
              href={mod.href}
              className={`p-6 rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group ${
                mod.isReady
                  ? "border-blue-300 ring-2 ring-blue-500/20 hover:-translate-y-1"
                  : "border-slate-200/80 hover:border-slate-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {mod.icon}
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${mod.color}`}>
                      {mod.badge}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      mod.isReady
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {mod.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1A3673] transition mb-1">
                  {mod.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{mod.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Rute: <code className="text-slate-700 font-mono font-semibold">{mod.href}</code></span>
                <span className={`font-bold flex items-center gap-1 ${mod.isReady ? "text-[#1A3673]" : "text-slate-400"}`}>
                  {mod.isReady ? "Buka Sekarang" : "Segera Hadir"}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200/80 max-w-4xl mx-auto shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Prisma Model Schema Terpasang:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Model</span>
              <strong className="text-slate-800 text-sm">User</strong>
              <span className="text-slate-500 block text-[11px] mt-1">Admin / Staff / Dokter</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Model</span>
              <strong className="text-slate-800 text-sm">Doctor</strong>
              <span className="text-slate-500 block text-[11px] mt-1">Poli & Awalan Tiket</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Model</span>
              <strong className="text-slate-800 text-sm">DailyQuota</strong>
              <span className="text-slate-500 block text-[11px] mt-1">Sesi & Batas Kuota</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Model</span>
              <strong className="text-slate-800 text-sm">Queue</strong>
              <span className="text-slate-500 block text-[11px] mt-1">Tiket & Status Antrian</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 bg-white">
        Klinik Pratama Kahatex &bull; Sistem Antrian Klinik
      </footer>
    </div>
  );
}
