# TECHNICAL SPECIFICATION & ROADMAP: CLINIC QUEUE MANAGEMENT SYSTEM

## 1. DESIGN TOKENS (CSS / TAILWIND)
Target context: Light medical theme based on brand palette.

- COLOR_PRIMARY: "#1A3673" (Deep Navy Blue - Header, Sidebar, Active Cards, Call Buttons)
- COLOR_PRIMARY_HOVER: "#12244E" (Midnight Navy - Button Hover, Focused Borders)
- COLOR_ACCENT: "#7A8288" (Slate Grey - Secondary labels, borders, queue badges)
- COLOR_SURFACE: "#FFFFFF" (Card backgrounds, table rows)
- COLOR_BACKGROUND: "#F8FAFC" (Main dashboard & kiosk canvas)
- COLOR_SUCCESS: "#10B981" (Quota available, completed status)
- COLOR_WARNING: "#F59E0B" (Low quota warning, recall action)
- COLOR_DANGER: "#EF4444" (Quota exhausted, skipped status, cancel action)

Tailwind configuration extension:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1A3673',
          hover: '#12244E',
          accent: '#7A8288',
          surface: '#FFFFFF',
          canvas: '#F8FAFC',
        }
      }
    }
  }
}
```

---

## 2. SYSTEM ARCHITECTURE & NETWORK
- Architecture: Local-First Client-Server Architecture
- Host: Local Mini-PC / Windows Workstation (acting as Node.js and PostgreSQL server)
- Network: Local Area Network (LAN) via static IP assignment
- Realtime Protocol: WebSockets (Socket.io)
- Text-to-Speech: Web Speech API (Client-side native browser synthesis, locale "id-ID")
- Printing: Client-side thermal print via browser printing or ESC/POS daemon

---

## 3. DATA SCHEMA & PRISMA SPECIFICATION

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum QueueStatus {
  WAITING
  CALLED
  SERVING
  COMPLETED
  SKIPPED
}

model Doctor {
  id           String       @id @default(uuid())
  nip          String?      @unique
  name         String
  specialty    String
  polyRoom     String       // e.g., "Poli Umum", "Poli Gigi"
  ticketPrefix String       // e.g., "A", "B", "C"
  isActive     Boolean      @default(true)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  quotas       DailyQuota[]

  @@map("doctors")
}

model DailyQuota {
  id           String      @id @default(uuid())
  doctorId     String
  date         DateTime    @db.Date
  sessionName  String      @default("Pagi") // "Pagi" or "Sore"
  totalQuota   Int
  usedQuota    Int         @default(0)
  isClosed     Boolean     @default(false)
  doctor       Doctor      @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  queues       Queue[]

  @@unique([doctorId, date, sessionName])
  @@map("daily_quotas")
}

model Queue {
  id           String      @id @default(uuid())
  quotaId      String
  queueNumber  Int         // 1, 2, 3...
  ticketCode   String      // "A-01", "B-02"
  status       QueueStatus @default(WAITING)
  callCount    Int         @default(0)
  printedAt    DateTime    @default(now())
  calledAt     DateTime?
  servedAt     DateTime?
  completedAt  DateTime?
  quota        DailyQuota  @relation(fields: [quotaId], references: [id], onDelete: Cascade)

  @@index([quotaId, status])
  @@map("queues")
}
```

---

## 4. CONCURRENCY & TRANSACTION SPECIFICATION
Atomic ticket creation transaction:
1. Begin PostgreSQL transaction.
2. Select quota row with pessimistic locking:
   `SELECT * FROM daily_quotas WHERE id = :quotaId FOR UPDATE;`
3. Validate: If `usedQuota >= totalQuota` or `isClosed == true`, abort and return `QUOTA_EXHAUSTED`.
4. Increment `usedQuota` by 1.
5. Generate `queueNumber = usedQuota`.
6. Insert into `queues` table with generated `ticketCode` (e.g., `${prefix}-${String(queueNumber).padStart(2, '0')}`).
7. Commit transaction and broadcast event `queue:created` via Socket.io.

