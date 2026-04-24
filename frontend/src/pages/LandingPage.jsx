import { useState } from 'react';

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body { background: #050a14; }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(3deg); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 30px rgba(234, 179, 8, 0.3); }
    50% { box-shadow: 0 0 60px rgba(234, 179, 8, 0.7); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounce-x {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(5px); }
  }

  .landing-root {
    font-family: 'DM Sans', sans-serif;
    background: #050a14;
    color: #fff;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 16px 40px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(5,10,20,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(234,179,8,0.15);
  }
  .nav-logo { 
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700;
    color: #eab308; letter-spacing: -0.5px;
  }
  .nav-logo span { color: #fff; }
  .nav-badge {
    background: rgba(234,179,8,0.1); border: 1px solid rgba(234,179,8,0.3);
    color: #eab308; padding: 6px 16px; border-radius: 100px;
    font-size: 13px; font-weight: 500;
  }

  .hero {
    min-height: 100vh;
    display: grid; grid-template-columns: 1fr 1fr;
    align-items: center; gap: 60px;
    padding: 120px 80px 80px;
    position: relative;
    background: radial-gradient(ellipse at 20% 50%, rgba(234,179,8,0.06) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.04) 0%, transparent 50%);
  }
  .hero::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23eab308' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }

  .hero-left { animation: fadeInUp 0.8s ease both; }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(234,179,8,0.1); border: 1px solid rgba(234,179,8,0.25);
    color: #eab308; padding: 8px 18px; border-radius: 100px;
    font-size: 13px; font-weight: 500; margin-bottom: 28px;
  }
  .hero-badge-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #eab308;
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(42px, 5vw, 68px);
    line-height: 1.1; font-weight: 900; margin-bottom: 24px;
  }
  .hero-title-accent {
    background: linear-gradient(135deg, #eab308 0%, #f59e0b 50%, #fbbf24 100%);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  .hero-subtitle {
    font-size: 17px; line-height: 1.7; color: rgba(255,255,255,0.6);
    margin-bottom: 36px; max-width: 480px;
  }

  .price-block {
    display: flex; align-items: center; gap: 16px; margin-bottom: 40px;
  }
  .price-original { font-size: 20px; color: rgba(255,255,255,0.3); text-decoration: line-through; }
  .price-free { font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 900; color: #eab308; }
  .price-tag { background: #16a34a; color: #fff; padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; }

  .hero-stats { display: flex; gap: 32px; margin-bottom: 48px; }
  .stat { text-align: center; }
  .stat-num { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #eab308; }
  .stat-label { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px; }

  .form-section {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px; padding: 40px; backdrop-filter: blur(20px);
    animation: fadeInUp 0.8s ease 0.2s both; position: relative; overflow: hidden;
  }
  .form-section::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #eab308, transparent);
  }
  .form-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; margin-bottom: 8px; }
  .form-subtitle { font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 28px; }

  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.7); margin-bottom: 8px; }
  .form-input {
    width: 100%; padding: 14px 18px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 15px; transition: all 0.3s ease; outline: none;
  }
  .form-input:focus { border-color: #eab308; background: rgba(234,179,8,0.05); box-shadow: 0 0 0 3px rgba(234,179,8,0.1); }
  .form-input::placeholder { color: rgba(255,255,255,0.25); }

  .submit-btn {
    width: 100%; padding: 16px;
    background: linear-gradient(135deg, #eab308, #f59e0b);
    border: none; border-radius: 12px; color: #000;
    font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700;
    cursor: pointer; transition: all 0.3s ease;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    animation: pulse-glow 2s ease-in-out infinite; margin-top: 8px;
  }
  .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(234,179,8,0.4); }
  .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; animation: none; }

  .trust-badges { display: flex; justify-content: center; gap: 20px; margin-top: 20px; flex-wrap: wrap; }
  .trust-badge { display: flex; align-items: center; gap: 6px; font-size: 12px; color: rgba(255,255,255,0.4); }

  .section { padding: 80px 80px; position: relative; }
  .section-label { font-size: 12px; letter-spacing: 4px; text-transform: uppercase; color: #eab308; margin-bottom: 16px; font-weight: 600; }
  .section-title { font-family: 'Playfair Display', serif; font-size: clamp(32px, 4vw, 48px); font-weight: 900; margin-bottom: 16px; }
  .section-sub { font-size: 16px; color: rgba(255,255,255,0.5); margin-bottom: 48px; }

  .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .feature-card {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; padding: 32px; transition: all 0.3s ease; cursor: default;
  }
  .feature-card:hover { border-color: rgba(234,179,8,0.3); background: rgba(234,179,8,0.03); transform: translateY(-4px); }
  .feature-icon { font-size: 36px; margin-bottom: 16px; }
  .feature-title { font-size: 17px; font-weight: 600; margin-bottom: 10px; }
  .feature-desc { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.6; }

  .course-section {
    padding: 80px;
    background: linear-gradient(135deg, rgba(234,179,8,0.04) 0%, rgba(59,130,246,0.03) 100%);
    border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .course-card {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(234,179,8,0.15);
    border-radius: 28px; padding: 52px;
    display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 40px;
    position: relative; overflow: hidden;
  }
  .course-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, #eab308, #f59e0b, transparent);
  }
  .coming-soon-badge {
    background: rgba(234,179,8,0.1); border: 1px solid #eab308; color: #eab308;
    padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; display: inline-block; margin-bottom: 20px;
  }
  .course-title { font-family: 'Playfair Display', serif; font-size: clamp(28px, 3.5vw, 44px); font-weight: 900; line-height: 1.2; margin-bottom: 16px; }
  .course-desc { font-size: 16px; color: rgba(255,255,255,0.55); line-height: 1.7; margin-bottom: 28px; }
  .course-price-block { text-align: center; background: rgba(234,179,8,0.05); border: 1px solid rgba(234,179,8,0.2); border-radius: 20px; padding: 32px 40px; }
  .course-price-label { font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
  .course-price { font-family: 'Playfair Display', serif; font-size: 48px; color: #eab308; font-weight: 900; }
  .course-price-currency { font-size: 20px; vertical-align: super; }
  .notify-btn {
    padding: 14px 32px; background: transparent; border: 2px solid rgba(234,179,8,0.5);
    border-radius: 12px; color: #eab308; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .notify-btn:hover { background: rgba(234,179,8,0.1); border-color: #eab308; }

  .success-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    animation: fadeInUp 0.4s ease;
  }
  .success-card {
    background: #0f1a2e; border: 1px solid rgba(234,179,8,0.3);
    border-radius: 28px; padding: 52px 48px;
    text-align: center; max-width: 480px; width: 90%;
    position: relative; overflow: hidden;
  }
  .success-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #eab308, transparent);
  }
  .success-icon { font-size: 64px; margin-bottom: 20px; }
  .success-title { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 900; margin-bottom: 12px; }
  .success-sub { font-size: 15px; color: rgba(255,255,255,0.55); margin-bottom: 32px; line-height: 1.6; }
  .download-btn {
    display: inline-flex; align-items: center; gap: 10px;
    background: linear-gradient(135deg, #eab308, #f59e0b);
    color: #000; padding: 16px 36px; border-radius: 12px;
    font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700;
    text-decoration: none; transition: all 0.3s ease; cursor: pointer; border: none;
    animation: pulse-glow 2s ease-in-out infinite;
  }
  .download-btn:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(234,179,8,0.4); }
  .download-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; animation: none; }
  .close-btn {
    display: block; margin: 16px auto 0; background: none; border: none;
    color: rgba(255,255,255,0.4); font-size: 14px; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }
  .close-btn:hover { color: #fff; }

  .footer {
    padding: 40px 80px; border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between;
  }
  .footer-logo { font-family: 'Playfair Display', serif; font-size: 20px; color: #eab308; }
  .footer-text { font-size: 13px; color: rgba(255,255,255,0.3); }

  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; padding: 100px 24px 60px; gap: 40px; }
    .features-grid { grid-template-columns: 1fr; }
    .section { padding: 60px 24px; }
    .course-section { padding: 60px 24px; }
    .course-card { grid-template-columns: 1fr; }
    .nav { padding: 14px 20px; }
    .footer { flex-direction: column; gap: 12px; padding: 28px 24px; text-align: center; }
  }
`;

const FEATURES = [
  { icon: '🗣️', title: 'Confident Speaking', desc: 'ভয় ছাড়াই ইংরেজিতে কথা বলার কৌশল শিখুন — যেকোনো পরিস্থিতিতে।' },
  { icon: '🧠', title: 'Smart Vocabulary', desc: 'প্রতিদিনের জীবনে কাজে লাগে এমন 400+ গুরুত্বপূর্ণ শব্দ ও বাক্য।' },
  { icon: '🎯', title: 'Pronunciation Guide', desc: 'সঠিক উচ্চারণ শিখুন — Native speakers-এর মতো করে।' },
  { icon: '💼', title: 'Business English', desc: 'Interview, presentation ও professional communication-এর জন্য বিশেষ গাইড।' },
  { icon: '📝', title: 'Grammar Shortcuts', desc: 'জটিল Grammar সহজে মনে রাখার স্মার্ট কৌশল ও টিপস।' },
  { icon: '🚀', title: '30-Day Action Plan', desc: '৩০ দিনে Fluent হওয়ার জন্য Step-by-step ব্যক্তিগত প্ল্যান।' },
];

const API_BASE = import.meta.env.VITE_API_URL || '';

// ✅ Safe JSON parse — empty response হলেও crash করবে না
const safeJson = async (res) => {
  const text = await res.text();
  if (!text) return { message: 'Server থেকে কোনো response আসেনি' };
  try { return JSON.parse(text); }
  catch { return { message: text }; }
};

export default function LandingPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [leadData, setLeadData] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      alert('সব তথ্য পূরণ করুন');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const err = await safeJson(res); // ✅ safe parse
        throw new Error(err.message || 'কিছু একটা সমস্যা হয়েছে');
      }

      setLeadData({ ...form });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '' });
    } catch (err) {
      alert(err.message || 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  // const handleDownload = async () => {
  //   if (!leadData) return;
  //   setDownloading(true);
  //   try {
  //     const res = await fetch(`${API_BASE}/api/ebook/download`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(leadData)
  //     });

  //     if (!res.ok) {
  //       const err = await safeJson(res); // ✅ safe parse
  //       throw new Error(err.message || 'Download failed');
  //     }

  //     // ✅ Content-Type চেক করো
  //     const contentType = res.headers.get('Content-Type') || '';
  //     if (!contentType.includes('application/pdf')) {
  //       const text = await res.text();
  //       throw new Error('PDF আসেনি। Server response: ' + text.slice(0, 100));
  //     }

  //     // ✅ Blob হিসেবে নাও
  //     const blob = await res.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'Scholarhaat-Ebook.pdf';
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);
  //   } catch (err) {
  //     alert(err.message || 'Download করতে সমস্যা হয়েছে।');
  //   } finally {
  //     setDownloading(false);
  //   }
  // };

  // ✅ GET request — lead data আর পাঠাতে হবে না
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = `${API_BASE}/api/leads/download`;
    a.download = 'Scholarhaat-Ebook.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <style>{styles}</style>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div className="landing-root">
        <nav className="nav">
          <div className="nav-logo">Scholar<span>haat</span></div>
          <div className="nav-badge">🌐 scholarhaat.com</div>
        </nav>

        <section className="hero">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              FREE E-BOOK — সীমিত সময়ের জন্য
            </div>
            <h1 className="hero-title">
              <span className="hero-title-accent">Fluently</span><br />
              Speaking<br />
              English
            </h1>
            <p className="hero-subtitle">
              আজই ডাউনলোড করুন আমাদের Premium E-book — একদম{' '}
              <strong style={{ color: '#eab308' }}>বিনামূল্যে</strong>।
              ইংরেজিতে কথা বলার সব ভয় দূর করুন মাত্র ৩০ দিনে।
            </p>
            <div className="price-block">
              <span className="price-original">৳৫০০</span>
              <span className="price-free">FREE</span>
              <span className="price-tag">100% বিনামূল্যে</span>
            </div>
            <div className="hero-stats">
              <div className="stat"><div className="stat-num">500+</div><div className="stat-label">শিক্ষার্থী</div></div>
              <div className="stat"><div className="stat-num">15+</div><div className="stat-label">পৃষ্ঠা</div></div>
              <div className="stat"><div className="stat-num">4.9★</div><div className="stat-label">রেটিং</div></div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-title">📥 E-book ডাউনলোড করুন</div>
            <p className="form-subtitle">নিচের তথ্য দিন এবং সাথে সাথে PDF পান</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">আপনার নাম *</label>
                <input className="form-input" type="text" name="name"
                  placeholder="যেমন: Dulal Mondal" value={form.name}
                  onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">ইমেইল *</label>
                <input className="form-input" type="email" name="email"
                  placeholder="yourname@gmail.com" value={form.email}
                  onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">মোবাইল নম্বর *</label>
                <input className="form-input" type="tel" name="phone"
                  placeholder="01XXXXXXXXX" value={form.phone}
                  onChange={handleChange} required />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? '⏳ প্রসেস হচ্ছে...' : '🎁 বিনামূল্যে ডাউনলোড করুন'}
              </button>
            </form>
            <div className="trust-badges">
              <span className="trust-badge">🔒 নিরাপদ</span>
              <span className="trust-badge">✅ Spam নেই</span>
              <span className="trust-badge">📧 কোনো Hidden Charge নেই</span>
            </div>
          </div>
        </section>

        <section className="section">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="section-label">E-BOOK এ কী আছে</div>
            <h2 className="section-title">এই E-book পড়ে যা শিখবেন</h2>
            <p className="section-sub">15+ পৃষ্ঠার এই E-book-এ রয়েছে সব কিছু যা আপনার দরকার</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="course-section">
          <div className="course-card">
            <div>
              <div className="coming-soon-badge">🔔 COMING SOON</div>
              <h2 className="course-title">
                Powerful Public<br />
                <span style={{ color: '#eab308' }}>English Speaking</span><br />
                Course
              </h2>
              <p className="course-desc">
                আমাদের সবচেয়ে comprehensive ইংরেজি speaking course শীঘ্রই আসছে।
                Live sessions, recordings, ও personal feedback সহ।
              </p>
              <button className="notify-btn">
                🔔 নোটিফিকেশন পেতে চাই{' '}
                <span style={{ animation: 'bounce-x 1.5s ease-in-out infinite', display: 'inline-block' }}>→</span>
              </button>
            </div>
            <div className="course-price-block">
              <div className="course-price-label">Course Price</div>
              <div className="course-price"><span className="course-price-currency">৳</span><span></span></div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>Early Bird Offer আসছে</div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-logo">Scholarhaat</div>
          <div className="footer-text">© 2026 Scholarhaat | scholarhaat.com | সকল অধিকার সংরক্ষিত</div>
        </footer>

        {success && (
          <div className="success-overlay" onClick={() => setSuccess(false)}>
            <div className="success-card" onClick={e => e.stopPropagation()}>
              <div className="success-icon">🎉</div>
              <div className="success-title">অভিনন্দন!</div>
              <p className="success-sub">
                আপনার E-book প্রস্তুত। নিচের বাটনে ক্লিক করে এখনই ডাউনলোড করুন।
                শুভকামনা রইল আপনার English Journey-তে! 🚀
              </p>
              <button className="download-btn" onClick={handleDownload} disabled={downloading}>
                {downloading ? '⏳ ডাউনলোড হচ্ছে...' : '📥 PDF ডাউনলোড করুন'}
              </button>
              <button className="close-btn" onClick={() => setSuccess(false)}>বন্ধ করুন ✕</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}