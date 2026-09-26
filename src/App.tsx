import { useMemo, useState, type FormEvent } from 'react'
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Boxes,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  ContactRound,
  Database,
  Facebook,
  FileClock,
  FileText,
  Filter,
  Eye,
  Inbox,
  Instagram,
  LayoutDashboard,
  Menu,
  MessageCircle,
  MoreHorizontal,
  PackageCheck,
  Paperclip,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  ListTodo,
  LockKeyhole,
  MapPin,
  Star,
  SlidersHorizontal,
  TrendingUp,
  UserPlus,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import './App.css'

type Page = 'overview' | 'workspace' | 'decisions' | 'inbox' | 'crm' | 'tasks' | 'canvassing' | 'pipeline' | 'production' | 'performance' | 'employees' | 'targets' | 'master' | 'access' | 'governance'
type AppRole = 'Owner' | 'Manager/Supervisor' | 'Admin' | 'Digital Marketing' | 'Sales Online' | 'Sales Canvassing' | 'PIC Brand' | 'Produksi'
type Channel = 'WhatsApp' | 'Instagram' | 'Facebook'
type Conversation = {
  id: number
  name: string
  brand: string
  channel: Channel
  preview: string
  time: string
  unread: number
  owner: string
  stage: string
  temperature: 'Hot' | 'Warm' | 'New'
  needs: string
  volume: string
  nextAction: string
}

type DetailItem = {
  kind: string
  title: string
  subtitle: string
  status: string
  description: string
  fields: { label: string; value: string }[]
  steps: { label: string; state: 'done' | 'current' | 'next' }[]
  activities: string[]
  primaryAction: string
}

type OpenDetail = (detail: DetailItem) => void

const processSteps = (current: number, labels: string[]) => labels.map((label, index) => ({ label, state: (index < current ? 'done' : index === current ? 'current' : 'next') as 'done' | 'current' | 'next' }))

