import { useMemo, useState, type FormEvent } from 'react'
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BadgeCheck,
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

type Page = 'overview' | 'inbox' | 'crm' | 'tasks' | 'pipeline' | 'production' | 'performance' | 'access' | 'governance'
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
  { role: 'Admin', users: 1, scope: 'Seluruh operasional', permissions: ['manage', 'manage', 'view', 'manage', 'view', 'limited'] },
  { role: 'Digital Marketing', users: 1, scope: 'Sumber dan kampanye', permissions: ['limited', 'manage', 'view', 'none', 'view', 'none'] },
  { role: 'Sales Online', users: 1, scope: 'Data sendiri dan kolaborasi', permissions: ['manage', 'manage', 'manage', 'view', 'view', 'none'] },
  { role: 'Sales Canvassing', users: 1, scope: 'Prospek dan aktivitas sendiri', permissions: ['limited', 'manage', 'manage', 'view', 'view', 'none'] },
  { role: 'PIC Brand', users: 1, scope: 'Order yang ditugaskan', permissions: ['view', 'view', 'view', 'manage', 'view', 'none'] },
  { role: 'Produksi', users: 4, scope: 'Produksi dan QC', permissions: ['none', 'none', 'none', 'limited', 'view', 'none'] },
]

const appUsers = [
  { name: 'Owner Demo', email: 'owner@silancar.id', role: 'Owner', status: 'Aktif', last: 'Baru saja' },
  { name: 'Admin Silancar', email: 'admin@silancar.id', role: 'Admin', status: 'Aktif', last: '5 menit lalu' },
  { name: 'Yola', email: 'yola@silancar.id', role: 'Sales Online', status: 'Aktif', last: '12 menit lalu' },
  { name: 'Rusydi', email: 'rusydi@silancar.id', role: 'Sales Canvassing', status: 'Aktif', last: '28 menit lalu' },
  { name: 'Dinar', email: 'dinar@silancar.id', role: 'PIC Brand', status: 'Aktif', last: '1 jam lalu' },
]

