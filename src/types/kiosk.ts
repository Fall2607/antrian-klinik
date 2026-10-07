export interface DoctorKiosk {
  id: string;
  name: string;
  specialty: string;
  polyCategory: "Poli Umum" | "Poli Gigi" | "Poli KIA";
  polyRoom: string;
  ticketPrefix: string;
  scheduleDetails: string;
  scheduleLines: string[];
  sessionName: string;
  scheduleTime: string;
  totalQuota: number;
  usedQuota: number;
  isClosed: boolean;
}

export interface IssuedTicket {
  ticketCode: string;
  queueNumber: number;
  doctorName: string;
  patientName?: string;
  specialty: string;
  polyRoom: string;
  sessionName: string;
  printedAt: string;
  waitingCount: number;
}
