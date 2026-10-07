"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { CLINIC_INFO } from "@/lib/kiosk-data";
import { Maximize2, Minimize2, Calendar, Clock } from "lucide-react";

export default function KioskHeader() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WIB"
      );
      setCurrentDate(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen for native browser fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
        mozFullScreenElement?: Element;
        msFullscreenElement?: Element;
      };
      const activeFs = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(activeFs);

      if (activeFs) {
        document.body.classList.add("kiosk-fullscreen-active");
      } else {
        document.body.classList.remove("kiosk-fullscreen-active");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  // Synchronous, Dual-Mode Fullscreen Handler
  const toggleFullscreen = useCallback(() => {
    const doc = document as unknown as {
      fullscreenElement?: Element;
      webkitFullscreenElement?: Element;
      mozFullScreenElement?: Element;
      msFullscreenElement?: Element;
      exitFullscreen?: () => Promise<void>;
      webkitExitFullscreen?: () => void;
      mozCancelFullScreen?: () => void;
      msExitFullscreen?: () => void;
    };

    const targetEl = (document.documentElement || document.body) as unknown as {
      requestFullscreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => void;
      mozRequestFullScreen?: () => void;
      msRequestFullscreen?: () => void;
    };

    const isCurrentlyActive =
      isFullscreen ||
      !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement ||
        document.body.classList.contains("kiosk-fullscreen-active")
      );

    if (!isCurrentlyActive) {
      // 1. Terapkan kelas visual CSS fullscreen seketika (bekerja 100% di semua browser & iframe/webview)
      document.body.classList.add("kiosk-fullscreen-active");
      setIsFullscreen(true);

      // 2. Coba picu native browser fullscreen
      try {
        if (targetEl.requestFullscreen) {
          targetEl.requestFullscreen().catch(() => {
            // Jika kebijakan browser/iframe memblokir native fullscreen, mode visual CSS tetap aktif
          });
        } else if (targetEl.webkitRequestFullscreen) {
          targetEl.webkitRequestFullscreen();
        } else if (targetEl.mozRequestFullScreen) {
          targetEl.mozRequestFullScreen();
        } else if (targetEl.msRequestFullscreen) {
          targetEl.msRequestFullscreen();
        }
      } catch {
        // Fallback gracefully
      }
    } else {
      // Keluar dari mode layar penuh
      document.body.classList.remove("kiosk-fullscreen-active");
      setIsFullscreen(false);

      try {
        if (doc.fullscreenElement) {
          if (doc.exitFullscreen) {
            doc.exitFullscreen().catch(() => {});
          } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
          } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
          } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
          }
        }
      } catch {
        // Fallback gracefully
      }
    }
  }, [isFullscreen]);

  // Listener tombol ESC untuk keluar dari fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        document.body.classList.remove("kiosk-fullscreen-active");
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 select-none sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand with Kahatex Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center p-1 shadow-xs shrink-0 overflow-hidden">
            <Image
              src="/logo-kahatex.png"
              alt="Logo Klinik Pratama Kahatex"
              width={34}
              height={34}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              {CLINIC_INFO.name}
            </h1>
            <p className="text-xs font-normal text-slate-500">
              Kiosk Nomor Antrian
            </p>
          </div>
        </div>

        {/* Right side: Tanggal header & Fullscreen Button */}
        <div className="flex items-center gap-3">
          {/* Tanggal header (text-sm font-medium) */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200/90 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-600">
            <Calendar className="w-4 h-4 text-[#1A3673]" />
            <span>{currentDate}</span>
            <span className="text-slate-300">|</span>
            <Clock className="w-4 h-4 text-[#1A3673]" />
            <span className="font-mono text-slate-800">{currentTime}</span>
          </div>

          {/* Tombol Layar Penuh (Dual-Mode: Native + CSS Viewport Maximize) */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all active:scale-95 cursor-pointer ${
              isFullscreen
                ? "bg-[#1A3673] text-white border-[#1A3673] shadow-xs"
                : "bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#1A3673] border-slate-200"
            }`}
            title={isFullscreen ? "Keluar dari Layar Penuh (ESC)" : "Mode Layar Penuh Kiosk"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Kecilkan</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-[#1A3673]" />
                <span className="hidden sm:inline">Layar Penuh</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
