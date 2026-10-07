"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { IssuedTicket } from "@/types/kiosk";
import { CLINIC_INFO } from "@/lib/kiosk-data";
import { Printer, CheckCircle, X, Sparkles, UserCheck, RotateCcw } from "lucide-react";

interface PrintTicketModalProps {
  ticket: IssuedTicket | null;
  onClose: () => void;
  autoCloseSeconds?: number;
}

export default function PrintTicketModal({
  ticket,
  onClose,
  autoCloseSeconds = 12,
}: PrintTicketModalProps) {
  const [countdown, setCountdown] = useState(autoCloseSeconds);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Sound chime effect on modal mount
  useEffect(() => {
    if (!ticket) return;

    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      osc2.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      osc2.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5

      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 0.6);
      osc2.stop(audioCtx.currentTime + 0.6);
    } catch {
      // Audio fallback
    }
  }, [ticket]);

  // Countdown timer for auto dismiss
  useEffect(() => {
    if (!ticket) return;

    setCountdown(autoCloseSeconds);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onCloseRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ticket, autoCloseSeconds]);

  if (!ticket) return null;

  // Thermal printing via isolated iframe
  const handlePrint = () => {
    let iframe = document.getElementById("thermal-print-frame") as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "thermal-print-frame";
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    const patientRow = ticket.patientName
      ? `<div style="font-size: 11px; font-weight: bold; margin-top: 4px; padding: 2px 4px; border: 1px solid black; display: inline-block;">PASIEN: ${ticket.patientName.toUpperCase()}</div>`
      : "";

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Tiket Antrian - ${ticket.ticketCode}</title>
          <style>
            @page {
              size: 58mm auto;
              margin: 0mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              width: 58mm;
              max-width: 58mm;
              font-family: 'Courier New', Courier, monospace, 'Segoe UI', sans-serif;
              font-size: 10px;
              color: #000000;
              background: #ffffff;
              padding: 5mm 3mm;
              line-height: 1.35;
              text-align: center;
            }
            .dashed-line {
              border-bottom: 1px dashed #000000;
              margin: 6px 0;
            }
            .clinic-name {
              font-size: 12px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .poly-badge {
              font-size: 11px;
              font-weight: bold;
              text-transform: uppercase;
              margin-top: 2px;
            }
            .doctor-name {
              font-size: 10px;
              font-weight: 600;
              margin-top: 1px;
            }
            .ticket-header {
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-top: 6px;
            }
            .ticket-number {
              font-size: 42px;
              font-weight: 900;
              line-height: 1.05;
              margin: 4px 0;
              letter-spacing: 2px;
            }
            .info-text {
              font-size: 9px;
              line-height: 1.4;
            }
            .barcode {
              display: flex;
              justify-content: center;
              gap: 2px;
              height: 24px;
              margin: 6px 0 2px 0;
            }
            .barcode span {
              background: #000;
              height: 100%;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="clinic-name">${CLINIC_INFO.name}</div>
          <div class="info-text" style="font-size: 8px;">${CLINIC_INFO.address}</div>
          <div class="info-text" style="font-size: 8px;">Telp: ${CLINIC_INFO.phone}</div>

          <div class="dashed-line"></div>

          <div class="poly-badge">${ticket.polyRoom}</div>
          <div class="doctor-name">${ticket.doctorName}</div>
          <div class="info-text" style="font-size: 8px;">(${ticket.specialty})</div>
          ${patientRow}

          <div class="dashed-line"></div>

          <div class="ticket-header">NOMOR ANTRIAN</div>
          <div class="ticket-number">${ticket.ticketCode}</div>

          <div class="info-text" style="font-weight: bold;">
            ${ticket.waitingCount > 0 ? `${ticket.waitingCount} antrian di depan Anda` : "Giliran berikutnya"}
          </div>

          <div class="dashed-line"></div>

          <div class="info-text" style="font-size: 8px;">
            Waktu Cetak: ${ticket.printedAt}
          </div>
          <div class="info-text" style="font-size: 8px; font-style: italic; margin-top: 4px;">
            Harap menunggu sampai nomor Anda dipanggil pada layar TV.
          </div>

          <div class="barcode">
            <span style="width: 2px;"></span>
            <span style="width: 1px;"></span>
            <span style="width: 3px;"></span>
            <span style="width: 1px;"></span>
            <span style="width: 2px;"></span>
            <span style="width: 4px;"></span>
            <span style="width: 1px;"></span>
            <span style="width: 3px;"></span>
            <span style="width: 2px;"></span>
            <span style="width: 1px;"></span>
            <span style="width: 4px;"></span>
            <span style="width: 2px;"></span>
          </div>
          <div style="font-size: 8px; letter-spacing: 1px; font-weight: bold; margin-top: 4px;">
            *** TERIMA KASIH ***
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col transform transition-all">
        {/* Header Bar */}
        <div className="bg-[#1A3673] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              {/* Judul sukses "Berhasil Diambil!": text-2xl font-bold */}
              <h3 className="text-2xl font-bold leading-tight">Berhasil Diambil!</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 bg-slate-50 flex flex-col items-center">
          {/* Subtitle sukses: text-base font-normal */}
          <p className="text-base font-normal text-slate-600 text-center mb-4">
            Silakan simpan nomor antrian Anda dan perhatikan layar pemanggilan.
          </p>

          {/* Ticket Receipt Visual */}
          <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-dashed border-slate-300 relative text-slate-800">
            {/* Clinic Header */}
            <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
              <div className="w-8 h-8 mx-auto mb-1 rounded-full overflow-hidden">
                <Image
                  src="/logo-kahatex.png"
                  alt="Kahatex"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <h4 className="font-bold text-sm uppercase tracking-wide text-slate-900">
                {CLINIC_INFO.name}
              </h4>
              <p className="text-xs font-normal text-slate-500">{CLINIC_INFO.address}</p>
            </div>

            {/* Destination, Doctor, Patient */}
            <div className="text-center mb-3">
              {/* Poli di sukses: text-base font-normal */}
              <p className="text-base font-normal text-slate-600">
                {ticket.polyRoom}
              </p>
              {/* Nama dokter di sukses: text-lg font-medium */}
              <p className="text-lg font-medium text-slate-800 mt-0.5">
                {ticket.doctorName}
              </p>

              {/* Optional Patient Name */}
              {ticket.patientName && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 text-[#1A3673] px-3 py-1 rounded-lg text-xs font-semibold border border-blue-200">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Pasien: {ticket.patientName}</span>
                </div>
              )}
            </div>

            {/* Nomor antrian sukses: text-7xl sm:text-8xl font-bold */}
            <div className="bg-slate-50 rounded-2xl py-4 px-2 text-center border border-slate-200 my-2">
              {/* Label "Nomor Antrian Anda": text-sm font-medium */}
              <span className="text-sm font-medium text-slate-500 block mb-1">
                Nomor Antrian Anda
              </span>
              <span className="text-7xl sm:text-8xl font-bold tracking-tight text-[#1A3673] font-mono block">
                {ticket.ticketCode}
              </span>
            </div>

            {/* Queue Status / Ahead count */}
            <div className="mt-3 pt-3 border-t border-dashed border-slate-300 text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {ticket.waitingCount > 0
                    ? `${ticket.waitingCount} antrian di depan Anda`
                    : "Anda adalah antrian berikutnya"}
                </span>
              </div>
              <p className="text-xs font-normal text-slate-400 mt-1">
                Waktu Cetak: {ticket.printedAt}
              </p>
            </div>
          </div>
        </div>

        {/* Action Footer: Tombol "Cetak Tiket" / "Ambil Lagi": text-base font-medium */}
        <div className="p-5 bg-white border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-xl bg-[#1A3673] hover:bg-[#12244E] text-white text-base font-medium flex items-center justify-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-5 h-5 text-blue-200" />
              <span>Cetak Tiket</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-base font-medium flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Ambil Lagi</span>
            </button>
          </div>

          {/* Auto-close notification */}
          <div className="flex items-center justify-between text-xs font-normal text-slate-500">
            <span>Kembali otomatis ke beranda dalam:</span>
            <span className="font-semibold text-[#1A3673] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 font-mono">
              {countdown} detik
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