function DetailDrawer({ detail, onClose }: { detail: DetailItem; onClose: () => void }) {
  const [actionTaken, setActionTaken] = useState(false)
  return <div className="detail-overlay" role="presentation" onMouseDown={event => { if (event.currentTarget === event.target) onClose() }}>
    <aside className="detail-drawer" role="dialog" aria-modal="true" aria-label={`Detail ${detail.title}`}>
      <header className="drawer-header"><div><span className="eyebrow">{detail.kind}</span><h2>{detail.title}</h2><p>{detail.subtitle}</p></div><button className="drawer-close" onClick={onClose} aria-label="Tutup detail"><X /></button></header>
      <div className="drawer-body">
        <section className="drawer-status"><span className="risk-pill safe">{detail.status}</span><p>{detail.description}</p></section>
        <section className="drawer-section"><div className="drawer-section-title"><span>Informasi utama</span><small>Data tersimpan pada satu record</small></div><dl className="drawer-fields">{detail.fields.map(field => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl></section>
        <section className="drawer-section"><div className="drawer-section-title"><span>Posisi dalam proses</span><small>Setiap perpindahan tahap tercatat</small></div><div className="drawer-flow">{detail.steps.map((step, index) => <div className={step.state} key={step.label}><span>{step.state === 'done' ? <Check /> : index + 1}</span><b>{step.label}</b></div>)}</div></section>
        <section className="drawer-section"><div className="drawer-section-title"><span>Aktivitas terakhir</span><small>Jejak kerja untuk owner dan tim</small></div><div className="drawer-activity">{detail.activities.map((activity, index) => <div key={activity}><i /><span><b>{index === 0 ? 'Terbaru' : `${index + 1} aktivitas lalu`}</b>{activity}</span></div>)}</div></section>
      </div>
      <footer className="drawer-footer">{actionTaken && <span className="drawer-action-note"><CheckCircle2 /> Simulasi tindakan berhasil</span>}<button className="secondary-btn" onClick={onClose}>Tutup</button><button className="primary-btn" onClick={() => setActionTaken(true)}>{detail.primaryAction} <ArrowRight /></button></footer>
    </aside>
  </div>
}

function CompletionModal({ title, onClose, onConfirm }: { title: string; onClose: () => void; onConfirm: () => void }) {
  const [result, setResult] = useState('')
  const [nextAction, setNextAction] = useState('Tidak ada tindak lanjut')
  const [evidence, setEvidence] = useState(false)
  const canSubmit = result.trim().length >= 8 && evidence
  return <div className="completion-overlay" role="presentation" onMouseDown={event => { if (event.currentTarget === event.target) onClose() }}><section className="completion-modal" role="dialog" aria-modal="true" aria-label={`Selesaikan ${title}`}>
    <header><div><span className="eyebrow">Konfirmasi hasil pekerjaan</span><h2>Selesaikan aktivitas</h2><p>{title}</p></div><button onClick={onClose} aria-label="Tutup konfirmasi"><X /></button></header>
    <div className="completion-body"><div className="completion-guidance"><ShieldCheck /><span><b>Aktivitas tidak langsung ditutup</b><small>Hasil dan bukti akan disimpan pada histori serta dapat diverifikasi atasan.</small></span></div>
      <label><span>Hasil aktivitas <em>Wajib</em></span><textarea value={result} onChange={event => setResult(event.target.value)} placeholder="Jelaskan hasil yang dicapai, keputusan, atau kendala yang ditemukan…" /></label>
      <label><span>Tindakan berikutnya</span><select value={nextAction} onChange={event => setNextAction(event.target.value)}><option>Tidak ada tindak lanjut</option><option>Buat follow-up baru</option><option>Menunggu pelanggan</option><option>Menunggu approval</option><option>Eskalasi ke atasan</option></select></label>
      <label className="evidence-check"><input type="checkbox" checked={evidence} onChange={event => setEvidence(event.target.checked)} /><span><b>Bukti pekerjaan sudah tersedia</b><small>Catatan, dokumen, foto, percakapan, atau perubahan status sudah tersimpan.</small></span></label>
    </div>
    <footer><button className="secondary-btn" onClick={onClose}>Batal</button><button className="primary-btn" disabled={!canSubmit} onClick={onConfirm}><Check /> Simpan hasil dan selesaikan</button></footer>
  </section></div>
}

const conversations: Conversation[] = [
  { id: 1, name: 'Nadia Putri', brand: 'Asteria Studio', channel: 'WhatsApp', preview: 'Untuk 500 pcs, bisa selesai sebelum akhir bulan?', time: '09.42', unread: 3, owner: 'Yola', stage: 'Qualified', temperature: 'Hot', needs: 'Kemeja korporat', volume: '500 pcs', nextAction: 'Kirim quotation hari ini' },
  { id: 2, name: 'Rizal Akbar', brand: 'Beno Tactical', channel: 'Instagram', preview: 'Kami perlu sample bahan ripstop terlebih dahulu.', time: '09.18', unread: 1, owner: 'Rusydi', stage: 'Sample', temperature: 'Warm', needs: 'Seragam tactical', volume: '1.200 pcs', nextAction: 'Konfirmasi jadwal sample' },
  { id: 3, name: 'Sinta Maharani', brand: 'Mukti Collection', channel: 'Facebook', preview: 'Harga kain rayon per roll berapa ya?', time: 'Kemarin', unread: 0, owner: 'Belum ada', stage: 'New', temperature: 'New', needs: 'Kain rayon', volume: '20 roll', nextAction: 'Tetapkan sales owner' },
  { id: 4, name: 'Andi Saputra', brand: 'Nusa Event', channel: 'WhatsApp', preview: 'Desain terakhir sudah kami setujui.', time: 'Kemarin', unread: 0, owner: 'Yola', stage: 'Negotiation', temperature: 'Hot', needs: 'Jaket event', volume: '350 pcs', nextAction: 'Terbitkan PO' },
  { id: 5, name: 'Fira Amalia', brand: 'Klinik Laras', channel: 'Instagram', preview: 'Apakah bisa bordir nama masing-masing?', time: 'Senin', unread: 0, owner: 'Rusydi', stage: 'Contacted', temperature: 'Warm', needs: 'Seragam klinik', volume: '85 pcs', nextAction: 'Lengkapi requirement' },
  { id: 6, name: 'Dimas Pratama', brand: 'Ruang Kopi', channel: 'Facebook', preview: 'Saya tunggu katalog apron dan estimasi harganya.', time: 'Senin', unread: 2, owner: 'Yola', stage: 'Qualified', temperature: 'Warm', needs: 'Apron barista', volume: '60 pcs', nextAction: 'Kirim katalog' },
]

const pipelineColumns = [
  { id: 'new', label: 'Lead Baru', color: '#7b8b9d', items: [{ brand: 'Mukti Collection', product: 'Kain rayon', value: 24000000, owner: 'Belum ada', age: '18 menit' }, { brand: 'Aruna School', product: 'Seragam sekolah', value: 76000000, owner: 'Yola', age: '2 jam' }] },
  { id: 'qualified', label: 'Qualified', color: '#0f8b8d', items: [{ brand: 'Asteria Studio', product: 'Kemeja korporat', value: 87500000, owner: 'Yola', age: 'Hari ini' }, { brand: 'Ruang Kopi', product: 'Apron barista', value: 10800000, owner: 'Yola', age: '1 hari' }] },
  { id: 'sample', label: 'Sample', color: '#f59f36', items: [{ brand: 'Beno Tactical', product: 'Seragam tactical', value: 216000000, owner: 'Rusydi', age: '3 hari' }] },
  { id: 'negotiation', label: 'Negosiasi', color: '#7758c5', items: [{ brand: 'Nusa Event', product: 'Jaket event', value: 73500000, owner: 'Yola', age: '2 hari' }, { brand: 'Klinik Laras', product: 'Seragam klinik', value: 17000000, owner: 'Rusydi', age: '4 hari' }] },
]

const weeklyData = [
  { day: 'Sen', leads: 48, qualified: 24 },
  { day: 'Sel', leads: 62, qualified: 31 },
  { day: 'Rab', leads: 57, qualified: 34 },
  { day: 'Kam', leads: 81, qualified: 46 },
  { day: 'Jum', leads: 74, qualified: 39 },
  { day: 'Sab', leads: 43, qualified: 18 },
  { day: 'Min', leads: 31, qualified: 12 },
]

const orders = [
  { po: 'SLC-2609-041', brand: 'Beno Tactical', item: 'Kemeja tactical', qty: '1.200', owner: 'Dinar', progress: 68, due: '29 Sep', status: 'Produksi', risk: 'Aman' },
  { po: 'SLC-2609-038', brand: 'Nusa Event', item: 'Jaket event', qty: '350', owner: 'Dinar', progress: 34, due: '27 Sep', status: 'Material', risk: 'Perlu perhatian' },
  { po: 'SLC-2609-034', brand: 'Ayu Inaproc', item: 'Mukena', qty: '800', owner: 'Rahma', progress: 91, due: '26 Sep', status: 'Quality control', risk: 'Aman' },
  { po: 'SLC-2609-029', brand: 'Oki Uniform', item: 'Seragam lapangan', qty: '500', owner: 'Dinar', progress: 82, due: '25 Sep', status: 'Rework', risk: 'Terlambat' },
]

const kpis = [
  { role: 'Sales Online', owner: 'Yola', metric: 'Conversion rate', actual: '24%', target: '22%', score: 100, trend: '+3,1%' },
  { role: 'Sales Canvassing', owner: 'Rusydi', metric: 'Qualified opportunities', actual: '18', target: '24', score: 75, trend: '-2' },
  { role: 'PIC Brand', owner: 'Dinar', metric: 'First pass approval', actual: '92%', target: '95%', score: 97, trend: '+4,0%' },
  { role: 'Produksi', owner: 'Tim Produksi', metric: 'Schedule adherence', actual: '88%', target: '95%', score: 93, trend: '+1,2%' },
  { role: 'Admin', owner: 'Admin Silancar', metric: 'Data completeness', actual: '97%', target: '98%', score: 99, trend: '+2,5%' },
]

const leadRows = [
  { name: 'Nadia Putri', brand: 'Asteria Studio', source: 'WhatsApp', need: 'Kemeja korporat', owner: 'Yola', stage: 'Qualified', next: 'Kirim quotation', due: 'Hari ini, 14.00', quality: 'Hot' },
  { name: 'Rizal Akbar', brand: 'Beno Tactical', source: 'Instagram', need: 'Seragam tactical', owner: 'Rusydi', stage: 'Sample', next: 'Konfirmasi sample', due: 'Hari ini, 16.00', quality: 'Warm' },
  { name: 'Sinta Maharani', brand: 'Mukti Collection', source: 'Facebook', need: 'Kain rayon', owner: 'Belum ada', stage: 'New', next: 'Tetapkan owner', due: 'Terlambat 18 menit', quality: 'New' },
  { name: 'Andi Saputra', brand: 'Nusa Event', source: 'WhatsApp', need: 'Jaket event', owner: 'Yola', stage: 'Negotiation', next: 'Terbitkan PO', due: 'Besok, 10.00', quality: 'Hot' },
  { name: 'Fira Amalia', brand: 'Klinik Laras', source: 'Instagram', need: 'Seragam klinik', owner: 'Rusydi', stage: 'Contacted', next: 'Lengkapi requirement', due: '26 Sep, 09.00', quality: 'Warm' },
]

const followUps = [
  { title: 'Hubungi kembali Asteria Studio', type: 'Follow-up quotation', owner: 'Yola', time: '14.00', status: 'Hari ini', priority: 'Tinggi' },
  { title: 'Konfirmasi jadwal sample Beno Tactical', type: 'Sample', owner: 'Rusydi', time: '16.00', status: 'Hari ini', priority: 'Tinggi' },
  { title: 'Assign lead Mukti Collection', type: 'Assignment', owner: 'Admin', time: '09.24', status: 'Overdue', priority: 'Kritis' },
  { title: 'Kunjungan CV Garuda Tekstil', type: 'Canvassing', owner: 'Rusydi', time: '10.00', status: 'Besok', priority: 'Normal' },
]

const auditRows = [
  { time: '10.24', actor: 'Yola', action: 'Mengubah tahap opportunity', object: 'Asteria Studio', detail: 'Qualified → Quotation' },
  { time: '10.06', actor: 'Dinar', action: 'Mengunggah approval sample', object: 'SLC-2609-041', detail: 'Sample v3 disetujui pelanggan' },
  { time: '09.48', actor: 'Admin', action: 'Menetapkan pemilik lead', object: 'Ruang Kopi', detail: 'Belum ada → Yola' },
  { time: '09.31', actor: 'Tim Produksi', action: 'Memperbarui progres', object: 'SLC-2609-029', detail: 'Rework 72 → 82%' },
]

const accessRoles = [
  { role: 'Owner', users: 1, scope: 'Seluruh bisnis', permissions: ['manage', 'manage', 'manage', 'manage', 'manage', 'manage'] },
  { role: 'Supervisor/Manager', users: 1, scope: 'Monitoring dan assessment', permissions: ['view', 'view', 'view', 'view', 'manage', 'view'] },
  { role: 'Admin', users: 1, scope: 'Seluruh operasional', permissions: ['manage', 'manage', 'view', 'manage', 'view', 'limited'] },
  { role: 'Digital Marketing', users: 1, scope: 'Sumber dan kampanye', permissions: ['limited', 'manage', 'view', 'none', 'view', 'none'] },
  { role: 'Sales Online', users: 1, scope: 'Data sendiri dan kolaborasi', permissions: ['manage', 'manage', 'manage', 'view', 'view', 'none'] },
  { role: 'Sales Canvassing', users: 1, scope: 'Prospek dan aktivitas sendiri', permissions: ['limited', 'manage', 'manage', 'view', 'view', 'none'] },
  { role: 'PIC Brand', users: 1, scope: 'Order yang ditugaskan', permissions: ['view', 'view', 'view', 'manage', 'view', 'none'] },
  { role: 'Produksi', users: 4, scope: 'Produksi dan QC', permissions: ['none', 'none', 'none', 'limited', 'view', 'none'] },
]

const appUsers = [
  { name: 'Owner Demo', email: 'owner@silancar.id', role: 'Owner', status: 'Aktif', last: 'Baru saja' },
  { name: 'Manager Sales', email: 'manager@silancar.id', role: 'Supervisor/Manager', status: 'Aktif', last: '3 menit lalu' },
  { name: 'Admin Silancar', email: 'admin@silancar.id', role: 'Admin', status: 'Aktif', last: '5 menit lalu' },
  { name: 'Yola', email: 'yola@silancar.id', role: 'Sales Online', status: 'Aktif', last: '12 menit lalu' },
  { name: 'Rusydi', email: 'rusydi@silancar.id', role: 'Sales Canvassing', status: 'Aktif', last: '28 menit lalu' },
  { name: 'Dinar', email: 'dinar@silancar.id', role: 'PIC Brand', status: 'Aktif', last: '1 jam lalu' },
]

const canvassingProspects = [
  { company: 'CV Garuda Tekstil', pic: 'Budi Santoso', area: 'Bandung', potential: 'Rp125 jt', activity: 'Visit', schedule: 'Hari ini, 10.00', owner: 'Rusydi', status: 'Warm' },
  { company: 'Koperasi Maju Bersama', pic: 'Ibu Rina', area: 'Cimahi', potential: 'Rp68 jt', activity: 'Presentation', schedule: 'Hari ini, 14.30', owner: 'Rusydi', status: 'Hot' },
  { company: 'SMA Bina Bangsa', pic: 'Pak Ahmad', area: 'Sumedang', potential: 'Rp92 jt', activity: 'Call', schedule: '27 Sep, 09.00', owner: 'Rusydi', status: 'Cool' },
  { company: 'PT Arunika Logistik', pic: 'Dewi Laras', area: 'Jakarta', potential: 'Rp180 jt', activity: 'WhatsApp', schedule: '28 Sep, 11.00', owner: 'Yola + Rusydi', status: 'Warm' },
]

const employeeRows = [
  { name: 'Yola', role: 'Sales Online', department: 'Sales', kpi: 96, assessment: 4.5, performance: 'Sangat baik', review: '30 Sep 2026' },
  { name: 'Rusydi', role: 'Sales Canvassing', department: 'Sales', kpi: 78, assessment: 4.1, performance: 'Baik', review: '30 Sep 2026' },
  { name: 'Dinar', role: 'PIC Brand', department: 'Operasional', kpi: 92, assessment: 4.6, performance: 'Sangat baik', review: '1 Okt 2026' },
  { name: 'Rahma', role: 'Production Coordinator', department: 'Produksi', kpi: 88, assessment: 4.2, performance: 'Baik', review: '1 Okt 2026' },
]

const targets = [
  { owner: 'Sales Online', metric: 'Revenue', period: 'September 2026', target: 'Rp500 jt', actual: 'Rp428 jt', progress: 86, type: 'Result KPI' },
  { owner: 'Sales Online', metric: 'Follow-up selesai', period: 'September 2026', target: '320 aktivitas', actual: '294 aktivitas', progress: 92, type: 'Activity KPI' },
  { owner: 'Sales Canvassing', metric: 'Kunjungan berkualitas', period: 'September 2026', target: '24 visit', actual: '18 visit', progress: 75, type: 'Activity KPI' },
  { owner: 'Produksi', metric: 'Order selesai tepat waktu', period: 'September 2026', target: '95%', actual: '88%', progress: 93, type: 'Quality KPI' },
]

type DecisionStatus = 'Menunggu keputusan' | 'Tindak lanjut' | 'Selesai'
type OwnerDecision = {
  id: number
  category: string
  title: string
  object: string
  risk: 'Kritis' | 'Tinggi' | 'Normal'
  impact: string
  recommendation: string
  owner: string
  deadline: string
  status: DecisionStatus
  resolution?: string
  evidence?: string
}

const initialOwnerDecisions: OwnerDecision[] = [
  { id: 1, category: 'Produksi', title: 'Putuskan penanganan rework', object: 'SLC-2609-029 · Oki Uniform', risk: 'Kritis', impact: 'Pengiriman berpotensi terlambat 2 hari dan menambah biaya Rp4,8 jt.', recommendation: 'Setujui lembur satu shift dan prioritaskan QC ulang 100 pcs pertama.', owner: 'Dinar', deadline: 'Hari ini, 11.00', status: 'Menunggu keputusan' },
  { id: 2, category: 'Order', title: 'Verifikasi order sebelum produksi', object: 'SLC-2609-041 · Beno Tactical', risk: 'Tinggi', impact: 'Nilai order Rp216 jt belum memiliki bukti termin pembayaran.', recommendation: 'Minta PIC Brand melengkapi bukti pembayaran sebelum material dipotong.', owner: 'Dinar', deadline: 'Hari ini, 13.00', status: 'Menunggu keputusan' },
  { id: 3, category: 'KPI', title: 'Setujui revisi bobot KPI canvassing', object: 'Target Sales · Oktober 2026', risk: 'Normal', impact: 'Bobot visit dan qualified opportunity berubah untuk empat anggota sales.', recommendation: 'Setujui setelah Manager Sales mengonfirmasi baseline dan sumber datanya.', owner: 'Manager Sales', deadline: 'Besok, 10.00', status: 'Menunggu keputusan' },
  { id: 4, category: 'Akses', title: 'Tinjau akses ekspor laporan', object: 'Role Admin Silancar', risk: 'Tinggi', impact: 'Role dapat mengekspor data pelanggan dan nilai transaksi.', recommendation: 'Batasi ekspor ke laporan agregat dan wajibkan alasan ekspor.', owner: 'Admin Silancar', deadline: 'Besok, 15.00', status: 'Menunggu keputusan' },
]

const availableRoles: AppRole[] = ['Owner', 'Manager/Supervisor', 'Admin', 'Digital Marketing', 'Sales Online', 'Sales Canvassing', 'PIC Brand', 'Produksi']

const rolePageAccess: Record<AppRole, Page[]> = {
  Owner: ['overview', 'workspace', 'decisions', 'inbox', 'crm', 'tasks', 'canvassing', 'pipeline', 'production', 'performance', 'employees', 'targets', 'master', 'access', 'governance'],
  'Manager/Supervisor': ['workspace', 'inbox', 'crm', 'tasks', 'canvassing', 'pipeline', 'production', 'performance', 'employees', 'targets', 'governance'],
  Admin: ['workspace', 'inbox', 'crm', 'tasks', 'pipeline', 'production', 'master', 'access', 'governance'],
  'Digital Marketing': ['workspace', 'crm', 'pipeline', 'performance', 'governance'],
  'Sales Online': ['workspace', 'inbox', 'crm', 'tasks', 'pipeline', 'performance'],
  'Sales Canvassing': ['workspace', 'crm', 'tasks', 'canvassing', 'pipeline', 'performance'],
  'PIC Brand': ['workspace', 'crm', 'tasks', 'production', 'performance'],
  Produksi: ['workspace', 'tasks', 'production', 'performance'],
}

type RoleWorkspaceItem = { id: string; title: string; meta: string; status: string; priority: string; detail: string }
type RoleWorkspaceTool = { title: string; value: string; note: string }
type RoleWorkspaceConfig = {
  score: string
  headline: string
  description: string
  metrics: [string, string, string][]
  queue: RoleWorkspaceItem[]
  tools: RoleWorkspaceTool[]
  flow: string[]
}

const roleWorkspaces: Record<AppRole, RoleWorkspaceConfig> = {
  Owner: { score: '9.4', headline: 'Kendalikan bisnis melalui exception', description: 'Pantau margin, pembayaran, forecast, approval, dan tindak lanjut tanpa membaca seluruh data operasional.', metrics: [['Gross margin', '31,8%', '+2,4%'], ['Piutang jatuh tempo', 'Rp84 jt', '3 invoice'], ['Forecast bulan ini', 'Rp1,42 M', '86% confidence']], queue: [{ id: 'ow-1', title: 'Approve margin order Beno Tactical', meta: 'Margin 24,2% · Rp216 jt', status: 'Menunggu approval', priority: 'Kritis', detail: 'Bukti termin belum lengkap dan margin berada 0,8% di bawah batas.' }, { id: 'ow-2', title: 'Review forecast Sales Canvassing', meta: 'Gap Rp92 jt', status: 'Hari ini', priority: 'Tinggi', detail: 'Pipeline qualified belum cukup untuk memenuhi target akhir bulan.' }], tools: [{ title: 'Approval rules', value: '8 aturan', note: 'Nilai, margin, diskon, akses' }, { title: 'Cash & payment', value: '92% sehat', note: '3 invoice perlu perhatian' }, { title: 'Business forecast', value: '86%', note: 'Akurasi 3 bulan terakhir' }], flow: ['Exception', 'Keputusan', 'PIC', 'Bukti', 'Verifikasi'] },
  'Manager/Supervisor': { score: '9.2', headline: 'Kendalikan kapasitas dan performa tim', description: 'Distribusikan pekerjaan, tangani anggota yang tertinggal, lakukan coaching, dan setujui evaluasi.', metrics: [['Beban rata-rata', '82%', '2 overload'], ['Coaching aktif', '3 sesi', 'Minggu ini'], ['Approval assessment', '2', 'Perlu tindakan']], queue: [{ id: 'mg-1', title: 'Redistribusi lead milik Yola', meta: '18 lead aktif · beban 112%', status: 'Hari ini', priority: 'Kritis', detail: 'Empat lead baru perlu dipindahkan agar SLA respons tetap terjaga.' }, { id: 'mg-2', title: 'Coaching Rusydi', meta: 'Qualified opportunity 75%', status: 'Besok', priority: 'Tinggi', detail: 'Aktivitas visit baik, tetapi rasio qualified masih di bawah target.' }], tools: [{ title: 'Team workload', value: '8 anggota', note: 'Beban dan SLA per orang' }, { title: 'Coaching notes', value: '12 catatan', note: 'Rencana pengembangan aktif' }, { title: 'Assessment approval', value: '8/10', note: '2 menunggu persetujuan' }], flow: ['Monitor', 'Analisis gap', 'Coaching', 'Review', 'Approve'] },
  Admin: { score: '9.3', headline: 'Jaga kualitas dan kelancaran data', description: 'Verifikasi order, tangani duplikasi, distribusikan lead, dan selesaikan antrean administrasi.', metrics: [['Verification queue', '7', '2 kritis'], ['Potensi duplikat', '2', 'Perlu merge'], ['Assignment SLA', '94%', '+6%']], queue: [{ id: 'ad-1', title: 'Verifikasi order SLC-2609-041', meta: 'Beno Tactical · Rp216 jt', status: 'Menunggu bukti', priority: 'Kritis', detail: 'Bukti termin pembayaran menjadi satu-satunya requirement yang belum lengkap.' }, { id: 'ad-2', title: 'Merge pelanggan Mukti Collection', meta: '2 profil · nomor sama', status: 'Perlu review', priority: 'Tinggi', detail: 'Gabungkan profil tanpa menghilangkan histori chat dan opportunity.' }], tools: [{ title: 'Assignment rules', value: '4 aturan', note: 'Round robin dan wilayah' }, { title: 'Data quality', value: '97,4%', note: 'Owner, kontak, next action' }, { title: 'Verification log', value: '46 item', note: 'Seluruh perubahan tercatat' }], flow: ['Masuk', 'Validasi', 'Deduplikasi', 'Assign', 'Audit'] },
  'Digital Marketing': { score: '9.1', headline: 'Ukur campaign sampai revenue', description: 'Hubungkan budget, CPL, kualitas lead, conversion, dan revenue agar optimasi tidak berhenti pada jumlah leads.', metrics: [['Ad spend', 'Rp42 jt', 'September'], ['Cost per lead', 'Rp94.600', '-8,2%'], ['Revenue attributed', 'Rp504 jt', '12× ROAS']], queue: [{ id: 'dm-1', title: 'Optimasi Meta Corporate Uniform', meta: 'CPL Rp128 rb · target Rp100 rb', status: 'Hari ini', priority: 'Tinggi', detail: 'Volume lead tinggi tetapi qualified rate turun menjadi 31%.' }, { id: 'dm-2', title: 'Review kualitas konten WhatsApp', meta: '52% qualified rate', status: 'Besok', priority: 'Normal', detail: 'Konten katalog baru menghasilkan lead berkualitas tertinggi minggu ini.' }], tools: [{ title: 'Campaign performance', value: '6 aktif', note: 'Budget, CPL, ROAS' }, { title: 'Content quality', value: '14 konten', note: 'Lead dan qualified rate' }, { title: 'Attribution', value: '91%', note: 'Campaign → order → revenue' }], flow: ['Campaign', 'Lead', 'Qualified', 'Order', 'Revenue'] },
  'Sales Online': { score: '9.4', headline: 'Ubah percakapan menjadi closing', description: 'Kelola inbox, quotation, follow-up, kolaborasi, dan checklist closing dari satu antrean pribadi.', metrics: [['Inbox saya', '12', '2 overdue'], ['Quotation aktif', '8', 'Rp328 jt'], ['Conversion', '24%', '+3,1%']], queue: [{ id: 'so-1', title: 'Kirim quotation Asteria Studio', meta: '500 pcs · Rp87,5 jt', status: '14.00', priority: 'Kritis', detail: 'Requirement lengkap dan quotation siap dikirim kepada pelanggan.' }, { id: 'so-2', title: 'Closing checklist Nusa Event', meta: 'Jaket event · Rp73,5 jt', status: 'Besok', priority: 'Tinggi', detail: 'Harga disetujui; PO dan alamat pengiriman perlu dikonfirmasi.' }], tools: [{ title: 'Quotation builder', value: '8 draft', note: 'Versi, diskon, approval' }, { title: 'Chat templates', value: '16 template', note: 'Follow-up dan objection' }, { title: 'Customer 360', value: '48 profil', note: 'Chat, order, histori' }], flow: ['Chat', 'Kualifikasi', 'Quotation', 'Negosiasi', 'Closing'] },
  'Sales Canvassing': { score: '9.2', headline: 'Buktikan aktivitas lapangan menjadi peluang', description: 'Rencanakan wilayah, check-in kunjungan, simpan bukti, dan lanjutkan hasil visit menjadi opportunity.', metrics: [['Visit hari ini', '4', '3 terjadwal'], ['Check-in valid', '92%', 'Lokasi sesuai'], ['Potensi pipeline', 'Rp465 jt', '18 opportunity']], queue: [{ id: 'sc-1', title: 'Check-in CV Garuda Tekstil', meta: 'Bandung · 10.00', status: 'Siap check-in', priority: 'Kritis', detail: 'Agenda membahas seragam 1.000 pcs dan pengambilan requirement.' }, { id: 'sc-2', title: 'Unggah hasil presentasi Koperasi Maju', meta: 'Cimahi · potensi Rp68 jt', status: 'Hari ini', priority: 'Tinggi', detail: 'Catat PIC, kebutuhan, foto bukti, dan jadwal follow-up.' }], tools: [{ title: 'Territory & route', value: '4 titik', note: 'Rute kunjungan hari ini' }, { title: 'Visit evidence', value: '18 bukti', note: 'Lokasi, foto, PIC, hasil' }, { title: 'Opportunity handoff', value: '3 aktif', note: 'Kolaborasi dengan online' }], flow: ['Prospek', 'Check-in', 'Visit', 'Bukti', 'Opportunity'] },
  'PIC Brand': { score: '9.3', headline: 'Jaga order bebas kesalahan', description: 'Satukan requirement, perubahan pelanggan, payment, margin, approval, dan komunikasi produksi.', metrics: [['Order aktif', '7', 'Rp684 jt'], ['Requirement lengkap', '94%', '1 pending'], ['First pass approval', '92%', '+4%']], queue: [{ id: 'pb-1', title: 'Lengkapi payment Beno Tactical', meta: 'Termin pertama · Rp64,8 jt', status: 'Hari ini', priority: 'Kritis', detail: 'Produksi belum dapat memotong material sebelum bukti pembayaran terverifikasi.' }, { id: 'pb-2', title: 'Review change request Nusa Event', meta: 'Perubahan artwork v4', status: 'Besok', priority: 'Tinggi', detail: 'Perubahan dapat menambah biaya bordir dan menggeser target kirim satu hari.' }], tools: [{ title: 'Requirement cockpit', value: '5/6 lengkap', note: 'Satu payment pending' }, { title: 'Change requests', value: '2 aktif', note: 'Dampak biaya dan jadwal' }, { title: 'Margin & payment', value: '28,6%', note: 'Margin portofolio order' }], flow: ['Requirement', 'Approval', 'Payment', 'Produksi', 'Handover'] },
  Produksi: { score: '9.2', headline: 'Eksekusi work order dengan bukti', description: 'Pantau material, vendor, kapasitas, output, defect, rework, QC, dan bukti setiap tahap produksi.', metrics: [['Work order aktif', '11', '2 berisiko'], ['Kapasitas terpakai', '78%', 'Aman'], ['Defect rate', '3,8%', '-0,6%']], queue: [{ id: 'pr-1', title: 'QC ulang Oki Uniform', meta: '100 pcs pertama · Rework', status: 'Hari ini', priority: 'Kritis', detail: 'Pastikan jahitan memenuhi toleransi sebelum melanjutkan batch berikutnya.' }, { id: 'pr-2', title: 'Konfirmasi material Nusa Event', meta: 'Vendor Sinar Textile', status: '12.00', priority: 'Tinggi', detail: 'Material utama tersedia; rib dan zipper masih menunggu konfirmasi vendor.' }], tools: [{ title: 'Work order', value: '11 aktif', note: 'Cutting sampai packing' }, { title: 'Material & vendor', value: '88% siap', note: '2 material pending' }, { title: 'QC & defect', value: '96,2% pass', note: 'Bukti dan rework tercatat' }], flow: ['Material', 'Cutting', 'Sewing', 'Finishing', 'QC', 'Packing'] },
}

const nav = [
  { id: 'overview' as const, label: 'Ringkasan', icon: LayoutDashboard },
  { id: 'workspace' as const, label: 'Ruang Kerja Saya', icon: BriefcaseBusiness },
  { id: 'decisions' as const, label: 'Keputusan Owner', icon: BadgeCheck, badge: 4 },
  { id: 'inbox' as const, label: 'Inbox Omnichannel', icon: Inbox, badge: 6 },
  { id: 'crm' as const, label: 'Prospek dan Pelanggan', icon: ContactRound, badge: 1 },
  { id: 'tasks' as const, label: 'Tugas dan Follow-up', icon: ListTodo, badge: 3 },
  { id: 'canvassing' as const, label: 'Sales Canvassing', icon: MapPin },
  { id: 'pipeline' as const, label: 'Peluang Penjualan', icon: TrendingUp },
  { id: 'production' as const, label: 'Order dan Produksi', icon: Boxes, badge: 1 },
  { id: 'performance' as const, label: 'KPI dan OKR', icon: Target },
  { id: 'employees' as const, label: 'Kinerja Karyawan', icon: Star },
  { id: 'targets' as const, label: 'Pengelolaan Target', icon: SlidersHorizontal },
  { id: 'master' as const, label: 'Master Data', icon: Database },
  { id: 'access' as const, label: 'Hak dan Akses', icon: LockKeyhole },
  { id: 'governance' as const, label: 'Laporan dan Audit', icon: ShieldCheck },
]

const rupiah = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)

function ChannelIcon({ channel }: { channel: Channel }) {
  if (channel === 'WhatsApp') return <MessageCircle size={15} />
  if (channel === 'Instagram') return <Instagram size={15} />
  return <Facebook size={15} />
}

function StatCard({ label, value, note, icon: Icon, tone, onClick }: { label: string; value: string; note: string; icon: typeof Inbox; tone: string; onClick?: () => void }) {
  return <article className={`stat-card ${onClick ? 'clickable-item' : ''}`} onClick={onClick}>
    <div className="stat-icon" style={{ background: `${tone}16`, color: tone }}><Icon size={21} /></div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-note"><span><TrendingUp size={13} /> {note}</span> dari minggu lalu</div>
  </article>
}

function Overview({ onNavigate, onOpenDetail }: { onNavigate: (page: Page) => void; onOpenDetail: OpenDetail }) {
  return <div className="page-stack">
    <section className="hero-strip">
      <div>
        <span className="eyebrow">Pusat keputusan owner</span>
        <h2>4 keputusan membutuhkan perhatian</h2>
        <p>Satu keputusan kritis terkait rework produksi harus diputuskan sebelum pukul 11.00.</p>
      </div>
      <button className="primary-btn" onClick={() => onNavigate('decisions')}><BadgeCheck size={17} /> Buka keputusan <ArrowRight size={16} /></button>
    </section>

    <section className="stats-grid">
      <StatCard label="Lead masuk hari ini" value="63" note="12,5%" icon={Inbox} tone="#158a8a" onClick={() => onOpenDetail({ kind: 'Ringkasan owner', title: '63 lead masuk hari ini', subtitle: 'Gabungan WhatsApp, Instagram, dan Facebook', status: '12,5% di atas minggu lalu', description: 'Owner dapat membuka metrik untuk melihat komposisi kanal, kualitas lead, owner, dan penanganannya.', fields: [{ label: 'WhatsApp', value: '41 lead' }, { label: 'Instagram', value: '14 lead' }, { label: 'Facebook', value: '8 lead' }, { label: 'Sudah ditangani', value: '57 lead' }], steps: processSteps(2, ['Masuk', 'Deduplikasi', 'Assigned', 'Direspons']), activities: ['6 lead masih membutuhkan tindakan admin.', 'Distribusi otomatis terakhir berjalan pukul 10.24.', '2 lead terindikasi sebagai kontak duplikat.'], primaryAction: 'Buka daftar lead' })} />
      <StatCard label="Belum ditangani" value="6" note="4 lebih sedikit" icon={Clock3} tone="#e57e25" />
      <StatCard label="Pipeline aktif" value="Rp504,8 jt" note="8,2%" icon={CircleDollarSign} tone="#5369c9" />
      <StatCard label="On time production" value="88%" note="1,2%" icon={PackageCheck} tone="#2f8f5b" />
    </section>

    <section className="dashboard-grid">
      <article className="panel chart-panel">
        <div className="panel-heading">
          <div><span className="eyebrow">Aktivitas 7 hari</span><h3>Pergerakan leads</h3></div>
          <div className="legend"><span><i className="dot leads-dot" /> Semua leads</span><span><i className="dot qualified-dot" /> Qualified</span></div>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData} margin={{ top: 10, right: 0, left: -28, bottom: 0 }}>
              <defs><linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#178d8c" stopOpacity={0.28}/><stop offset="100%" stopColor="#178d8c" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="#e8eef3" strokeDasharray="4 4" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#789', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#789', fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #dde7ee', boxShadow: '0 10px 30px rgba(16,42,67,.10)' }} />
              <Area type="monotone" dataKey="leads" stroke="#178d8c" fill="url(#leadFill)" strokeWidth={2.4} />
              <Area type="monotone" dataKey="qualified" stroke="#e99a3f" fill="transparent" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>
      <article className="panel attention-panel">
        <div className="panel-heading"><div><span className="eyebrow">Perlu tindakan</span><h3>Prioritas hari ini</h3></div><button className="icon-ghost"><MoreHorizontal /></button></div>
        <div className="attention-list">
          <button onClick={() => onNavigate('decisions')}><span className="priority-mark red"><BadgeCheck /></span><span><b>4 keputusan menunggu owner</b><small>1 keputusan kritis jatuh tempo pukul 11.00</small></span><ChevronRight /></button>
          <button onClick={() => onNavigate('inbox')}><span className="priority-mark orange"><Clock3 /></span><span><b>6 chat belum ditangani</b><small>2 sudah melewati SLA 15 menit</small></span><ChevronRight /></button>
          <button onClick={() => onNavigate('production')}><span className="priority-mark red"><AlertCircle /></span><span><b>Order Oki Uniform terlambat</b><small>Rework jahitan membutuhkan keputusan</small></span><ChevronRight /></button>
          <button onClick={() => onNavigate('performance')}><span className="priority-mark green"><ClipboardCheck /></span><span><b>Review KPI mingguan</b><small>Sales canvassing masih di bawah target</small></span><ChevronRight /></button>
        </div>
      </article>
    </section>

    <section className="dashboard-grid lower-grid">
      <article className="panel">
        <div className="panel-heading"><div><span className="eyebrow">Pipeline aktif</span><h3>Distribusi nilai per tahap</h3></div><button className="text-btn" onClick={() => onNavigate('pipeline')}>Lihat pipeline <ArrowRight /></button></div>
        <div className="stage-bars">
          {[['Lead baru', 100, 'Rp100 jt', '#91a1b2'], ['Qualified', 160, 'Rp160 jt', '#178d8c'], ['Sample', 216, 'Rp216 jt', '#e99a3f'], ['Negosiasi', 91, 'Rp90,5 jt', '#7758c5']].map(([label, width, value, color]) => <div className="stage-row" key={String(label)}><div><b>{label}</b><span>{value}</span></div><div className="bar-track"><i style={{ width: `${Math.min(Number(width) / 2.16, 100)}%`, background: String(color) }} /></div></div>)}
        </div>
      </article>
      <article className="panel team-panel">
        <div className="panel-heading"><div><span className="eyebrow">Kapasitas tim</span><h3>Beban kerja aktif</h3></div></div>
        {[['Yola', 'Sales online', 18, '#e9a13b'], ['Rusydi', 'Sales canvassing', 11, '#188c8b'], ['Dinar', 'PIC brand', 7, '#6877d5']].map(([name, role, load, color]) => <div className="team-load" key={String(name)}><span className="avatar-sm" style={{ background: `${color}20`, color: String(color) }}>{String(name).slice(0, 1)}</span><div><b>{name}</b><small>{role}</small></div><div className="load-number"><b>{load}</b><small>aktif</small></div></div>)}
      </article>
    </section>
  </div>
}

