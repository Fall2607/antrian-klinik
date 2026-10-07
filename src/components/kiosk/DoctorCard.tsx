"use client";

import { DoctorKiosk } from "@/types/kiosk";
import { Stethoscope, Clock, Ticket, AlertCircle, CheckCircle2, Lock } from "lucide-react";

interface DoctorCardProps {
  doctor: DoctorKiosk;
  onSelectDoctor: (doctor: DoctorKiosk) => void;
  isProcessing?: boolean;
}

export default function DoctorCard({
  doctor,
  onSelectDoctor,
  isProcessing = false,
}: DoctorCardProps) {
  const remainingQuota = Math.max(0, doctor.totalQuota - doctor.usedQuota);
  const isFull = remainingQuota <= 0 || doctor.isClosed;
  const isLow = remainingQuota > 0 && remainingQuota <= 3;
  const quotaPercentage = Math.min(
    100,
    Math.round((doctor.usedQuota / doctor.totalQuota) * 100)
  );

  return (
    <div
      className={`relative rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between border ${
        isFull
          ? "bg-slate-50/90 border-slate-200 opacity-80"
          : isLow
          ? "bg-white border-amber-300 shadow-sm hover:shadow-md hover:border-amber-400"
          : "bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300"
      }`}
    >
      {/* Top Tag & Ticket Prefix */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-[#1A3673] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {doctor.ticketPrefix}
          </span>
          {/* Poli di kartu: text-sm font-normal */}
          <span className="text-sm font-normal text-slate-600 bg-blue-50/70 px-2.5 py-0.5 rounded-lg border border-blue-200/70">
            {doctor.polyRoom}
          </span>
        </div>

        {/* Badge "Kuota Penuh"/"Tersedia": text-xs font-semibold (12px, 600) */}
        {isFull ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            <Lock className="w-3 h-3" />
            Kuota Penuh
          </span>
        ) : isLow ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <AlertCircle className="w-3 h-3" />
            Sisa {remainingQuota} Pasien
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Tersedia
          </span>
        )}
      </div>

      {/* Doctor Info */}
      <div className="mb-4">
        {/* Nama dokter di kartu: text-lg font-bold (18px, 700) */}
        <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
          {doctor.name}
        </h3>
        <p className="text-sm font-normal text-slate-500 mt-0.5 flex items-center gap-1.5">
          <Stethoscope className="w-4 h-4 text-[#1A3673] shrink-0" />
          {doctor.specialty}
        </p>

        <div className="mt-2.5 flex items-start gap-1.5 text-xs text-slate-700 bg-slate-50 py-1.5 px-2.5 rounded-xl border border-slate-100">
          <Clock className="w-3.5 h-3.5 text-[#1A3673] shrink-0 mt-0.5" />
          <div className="leading-tight w-full">
            <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">JADWAL</span>
            <div className="space-y-0.5">
              {(doctor.scheduleLines || [doctor.scheduleDetails]).map((line, idx) => (
                <div key={idx} className="text-xs font-normal text-slate-700">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quota Progress Meter */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
        {/* Info terdaftar/sisa di kartu: text-sm font-normal + font-bold untuk sisa */}
        <div className="flex items-center justify-between text-sm font-normal text-slate-600 mb-2">
          <span>Terdaftar: {doctor.usedQuota} dari {doctor.totalQuota}</span>
          <span
            className={`text-sm ${
              isFull
                ? "font-bold text-red-600"
                : isLow
                ? "font-bold text-amber-700"
                : "font-bold text-emerald-700"
            }`}
          >
            Sisa: {remainingQuota}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isFull
                ? "bg-red-500"
                : isLow
                ? "bg-amber-500"
                : "bg-emerald-500"
            }`}
            style={{ width: `${quotaPercentage}%` }}
          />
        </div>
      </div>

      {/* Tombol: text-lg font-bold (18px, 700) */}
      <button
        onClick={() => !isFull && !isProcessing && onSelectDoctor(doctor)}
        disabled={isFull || isProcessing}
        className={`w-full py-3 px-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition-all duration-150 select-none ${
          isFull
            ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
            : "bg-[#1A3673] hover:bg-[#12244E] text-white shadow-xs hover:shadow-md active:scale-[0.98] cursor-pointer"
        }`}
      >
        {isFull ? (
          <>
            <Lock className="w-5 h-5 text-slate-400" />
            <span>Kuota Penuh</span>
          </>
        ) : (
          <>
            <Ticket className="w-5 h-5 text-blue-200" />
            <span>Ambil Nomor Antrian</span>
          </>
        )}
      </button>
    </div>
  );
}
