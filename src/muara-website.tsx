"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { ArrowUpRight, ArrowRight, Check, ChevronDown, MapPin, ScanLine, Files, Route, Menu, X, Leaf, ShieldCheck, Layers, LoaderCircle, Plus, Users, Smartphone, CloudUpload, BookOpen } from "lucide-react";

const services = [
  { name: "TAPAK", title: "Pemetaan lahan pemasok", text: "Kami mencatat identitas pemasok, lokasi dan batas lahan, serta periode panen sebagai dasar penelusuran bahan.", result: "Peta sumber dan identitas pemasok", icon: MapPin, className: "tapak" },
  { name: "SINYAL", title: "Riwayat lingkungan", text: "Kami memeriksa riwayat lahan dan indikasi perubahan lingkungan. Temuan dicatat dan ditelaah sesuai lokasi, waktu, serta risikonya.", result: "Catatan pemeriksaan lingkungan", icon: ScanLine, className: "sinyal" },
  { name: "BRANKAS HAK", title: "Dokumen hak dan izin", text: "Kami menata dokumen hak dan izin, mencocokkannya dengan lahan serta pemegangnya, dan mencatat masa berlaku maupun dokumen yang belum lengkap.", result: "Dokumen lahan beserta statusnya", icon: Files, className: "hak" },
  { name: "ALIRAN BAHAN", title: "Pencatatan aliran bahan", text: "Kami menghubungkan data sumber dengan catatan pengiriman, penerimaan, stok, pengolahan, dan produk yang dicatat perusahaan.", result: "Jejak bahan sampai produk", icon: Route, className: "aliran" },
];

const readiness = [
  { label: "Mulai dari awal", tag: "LAYANAN LENGKAP", heading: "Mulai pencatatan dan pengelolaan dari awal.", text: "Untuk perusahaan yang membutuhkan pencatatan dan pengelolaan bukti dari awal. MUARA menyiapkan sistem inti, mendampingi pemasok, dan membantu mengelola catatan rutin.", items: ["Tentukan jaringan pemasok dan cakupan lahan", "Siapkan sistem dan pencatatan yang sesuai", "Hubungkan bukti dengan penerimaan bahan dan produk"], interest: "Pengelolaan menyeluruh" },
  { label: "Sudah punya sistem", tag: "MELENGKAPI SISTEM ANDA", heading: "Gunakan sistem yang ada, lengkapi kebutuhannya.", text: "MUARA membantu pekerjaan yang belum tertangani, seperti pendataan pemasok, pemeriksaan dokumen, atau pembaruan data. Hasilnya disesuaikan dengan sistem dan proses perusahaan Anda.", items: ["Petakan data dan proses yang sudah tersedia", "Pilih pekerjaan yang perlu dilengkapi", "Hubungkan hasilnya dengan sistem perusahaan"], interest: "Melengkapi sistem" },
  { label: "Butuh pekerjaan tertentu", tag: "LAYANAN TERPILIH", heading: "Pilih pekerjaan yang membutuhkan bantuan.", text: "Untuk perusahaan yang memerlukan bantuan lapangan, pembaruan bukti, atau pemeriksaan tertentu. Hasil pekerjaan diserahkan ke sistem pelanggan sesuai kesepakatan.", items: ["Tentukan pekerjaan dan hasil yang dibutuhkan", "Tugaskan pengumpul data dan pemeriksa terpisah", "Serahkan hasil beserta sumber dan catatan temuannya"], interest: "Layanan lapangan" },
];