function RoleWorkspace({ role, onOpenDetail }: { role: AppRole; onOpenDetail: OpenDetail }) {
  const config = roleWorkspaces[role]
  const [completed, setCompleted] = useState<string[]>([])
  const [pendingCompletion, setPendingCompletion] = useState<RoleWorkspaceItem | null>(null)
  const queue = config.queue
  const activeCount = queue.filter(item => !completed.includes(item.id)).length
  const openWorkspaceDetail = (item: RoleWorkspaceItem) => onOpenDetail({
    kind: `Ruang kerja ${role}`,
    title: item.title,
    subtitle: item.meta,
    status: completed.includes(item.id) ? 'Selesai dan tercatat' : item.status,
    description: item.detail,
    fields: [{ label: 'Role aktif', value: role }, { label: 'Prioritas', value: item.priority }, { label: 'Status', value: completed.includes(item.id) ? 'Selesai' : item.status }, { label: 'SLA', value: item.status }, { label: 'Bukti wajib', value: 'Catatan hasil dan lampiran' }, { label: 'Audit', value: 'Setiap perubahan tercatat' }],
    steps: processSteps(completed.includes(item.id) ? config.flow.length : 2, config.flow),
    activities: [completed.includes(item.id) ? 'Aktivitas sudah diselesaikan pada sesi demo.' : 'Aktivitas menunggu tindakan pengguna.', item.detail, `Aktivitas ditampilkan khusus untuk role ${role}.`],
    primaryAction: completed.includes(item.id) ? 'Lihat bukti hasil' : 'Catat hasil aktivitas',
  })
  const confirmCompletion = () => {
    if (!pendingCompletion) return
    setCompleted(current => [...current.filter(id => id !== pendingCompletion.id), pendingCompletion.id])
    setPendingCompletion(null)
  }
  return <div className="page-stack role-workspace">
    <section className="role-hero panel">
      <div><span className="eyebrow">Ruang kerja berbasis peran</span><h2>{config.headline}</h2><p>{config.description}</p><div className="role-flow">{config.flow.map((step, index) => <span key={step}><i>{index + 1}</i>{step}</span>)}</div></div>
      <div className="readiness-score"><span>Kesiapan demo</span><b>{config.score}<small>/10</small></b><em>Cakupan alur prototype</em></div>
    </section>

    <section className="role-metrics">{config.metrics.map(([label, value, note], index) => <article className="panel" key={label}><span className={`metric-icon ${index === 0 ? 'green' : index === 1 ? 'orange' : 'purple'}`}>{index === 0 ? <TrendingUp /> : index === 1 ? <Clock3 /> : <BadgeCheck />}</span><div><small>{label}</small><b>{value}</b><em>{note}</em></div></article>)}</section>

    <section className="role-work-grid">
      <article className="panel role-queue"><div className="panel-heading"><div><span className="eyebrow">Pekerjaan saya</span><h3>Antrean prioritas {role}</h3><p>{activeCount} aktivitas aktif · diperbarui berdasarkan assignment dan SLA.</p></div><span className="risk-pill warning">{activeCount} aktif</span></div><div>{queue.map(item => { const done = completed.includes(item.id); return <div className={`role-queue-item ${done ? 'done' : ''}`} key={item.id}>
        <button className="task-check" onClick={() => done ? setCompleted(current => current.filter(id => id !== item.id)) : setPendingCompletion(item)} aria-label={done ? `Buka kembali ${item.title}` : `Selesaikan ${item.title}`}>{done ? <Check /> : null}</button>
        <button className="role-queue-copy" onClick={() => openWorkspaceDetail(item)}><span className={`priority-chip ${item.priority.toLowerCase()}`}>{item.priority}</span><span><b>{item.title}</b><small>{item.meta}</small><em>{item.detail}</em></span></button>
        <span className={`decision-status ${done ? 'done' : 'waiting'}`}>{done ? 'Selesai' : item.status}</span><button className="icon-ghost" onClick={() => openWorkspaceDetail(item)} aria-label={`Buka detail ${item.title}`}><ChevronRight /></button>
      </div> })}</div></article>

      <aside className="role-tool-column"><article className="panel"><div className="panel-heading"><div><span className="eyebrow">Alat kerja role</span><h3>Kontrol utama</h3></div></div><div className="role-tool-list">{config.tools.map(tool => <button key={tool.title} onClick={() => onOpenDetail({ kind: `Kontrol ${role}`, title: tool.title, subtitle: tool.note, status: tool.value, description: `Modul ${tool.title} menyediakan data dan tindakan yang dibutuhkan ${role} untuk menyelesaikan pekerjaan tanpa berpindah konteks.`, fields: [{ label: 'Indikator saat ini', value: tool.value }, { label: 'Cakupan', value: tool.note }, { label: 'Role pemilik', value: role }, { label: 'Sumber data', value: 'Aktivitas operasional Silancar' }], steps: processSteps(2, config.flow), activities: [`Nilai terakhir: ${tool.value}.`, tool.note, 'Akses mengikuti role dan assignment pengguna.'], primaryAction: 'Buka kontrol' })}><span><b>{tool.title}</b><small>{tool.note}</small></span><strong>{tool.value}</strong><ChevronRight /></button>)}</div></article><article className="panel role-proof-card"><span className="priority-mark green"><ShieldCheck /></span><div><span className="eyebrow">Akuntabilitas</span><h3>Tindakan wajib memiliki hasil</h3><p>Aktivitas selesai harus menyimpan catatan, bukti, waktu, dan pengguna yang melakukan perubahan.</p></div></article></aside>
    </section>
    {pendingCompletion && <CompletionModal title={pendingCompletion.title} onClose={() => setPendingCompletion(null)} onConfirm={confirmCompletion} />}
  </div>
}