const nav = [
  { id: 'overview' as const, label: 'Ringkasan', icon: LayoutDashboard },
  { id: 'inbox' as const, label: 'Inbox Omnichannel', icon: Inbox, badge: 6 },
  { id: 'crm' as const, label: 'Leads dan Pelanggan', icon: ContactRound, badge: 1 },
  { id: 'tasks' as const, label: 'Tugas dan Follow-up', icon: ListTodo, badge: 3 },
  { id: 'pipeline' as const, label: 'Pipeline Penjualan', icon: TrendingUp },
  { id: 'production' as const, label: 'Order dan Produksi', icon: Boxes, badge: 1 },
  { id: 'performance' as const, label: 'KPI dan OKR', icon: Target },
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
        <span className="eyebrow">Status operasional hari ini</span>
        <h2>6 chat perlu ditangani</h2>
        <p>Dua chat melewati SLA dan satu order produksi membutuhkan keputusan.</p>
      </div>
      <button className="primary-btn" onClick={() => onNavigate('inbox')}><Inbox size={17} /> Buka inbox <ArrowRight size={16} /></button>
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
          <button onClick={() => onNavigate('inbox')}><span className="priority-mark orange"><Clock3 /></span><span><b>6 chat belum ditangani</b><small>2 sudah melewati SLA 15 menit</small></span><ChevronRight /></button>
          <button onClick={() => onNavigate('production')}><span className="priority-mark red"><AlertCircle /></span><span><b>Order Oki Uniform terlambat</b><small>Rework jahitan membutuhkan keputusan</small></span><ChevronRight /></button>
          <button onClick={() => onNavigate('pipeline')}><span className="priority-mark purple"><CircleDollarSign /></span><span><b>2 deal siap ditutup</b><small>Potensi nilai Rp161 juta</small></span><ChevronRight /></button>
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
  return <div className="page-stack">
    <section className="task-layout">
      <article className="panel task-board">
        <div className="panel-heading"><div><span className="eyebrow">Prioritas hari ini</span><h3>Daftar kerja tim</h3></div><div className="task-tabs"><button className="active">Semua</button><button>Overdue</button><button>Saya</button></div></div>
        <div className="task-list">{followUps.map(task => { const done = completed.includes(task.title); return <div className={`task-item ${done ? 'done' : ''}`} key={task.title}><button className="task-check" onClick={() => setCompleted(value => done ? value.filter(item => item !== task.title) : [...value, task.title])}>{done ? <Check /> : null}</button><div className="task-copy clickable-copy" onClick={() => onOpenDetail({ kind: 'Detail tugas dan follow-up', title: task.title, subtitle: `${task.type} · ${task.owner}`, status: done ? 'Selesai' : task.status, description: 'Tugas memastikan setiap lead memiliki tindakan konkret, pemilik, tenggat, prioritas, dan hasil yang dapat diaudit.', fields: [{ label: 'Penanggung jawab', value: task.owner }, { label: 'Jenis aktivitas', value: task.type }, { label: 'Prioritas', value: task.priority }, { label: 'Tenggat', value: `${task.status}, ${task.time}` }, { label: 'Objek terkait', value: task.title.split(' ').slice(-2).join(' ') }, { label: 'Eskalasi', value: task.status === 'Overdue' ? 'Admin dan owner' : 'Belum diperlukan' }], steps: processSteps(done ? 3 : task.status === 'Overdue' ? 2 : 1, ['Dibuat', 'Dikerjakan', 'Eskalasi', 'Selesai']), activities: [done ? 'Tugas ditandai selesai pada sesi demo.' : 'Tugas masih menunggu tindakan pemilik.', `Prioritas ditetapkan sebagai ${task.priority}.`, `Tenggat tercatat ${task.status}, ${task.time}.`], primaryAction: done ? 'Lihat hasil' : 'Catat hasil tugas' })}><b>{task.title}</b><span>{task.type} · {task.owner}</span></div><span className={`priority-chip ${task.priority.toLowerCase()}`}>{task.priority}</span><div className="task-time"><b>{task.time}</b><span>{task.status}</span></div><button className="icon-ghost" aria-label={`Buka detail ${task.title}`} onClick={() => onOpenDetail({ kind: 'Detail tugas dan follow-up', title: task.title, subtitle: `${task.type} · ${task.owner}`, status: done ? 'Selesai' : task.status, description: 'Tugas memastikan setiap lead memiliki tindakan konkret, pemilik, tenggat, prioritas, dan hasil yang dapat diaudit.', fields: [{ label: 'Penanggung jawab', value: task.owner }, { label: 'Jenis aktivitas', value: task.type }, { label: 'Prioritas', value: task.priority }, { label: 'Tenggat', value: `${task.status}, ${task.time}` }], steps: processSteps(done ? 3 : 1, ['Dibuat', 'Dikerjakan', 'Eskalasi', 'Selesai']), activities: ['Status tugas dapat diperbarui dari daftar kerja.', `Prioritas ditetapkan sebagai ${task.priority}.`, `Tenggat tercatat ${task.status}, ${task.time}.`], primaryAction: done ? 'Lihat hasil' : 'Catat hasil tugas' })}><ChevronRight /></button></div> })}</div>
      </article>
      <aside className="task-sidebar">
        <article className="panel"><span className="eyebrow">Ringkasan</span><h3>Kontrol follow-up</h3><div className="task-summary"><div><b>12</b><span>Hari ini</span></div><div><b>3</b><span>Overdue</span></div><div><b>92%</b><span>Patuh SLA</span></div></div></article>
        <article className="panel escalation-card"><span className="priority-mark red"><AlertCircle /></span><h3>Eskalasi otomatis</h3><p>Lead tanpa owner lebih dari 15 menit diteruskan ke admin dan owner.</p><button className="text-btn" onClick={() => onNavigate('inbox')}>Lihat di inbox <ArrowRight /></button></article>
        <article className="panel"><span className="eyebrow">Kolaborasi sales</span><h3>2 permintaan bantuan</h3><p className="muted-copy">Rusydi membantu kunjungan untuk peluang milik Yola tanpa mengubah primary owner.</p><button className="secondary-btn wide-btn">Tinjau kolaborasi</button></article>
      </aside>
    </section>
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

function AccessControl({ onOpenDetail }: { onOpenDetail: OpenDetail }) {
  return <div className="page-stack">
    <section className="access-summary">
      <article className="panel"><span className="metric-icon green"><Users /></span><div><small>Pengguna aktif</small><b>10</b><em>7 jenis role</em></div></article>
      <article className="panel"><span className="metric-icon purple"><LockKeyhole /></span><div><small>Role terkonfigurasi</small><b>7</b><em>Least privilege</em></div></article>
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [selectedDetail, setSelectedDetail] = useState<DetailItem | null>(null)
  const pageMeta = useMemo(() => ({ overview: ['Ringkasan', 'Pusat kendali bisnis hari ini'], inbox: ['Inbox Omnichannel', 'WhatsApp, Instagram, dan Facebook'], crm: ['Leads dan Pelanggan', 'Database pelanggan dan kebutuhan'], tasks: ['Tugas dan Follow-up', 'Daftar kerja dan eskalasi tim'], pipeline: ['Pipeline Penjualan', 'Peluang dan forecast penjualan'], production: ['Order dan Produksi', 'Monitoring operasional dan PIC brand'], performance: ['KPI dan OKR', 'Target dan kinerja tim'], access: ['Hak dan Akses', 'Pengguna, role, cakupan data, dan keamanan'], governance: ['Laporan dan Audit', 'Kontrol data dan akuntabilitas'] }[page]), [page])
  const selectPage = (next: Page) => { setPage(next); setSidebarOpen(false) }
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 2600) }
  return <div className="app-shell">
    <header className="topbar">
      <div className="top-brand"><span className="brand-mark">S</span><strong>Silancar</strong></div>
      <nav className={`top-navigation ${sidebarOpen ? 'open' : ''}`}>
        {nav.map(item => <button className={`${page === item.id ? 'active' : ''} ${['tasks', 'access', 'governance'].includes(item.id) ? 'secondary-nav' : ''}`} onClick={() => selectPage(item.id)} key={item.id}>{item.label.replace(' Omnichannel', '').replace(' Penjualan', '').replace(' dan Produksi', '').replace(' dan Pelanggan', '')}</button>)}
      </nav>
      <div className="top-actions">
        <button className="top-round" aria-label="Pencarian" onClick={() => showNotice('Pencarian global siap dihubungkan ke seluruh data Silancar.')}><Search /></button>
        <button className="top-round notification-btn" aria-label="Notifikasi" onClick={() => showNotice('3 notifikasi prioritas: chat overdue, order terlambat, dan review KPI.')}><Bell /><i /></button>
        <button className="profile-button" onClick={() => showNotice('Profil aktif: Owner Demo · akses seluruh modul.')}><span className="avatar-md">OD</span><ChevronDown /></button>
        <button className="mobile-menu" onClick={() => setSidebarOpen(value => !value)}>{sidebarOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
    <div className="app-body">
      <aside className="icon-rail" aria-label="Navigasi cepat">
        <div className="rail-main">
          {nav.map(item => { const Icon = item.icon; return <button aria-label={item.label} title={item.label} className={page === item.id ? 'active' : ''} onClick={() => selectPage(item.id)} key={item.id}><Icon />{item.badge && <em>{item.badge}</em>}</button> })}
        </div>
        <div className="rail-bottom"><button aria-label="Pengaturan" title="Hak dan Akses" onClick={() => selectPage('access')}><Settings /></button><button aria-label="Keluar" title="Keluar" onClick={() => showNotice('Mode prototype: sesi demo tetap aktif.')}><ArrowRight /></button></div>
      </aside>
      <main className="app-main">
        <div className="page-intro">
          <div><h1>{page === 'overview' ? <>Welcome Back, <span>Owner</span></> : pageMeta[0]}</h1><p>{pageMeta[1]}</p></div>
          <div className="intro-actions"><button className="period-btn" onClick={() => showNotice('Filter periode aktif: 25 September 2026.')}><CalendarDays /> 25 Sep 2026 <ChevronDown /></button>{page === 'overview' || page === 'inbox' || page === 'crm' ? <button className="primary-btn" onClick={() => showNotice('Form lead baru akan menyimpan sumber, kebutuhan, owner, dan next action.')}><Plus /> Tambah Lead</button> : page === 'tasks' ? <button className="primary-btn" onClick={() => showNotice('Form tugas akan meminta owner, tenggat, prioritas, dan objek terkait.')}><Plus /> Buat Tugas</button> : page === 'pipeline' ? <button className="primary-btn" onClick={() => showNotice('Opportunity baru akan ditautkan ke lead agar tidak terjadi duplikasi.')}><Plus /> Tambah Opportunity</button> : page === 'production' ? <button className="primary-btn" onClick={() => showNotice('Order baru dibuat dari deal won dan checklist requirement.')}><Plus /> Buat Order</button> : page === 'performance' ? <button className="primary-btn" onClick={() => showNotice('Target KPI memerlukan periode, formula, bobot, dan persetujuan owner.')}><Target /> Atur Target</button> : page === 'access' ? <button className="primary-btn" onClick={() => showNotice('Pengguna baru akan diundang dan diberi role setelah persetujuan owner.')}><UserPlus /> Tambah Pengguna</button> : <button className="primary-btn" onClick={() => showNotice('Laporan demo siap; ekspor final memerlukan backend.')}><FileText /> Unduh Laporan</button>}</div>
        </div>
        <div className={`content ${page === 'inbox' ? 'inbox-content' : ''}`}>
          {page === 'overview' && <Overview onNavigate={selectPage} onOpenDetail={setSelectedDetail} />}
          {page === 'inbox' && <OmnichannelInbox onOpenDetail={setSelectedDetail} />}
          {page === 'crm' && <Crm onNavigate={selectPage} onOpenDetail={setSelectedDetail} />}
          {page === 'tasks' && <Tasks onNavigate={selectPage} onOpenDetail={setSelectedDetail} />}
          {page === 'pipeline' && <Pipeline onOpenDetail={setSelectedDetail} />}
          {page === 'production' && <Production onOpenDetail={setSelectedDetail} />}
          {page === 'performance' && <Performance onOpenDetail={setSelectedDetail} />}
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