---

## 5. REALTIME EVENT DEFINITIONS (SOCKET.IO)

- Client -> Server:
  - `call:next` { quotaId: string }
  - `call:repeat` { queueId: string }
  - `status:update` { queueId: string, status: "SERVING" | "COMPLETED" | "SKIPPED" }

- Server -> Client (Broadcast to all clients):
  - `display:call` {
      ticketCode: string,
      polyRoom: string,
      doctorName: string,
      timestamp: number
    }
  - `quota:updated` { quotaId: string, usedQuota: number, remainingQuota: number }
  - `queue:state_changed` { queueId: string, status: string }

---

## 6. IMPLEMENTATION ROADMAP

### Phase 1: Environment & Persistence Layer
- [ ] Initialize Next.js project with App Router, TypeScript, and Tailwind CSS.
- [ ] Setup Prisma schema with PostgreSQL database connection.
- [ ] Create database migration scripts for `Doctor`, `DailyQuota`, and `Queue` models.
- [ ] Implement atomic ticket issuance function using Prisma interactive transactions.
- [ ] Build standalone Socket.io server integrated with HTTP server instance.

### Phase 2: Administrative Module (Doctor & Quota Management)
- [ ] CRUD API routes for doctor data management (`/api/doctors`).
- [ ] UI for doctor list, addition form, edit modal, and status toggle.
- [ ] CRUD API routes for quota scheduling (`/api/quotas`).
- [ ] UI for date-based quota allocation per doctor.
- [ ] Emergency quota switch UI (lock/unlock admissions manually).

### Phase 3: Patient Kiosk & Print Integration
- [ ] Touch-optimized responsive kiosk page (`/kiosk`).
- [ ] Card components listing active doctors for current date with live quota counters.
- [ ] Automatic disable state when doctor quota reaches limit.
- [ ] Print layout template designed for 58mm/80mm thermal paper with print media query:
  `@media print { body { width: 58mm; margin: 0; } }`
- [ ] Client-side print trigger using auto-dismiss dialog.

### Phase 4: TV Display & Audio Queue Engine
- [ ] Full-screen TV display layout (`/display`) with 1080p target resolution.
- [ ] Main caller view: Large typography for active ticket code and destination room.
- [ ] Secondary view: Grid of recently called tickets per counter/room.
- [ ] Web Speech API sound synthesizer utility:
  - Implement sequential FIFO queue array to prevent audio overlap during simultaneous calls.
  - Sentence format: "Nomor antrian [Kode Tiket], silakan menuju [Nama Poli]".
  - Audio playback speed: 0.9, language: "id-ID".
- [ ] Unmute overlay button to satisfy browser autoplay policy on initial TV boot.

### Phase 5: Doctor / Counter Calling Interface
- [ ] Doctor counter interface (`/counter/[doctorId]`).
- [ ] Large display of current active patient.
- [ ] Control buttons:
  - "Panggil Berikutnya" (Calls next WAITING ticket, triggers `display:call`).
  - "Panggil Ulang" (Re-triggers `display:call` without incrementing index).
  - "Mulai Layani" (Sets status to SERVING).
  - "Selesai" (Sets status to COMPLETED).
  - "Lewati" (Sets status to SKIPPED).
- [ ] Data table showing remaining waiting patients and skipped patients list with recall action.

### Phase 6: Local Deployment & Automation
- [ ] Configure production build output (`next build`).
- [ ] Setup background service definition using NSSM (Non-Sucking Service Manager) or PM2 for automatic Node.js execution on Windows boot.
- [ ] Create Windows `.bat` startup launcher script for silent background execution.
- [ ] Setup kiosk-mode browser launch configuration:
  `chrome.exe --kiosk --app=http://localhost:3000/kiosk`