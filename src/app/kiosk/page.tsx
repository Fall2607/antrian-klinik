"use client";

import { useState, useMemo } from "react";
import KioskHeader from "@/components/kiosk/KioskHeader";
import DoctorCard from "@/components/kiosk/DoctorCard";
import PatientNameModal from "@/components/kiosk/PatientNameModal";
import PrintTicketModal from "@/components/kiosk/PrintTicketModal";
import KioskFooter from "@/components/kiosk/KioskFooter";
import KioskGuideModal from "@/components/kiosk/KioskGuideModal";
import { INITIAL_DOCTORS } from "@/lib/kiosk-data";
import { DoctorKiosk, IssuedTicket } from "@/types/kiosk";
import { Search, Filter, Stethoscope, RotateCcw, Check } from "lucide-react";

export default function KioskPage() {
  const [doctors, setDoctors] = useState<DoctorKiosk[]>(INITIAL_DOCTORS);
  const [selectedPoly, setSelectedPoly] = useState<string>("SEMUA");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [doctorForNameInput, setDoctorForNameInput] = useState<DoctorKiosk | null>(null);
  const [issuedTicket, setIssuedTicket] = useState<IssuedTicket | null>(null);

  // 3 Poliklinik: Poli Umum, Poli Gigi, Poli KIA
  const polyCategories = ["SEMUA", "Poli Umum", "Poli Gigi", "Poli KIA"];

  // Filtered doctors list
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchPoly =
        selectedPoly === "SEMUA" || doc.polyCategory === selectedPoly;
      const matchSearch =
        searchQuery.trim() === "" ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.polyRoom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.scheduleDetails.toLowerCase().includes(searchQuery.toLowerCase());
      return matchPoly && matchSearch;
    });
  }, [doctors, selectedPoly, searchQuery]);

  // Step 1: Pasien klik ambil antrian -> buka dialog input nama opsional
  const handleSelectDoctor = (doctor: DoctorKiosk) => {
    setDoctorForNameInput(doctor);
  };

  // Step 2: Konfirmasi penerbitan tiket
  const handleConfirmIssueTicket = (patientName: string) => {
    if (!doctorForNameInput) return;

    const doctor = doctorForNameInput;
    const newQueueNumber = doctor.usedQuota + 1;
    const formattedCode = `${doctor.ticketPrefix}-${String(newQueueNumber).padStart(2, "0")}`;

    // Update kuota dokter lokal
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === doctor.id ? { ...d, usedQuota: newQueueNumber } : d
      )
    );

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} ${now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })} WIB`;

    const waitingEst = Math.max(0, Math.floor(newQueueNumber * 0.4));

    const newTicket: IssuedTicket = {
      ticketCode: formattedCode,
      queueNumber: newQueueNumber,
      doctorName: doctor.name,
      patientName: patientName || undefined,
      specialty: doctor.specialty,
      polyRoom: doctor.polyRoom,
      sessionName: doctor.sessionName,
      printedAt: formattedDate,
      waitingCount: waitingEst,
    };

    setDoctorForNameInput(null);
    setIssuedTicket(newTicket);
  };

  const handleResetDemoQuota = () => {
    setDoctors(INITIAL_DOCTORS);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between selection:bg-blue-100">
      {/* Header Compact dengan Logo Kahatex */}
      <KioskHeader />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* Step dots & Heading Section */}

        {/* Compact Filter Tabs & Search Bar */}
        <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Poliklinik Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#1A3673]" />
              Poli:
            </span>
            {polyCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedPoly(category)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium tracking-tight whitespace-nowrap transition-all duration-150 select-none cursor-pointer ${
                  selectedPoly === category
                    ? "bg-[#1A3673] text-white shadow-xs font-bold"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari dokter atau jadwal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A3673] focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Doctor Cards Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onSelectDoctor={handleSelectDoctor}
              />
            ))}
          </div>
        ) : (
          /* Empty State — "Belum ada dokter": text-lg font-medium, subtitle: text-base normal */
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 max-w-md mx-auto shadow-xs my-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1A3673] flex items-center justify-center mx-auto mb-3">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">
              Belum ada dokter
            </h3>
            <p className="text-base font-normal text-slate-500 mt-1">
              Tidak ada jadwal dokter yang cocok dengan pencarian Anda saat ini.
            </p>
            <button
              onClick={() => {
                setSelectedPoly("SEMUA");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#1A3673] text-white text-base font-medium hover:bg-[#12244E] transition shadow-xs cursor-pointer"
            >
              Tampilkan Semua Dokter
            </button>
          </div>
        )}

        {/* Development Reset Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleResetDemoQuota}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            title="Kembalikan kuota ke kondisi simulasi awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Simulasi Kuota</span>
          </button>
        </div>
      </main>

      {/* Floating Action Button untuk Panduan Antrian */}
      <KioskGuideModal />

      {/* Footer: text-sm normal */}
      <KioskFooter />

      {/* Modal 1: Input Nama Pasien (Opsional) */}
      <PatientNameModal
        doctor={doctorForNameInput}
        isOpen={!!doctorForNameInput}
        onClose={() => setDoctorForNameInput(null)}
        onConfirm={handleConfirmIssueTicket}
      />

      {/* Modal 2: Preview Struk Tiket Thermal 58mm */}
      <PrintTicketModal
        ticket={issuedTicket}
        onClose={() => setIssuedTicket(null)}
        autoCloseSeconds={12}
      />
    </div>
  );
}