const trace = [
  { name: "Lahan", sub: "Sumber bahan", title: "Catat lahan asal dan pemasoknya.", text: "Identitas lahan, pemasok, lokasi, dan periode panen menjadi titik awal. Bukti lingkungan dan hak terhubung dengan sumber yang sama.", evidence: ["Identitas pemasok dan lahan", "Lokasi / batas lahan", "Periode panen dan sumber dokumen"], icon: MapPin },
  { name: "Pengiriman", sub: "Perjalanan bahan", title: "Catat bahan yang meninggalkan sumber.", text: "Catatan pengiriman dihubungkan dengan sumbernya. Identitas transaksi, waktu, dan jumlah bahan membantu penerima memeriksa kecocokan catatan.", evidence: ["Identitas pengiriman", "Sumber dan tujuan", "Tanggal dan jumlah bahan"], icon: Route },
  { name: "Penerimaan", sub: "Bahan masuk", title: "Periksa kecocokan saat bahan diterima.", text: "Catatan penerimaan dibandingkan dengan pengiriman. Selisih identitas, waktu, atau jumlah menjadi temuan yang perlu dijelaskan.", evidence: ["Catatan penerimaan", "Pengiriman terkait", "Selisih dan penjelasannya"], icon: Check },
  { name: "Stok & proses", sub: "Pengolahan", title: "Hubungkan bahan masuk dengan hasil pengolahan.", text: "Catatan stok dan proses menghubungkan bahan yang diterima dengan produk yang dihasilkan. Catatan ini harus sesuai dengan pergerakan bahan yang dikelola perusahaan.", evidence: ["Catatan stok dan perpindahan", "Proses / kelompok produksi", "Hubungan input dan output"], icon: Layers },
  { name: "Produk", sub: "Paket bukti", title: "Siapkan bukti untuk produk terkait.", text: "Paspor MUARA menghimpun bukti yang terkait dengan bahan dan produk. Penerima dapat melihat sumber, hasil pemeriksaan, serta kekurangan data yang tercatat.", evidence: ["Hubungan produk dengan bahan", "Bukti sumber yang relevan", "Status dan riwayat pemeriksaan"], icon: Files },
];

const faqs = [
  { q: "Apakah kami harus mengganti sistem yang sudah ada?", a: "Tidak harus. MUARA dapat diterapkan secara lengkap, dipakai untuk bagian yang belum tersedia, atau menyediakan pekerjaan tertentu. Cara menghubungkan data disesuaikan dengan sistem dan lingkup pekerjaan. Integrasi khusus memiliki perhitungan biaya tersendiri." },
  { q: "Apakah pemasok kecil harus memiliki aplikasi sendiri?", a: "Tidak. Juru Petak dapat mendampingi pengumpulan data dan membawa perangkat. Data lapangan dapat dicatat tanpa koneksi, lalu disinkronkan. Dalam paket yang dibiayai pelanggan pengolah, pemasok kecil tidak dikenai tagihan langsung." },
  { q: "Apa sebenarnya Paspor MUARA?", a: "Paspor MUARA adalah paket informasi yang menghubungkan bukti sumber, dokumen, hasil pemeriksaan, serta catatan bahan dan produk terkait. Ini bukan sertifikat kepatuhan dan bukan pengganti keputusan uji tuntas pihak yang bertanggung jawab." },
  { q: "Bagaimana layanan dan biayanya ditentukan?", a: "Layanan terdiri dari penyiapan awal dan pengelolaan rutin. Cakupan awal dirancang sampai 400 plot per lokasi, dengan pilihan tambahan 400 plot. Sistem inti atau penghubung standar termasuk dalam layanan. Lingkup pekerjaan, perjalanan pembaruan, dan pekerjaan khusus dijelaskan dalam penawaran; tidak ada lisensi inti yang ditagih terpisah." },
  { q: "Apakah semua data pemasok akan terbuka untuk umum?", a: "Tidak. Data operasional dan bukti pemasok diatur berdasarkan tujuan penggunaan, persetujuan atau dasar pemrosesan yang sesuai, serta hak akses pihak terkait. Perusahaan menentukan pihak yang dapat mengakses data sesuai peran dan kebutuhan penggunaannya." },
];

function Brand({ light = false }: { light?: boolean }) {
  return <a href="#beranda" aria-label="MUARA, kembali ke beranda" className={`brand ${light ? "brand-light" : ""}`}>
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M7 5v10c0 9 13 9 13 18M20 4v11c0 9 0 9 0 18M33 5v10c0 9-13 9-13 18" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round"/><circle cx="20" cy="34" r="3.5" fill="currentColor"/></svg>
    <span>MUARA<span className="brand-dot">.</span></span>
  </a>;
}