function OwnerDecisions() {
  const [items, setItems] = useState<OwnerDecision[]>(initialOwnerDecisions)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [view, setView] = useState<'active' | 'completed'>('active')
  const [note, setNote] = useState('')
  const [lastAction, setLastAction] = useState('')
  const selected = items.find(item => item.id === selectedId) ?? null
  const waiting = items.filter(item => item.status === 'Menunggu keputusan').length
  const followUp = items.filter(item => item.status === 'Tindak lanjut').length
  const completed = items.filter(item => item.status === 'Selesai').length
  const visible = items.filter(item => view === 'active' ? item.status !== 'Selesai' : item.status === 'Selesai')

  const decide = (resolution: string) => {
    if (!selected) return
    setItems(current => current.map(item => item.id === selected.id ? { ...item, status: 'Tindak lanjut', resolution: `${resolution}${note.trim() ? ` · ${note.trim()}` : ''}` } : item))
    setLastAction(`${resolution} dicatat. Tindak lanjut otomatis dibuat untuk ${selected.owner}.`)
    setNote('')
    setSelectedId(null)
  }

  const verifyComplete = (id: number) => {
    setItems(current => current.map(item => item.id === id ? { ...item, status: 'Selesai', evidence: 'Bukti penyelesaian dan catatan PIC telah diverifikasi owner.' } : item))
    setLastAction('Tindak lanjut ditutup setelah bukti penyelesaian diverifikasi.')
  }

  return <div className="page-stack owner-decision-page">
    {lastAction && <div className="decision-feedback"><CheckCircle2 /><span><b>Aktivitas tersimpan</b>{lastAction}</span><button onClick={() => setLastAction('')} aria-label="Tutup notifikasi"><X /></button></div>}
    <section className="decision-stats">
      <article className="panel"><span className="metric-icon red"><AlertCircle /></span><div><small>Menunggu keputusan</small><b>{waiting}</b><em>Owner perlu bertindak</em></div></article>
      <article className="panel"><span className="metric-icon orange"><Clock3 /></span><div><small>Dalam tindak lanjut</small><b>{followUp}</b><em>Menunggu hasil PIC</em></div></article>
      <article className="panel"><span className="metric-icon green"><CheckCircle2 /></span><div><small>Selesai diverifikasi</small><b>{completed}</b><em>Bukti telah diperiksa</em></div></article>
      <article className="panel"><span className="metric-icon purple"><FileClock /></span><div><small>SLA keputusan</small><b>92%</b><em>Target maksimal 4 jam</em></div></article>
    </section>

    <section className="decision-layout">
      <article className="panel decision-queue">
        <div className="panel-heading decision-heading"><div><span className="eyebrow">Pusat kendali owner</span><h3>Keputusan dan pengecualian</h3><p>Hanya hal yang membutuhkan kewenangan owner atau berisiko terhadap target bisnis.</p></div><div className="task-tabs"><button className={view === 'active' ? 'active' : ''} onClick={() => setView('active')}>Aktif</button><button className={view === 'completed' ? 'active' : ''} onClick={() => setView('completed')}>Selesai</button></div></div>
        <div className="decision-list">{visible.length === 0 ? <div className="decision-empty"><CheckCircle2 /><h3>Tidak ada keputusan pada daftar ini</h3><p>Semua exception sudah diproses dan diverifikasi.</p></div> : visible.map(item => <button className="decision-item" key={item.id} onClick={() => setSelectedId(item.id)}>
          <span className={`decision-risk ${item.risk.toLowerCase()}`}>{item.risk}</span>
          <span className="decision-copy"><small>{item.category} · {item.object}</small><b>{item.title}</b><em>{item.impact}</em></span>
          <span className="decision-owner"><small>PIC</small><b>{item.owner}</b></span>
          <span className="decision-deadline"><small>Tenggat</small><b>{item.deadline}</b></span>
          <span className={`decision-status ${item.status === 'Selesai' ? 'done' : item.status === 'Tindak lanjut' ? 'progress' : 'waiting'}`}>{item.status}</span>
          <ChevronRight />
        </button>)}</div>
      </article>

      <aside className="decision-followups">
        <article className="panel"><div className="panel-heading"><div><span className="eyebrow">Kontrol penyelesaian</span><h3>Tindak lanjut keputusan</h3></div><span className="risk-pill warning">{followUp} aktif</span></div>
          <div className="owner-followup-list">{items.filter(item => item.status === 'Tindak lanjut').length === 0 ? <div className="followup-placeholder"><Clock3 /><p>Keputusan yang diproses akan otomatis menjadi tindak lanjut di sini.</p></div> : items.filter(item => item.status === 'Tindak lanjut').map(item => <div key={item.id}><span><b>{item.title}</b><small>{item.owner} · {item.deadline}</small><em>{item.resolution}</em></span><button onClick={() => verifyComplete(item.id)}><Check /> Verifikasi selesai</button></div>)}</div>
        </article>
        <article className="panel owner-control-rule"><span className="priority-mark green"><ShieldCheck /></span><h3>Aturan penutupan</h3><p>Keputusan baru dianggap selesai setelah PIC mencatat hasil dan owner memverifikasi bukti penyelesaiannya.</p><ul><li>Keputusan dan alasan tercatat.</li><li>PIC serta tenggat ditentukan.</li><li>Bukti hasil wajib tersedia.</li><li>Jejak aktivitas masuk audit log.</li></ul></article>
      </aside>
    </section>

    {selected && <div className="decision-modal-overlay" role="presentation" onMouseDown={event => { if (event.currentTarget === event.target) setSelectedId(null) }}><section className="decision-modal" role="dialog" aria-modal="true" aria-label={`Keputusan ${selected.title}`}>
      <header><div><span className="eyebrow">{selected.category} · Keputusan owner</span><h2>{selected.title}</h2><p>{selected.object}</p></div><button onClick={() => setSelectedId(null)} aria-label="Tutup keputusan"><X /></button></header>
      <div className="decision-modal-body">
        <section className="decision-context"><span className={`decision-risk ${selected.risk.toLowerCase()}`}>{selected.risk}</span><h3>Dampak jika tidak diputuskan</h3><p>{selected.impact}</p></section>
        <section className="decision-recommendation"><span><Sparkles /> Rekomendasi sistem</span><p>{selected.recommendation}</p></section>
        <dl><div><dt>Penanggung jawab</dt><dd>{selected.owner}</dd></div><div><dt>Tenggat keputusan</dt><dd>{selected.deadline}</dd></div><div><dt>Status</dt><dd>{selected.status}</dd></div><div><dt>Objek terkait</dt><dd>{selected.object}</dd></div></dl>
        <label className="decision-note"><span>Catatan owner <small>Opsional, tetapi disarankan</small></span><textarea value={note} onChange={event => setNote(event.target.value)} placeholder="Tuliskan alasan keputusan, batasan, atau hasil yang diharapkan…" /></label>
      </div>
      <footer><button className="secondary-btn" onClick={() => decide('Didelegasikan untuk keputusan lanjutan')}>Delegasikan</button><button className="secondary-btn revise-btn" onClick={() => decide('Revisi diminta oleh owner')}>Minta revisi</button><button className="primary-btn" onClick={() => decide('Disetujui oleh owner')}><Check /> Setujui dan buat tindak lanjut</button></footer>
    </section></div>}
  </div>
}

function OmnichannelInbox({ onOpenDetail }: { onOpenDetail: OpenDetail }) {
  const [selectedId, setSelectedId] = useState(1)
  const [channel, setChannel] = useState<'Semua' | Channel>('Semua')
  const [query, setQuery] = useState('')
  const [reply, setReply] = useState('')
  const [owner, setOwner] = useState(conversations[0].owner)
  const [sentMessages, setSentMessages] = useState<string[]>([])
  const selected = conversations.find(item => item.id === selectedId) ?? conversations[0]
  const filtered = conversations.filter(item => (channel === 'Semua' || item.channel === channel) && `${item.name} ${item.brand} ${item.preview}`.toLowerCase().includes(query.toLowerCase()))
  const submitReply = (event: FormEvent) => { event.preventDefault(); if (!reply.trim()) return; setSentMessages(messages => [...messages, reply.trim()]); setReply('') }
  return <section className="inbox-shell">
    <aside className="conversation-list">
      <div className="inbox-title-row"><div><span className="eyebrow">Semua kanal</span><h2>Inbox</h2></div><button className="square-btn"><Plus /></button></div>
      <label className="search-box compact"><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari nama atau pesan" /></label>
      <div className="channel-tabs">
        {(['Semua', 'WhatsApp', 'Instagram', 'Facebook'] as const).map(item => <button className={channel === item ? 'active' : ''} onClick={() => setChannel(item)} key={item}>{item === 'Semua' ? item : <><ChannelIcon channel={item} /><span>{item}</span></>}</button>)}
      </div>
      <div className="inbox-filter-row"><span>{filtered.length} percakapan</span><button><Filter /> Filter</button></div>
      <div className="conversation-scroll">
        {filtered.map(item => <button className={`conversation-item ${selected.id === item.id ? 'active' : ''}`} onClick={() => { setSelectedId(item.id); setOwner(item.owner) }} key={item.id}>
          <span className={`channel-avatar ${item.channel.toLowerCase()}`}><ChannelIcon channel={item.channel} /></span>
          <span className="conversation-copy"><span><b>{item.name}</b><time>{item.time}</time></span><small>{item.brand}</small><p>{item.preview}</p><em className={`temp ${item.temperature.toLowerCase()}`}>{item.temperature}</em></span>
          {item.unread > 0 && <i className="unread-badge">{item.unread}</i>}
        </button>)}
      </div>
    </aside>
    <main className="chat-panel">
      <header className="chat-header">
        <div className="chat-person"><span className="avatar-md">{selected.name.charAt(0)}</span><div><h3>{selected.name}</h3><span><ChannelIcon channel={selected.channel} /> {selected.channel} · {selected.brand}</span></div></div>
        <div className="chat-actions"><button className="status-button"><i /> SLA aktif 08:32</button><button className="secondary-btn chat-detail-btn" onClick={() => onOpenDetail({ kind: 'Detail percakapan', title: selected.name, subtitle: `${selected.brand} · ${selected.channel}`, status: `${selected.temperature} · ${selected.stage}`, description: 'Percakapan terhubung ke profil lead sehingga assignment, follow-up, dan seluruh riwayat tidak terpisah dari proses penjualan.', fields: [{ label: 'Kebutuhan', value: selected.needs }, { label: 'Volume', value: selected.volume }, { label: 'Primary owner', value: owner }, { label: 'Next action', value: selected.nextAction }], steps: processSteps(1, ['Pesan masuk', 'Respons', 'Kualifikasi', 'Opportunity']), activities: [`Pesan terakhir diterima ${selected.time}.`, `Ringkasan kebutuhan dibuat dari percakapan ${selected.channel}.`, `SLA respons dipantau oleh sistem.`], primaryAction: 'Buka profil lead' })}>Lihat detail</button><button className="square-btn"><MoreHorizontal /></button></div>
      </header>
      <div className="chat-thread">
        <div className="date-divider"><span>Hari ini</span></div>
        <div className="bubble incoming"><p>Halo kak, saya dari {selected.brand}. Kami sedang mencari vendor untuk {selected.needs.toLowerCase()}.</p><time>09.34</time></div>
        <div className="bubble outgoing"><p>Halo Kak {selected.name.split(' ')[0]}, terima kasih sudah menghubungi Silancar. Boleh diinformasikan perkiraan jumlah dan target waktunya?</p><time>09.36 <Check size={13} /></time></div>
        <div className="bubble incoming"><p>{selected.preview}</p><time>09.42</time></div>
        <div className="internal-note"><Sparkles /><span><b>Ringkasan AI</b>Kebutuhan {selected.needs.toLowerCase()} sebanyak {selected.volume}. Pelanggan membutuhkan kepastian harga dan jadwal.</span></div>
        {sentMessages.map((message, index) => <div className="bubble outgoing" key={`${message}-${index}`}><p>{message}</p><time>Baru saja <Check size={13} /></time></div>)}
      </div>
      <form className="composer" onSubmit={submitReply}>
        <button type="button" className="icon-ghost"><Paperclip /></button>
        <textarea value={reply} onChange={event => setReply(event.target.value)} placeholder="Tulis balasan ke pelanggan..." rows={1} />
        <button className="send-btn" aria-label="Kirim pesan"><Send /></button>
      </form>
    </main>
    <aside className="customer-panel">
      <div className="customer-head"><span className="avatar-lg">{selected.name.charAt(0)}</span><h3>{selected.name}</h3><p>{selected.brand}</p><div className="customer-badges"><span className={`temp ${selected.temperature.toLowerCase()}`}>{selected.temperature}</span><span>{selected.stage}</span></div></div>
      <div className="detail-section"><div className="detail-title"><span>Penanggung jawab</span><button>Ubah</button></div><select value={owner} onChange={event => setOwner(event.target.value)}><option>Belum ada</option><option>Yola</option><option>Rusydi</option><option>Dinar</option></select></div>
      <div className="detail-section"><div className="detail-title"><span>Informasi lead</span></div><dl><div><dt>Kebutuhan</dt><dd>{selected.needs}</dd></div><div><dt>Volume</dt><dd>{selected.volume}</dd></div><div><dt>Tahap</dt><dd>{selected.stage}</dd></div><div><dt>Sumber</dt><dd>{selected.channel}</dd></div></dl></div>
      <div className="detail-section"><div className="detail-title"><span>Tindakan berikutnya</span><button>Edit</button></div><div className="next-action"><CalendarDays /><div><b>{selected.nextAction}</b><small>Hari ini, 14.00 WIB</small></div></div></div>
      <div className="detail-section"><div className="detail-title"><span>Kolaborator</span><button><Plus /> Tambah</button></div><div className="collaborators"><span className="avatar-sm">Y</span><span className="avatar-sm alt">R</span><p>Yola dan Rusydi</p></div></div>
    </aside>
  </section>
}

