"use client";

import { useState } from "react";
import { HelpCircle, X, MousePointerClick, Ticket, Volume2, CheckCircle2 } from "lucide-react";

export default function KioskGuideModal() {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      num: "1",
      icon: <MousePointerClick className="w-5 h-5 text-[#1A3673]" />,
      title: "Pilih Dokter & Poliklinik",
      desc: "Sentuh kartu dokter tujuan Anda pada layar (Poli Umum, Poli Gigi, atau Poli KIA).",
    },
    {
      num: "2",
      icon: <Ticket className="w-5 h-5 text-emerald-600" />,
      title: "Isi Nama Pasien (Opsional)",
      desc: "Anda dapat mengetik nama pasien atau langsung klik 'Lewati' untuk mencetak tanpa nama.",
    },
    {
      num: "3",
      icon: <Volume2 className="w-5 h-5 text-indigo-600" />,
      title: "Ambil Tiket & Tunggu Panggilan",
      desc: "Ambil kertas tiket dari mesin printer thermal dan perhatikan panggilan pada layar TV antrian.",
    },
  ];

  return (
    <>
      {/* Floating Action Button (FAB) at Bottom Right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 bg-white hover:bg-slate-50 text-[#1A3673] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-lg border-2 border-blue-200/90 flex items-center gap-2 hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer print:hidden"
        title="Lihat Tata Cara Pengambilan Antrian"
      >
        <HelpCircle className="w-4 h-4 text-[#1A3673]" />
        <span>Panduan Antrian</span>
      </button>

      {/* Guide Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 print:hidden animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
            {/* Header */}
            <div className="bg-[#1A3673] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-blue-200" />
                <h3 className="font-extrabold text-base">Tata Cara Pengambilan Antrian</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps Body */}
            <div className="p-6 space-y-4">
              {steps.map((s) => (
                <div
                  key={s.num}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-slate-800 shrink-0 border border-slate-200">
                    {s.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#1A3673] text-white text-[10px] inline-flex items-center justify-center font-mono">
                        {s.num}
                      </span>
                      {s.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}

              {/* Note */}
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#1A3673] shrink-0" />
                <span>
                  Bila memerlukan bantuan khusus, silakan hubungi petugas loket pendaftaran.
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#1A3673] text-white text-xs font-bold hover:bg-[#12244E] transition cursor-pointer"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