const mapPoints = [
  { title: "Lokasi lahan", text: "Identitas pemasok, batas lahan, dan periode panen.", icon: MapPin },
  { title: "Dokumen pemasok", text: "Hak dan izin yang sesuai dengan lahan serta pemegangnya.", icon: Files },
  { title: "Perjalanan bahan", text: "Catatan pengiriman, penerimaan, dan pengolahan.", icon: Route },
];
const passportContents = [
  ["Asal bahan", ["Identitas pemasok", "Lokasi dan batas lahan", "Periode panen"]],
  ["Riwayat lingkungan", ["Riwayat lahan", "Temuan perubahan", "Hasil pemeriksaan"]],
  ["Hak dan izin", ["Pemegang hak", "Dokumen pendukung", "Masa berlaku"]],
  ["Bahan dan produk", ["Pengiriman dan penerimaan", "Stok dan pengolahan", "Produk terkait"]],
] as const;

export default function MuaraWebsite({ inquiryEndpoint = "/api/inquiries" }: { inquiryEndpoint?: string }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [ready, setReady] = useState(0);
  const [step, setStep] = useState(0);
  const [interest, setInterest] = useState("Pengelolaan menyeluruh");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [copied, setCopied] = useState(false);
  const [mapPoint, setMapPoint] = useState(0);
  const [passportTab, setPassportTab] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const passportRef = useRef<HTMLDialogElement>(null);
  const current = readiness[ready];
  const example = trace[step];
  const selectedMapPoint = mapPoints[mapPoint];

  useEffect(() => {
    let scheduled = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      scheduled = false;
    };
    const onScroll = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll); update();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
    }, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
    ["tentang", "layanan", "cara-kerja", "hubungi"].forEach(id => {
      const element = document.getElementById(id); if (element) observer.observe(element);
    });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); observer.disconnect(); };
  }, []);

  function openPrivacy() { dialogRef.current?.showModal(); }
  function closePrivacy() { dialogRef.current?.close(); }
  function chooseService() { setInterest(current.interest); setReference(""); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(inquiryEndpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.get("name"), company: data.get("company"), email: data.get("email"), interest, message: data.get("message"), website: data.get("website"), consent: data.get("consent") === "on" }),
      });
      const result = await response.json() as { reference?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "Permintaan belum tersimpan. Coba lagi.");
      if (!result.reference) throw new Error("Konfirmasi belum diterima. Coba kembali.");
      setReference(result.reference); formRef.current?.reset();
    } catch (err) { setError(err instanceof Error ? err.message : "Koneksi terputus. Coba kirim kembali."); }
    finally { setSending(false); }
  }
  async function copyReference() {
    try { await navigator.clipboard.writeText(reference); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setCopied(false); }
  }

  return <>
    <a className="skip-link" href="#konten">Langsung ke isi</a>
    <header className="site-header"><div className="reading-progress" style={{width: `${scrollProgress}%`}} aria-hidden="true"/>
      <div className="nav-wrap"><Brand />
        <nav aria-label="Navigasi utama" className={mobileMenu ? "nav-links is-open" : "nav-links"}>
          {[["Layanan", "layanan"], ["Cara kerja", "cara-kerja"], ["Tentang MUARA", "tentang"]].map(([label, id]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} onClick={() => setMobileMenu(false)}>{label}</a>)}
          <a className="button nav-cta" href="#hubungi" onClick={() => setMobileMenu(false)}>Hubungi MUARA <ArrowUpRight size={17} /></a>
        </nav>
        <button className="mobile-toggle" aria-label={mobileMenu ? "Tutup menu" : "Buka menu"} aria-expanded={mobileMenu} onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button>
      </div>
    </header>
    <main id="konten">
      <section className="hero" id="beranda">
        <div className="hero-main container">
          <div className="hero-copy">
            <div className="eyebrow"><span className="small-line" /> LAYANAN RANTAI PASOK PULP DAN KERTAS</div>
            <h1>Telusuri bahan.<br/>Dari lahan<br/><em>hingga produk.</em></h1>
            <p>MUARA membantu perusahaan pulp dan kertas memetakan lahan pemasok, memeriksa dokumen dan riwayat lahan, serta menghubungkan data tersebut dengan catatan bahan dan produk.</p>
            <div className="hero-actions"><a className="button" href="#layanan">Lihat layanan MUARA <ArrowUpRight size={19}/></a><a className="text-link" href="#cara-kerja">Lihat cara kerja <ArrowRight size={17}/></a></div>
            <div className="hero-note"><span className="note-dot"/>Layanan dapat disesuaikan dengan sistem yang sudah Anda miliki.</div>
          </div>
          <div className="hero-visual">
            <div className="map-frame"><img src="/landscape.svg" alt="Gambar bentang lahan dan aliran sungai" width="640" height="720" fetchPriority="high"/>
              <div className="map-points" role="group" aria-label="Jelajahi data rantai pasok">{mapPoints.map((point, index) => <button key={point.title} className={`map-point map-point-${index} ${mapPoint === index ? "selected" : ""}`} aria-label={point.title} aria-pressed={mapPoint === index} onClick={() => setMapPoint(index)}><Plus size={17}/></button>)}</div>
              <div className="map-insight" aria-live="polite"><span className="map-insight-icon"><selectedMapPoint.icon size={22} strokeWidth={1.5}/></span><div><strong>{selectedMapPoint.title}</strong><p>{selectedMapPoint.text}</p></div><span className="map-count">0{mapPoint + 1}</span></div>
            </div><div className="map-hint"><span className="hint-dots">{mapPoints.map((point, index) => <button key={point.title} onClick={() => setMapPoint(index)} aria-label={`Tampilkan ${point.title.toLowerCase()}`} aria-pressed={mapPoint === index}/>)}</span><span>Pilih titik pada peta untuk melihat datanya</span></div>
          </div>
        </div>
        <div className="hero-bottom container"><span>CAKUPAN LAYANAN</span><div><span>Lokasi & waktu</span><span>Riwayat lingkungan</span><span>Legalitas & hak</span><span>Perjalanan bahan</span></div></div>
      </section>

      <section className="intro section-pad container" id="tentang">
        <div className="eyebrow">TENTANG MUARA</div>
        <div className="intro-grid"><h2>Membantu perusahaan<br/><em>mengelola bukti asal bahan.</em></h2><div><p className="large-copy">Ketika peta lahan, dokumen izin, dan catatan pengiriman disimpan terpisah, tim perlu mencocokkannya satu per satu.</p><p>MUARA dirancang untuk menyatukan pencatatan tersebut dan membantu pengumpulan, pemeriksaan, serta pembaruannya. Tim dapat menelusuri dokumen dan asal bahan dari sumber yang sama.</p><p className="intro-foot"><Leaf size={18}/><span>Sistem pencatatan dan pendampingan lapangan.</span></p></div></div>
      </section>

      <section className="services section-pad" id="layanan">
        <div className="container"><div className="section-heading"><div><div className="eyebrow">LAYANAN KAMI</div><h2>Dari pemetaan lahan<br/><em>sampai pencatatan bahan.</em></h2></div><p>Pilih layanan sesuai kebutuhan perusahaan, mulai dari pengumpulan data di lapangan hingga pengelolaan catatan rutin.</p></div>
          <div className="service-grid">{services.map((s, i) => <article className={`service ${s.className}`} key={s.name}><div className="service-top"><s.icon size={25} strokeWidth={1.5}/><span>0{i + 1}</span></div><div className="service-name">{s.name}</div><h3>{s.title}</h3><p>{s.text}</p><div className="service-result"><span>HASIL KERJA</span><strong>{s.result}</strong></div></article>)}</div>
          <div className="passport-showcase"><div className="passport-visual" aria-hidden="true"><div className="passport-shadow"/><div className="passport-book"><span>MUARA.</span><div className="book-river"><i/><i/><i/></div><strong>Paspor<br/>MUARA</strong><small>ASAL BAHAN & DOKUMEN</small></div><span className="passport-seal"><Files size={23} strokeWidth={1.3}/></span></div><div className="passport-showcase-copy"><div className="eyebrow">HASIL PENGELOLAAN BUKTI</div><h3>Kenali isi<br/><em>Paspor MUARA.</em></h3><p>Kumpulan bukti asal bahan, dokumen, hasil pemeriksaan, dan catatan produk terkait. Penerima dapat melihat asal bahan, dokumen pendukung, dan hasil pemeriksaannya.</p><button className="text-link" onClick={() => passportRef.current?.showModal()}>Lihat isi Paspor MUARA <BookOpen size={18}/></button></div></div>
        </div>
      </section>

      <section className="readiness section-pad container" id="kebutuhan">
        <div className="section-heading"><div><div className="eyebrow">PILIHAN LAYANAN</div><h2>Sesuaikan layanan<br/><em>dengan kebutuhan Anda.</em></h2></div><p>MUARA dapat membantu perusahaan yang baru memulai, ingin melengkapi sistem, atau membutuhkan pekerjaan tertentu.</p></div>
        <div className="readiness-tabs" role="tablist" aria-label="Kesiapan sistem pelanggan">{readiness.map((r, i) => <button key={r.label} role="tab" id={`readiness-tab-${i}`} aria-selected={ready === i} aria-controls="readiness-panel" tabIndex={ready === i ? 0 : -1} onClick={() => setReady(i)} onKeyDown={e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { const next = (i + (e.key === "ArrowRight" ? 1 : 2)) % 3; setReady(next); document.getElementById(`readiness-tab-${next}`)?.focus(); } }}><span>0{i + 1}</span>{r.label}<ArrowUpRight size={18}/></button>)}</div>
        <div className="readiness-panel" id="readiness-panel" role="tabpanel" aria-labelledby={`readiness-tab-${ready}`}><div><div className="eyebrow">{current.tag}</div><h3>{current.heading}</h3><p>{current.text}</p><a href="#hubungi" className="text-link" onClick={chooseService}>Bahas kebutuhan ini <ArrowUpRight size={18}/></a></div><ol>{current.items.map((item, i) => <li key={item}><span>0{i + 1}</span>{item}</li>)}</ol></div>
      </section>

      <section className="trace-section section-pad" id="cara-kerja"><div className="container"><div className="section-heading"><div><div className="eyebrow">PENELUSURAN BAHAN</div><h2>Apa yang dicatat<br/><em>di setiap tahap?</em></h2></div><p>Pilih tahap untuk melihat data yang menghubungkan lahan asal dengan bahan dan produk.</p></div>
        <div className="trace-stages" role="tablist" aria-label="Tahap perjalanan bahan">{trace.map((s, i) => <button key={s.name} role="tab" id={`trace-tab-${i}`} aria-selected={step === i} aria-controls="trace-panel" tabIndex={step === i ? 0 : -1} onClick={() => setStep(i)} onKeyDown={e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { const next = (i + (e.key === "ArrowRight" ? 1 : 4)) % 5; setStep(next); document.getElementById(`trace-tab-${next}`)?.focus(); } }}><s.icon size={22} strokeWidth={1.6}/><span>{s.name}<small>{s.sub}</small></span><ArrowRight className="stage-arrow" size={16}/></button>)}</div>
        <div className="trace-panel" id="trace-panel" role="tabpanel" aria-labelledby={`trace-tab-${step}`}><div className="trace-example"><span className="small-tag">DATA YANG DICATAT</span><div className="example-id"><span>LAHAN</span><ArrowRight size={16}/><span>BAHAN</span><ArrowRight size={16}/><span>PRODUK</span></div><div className="evidence-list">{example.evidence.map((e, i) => <div key={e}><span>0{i + 1}</span>{e}<Check size={16}/></div>)}</div></div><div className="trace-copy"><span className="step-index">0{step + 1} / 05</span><h3>{example.title}</h3><p>{example.text}</p><div className="trace-controls"><button onClick={() => setStep((step + 4) % 5)} aria-label="Tahap sebelumnya"><ArrowRight size={18} style={{transform: "rotate(180deg)"}}/></button><button onClick={() => setStep((step + 1) % 5)}>Tahap berikutnya <ArrowRight size={18}/></button></div></div></div>
        
      </div></section>

      <section className="supplier-section"><div className="container supplier-grid"><div className="supplier-visual" aria-hidden="true"><div className="supplier-orbit"/><div className="supplier-hub"><Leaf size={36} strokeWidth={1.3}/></div><span className="supplier-node node-people"><Users size={25}/></span><span className="supplier-node node-phone"><Smartphone size={25}/></span><span className="supplier-node node-cloud"><CloudUpload size={27}/></span><div className="supplier-label">PENDAMPINGAN DI LAPANGAN</div></div><div className="supplier-copy"><div className="eyebrow">KETERLIBATAN PEMASOK</div><h2>Pemasok kecil<br/><em>tetap dapat ikut.</em></h2><p>Petugas mendampingi pengumpulan data dan dapat membawa perangkat. Pencatatan bisa dilakukan tanpa koneksi, lalu disinkronkan.</p><div className="supplier-feature"><Check size={16}/><span>Pemasok tidak harus memiliki aplikasi sendiri.</span></div><div className="supplier-feature"><Check size={16}/><span>Tidak ada tagihan langsung ke pemasok kecil dalam paket yang dibiayai pelanggan pengolah.</span></div></div></div></section>

      <section className="working section-pad container"><div className="working-heading"><div className="eyebrow">PROSES LAYANAN</div><h2>Bagaimana<br/><em>layanan berjalan?</em></h2></div><div className="working-steps">{[
        ["Sepakati lingkup", "Tentukan pemasok, cakupan lahan, alur bahan, kondisi sistem, dan hasil kerja yang dibutuhkan."],
        ["Kumpulkan & periksa", "Juru Petak mengumpulkan data. Pemeriksa terpisah menilai kelengkapan, kecocokan, dan sumber temuannya."],
        ["Hubungkan & serahkan", "Bukti dihubungkan dengan catatan bahan dan produk, lalu diserahkan sesuai hak akses."],
        ["Kelola & perbarui", "Perubahan pemasok, lahan, dokumen, atau temuan baru memperbarui catatan yang terdampak."],
      ].map(([title, text], i) => <article key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>

      <section className="faq section-pad"><div className="container faq-grid"><div><div className="eyebrow">PERTANYAAN UMUM</div><h2>Yang perlu<br/><em>Anda ketahui.</em></h2><p>Tentang sistem, keterlibatan pemasok, biaya, dan penggunaan data.</p></div><div>{faqs.map(f => <details key={f.q}><summary>{f.q}<ChevronDown size={18}/></summary><p>{f.a}</p></details>)}</div></div></section>

      <section className="contact section-pad" id="hubungi"><div className="container contact-grid"><div className="contact-copy"><div className="eyebrow">HUBUNGI MUARA</div><h2>Apa yang<br/><em>Anda butuhkan?</em></h2><p>Ceritakan kondisi pencatatan pemasok di perusahaan Anda dan pekerjaan yang membutuhkan bantuan.</p><div className="contact-guidance"><ShieldCheck size={20}/><p>Tuliskan gambaran kebutuhan saja. Simpan dokumen lahan dan data pribadi pemasok untuk pembahasan terpisah.</p></div><div className="contact-mark" aria-hidden="true">M<span>↗</span></div></div>
        <div className="contact-form-wrap">{reference ? <div className="success-panel" role="status"><span className="success-icon"><Check size={30}/></span><div className="eyebrow">PERMINTAAN TERCATAT</div><h3>Permintaan Anda sudah tersimpan.</h3><p>Kebutuhan Anda telah tersimpan. Simpan kode berikut sebagai referensi permintaan Anda.</p><button className="reference" onClick={copyReference} title="Salin kode referensi">{reference}<span>{copied ? "Tersalin" : "Salin kode"}</span></button><button className="text-link" onClick={() => {setReference("");setCopied(false);}}>Kirim kebutuhan lainnya <ArrowRight size={16}/></button></div> : <form ref={formRef} onSubmit={submit}><h3>Ceritakan kebutuhan Anda</h3><p className="form-intro">Semua kolom perlu diisi.</p><div className="form-two"><label>Nama lengkap<input required name="name" autoComplete="name" minLength={2} maxLength={100} placeholder="Nama Anda"/></label><label>Perusahaan / organisasi<input required name="company" autoComplete="organization" minLength={2} maxLength={150} placeholder="Nama perusahaan"/></label></div><label>Email kerja<input required name="email" autoComplete="email" type="email" maxLength={254} placeholder="nama@perusahaan.com"/></label><label>Kebutuhan utama<select value={interest} onChange={e => setInterest(e.target.value)} name="interest">{["Pengelolaan menyeluruh", "Melengkapi sistem", "Layanan lapangan", "Mengenal MUARA"].map(o => <option key={o}>{o}</option>)}</select></label><label>Gambaran kebutuhan<textarea required name="message" rows={4} minLength={15} maxLength={2000} placeholder="Misalnya: kami ingin merapikan bukti pemasok dan menghubungkannya dengan catatan penerimaan bahan."/></label><div className="honey" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div><label className="consent"><input name="consent" required type="checkbox"/><span>Saya menyetujui penggunaan data ini untuk menangani permintaan saya, sesuai <button type="button" onClick={openPrivacy}>informasi privasi</button>.</span></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button form-submit" disabled={sending} type="submit">{sending ? <>Menyimpan permintaan <LoaderCircle className="spin" size={19}/></> : <>Kirim kebutuhan <ArrowUpRight size={19}/></>}</button><p className="form-note">Data Anda digunakan untuk menangani permintaan ini.</p></form>}</div>
      </div></section>
    </main>
    <footer className="footer"><div className="container"><div className="footer-top"><Brand light/><p>Pendampingan lapangan dan<br/>pengelolaan data pemasok.</p><a href="#beranda" className="back-top">Kembali ke atas <ArrowUpRight size={18}/></a></div><div className="footer-bottom"><span>© 2026 MUARA. Pengelolaan bukti rantai pasok.</span><button onClick={openPrivacy}>Informasi privasi</button><span>PULP DAN KERTAS</span></div></div></footer>
    <dialog ref={passportRef} className="passport-dialog" onClick={e => { if (e.target === e.currentTarget) passportRef.current?.close(); }} aria-labelledby="passport-title"><div className="passport-modal"><button className="dialog-close" onClick={() => passportRef.current?.close()} aria-label="Tutup pratinjau paspor"><X size={22}/></button><div className="eyebrow">PASPOR MUARA</div><h2 id="passport-title">Apa yang ada<br/><em>di dalamnya?</em></h2><p className="passport-intro">Empat kelompok informasi untuk menelusuri asal bahan dan memeriksa bukti pendukungnya.</p><div className="passport-tabs" role="tablist" aria-label="Isi Paspor MUARA">{passportContents.map(([name], index) => <button key={name} id={`passport-tab-${index}`} role="tab" aria-selected={passportTab === index} aria-controls="passport-content" tabIndex={passportTab === index ? 0 : -1} onClick={() => setPassportTab(index)} onKeyDown={e => {if(e.key === "ArrowRight" || e.key === "ArrowLeft"){const next = (index + (e.key === "ArrowRight" ? 1 : 3)) % 4;setPassportTab(next);document.getElementById(`passport-tab-${next}`)?.focus();}}}><span>0{index + 1}</span>{name}</button>)}</div><div id="passport-content" className="passport-content" role="tabpanel" aria-labelledby={`passport-tab-${passportTab}`}><Files size={32} strokeWidth={1.3}/><h3>{passportContents[passportTab][0]}</h3><ul>{passportContents[passportTab][1].map(item => <li key={item}><span/>{item}</li>)}</ul></div><p className="passport-foot">Paspor memuat bukti dan hasil pemeriksaan. Status serta kekurangan informasi tetap dicatat.</p><button className="button" onClick={() => passportRef.current?.close()}>Kembali ke layanan <ArrowRight size={17}/></button></div></dialog>
    <dialog ref={dialogRef} className="privacy-dialog" onClick={e => {if(e.target === e.currentTarget)closePrivacy();}} aria-labelledby="privacy-title"><div className="privacy-content"><button className="dialog-close" onClick={closePrivacy} aria-label="Tutup informasi privasi"><X size={22}/></button><div className="eyebrow">PRIVASI FORMULIR</div><h2 id="privacy-title">Penggunaan data<br/>formulir kontak.</h2><p>Formulir menyimpan nama, organisasi, email, pilihan kebutuhan, isi pesan, waktu pengiriman, dan persetujuan Anda. Data digunakan untuk mencatat serta menangani permintaan terkait MUARA.</p><p>Isian formulir bersifat privat dan hanya dapat dikelola oleh pemilik website. Data tidak dibagikan kepada calon mitra melalui formulir ini.</p><p>Sistem juga mencatat penghitung pengiriman untuk membatasi spam.</p><p>Jangan kirim dokumen hak, koordinat lahan, atau informasi pribadi pemasok. Jika ingin memperbaiki atau menghapus permintaan, kirim permintaan baru dengan kode referensi sebelumnya dan email yang sama.</p><span className="privacy-date">Berlaku 2 November 2026</span><button className="button" onClick={closePrivacy}>Saya mengerti <Check size={17}/></button></div></dialog>
  </>;
}