function Crm({ onNavigate, onOpenDetail }: { onNavigate: (page: Page) => void; onOpenDetail: OpenDetail }) {
  const [query, setQuery] = useState('')
  const filtered = leadRows.filter(item => `${item.name} ${item.brand} ${item.need} ${item.owner}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="page-stack">
    <section className="crm-stats">
      <div><span className="metric-icon green"><ContactRound /></span><p><small>Total lead aktif</small><b>48</b></p></div>
      <div><span className="metric-icon orange"><Clock3 /></span><p><small>Follow-up hari ini</small><b>12</b></p></div>
      <div><span className="metric-icon red"><AlertCircle /></span><p><small>Belum memiliki owner</small><b>1</b></p></div>
      <div><span className="metric-icon purple"><BadgeCheck /></span><p><small>Potensi duplikat</small><b>2</b></p></div>
    </section>
    <section className="panel crm-panel">
      <div className="table-tools"><label className="search-box compact"><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari nama, brand, kebutuhan, atau owner" /></label><div><button className="secondary-btn"><Filter /> Filter</button><button className="secondary-btn"><FileText /> Ekspor</button></div></div>
      <div className="table-scroll"><table className="data-table crm-table"><thead><tr><th>Kontak dan brand</th><th>Sumber</th><th>Kebutuhan</th><th>Owner</th><th>Tahap</th><th>Next action</th><th>Jatuh tempo</th><th>Kualitas</th></tr></thead><tbody>{filtered.map(lead => <tr className="clickable-row" key={lead.name} onClick={() => onOpenDetail({ kind: 'Detail lead dan pelanggan', title: lead.name, subtitle: `${lead.brand} · ${lead.source}`, status: `${lead.quality} · ${lead.stage}`, description: 'Profil ini menjadi single source of truth untuk identitas, kebutuhan, komunikasi, assignment, dan tindak lanjut pelanggan.', fields: [{ label: 'Kebutuhan', value: lead.need }, { label: 'Primary owner', value: lead.owner }, { label: 'Next action', value: lead.next }, { label: 'Jatuh tempo', value: lead.due }, { label: 'Sumber lead', value: lead.source }, { label: 'Potensi duplikat', value: lead.name === 'Sinta Maharani' ? 'Perlu diperiksa' : 'Tidak ditemukan' }], steps: processSteps(['New', 'Contacted', 'Qualified', 'Sample', 'Negotiation'].indexOf(lead.stage), ['New', 'Contacted', 'Qualified', 'Sample', 'Negotiation']), activities: [`Next action ditetapkan: ${lead.next}.`, `Owner aktif: ${lead.owner}.`, `Lead dibuat dari kanal ${lead.source}.`], primaryAction: 'Buka aktivitas lengkap' })}><td><b>{lead.name}</b><small>{lead.brand}</small></td><td><span className="source-cell"><ChannelIcon channel={lead.source as Channel} /> {lead.source}</span></td><td>{lead.need}</td><td>{lead.owner}</td><td><span className="status-pill">{lead.stage}</span></td><td>{lead.next}</td><td><span className={lead.due.includes('Terlambat') ? 'due-overdue' : ''}>{lead.due}</span></td><td><span className={`temp ${lead.quality.toLowerCase()}`}>{lead.quality}</span></td></tr>)}</tbody></table></div>
    </section>
    <section className="crm-bottom">
      <article className="panel"><div className="panel-heading"><div><span className="eyebrow">Kualitas data</span><h3>Kelengkapan profil lead</h3></div><b className="quality-score">94%</b></div><div className="quality-grid"><span><CheckCircle2 /> 46 memiliki owner</span><span><CheckCircle2 /> 44 memiliki next action</span><span><AlertCircle /> 2 perlu deduplikasi</span></div></article>
      <article className="panel action-card"><div><span className="eyebrow">Langkah berikutnya</span><h3>3 tugas paling mendesak</h3><p>Kelola follow-up, assignment, dan eskalasi dari satu daftar kerja.</p></div><button className="text-btn" onClick={() => onNavigate('tasks')}>Buka tugas <ArrowRight /></button></article>
    </section>
  </div>
}

function Tasks({ onNavigate, onOpenDetail }: { onNavigate: (page: Page) => void; onOpenDetail: OpenDetail }) {
  const [completed, setCompleted] = useState<string[]>([])
  const [pendingCompletion, setPendingCompletion] = useState<string | null>(null)
  return <div className="page-stack">
    <section className="task-layout">
      <article className="panel task-board">
        <div className="panel-heading"><div><span className="eyebrow">Prioritas hari ini</span><h3>Daftar kerja tim</h3></div><div className="task-tabs"><button className="active">Semua</button><button>Overdue</button><button>Saya</button></div></div>
        <div className="task-list">{followUps.map(task => { const done = completed.includes(task.title); return <div className={`task-item ${done ? 'done' : ''}`} key={task.title}><button className="task-check" onClick={() => done ? setCompleted(value => value.filter(item => item !== task.title)) : setPendingCompletion(task.title)}>{done ? <Check /> : null}</button><div className="task-copy clickable-copy" onClick={() => onOpenDetail({ kind: 'Detail tugas dan follow-up', title: task.title, subtitle: `${task.type} · ${task.owner}`, status: done ? 'Selesai' : task.status, description: 'Tugas memastikan setiap lead memiliki tindakan konkret, pemilik, tenggat, prioritas, dan hasil yang dapat diaudit.', fields: [{ label: 'Penanggung jawab', value: task.owner }, { label: 'Jenis aktivitas', value: task.type }, { label: 'Prioritas', value: task.priority }, { label: 'Tenggat', value: `${task.status}, ${task.time}` }, { label: 'Objek terkait', value: task.title.split(' ').slice(-2).join(' ') }, { label: 'Eskalasi', value: task.status === 'Overdue' ? 'Admin dan owner' : 'Belum diperlukan' }], steps: processSteps(done ? 3 : task.status === 'Overdue' ? 2 : 1, ['Dibuat', 'Dikerjakan', 'Eskalasi', 'Selesai']), activities: [done ? 'Tugas ditandai selesai pada sesi demo.' : 'Tugas masih menunggu tindakan pemilik.', `Prioritas ditetapkan sebagai ${task.priority}.`, `Tenggat tercatat ${task.status}, ${task.time}.`], primaryAction: done ? 'Lihat hasil' : 'Catat hasil tugas' })}><b>{task.title}</b><span>{task.type} · {task.owner}</span></div><span className={`priority-chip ${task.priority.toLowerCase()}`}>{task.priority}</span><div className="task-time"><b>{task.time}</b><span>{task.status}</span></div><button className="icon-ghost" aria-label={`Buka detail ${task.title}`} onClick={() => onOpenDetail({ kind: 'Detail tugas dan follow-up', title: task.title, subtitle: `${task.type} · ${task.owner}`, status: done ? 'Selesai' : task.status, description: 'Tugas memastikan setiap lead memiliki tindakan konkret, pemilik, tenggat, prioritas, dan hasil yang dapat diaudit.', fields: [{ label: 'Penanggung jawab', value: task.owner }, { label: 'Jenis aktivitas', value: task.type }, { label: 'Prioritas', value: task.priority }, { label: 'Tenggat', value: `${task.status}, ${task.time}` }], steps: processSteps(done ? 3 : 1, ['Dibuat', 'Dikerjakan', 'Eskalasi', 'Selesai']), activities: ['Status tugas dapat diperbarui dari daftar kerja.', `Prioritas ditetapkan sebagai ${task.priority}.`, `Tenggat tercatat ${task.status}, ${task.time}.`], primaryAction: done ? 'Lihat hasil' : 'Catat hasil tugas' })}><ChevronRight /></button></div> })}</div>
      </article>
      <aside className="task-sidebar">
        <article className="panel"><span className="eyebrow">Ringkasan</span><h3>Kontrol follow-up</h3><div className="task-summary"><div><b>12</b><span>Hari ini</span></div><div><b>3</b><span>Overdue</span></div><div><b>92%</b><span>Patuh SLA</span></div></div></article>
        <article className="panel escalation-card"><span className="priority-mark red"><AlertCircle /></span><h3>Eskalasi otomatis</h3><p>Lead tanpa owner lebih dari 15 menit diteruskan ke admin dan owner.</p><button className="text-btn" onClick={() => onNavigate('inbox')}>Lihat di inbox <ArrowRight /></button></article>
        <article className="panel"><span className="eyebrow">Kolaborasi sales</span><h3>2 permintaan bantuan</h3><p className="muted-copy">Rusydi membantu kunjungan untuk peluang milik Yola tanpa mengubah primary owner.</p><button className="secondary-btn wide-btn">Tinjau kolaborasi</button></article>
      </aside>
    </section>
    {pendingCompletion && <CompletionModal title={pendingCompletion} onClose={() => setPendingCompletion(null)} onConfirm={() => { setCompleted(value => [...value.filter(item => item !== pendingCompletion), pendingCompletion]); setPendingCompletion(null) }} />}
  </div>
}

function Canvassing({ onOpenDetail }: { onOpenDetail: OpenDetail }) {
  return <div className="page-stack">
    <section className="module-stats">
      <div><span className="metric-icon green"><Building2 /></span><p><small>Prospek aktif</small><b>32</b></p></div>
      <div><span className="metric-icon orange"><MapPin /></span><p><small>Visit bulan ini</small><b>18/24</b></p></div>
      <div><span className="metric-icon purple"><BriefcaseBusiness /></span><p><small>Presentasi</small><b>9</b></p></div>
      <div><span className="metric-icon red"><CircleDollarSign /></span><p><small>Potensi pipeline</small><b>Rp465 jt</b></p></div>
    </section>
    <section className="panel canvassing-panel">
      <div className="panel-heading module-heading"><div><span className="eyebrow">Aktivitas lapangan</span><h3>Prospek dan jadwal kunjungan</h3><p>Catat perusahaan, PIC, alamat, potensi, visit, call, WhatsApp, presentasi, dan hasil follow-up.</p></div><div className="module-tools"><button className="secondary-btn"><CalendarDays /> Kalender</button><button className="secondary-btn"><Plus /> Tambah prospek</button></div></div>
      <div className="table-scroll"><table className="data-table module-table"><thead><tr><th>Perusahaan dan PIC</th><th>Area</th><th>Potensi</th><th>Aktivitas berikutnya</th><th>Jadwal</th><th>Owner</th><th>Status</th></tr></thead><tbody>{canvassingProspects.map(item => <tr className="clickable-row" key={item.company} onClick={() => onOpenDetail({ kind: 'Detail sales canvassing', title: item.company, subtitle: `${item.pic} · ${item.area}`, status: item.status, description: 'Prospek canvassing menyimpan hasil kunjungan, kontak, presentasi, potensi, bukti aktivitas, dan follow-up sampai berubah menjadi order.', fields: [{ label: 'PIC Perusahaan', value: item.pic }, { label: 'Area', value: item.area }, { label: 'Potensi', value: item.potential }, { label: 'Owner', value: item.owner }, { label: 'Aktivitas berikutnya', value: item.activity }, { label: 'Jadwal', value: item.schedule }], steps: processSteps(item.status === 'Hot' ? 3 : item.status === 'Warm' ? 2 : 1, ['Prospek baru', 'Kontak', 'Visit/Presentasi', 'Hot', 'Order']), activities: [`${item.activity} dijadwalkan ${item.schedule}.`, `Potensi peluang diperbarui menjadi ${item.potential}.`, `Aktivitas dimiliki oleh ${item.owner}.`], primaryAction: 'Catat hasil aktivitas' })}><td><b>{item.company}</b><small>{item.pic}</small></td><td><span className="source-cell"><MapPin /> {item.area}</span></td><td><b>{item.potential}</b></td><td><span className="status-pill">{item.activity}</span></td><td>{item.schedule}</td><td>{item.owner}</td><td><span className={`temp ${item.status.toLowerCase()}`}>{item.status}</span></td></tr>)}</tbody></table></div>
    </section>
    <section className="canvassing-bottom"><article className="panel"><div className="panel-heading"><div><span className="eyebrow">Target aktivitas</span><h3>Realisasi September</h3></div><b className="quality-score">75%</b></div><div className="activity-bars">{[['Visit', 18, 24], ['Prospek baru', 21, 28], ['Presentasi', 9, 12], ['Follow-up', 38, 40]].map(([label, actual, target]) => <div key={String(label)}><span><b>{label}</b><small>{actual} dari {target}</small></span><div><i style={{ width: `${Number(actual) / Number(target) * 100}%` }} /></div></div>)}</div></article><article className="panel"><span className="eyebrow">Kolaborasi</span><h3>Sales online + canvassing</h3><p className="muted-copy">Dua peluang membutuhkan kunjungan Rusydi, sementara Yola tetap menjadi primary owner. Seluruh kontribusi disimpan pada opportunity yang sama.</p><button className="secondary-btn wide-btn">Lihat permintaan bantuan</button></article></section>
  </div>
}

function Pipeline({ onOpenDetail }: { onOpenDetail: OpenDetail }) {
  return <div className="page-stack">
    <section className="pipeline-summary">
      <div><span>Total pipeline</span><b>Rp504,8 jt</b></div><div><span>Weighted forecast</span><b>Rp284,7 jt</b></div><div><span>Closing bulan ini</span><b>Rp176,2 jt</b></div><div><span>Win rate</span><b>24,8%</b></div>
    </section>
    <section className="kanban-board">
      {pipelineColumns.map(column => <div className="kanban-column" key={column.id}>
        <header><span><i style={{ background: column.color }} />{column.label}</span><b>{column.items.length}</b></header>
        <div className="kanban-total">{rupiah(column.items.reduce((sum, item) => sum + item.value, 0))}</div>
        <div className="kanban-items">
          {column.items.map(item => <article className="deal-card clickable-item" key={item.brand} onClick={() => onOpenDetail({ kind: 'Detail opportunity', title: item.brand, subtitle: item.product, status: column.label, description: 'Opportunity menghubungkan kebutuhan lead dengan nilai transaksi, probabilitas, quotation, sample, kolaborator, dan target closing.', fields: [{ label: 'Nilai peluang', value: rupiah(item.value) }, { label: 'Primary owner', value: item.owner }, { label: 'Aging tahap', value: item.age }, { label: 'Probabilitas', value: column.id === 'negotiation' ? '75%' : column.id === 'sample' ? '55%' : column.id === 'qualified' ? '35%' : '10%' }, { label: 'Target closing', value: '30 Sep 2026' }, { label: 'Kolaborator', value: item.owner === 'Yola' ? 'Rusydi · Canvassing' : 'Belum ada' }], steps: processSteps(['new', 'qualified', 'sample', 'negotiation'].indexOf(column.id), ['Lead baru', 'Qualified', 'Sample', 'Negosiasi', 'Won']), activities: [`Opportunity berada di tahap ${column.label}.`, `Nilai terakhir diperbarui menjadi ${rupiah(item.value)}.`, `Primary owner: ${item.owner}.`], primaryAction: column.id === 'negotiation' ? 'Tandai sebagai won' : 'Pindahkan tahap' })}>
            <div className="deal-top"><span className="brand-avatar">{item.brand.charAt(0)}</span><button onClick={event => event.stopPropagation()}><MoreHorizontal /></button></div>
            <h3>{item.brand}</h3><p>{item.product}</p><strong>{rupiah(item.value)}</strong>
            <footer><span><UserRound /> {item.owner}</span><span><Clock3 /> {item.age}</span></footer>
          </article>)}
          <button className="add-deal"><Plus /> Tambah peluang</button>
        </div>
      </div>)}
    </section>
  </div>
}

function Production({ onOpenDetail }: { onOpenDetail: OpenDetail }) {
  const productionStats = [
    { label: 'Order aktif', value: '14', icon: Boxes, color: '#5369c9' },
    { label: 'Sesuai jadwal', value: '11', icon: CheckCircle2, color: '#2e9861' },
    { label: 'Perlu perhatian', value: '2', icon: Clock3, color: '#e49a37' },
    { label: 'Terlambat', value: '1', icon: AlertCircle, color: '#d74d52' },
  ]
  const openOrder = (order: typeof orders[number]) => onOpenDetail({ kind: 'Detail order dan produksi', title: order.po, subtitle: `${order.brand} · ${order.item}`, status: `${order.status} · ${order.risk}`, description: 'Detail order menyatukan requirement, approval, material, vendor, progres produksi, QC, pengiriman, dan kendala dalam satu riwayat.', fields: [{ label: 'Kuantitas', value: `${order.qty} pcs` }, { label: 'PIC Brand', value: order.owner }, { label: 'Progress', value: `${order.progress}%` }, { label: 'Target kirim', value: order.due }, { label: 'Jalur pemenuhan', value: 'Produksi konveksi' }, { label: 'Checklist requirement', value: order.po === 'SLC-2609-041' ? '5 dari 6 lengkap' : 'Lengkap' }], steps: processSteps(order.status === 'Material' ? 2 : order.status === 'Produksi' ? 3 : order.status === 'Quality control' || order.status === 'Rework' ? 4 : 5, ['Requirement', 'Sample', 'Material', 'Produksi', 'QC', 'Pengiriman']), activities: [`Progress terakhir dilaporkan ${order.progress}%.`, order.risk === 'Aman' ? 'Tidak ada kendala kritis terbuka.' : `Risiko terdeteksi: ${order.risk}.`, `Target pengiriman tercatat ${order.due}.`], primaryAction: order.risk === 'Aman' ? 'Perbarui progres' : 'Tangani kendala' })
  return <div className="page-stack">
    <section className="production-stats">
      {productionStats.map(item => { const Icon = item.icon; return <div key={item.label}><span style={{ background: `${item.color}16`, color: item.color }}><Icon /></span><div><small>{item.label}</small><b>{item.value}</b></div></div> })}
    </section>
    <section className="panel order-table-panel">
      <div className="table-tools"><label className="search-box compact"><Search /><input placeholder="Cari PO, brand, atau item" /></label><div><button className="secondary-btn"><Filter /> Filter</button><button className="secondary-btn"><CalendarDays /> September 2026</button></div></div>
      <div className="table-scroll"><table className="data-table"><thead><tr><th>PO dan brand</th><th>Item</th><th>Qty</th><th>PIC</th><th>Progress</th><th>Target kirim</th><th>Status</th><th>Risiko</th></tr></thead><tbody>{orders.map(order => <tr className="clickable-row" key={order.po} onClick={() => openOrder(order)}><td><b>{order.po}</b><small>{order.brand}</small></td><td>{order.item}</td><td>{order.qty}</td><td><span className="owner-chip"><i>{order.owner.charAt(0)}</i>{order.owner}</span></td><td><div className="progress-cell"><span><b>{order.progress}%</b></span><div><i style={{ width: `${order.progress}%` }} /></div></div></td><td>{order.due}</td><td><span className="status-pill">{order.status}</span></td><td><span className={`risk-pill ${order.risk === 'Aman' ? 'safe' : order.risk === 'Terlambat' ? 'danger' : 'warning'}`}>{order.risk}</span></td></tr>)}</tbody></table></div>
    </section>
    <section className="operations-control">
      <article className="panel order-journey"><div className="panel-heading"><div><span className="eyebrow">Alur order terpilih</span><h3>SLC-2609-041 · Beno Tactical</h3></div><span className="risk-pill safe">Sesuai jadwal</span></div><div className="journey-steps">{[['Requirement', true], ['Sample', true], ['Material', true], ['Produksi', true], ['Quality control', false], ['Pengiriman', false]].map(([label, done], index) => <div className={done ? 'complete' : index === 4 ? 'current' : ''} key={String(label)}><span>{done ? <Check /> : index + 1}</span><b>{label}</b></div>)}</div></article>
      <article className="panel brand-control"><div className="panel-heading"><div><span className="eyebrow">Kontrol PIC Brand</span><h3>Requirement dan approval</h3></div><span className="completion-badge">5/6 lengkap</span></div><div className="checklist-grid"><span><CheckCircle2 /> Spesifikasi produk</span><span><CheckCircle2 /> Warna dan ukuran</span><span><CheckCircle2 /> Artwork v3</span><span><CheckCircle2 /> Approval sample</span><span><CheckCircle2 /> Target dan alamat</span><span className="pending"><Clock3 /> Bukti termin pembayaran</span></div><div className="control-footer"><span><FileClock /> Perubahan terakhir oleh Dinar, 10.06</span><button className="secondary-btn" onClick={() => openOrder(orders[0])}>Buka detail order</button></div></article>
    </section>
    <section className="production-bottom">
      <article className="panel"><div className="panel-heading"><div><span className="eyebrow">Kapasitas</span><h3>Beban produksi minggu ini</h3></div><span className="capacity-label">78% terpakai</span></div><div className="capacity-track"><i /></div><div className="capacity-meta"><span>3.120 pcs terjadwal</span><span>kapasitas 4.000 pcs</span></div></article>
      <article className="panel"><div className="panel-heading"><div><span className="eyebrow">Quality control</span><h3>Hasil inspeksi</h3></div></div><div className="qc-grid"><div><span className="qc-ring">96%</span><small>First pass yield</small></div><div><b>84</b><small>Unit rework</small></div><div><b>12</b><small>Unit reject</small></div></div></article>
    </section>
  </div>
}

function Performance({ onOpenDetail }: { onOpenDetail: OpenDetail }) {
  return <div className="page-stack">
    <section className="score-hero">
      <div className="score-ring"><div><b>92</b><span>Skor tim</span></div></div><div className="score-copy"><span className="eyebrow">Kinerja keseluruhan</span><h3>Tim berada di jalur yang baik</h3><p>Empat dari lima peran mendekati atau melampaui target. Sales canvassing perlu meningkatkan jumlah opportunity qualified.</p><div className="score-tags"><span><CheckCircle2 /> 3 KPI tercapai</span><span><Clock3 /> 2 perlu perhatian</span></div></div><div className="okr-progress"><span>Progress OKR kuartal</span><b>72%</b><div><i /></div><small>9 dari 12 key result berada di jalur yang tepat</small></div>
    </section>
    <section className="panel performance-panel">
      <div className="panel-heading"><div><span className="eyebrow">KPI per peran</span><h3>Realisasi bulan berjalan</h3></div><button className="secondary-btn"><CalendarDays /> Bulan ini <ChevronDown /></button></div>
      <div className="table-scroll"><table className="data-table kpi-table"><thead><tr><th>Peran dan pemilik</th><th>Indikator utama</th><th>Realisasi</th><th>Target</th><th>Skor</th><th>Tren</th><th>Status</th></tr></thead><tbody>{kpis.map(kpi => <tr className="clickable-row" key={kpi.role} onClick={() => onOpenDetail({ kind: 'Detail KPI', title: kpi.role, subtitle: `${kpi.owner} · ${kpi.metric}`, status: kpi.score >= 95 ? 'Tercapai' : 'Perlu perhatian', description: 'Setiap nilai KPI menunjukkan formula, target, realisasi, bobot, periode, dan sumber data agar penilaian dapat dijelaskan dan diaudit.', fields: [{ label: 'Realisasi', value: kpi.actual }, { label: 'Target', value: kpi.target }, { label: 'Skor', value: `${kpi.score}/100` }, { label: 'Tren', value: kpi.trend }, { label: 'Bobot KPI', value: '25%' }, { label: 'Sumber data', value: kpi.role.includes('Sales') ? 'CRM dan Pipeline' : kpi.role === 'Produksi' ? 'Order dan Produksi' : 'Aktivitas operasional' }], steps: processSteps(kpi.score >= 95 ? 3 : 2, ['Target disetujui', 'Data terkumpul', 'Review', 'Disahkan']), activities: [`Realisasi periode berjalan: ${kpi.actual}.`, `Perbandingan dengan target menghasilkan skor ${kpi.score}.`, `Tren dari periode sebelumnya: ${kpi.trend}.`], primaryAction: 'Buka sumber data' })}><td><b>{kpi.role}</b><small>{kpi.owner}</small></td><td>{kpi.metric}</td><td><b>{kpi.actual}</b></td><td>{kpi.target}</td><td><div className="score-bar"><div><i style={{ width: `${kpi.score}%` }} /></div><b>{kpi.score}</b></div></td><td><span className={kpi.trend.startsWith('+') ? 'trend-up' : 'trend-down'}>{kpi.trend}</span></td><td><span className={`risk-pill ${kpi.score >= 95 ? 'safe' : 'warning'}`}>{kpi.score >= 95 ? 'Tercapai' : 'Perlu perhatian'}</span></td></tr>)}</tbody></table></div>
    </section>
    <section className="okr-grid">
      {[['Tidak ada lead tanpa tindak lanjut', 86, '3 key result'], ['Mengurangi kesalahan order', 74, '3 key result'], ['Meningkatkan konversi penjualan', 63, '3 key result']].map(([name, score, meta]) => <article className="panel okr-card clickable-item" key={String(name)} onClick={() => onOpenDetail({ kind: 'Detail objective dan key result', title: String(name), subtitle: `${meta} · Kuartal III 2026`, status: `${score}% progress`, description: 'OKR mengukur perubahan penting lintas fungsi, sementara KPI mengukur konsistensi kinerja rutin setiap peran.', fields: [{ label: 'Progress objective', value: `${score}%` }, { label: 'Jumlah key result', value: String(meta) }, { label: 'Pemilik', value: 'Owner dan Kepala Operasional' }, { label: 'Periode', value: 'Q3 2026' }], steps: processSteps(Number(score) >= 80 ? 3 : 2, ['Dirancang', 'Baseline', 'Eksekusi', 'Review akhir']), activities: [`Progress terbaru dihitung ${score}%.`, 'Key result ditarik dari data operasional terkait.', 'Review dilakukan pada rapat mingguan.'], primaryAction: 'Lihat key results' })}><div><span className="objective-icon"><Target /></span><button onClick={event => event.stopPropagation()}><MoreHorizontal /></button></div><h3>{name}</h3><p>{meta}</p><div className="okr-card-progress"><span>Progress</span><b>{score}%</b><div><i style={{ width: `${score}%` }} /></div></div></article>)}
    </section>
  </div>
}

function PermissionBadge({ value }: { value: string }) {
  if (value === 'manage') return <span className="permission-badge manage"><CheckCircle2 /> Kelola</span>
  if (value === 'view') return <span className="permission-badge view"><Eye /> Lihat</span>
  if (value === 'limited') return <span className="permission-badge limited"><ShieldCheck /> Terbatas</span>
  return <span className="permission-badge none">—</span>
}

function EmployeePerformance({ onOpenDetail }: { onOpenDetail: OpenDetail }) {
  const criteria = ['Discipline', 'Communication', 'Responsibility', 'Teamwork', 'Initiative', 'Customer Handling', 'Problem Solving']
  return <div className="page-stack">
    <section className="module-stats">
      <div><span className="metric-icon green"><Users /></span><p><small>Karyawan dinilai</small><b>8/10</b></p></div>
      <div><span className="metric-icon purple"><Star /></span><p><small>Rata-rata assessment</small><b>4,3</b></p></div>
      <div><span className="metric-icon orange"><ClipboardCheck /></span><p><small>Review belum selesai</small><b>2</b></p></div>
      <div><span className="metric-icon red"><TrendingUp /></span><p><small>Performance meningkat</small><b>6 orang</b></p></div>
    </section>
    <section className="performance-layout"><article className="panel employee-table-panel"><div className="panel-heading module-heading"><div><span className="eyebrow">Performance review</span><h3>Kinerja karyawan periode berjalan</h3><p>KPI otomatis digabungkan dengan assessment manager berskala 1–5 dan catatan per periode.</p></div><button className="secondary-btn"><Plus /> Mulai assessment</button></div><div className="table-scroll"><table className="data-table module-table"><thead><tr><th>Karyawan dan peran</th><th>Department</th><th>Skor KPI</th><th>Assessment</th><th>Hasil</th><th>Review berikutnya</th></tr></thead><tbody>{employeeRows.map(item => <tr className="clickable-row" key={item.name} onClick={() => onOpenDetail({ kind: 'Detail employee performance', title: item.name, subtitle: `${item.role} · ${item.department}`, status: item.performance, description: 'Performance review menggabungkan pencapaian KPI dengan penilaian perilaku oleh manager. Sistem menyimpan score 1–5, catatan, reviewer, dan histori setiap periode.', fields: [{ label: 'Skor KPI', value: `${item.kpi}/100` }, { label: 'Assessment manager', value: `${item.assessment}/5` }, { label: 'Department', value: item.department }, { label: 'Periode', value: 'September 2026' }, { label: 'Reviewer', value: 'Supervisor/Manager' }, { label: 'Review berikutnya', value: item.review }], steps: processSteps(2, ['Data KPI final', 'Self review', 'Manager assessment', 'Acknowledgement']), activities: [`Assessment sementara ${item.assessment}/5.`, `Skor KPI periode ini ${item.kpi}/100.`, 'Catatan manager tersimpan pada histori performance.'], primaryAction: 'Lanjutkan assessment' })}><td><b>{item.name}</b><small>{item.role}</small></td><td>{item.department}</td><td><div className="score-bar"><div><i style={{ width: `${item.kpi}%` }} /></div><b>{item.kpi}</b></div></td><td><span className="rating-value"><Star /> {item.assessment}</span></td><td><span className="risk-pill safe">{item.performance}</span></td><td>{item.review}</td></tr>)}</tbody></table></div></article><aside className="panel assessment-criteria"><span className="eyebrow">Kriteria assessment</span><h3>Penilaian manager 1–5</h3><p>Nilai harus disertai catatan agar evaluasi dapat dipahami karyawan.</p><div>{criteria.map((item, index) => <span key={item}><b>{item}</b><em>{(4.0 + (index % 4) * .2).toFixed(1)}</em></span>)}</div><button className="secondary-btn wide-btn">Lihat histori periode</button></aside></section>
  </div>
}

function TargetManagement({ onOpenDetail }: { onOpenDetail: OpenDetail }) {
  return <div className="page-stack">
    <section className="module-stats">
      <div><span className="metric-icon green"><Target /></span><p><small>Target aktif</small><b>16</b></p></div>
      <div><span className="metric-icon purple"><BadgeCheck /></span><p><small>Di atas target</small><b>7</b></p></div>
      <div><span className="metric-icon orange"><Clock3 /></span><p><small>Perlu perhatian</small><b>5</b></p></div>
      <div><span className="metric-icon red"><AlertCircle /></span><p><small>Belum disetujui</small><b>2</b></p></div>
    </section>
    <section className="panel target-panel"><div className="panel-heading module-heading"><div><span className="eyebrow">Target per periode</span><h3>Target department dan karyawan</h3><p>Target dapat ditetapkan berdasarkan sales, product, revenue, order, dan activity dengan bobot yang configurable.</p></div><div className="module-tools"><button className="secondary-btn"><SlidersHorizontal /> Template KPI</button><button className="secondary-btn"><Plus /> Buat target</button></div></div><div className="target-list">{targets.map(item => <button key={`${item.owner}-${item.metric}`} onClick={() => onOpenDetail({ kind: 'Detail target', title: item.metric, subtitle: `${item.owner} · ${item.period}`, status: `${item.progress}% tercapai`, description: 'Target menjadi dasar perhitungan achievement KPI. Setiap perubahan nilai, periode, bobot, dan pemilik memerlukan approval dan disimpan dalam audit log.', fields: [{ label: 'Pemilik target', value: item.owner }, { label: 'Tipe KPI', value: item.type }, { label: 'Target', value: item.target }, { label: 'Realisasi', value: item.actual }, { label: 'Achievement', value: `${item.progress}%` }, { label: 'Formula', value: 'Actual ÷ Target × 100%' }], steps: processSteps(3, ['Draft', 'Review manager', 'Disetujui', 'Berjalan', 'Ditutup']), activities: [`Realisasi terakhir ${item.actual}.`, `Achievement dihitung ${item.progress}%.`, 'Target disetujui untuk periode September 2026.'], primaryAction: 'Ubah target' })}><span className="target-owner"><i>{item.owner.charAt(0)}</i><span><b>{item.owner}</b><small>{item.type}</small></span></span><span><b>{item.metric}</b><small>{item.period}</small></span><span><small>Target</small><b>{item.target}</b></span><span><small>Realisasi</small><b>{item.actual}</b></span><span className="target-progress"><small>{item.progress}%</small><span><i style={{ width: `${item.progress}%` }} /></span></span><ChevronRight /></button>)}</div></section>
  </div>
}

function MasterData({ onOpenDetail }: { onOpenDetail: OpenDetail }) {
  const domains = [
    { name: 'Employee', count: 10, detail: 'Department, position, atasan, status kerja', icon: Users },
    { name: 'Customer', count: 186, detail: 'Kontak, perusahaan, alamat, sumber, histori', icon: ContactRound },
    { name: 'Product', count: 42, detail: 'Kategori, SKU, jenis layanan, harga dasar', icon: Boxes },
    { name: 'Lead Source & Status', count: 13, detail: 'Facebook, WhatsApp, Instagram, Other; lifecycle', icon: Database },
  ]
  return <div className="page-stack"><section className="master-grid">{domains.map(item => { const Icon = item.icon; return <article className="panel clickable-item" key={item.name} onClick={() => onOpenDetail({ kind: 'Detail master data', title: item.name, subtitle: `${item.count} data aktif`, status: 'Terkonfigurasi', description: 'Master data menjaga penggunaan istilah, kategori, status, dan referensi yang sama pada seluruh proses aplikasi.', fields: [{ label: 'Jumlah data', value: String(item.count) }, { label: 'Informasi', value: item.detail }, { label: 'Status', value: 'Aktif' }, { label: 'Perubahan terakhir', value: '25 Sep 2026' }], steps: processSteps(3, ['Dibuat', 'Divalidasi', 'Digunakan', 'Diaudit']), activities: ['Data digunakan pada transaksi aktif.', 'Perubahan terakhir dilakukan oleh Admin.', 'Duplikasi diperiksa sebelum penyimpanan.'], primaryAction: 'Kelola data' })}><span className="metric-icon green"><Icon /></span><div><h3>{item.name}</h3><p>{item.detail}</p><b>{item.count} data aktif</b></div><ChevronRight /></article> })}</section><section className="panel lifecycle-panel"><div className="panel-heading"><div><span className="eyebrow">Kamus status PRD</span><h3>Lead dan order lifecycle</h3></div><span className="risk-pill safe">Sinkron</span></div><div className="lifecycle-group"><div><b>Lead</b><p>{['New', 'Contacted', 'Qualified', 'Cool', 'Warm', 'Hot', 'Order'].map(item => <span key={item}>{item}</span>)}</p><small>Status akhir tambahan: Lost, Invalid, Duplicate</small></div><div><b>Order</b><p>{['Created', 'Verification', 'Approved', 'Production', 'Ready', 'Completed'].map(item => <span key={item}>{item}</span>)}</p><small>Status akhir tambahan: Cancelled, Rejected</small></div></div></section></div>
}

function AccessControl({ onOpenDetail }: { onOpenDetail: OpenDetail }) {
  return <div className="page-stack">
    <section className="access-summary">
      <article className="panel"><span className="metric-icon green"><Users /></span><div><small>Pengguna aktif</small><b>11</b><em>8 jenis role</em></div></article>
      <article className="panel"><span className="metric-icon purple"><LockKeyhole /></span><div><small>Role terkonfigurasi</small><b>8</b><em>Least privilege</em></div></article>
      <article className="panel"><span className="metric-icon orange"><ShieldCheck /></span><div><small>Perubahan perlu approval</small><b>4</b><em>Target, formula, akses, ekspor</em></div></article>
      <article className="panel"><span className="metric-icon red"><FileClock /></span><div><small>Review akses berikutnya</small><b>30 Sep</b><em>Review bulanan</em></div></article>
    </section>

    <section className="panel access-matrix-panel">
      <div className="panel-heading access-heading"><div><span className="eyebrow">Role-based access control</span><h3>Matriks hak akses</h3><p>Kelola berarti dapat melihat dan mengubah. Terbatas berarti hanya data yang ditugaskan atau tindakan tertentu.</p></div><div className="permission-legend"><PermissionBadge value="manage" /><PermissionBadge value="view" /><PermissionBadge value="limited" /></div></div>
      <div className="table-scroll"><table className="data-table access-table"><thead><tr><th>Role dan cakupan data</th><th>Inbox</th><th>Leads</th><th>Pipeline</th><th>Order & Produksi</th><th>KPI & OKR</th><th>Pengaturan & Audit</th></tr></thead><tbody>{accessRoles.map(item => <tr className="clickable-row" key={item.role} onClick={() => onOpenDetail({ kind: 'Detail role dan akses', title: item.role, subtitle: `${item.users} pengguna · ${item.scope}`, status: 'Role aktif', description: 'Hak akses ditetapkan berdasarkan tanggung jawab kerja. Pengguna hanya melihat data dan tindakan yang diperlukan untuk menjalankan perannya.', fields: [{ label: 'Jumlah pengguna', value: String(item.users) }, { label: 'Cakupan data', value: item.scope }, { label: 'Inbox', value: item.permissions[0] === 'manage' ? 'Kelola' : item.permissions[0] === 'view' ? 'Lihat' : item.permissions[0] === 'limited' ? 'Terbatas' : 'Tidak ada akses' }, { label: 'Leads', value: item.permissions[1] === 'manage' ? 'Kelola' : item.permissions[1] === 'view' ? 'Lihat' : item.permissions[1] === 'limited' ? 'Terbatas' : 'Tidak ada akses' }, { label: 'Order', value: item.permissions[3] === 'manage' ? 'Kelola' : item.permissions[3] === 'view' ? 'Lihat' : item.permissions[3] === 'limited' ? 'Terbatas' : 'Tidak ada akses' }, { label: 'Data sensitif', value: item.role === 'Owner' ? 'Dapat dilihat' : 'Dibatasi sesuai kebutuhan' }], steps: processSteps(3, ['Role dibuat', 'Izin dipilih', 'Disetujui owner', 'Akses aktif']), activities: [`Cakupan akses saat ini: ${item.scope}.`, `${item.users} pengguna menggunakan role ini.`, 'Perubahan izin akan dicatat dalam audit log.'], primaryAction: 'Ubah hak akses' })}><td><b>{item.role}</b><small>{item.scope} · {item.users} pengguna</small></td>{item.permissions.map((permission, index) => <td key={`${item.role}-${index}`}><PermissionBadge value={permission} /></td>)}</tr>)}</tbody></table></div>
    </section>

    <section className="access-bottom">
      <article className="panel user-access-panel"><div className="panel-heading"><div><span className="eyebrow">Pengguna aplikasi</span><h3>Akun dan role aktif</h3></div><button className="secondary-btn"><UserPlus /> Tambah pengguna</button></div><div className="user-access-list">{appUsers.map(user => <button key={user.email} onClick={() => onOpenDetail({ kind: 'Detail pengguna', title: user.name, subtitle: user.email, status: user.status, description: 'Setiap pengguna memiliki akun individual. Aktivitas, perubahan data, dan akses sensitif tercatat atas nama pengguna tersebut.', fields: [{ label: 'Role', value: user.role }, { label: 'Status akun', value: user.status }, { label: 'Login terakhir', value: user.last }, { label: 'Autentikasi', value: 'Password dan OTP' }, { label: 'Akses data', value: accessRoles.find(role => role.role === user.role)?.scope ?? 'Sesuai penugasan' }, { label: 'Sesi aktif', value: '1 perangkat' }], steps: processSteps(3, ['Diundang', 'Verifikasi', 'Role ditetapkan', 'Aktif']), activities: [`Login terakhir ${user.last}.`, `Role aktif: ${user.role}.`, 'Belum ada aktivitas keamanan mencurigakan.'], primaryAction: 'Kelola pengguna' })}><span className="avatar-md">{user.name.split(' ').map(word => word[0]).join('').slice(0, 2)}</span><span><b>{user.name}</b><small>{user.email}</small></span><span className="user-role">{user.role}</span><span className="risk-pill safe">{user.status}</span><span className="last-access">{user.last}</span><ChevronRight /></button>)}</div></article>
      <aside className="access-rules">
        <article className="panel"><span className="priority-mark green"><LockKeyhole /></span><h3>Prinsip akses Silancar</h3><ul><li>Satu akun untuk satu orang.</li><li>Akses mengikuti role dan penugasan.</li><li>Data sensitif hanya untuk pihak berwenang.</li><li>Perubahan hak akses dicatat permanen.</li></ul></article>
        <article className="panel access-alert"><span className="eyebrow">Kontrol owner</span><h3>2 akses perlu ditinjau</h3><p>Role rangkap dan akses ekspor data memerlukan konfirmasi owner.</p><button className="secondary-btn wide-btn">Tinjau akses</button></article>
      </aside>
    </section>
  </div>
}

function Governance({ onOpenDetail }: { onOpenDetail: OpenDetail }) {
  return <div className="page-stack">
    <section className="report-cards">
      <article className="panel"><span className="metric-icon green"><MessageCircle /></span><div><small>Response SLA</small><b>91,8%</b><em>+4,2% vs Agustus</em></div></article>
      <article className="panel"><span className="metric-icon orange"><TrendingUp /></span><div><small>Lead → Qualified</small><b>47,6%</b><em>WhatsApp tertinggi</em></div></article>
      <article className="panel"><span className="metric-icon purple"><CircleDollarSign /></span><div><small>Forecast accuracy</small><b>86,3%</b><em>Dalam toleransi</em></div></article>
      <article className="panel"><span className="metric-icon red"><ShieldCheck /></span><div><small>Data tanpa anomali</small><b>98,4%</b><em>2 item perlu review</em></div></article>
    </section>
    <section className="governance-grid">
      <article className="panel channel-report"><div className="panel-heading"><div><span className="eyebrow">Performa sumber lead</span><h3>Kualitas per kanal</h3></div><button className="secondary-btn"><CalendarDays /> September</button></div><div className="channel-performance">{[
        ['WhatsApp', 284, '52%', 'Rp312 jt', '#27a35d'], ['Instagram', 96, '41%', 'Rp128 jt', '#c75291'], ['Facebook', 64, '33%', 'Rp64 jt', '#4d73bd']
      ].map(([name, leads, conversion, value, color]) => <div className="clickable-item" key={String(name)} onClick={() => onOpenDetail({ kind: 'Detail laporan kanal', title: String(name), subtitle: `Performa sumber lead · September 2026`, status: `${conversion} qualified rate`, description: 'Laporan kanal membantu owner membandingkan volume, kualitas, kecepatan respons, conversion, dan nilai pipeline dari setiap sumber.', fields: [{ label: 'Lead masuk', value: `${leads} lead` }, { label: 'Qualified rate', value: String(conversion) }, { label: 'Nilai pipeline', value: String(value) }, { label: 'First response SLA', value: name === 'WhatsApp' ? '94%' : name === 'Instagram' ? '89%' : '86%' }], steps: processSteps(3, ['Pesan masuk', 'Lead', 'Qualified', 'Pipeline']), activities: [`${leads} lead tercatat pada periode ini.`, `Qualified rate berada di ${conversion}.`, `Kontribusi pipeline mencapai ${value}.`], primaryAction: 'Lihat daftar lead' })}><span className="channel-report-icon" style={{ color: String(color), background: `${color}16` }}><ChannelIcon channel={name as Channel} /></span><div><b>{name}</b><small>{leads} leads</small></div><div><b>{conversion}</b><small>Qualified rate</small></div><div><b>{value}</b><small>Pipeline</small></div></div>)}</div></article>
      <article className="panel master-card"><div className="panel-heading"><div><span className="eyebrow">Master data</span><h3>Kesiapan konfigurasi</h3></div><Database /></div><div className="master-list"><span><b>7</b> Pengguna dan peran <CheckCircle2 /></span><span><b>3</b> Kanal aktif <CheckCircle2 /></span><span><b>9</b> Status pipeline <CheckCircle2 /></span><span><b>5</b> Formula KPI <AlertCircle /></span></div><p>Formula KPI masih menunggu persetujuan final owner.</p><button className="secondary-btn wide-btn"><Settings /> Buka pengaturan</button></article>
    </section>
    <section className="panel audit-panel">
      <div className="panel-heading"><div><span className="eyebrow">Jejak perubahan</span><h3>Audit log terbaru</h3></div><div className="audit-actions"><label className="search-box compact"><Search /><input placeholder="Cari aktivitas" /></label><button className="secondary-btn"><Filter /> Filter</button></div></div>
      <div className="table-scroll"><table className="data-table"><thead><tr><th>Waktu</th><th>Pengguna</th><th>Aktivitas</th><th>Objek</th><th>Detail perubahan</th></tr></thead><tbody>{auditRows.map(row => <tr className="clickable-row" key={`${row.time}-${row.object}`} onClick={() => onOpenDetail({ kind: 'Detail audit log', title: row.action, subtitle: `${row.object} · ${row.time}`, status: 'Tercatat permanen', description: 'Audit log menunjukkan siapa mengubah apa, kapan perubahan terjadi, dan nilai sebelum maupun sesudahnya.', fields: [{ label: 'Pengguna', value: row.actor }, { label: 'Objek', value: row.object }, { label: 'Waktu', value: `25 Sep 2026, ${row.time} WIB` }, { label: 'Perubahan', value: row.detail }, { label: 'Sumber', value: 'Aplikasi Silancar' }, { label: 'Alamat perangkat', value: 'Disamarkan pada prototype' }], steps: processSteps(3, ['Aksi pengguna', 'Validasi akses', 'Perubahan data', 'Audit tersimpan']), activities: [row.detail, `Aktivitas dilakukan oleh ${row.actor}.`, 'Tidak dapat dihapus oleh pengguna operasional biasa.'], primaryAction: 'Buka objek terkait' })}><td>{row.time}</td><td><span className="owner-chip"><i>{row.actor.charAt(0)}</i>{row.actor}</span></td><td>{row.action}</td><td><b>{row.object}</b></td><td>{row.detail}</td></tr>)}</tbody></table></div>
    </section>
  </div>
}

function App() {
  const [page, setPage] = useState<Page>('overview')
  const [activeRole, setActiveRole] = useState<AppRole>('Owner')
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const [railExpanded, setRailExpanded] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [selectedDetail, setSelectedDetail] = useState<DetailItem | null>(null)
  const pageMeta = useMemo(() => ({ overview: ['Ringkasan', 'Pusat kendali bisnis hari ini'], workspace: [`Ruang Kerja ${activeRole}`, 'Pekerjaan, kontrol, dan indikator yang relevan dengan peran aktif'], decisions: ['Keputusan Owner', 'Putuskan pengecualian, tugaskan PIC, dan verifikasi penyelesaian'], inbox: ['Inbox Omnichannel', 'WhatsApp, Instagram, dan Facebook'], crm: ['Prospek dan Pelanggan', 'Database pelanggan dan kebutuhan'], tasks: ['Tugas dan Follow-up', 'Daftar kerja dan eskalasi tim'], canvassing: ['Sales Canvassing', 'Prospek, kunjungan, presentasi, dan aktivitas lapangan'], pipeline: ['Peluang Penjualan', 'Peluang dan proyeksi penjualan'], production: ['Order dan Produksi', 'Monitoring operasional dan PIC brand'], performance: ['KPI dan OKR', 'KPI, pencapaian, dan tujuan tim'], employees: ['Kinerja Karyawan', 'Penilaian manager dan histori kinerja'], targets: ['Pengelolaan Target', 'Target periode, departemen, sales, dan aktivitas'], master: ['Master Data', 'Karyawan, pelanggan, produk, sumber, dan status'], access: ['Hak dan Akses', 'Pengguna, peran, cakupan data, dan keamanan'], governance: ['Laporan dan Audit', 'Kontrol data dan akuntabilitas'] }[page]), [page, activeRole])
  const activeNav = useMemo(() => nav.filter(item => rolePageAccess[activeRole].includes(item.id)), [activeRole])
  const selectPage = (next: Page) => { setPage(next); setSidebarOpen(false) }
  const selectRole = (role: AppRole) => { setActiveRole(role); setPage('workspace'); setRoleMenuOpen(false); setSidebarOpen(false) }
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 2600) }
  return <div className="app-shell">
    <header className="topbar">
      <div className="top-brand"><span className="brand-mark">S</span><strong>Silancar</strong></div>
      <nav className={`top-navigation ${sidebarOpen ? 'open' : ''}`}>
        {activeNav.map(item => <button className={`${page === item.id ? 'active' : ''} ${['tasks', 'canvassing', 'employees', 'targets', 'master', 'access', 'governance'].includes(item.id) ? 'secondary-nav' : ''}`} onClick={() => selectPage(item.id)} key={item.id}>{item.label.replace(' Omnichannel', '').replace(' Penjualan', '').replace(' dan Produksi', '').replace(' dan Pelanggan', '').replace(' Owner', '')}</button>)}
      </nav>
      <div className="top-actions">
        <button className="top-round" aria-label="Pencarian" onClick={() => showNotice('Pencarian global siap dihubungkan ke seluruh data Silancar.')}><Search /></button>
        <button className="top-round notification-btn" aria-label="Notifikasi" onClick={() => showNotice('3 notifikasi prioritas: chat overdue, order terlambat, dan review KPI.')}><Bell /><i /></button>
        <button className="profile-button" onClick={() => setRoleMenuOpen(value => !value)} aria-expanded={roleMenuOpen}><span className="avatar-md">{activeRole.split(/\s|\//).map(word => word[0]).join('').slice(0, 2)}</span><span className="profile-role-copy"><b>{activeRole}</b><small>Mode demo role</small></span><ChevronDown /></button>
        {roleMenuOpen && <div className="role-switcher"><div><span className="eyebrow">Lihat aplikasi sebagai</span><h3>Pilih role demo</h3><p>Menu, data, dan pekerjaan akan disesuaikan dengan hak akses role.</p></div>{availableRoles.map(role => <button className={activeRole === role ? 'active' : ''} key={role} onClick={() => selectRole(role)}><span>{role.split(/\s|\//).map(word => word[0]).join('').slice(0, 2)}</span><b>{role}</b>{activeRole === role && <Check />}</button>)}</div>}
        <button className="mobile-menu" onClick={() => setSidebarOpen(value => !value)}>{sidebarOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
    <div className={`app-body ${railExpanded ? 'rail-expanded' : ''}`}>
      <aside className={`icon-rail ${railExpanded ? 'expanded' : ''}`} aria-label="Navigasi utama">
        <div className="rail-main">
          <button className="rail-toggle" aria-label={railExpanded ? 'Perkecil navigasi' : 'Perluas navigasi'} onClick={() => setRailExpanded(value => !value)}><Menu /><span>{railExpanded ? 'Perkecil menu' : 'Menu'}</span></button>
          {activeNav.map(item => { const Icon = item.icon; return <button aria-label={item.label} title={item.label} className={page === item.id ? 'active' : ''} onClick={() => selectPage(item.id)} key={item.id}><Icon /><span>{item.label}</span>{item.badge && <em>{item.badge}</em>}</button> })}
        </div>
        <div className="rail-bottom">{rolePageAccess[activeRole].includes('access') && <button aria-label="Pengaturan" title="Hak dan Akses" onClick={() => selectPage('access')}><Settings /><span>Pengaturan</span></button>}<button aria-label="Keluar" title="Keluar" onClick={() => showNotice('Mode prototype: sesi demo tetap aktif.')}><ArrowRight /><span>Keluar</span></button></div>
      </aside>
      <main className="app-main">
        <div className="page-intro">
          <div><h1>{page === 'overview' ? <>Welcome Back, <span>Owner</span></> : pageMeta[0]}</h1><p>{pageMeta[1]}</p></div>
          <div className="intro-actions"><button className="period-btn" onClick={() => showNotice('Filter periode aktif: 25 September 2026.')}><CalendarDays /> 25 Sep 2026 <ChevronDown /></button>{page === 'workspace' ? <button className="primary-btn" onClick={() => showNotice(`Aktivitas baru akan mengikuti workflow dan hak akses ${activeRole}.`)}><Plus /> Buat aktivitas</button> : page === 'decisions' ? <button className="primary-btn" onClick={() => showNotice('Aturan approval menentukan jenis keputusan, batas nilai, SLA, dan pejabat berwenang.')}><Settings /> Atur approval</button> : page === 'overview' || page === 'inbox' || page === 'crm' ? <button className="primary-btn" onClick={() => showNotice('Form lead baru akan menyimpan sumber, kebutuhan, owner, dan next action.')}><Plus /> Tambah Lead</button> : page === 'tasks' ? <button className="primary-btn" onClick={() => showNotice('Form tugas akan meminta owner, tenggat, prioritas, dan objek terkait.')}><Plus /> Buat Tugas</button> : page === 'canvassing' ? <button className="primary-btn" onClick={() => showNotice('Prospek baru akan menyimpan perusahaan, PIC, alamat, potensi, dan jadwal aktivitas.')}><Plus /> Tambah Prospek</button> : page === 'pipeline' ? <button className="primary-btn" onClick={() => showNotice('Opportunity baru akan ditautkan ke lead agar tidak terjadi duplikasi.')}><Plus /> Tambah Opportunity</button> : page === 'production' ? <button className="primary-btn" onClick={() => showNotice('Order baru dibuat dari deal won dan checklist requirement.')}><Plus /> Buat Order</button> : page === 'performance' ? <button className="primary-btn" onClick={() => showNotice('Template KPI mengatur indikator, bobot, formula, dan sumber data.')}><Target /> Template KPI</button> : page === 'employees' ? <button className="primary-btn" onClick={() => showNotice('Assessment manager menggunakan skala 1–5 dan wajib memiliki catatan.')}><Star /> Mulai Assessment</button> : page === 'targets' ? <button className="primary-btn" onClick={() => showNotice('Target baru akan melalui review dan approval manager.')}><Plus /> Buat Target</button> : page === 'master' ? <button className="primary-btn" onClick={() => showNotice('Master data baru akan divalidasi sebelum digunakan pada transaksi.')}><Plus /> Tambah Data</button> : page === 'access' ? <button className="primary-btn" onClick={() => showNotice('Pengguna baru akan diundang dan diberi role setelah persetujuan owner.')}><UserPlus /> Tambah Pengguna</button> : <button className="primary-btn" onClick={() => showNotice('Ekspor Excel dan PDF tersedia pada versi final setelah backend laporan terhubung.')}><FileText /> Ekspor Excel / PDF</button>}</div>
        </div>
        <div className={`content ${page === 'inbox' ? 'inbox-content' : ''}`}>
          {page === 'overview' && <Overview onNavigate={selectPage} onOpenDetail={setSelectedDetail} />}
          {page === 'workspace' && <RoleWorkspace role={activeRole} onOpenDetail={setSelectedDetail} />}
          {page === 'decisions' && <OwnerDecisions />}
          {page === 'inbox' && <OmnichannelInbox onOpenDetail={setSelectedDetail} />}
          {page === 'crm' && <Crm onNavigate={selectPage} onOpenDetail={setSelectedDetail} />}
          {page === 'tasks' && <Tasks onNavigate={selectPage} onOpenDetail={setSelectedDetail} />}
          {page === 'canvassing' && <Canvassing onOpenDetail={setSelectedDetail} />}
          {page === 'pipeline' && <Pipeline onOpenDetail={setSelectedDetail} />}
          {page === 'production' && <Production onOpenDetail={setSelectedDetail} />}
          {page === 'performance' && <Performance onOpenDetail={setSelectedDetail} />}
          {page === 'employees' && <EmployeePerformance onOpenDetail={setSelectedDetail} />}
          {page === 'targets' && <TargetManagement onOpenDetail={setSelectedDetail} />}
          {page === 'master' && <MasterData onOpenDetail={setSelectedDetail} />}
          {page === 'access' && <AccessControl onOpenDetail={setSelectedDetail} />}
          {page === 'governance' && <Governance onOpenDetail={setSelectedDetail} />}
        </div>
      </main>
    </div>
    {notice && <div className="demo-toast"><CheckCircle2 /><span><b>Prototype interaktif</b>{notice}</span></div>}
    {selectedDetail && <DetailDrawer detail={selectedDetail} onClose={() => setSelectedDetail(null)} />}
  </div>
}

export default App
