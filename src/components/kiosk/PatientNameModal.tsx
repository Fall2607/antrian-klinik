"use client";

import { useState } from "react";
import { DoctorKiosk } from "@/types/kiosk";
import { User, Ticket, X } from "lucide-react";

interface PatientNameModalProps {
  doctor: DoctorKiosk | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (patientName: string) => void;
}

export default function PatientNameModal({
  doctor,
  isOpen,
  onClose,
  onConfirm,
}: PatientNameModalProps) {
  const [name, setName] = useState<string>("");

  if (!isOpen || !doctor) return null;

  const remainingQuota = Math.max(0, doctor.totalQuota - doctor.usedQuota);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onConfirm(name.trim());
    setName("");
  };

  const scheduleList =
    doctor.scheduleLines && doctor.scheduleLines.length > 0
      ? doctor.scheduleLines
      : [doctor.scheduleDetails];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Header Bar */}
        <div className="bg-[#1A3673] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Ticket className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base leading-tight">Konfirmasi Pendaftaran</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7">
          {/* Doctor Info & Quota Summary */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 mb-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                {/* Judul konfirmasi — nama dokter: text-2xl font-bold */}
                <h4 className="text-2xl font-bold text-slate-900">
                  {doctor.name}
                </h4>
                {/* Poli di konfirmasi: text-lg font-normal */}
                <p className="text-lg font-normal text-slate-600 mt-0.5">
                  {doctor.polyRoom} &bull; {doctor.specialty}
                </p>
              </div>

              {/* Sisa Kuota: Cukup angkanya saja, tanpa icon kecil */}
              <div className="text-right shrink-0 bg-white px-3.5 py-1.5 rounded-xl border border-blue-200/80 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Sisa Kuota</span>
                <span className="text-2xl font-bold text-emerald-700 font-mono leading-tight">
                  {remainingQuota}
                </span>
              </div>
            </div>

            {/* Jadwal Praktik: Dibedah menurun ke bawah */}
            <div className="mt-3.5 pt-3 border-t border-blue-200/60">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Jadwal Praktik:
              </span>
              <div className="space-y-1">
                {scheduleList.map((line, idx) => (
                  <p key={idx} className="text-sm font-medium text-slate-800 leading-snug">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              {/* Label input "Nama Pasien": text-sm font-medium */}
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#1A3673]" />
                  Nama Pasien
                </span>
                <span className="text-xs font-normal text-slate-400">
                  (Opsional)
                </span>
              </label>

              {/* Input text: text-base font-normal */}
              <input
                type="text"
                autoFocus
                placeholder="Ketik nama pasien di sini (boleh dikosongkan)..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-base font-normal placeholder:text-slate-400 focus:outline-none focus:border-[#1A3673] focus:bg-white transition"
              />

              <p className="text-sm font-normal text-slate-500 mt-2">
                Nama pasien akan dicetak pada kertas tiket untuk memudahkan pemanggilan oleh perawat.
              </p>
            </div>

            {/* Action Button: Hanya 1 tombol "Ambil Nomor Antrian" */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#1A3673] hover:bg-[#12244E] text-white text-lg font-bold flex items-center justify-center gap-2 shadow-xs hover:shadow active:scale-[0.98] transition cursor-pointer"
              >
                <span>Ambil Nomor Antrian</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
