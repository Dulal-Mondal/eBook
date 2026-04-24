import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 30px rgba(234,179,8,0.2); }
    50% { box-shadow: 0 0 60px rgba(234,179,8,0.5); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .login-root {
    min-height: 100vh;
    background: #050a14;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative; overflow: hidden;
  }
  .login-root::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 40%, rgba(234,179,8,0.06) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 70%, rgba(59,130,246,0.04) 0%, transparent 50%);
    pointer-events: none;
  }
  .login-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 28px; padding: 52px 48px;
    width: 440px; max-width: 95vw;
    animation: fadeInUp 0.6s ease both;
    position: relative; overflow: hidden;
    backdrop-filter: blur(20px);
  }
  .login-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #eab308, transparent);
  }
  .login-logo {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 700; color: #eab308;
    text-align: center; margin-bottom: 6px;
  }
  .login-logo span { color: #fff; }
  .login-subtitle {
    text-align: center; font-size: 14px; color: rgba(255,255,255,0.4);
    margin-bottom: 36px;
  }
  .login-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: #fff;
    margin-bottom: 28px; text-align: center;
  }
  .form-group { margin-bottom: 20px; }
  .form-label {
    display: block; font-size: 13px; font-weight: 500;
    color: rgba(255,255,255,0.6); margin-bottom: 8px;
  }
  .form-input {
    width: 100%; padding: 14px 18px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 15px;
    transition: all 0.3s ease; outline: none;
  }
  .form-input:focus {
    border-color: #eab308;
    background: rgba(234,179,8,0.04);
    box-shadow: 0 0 0 3px rgba(234,179,8,0.1);
  }
  .form-input::placeholder { color: rgba(255,255,255,0.2); }
  .login-btn {
    width: 100%; padding: 15px;
    background: linear-gradient(135deg, #eab308, #f59e0b);
    border: none; border-radius: 12px;
    color: #000; font-family: 'DM Sans', sans-serif;
    font-size: 16px; font-weight: 700; cursor: pointer;
    transition: all 0.3s ease; margin-top: 8px;
    animation: pulse-glow 2s ease-in-out infinite;
  }
  .login-btn:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(234,179,8,0.35); }
  .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .error-msg {
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
    color: #f87171; padding: 12px 16px; border-radius: 10px;
    font-size: 14px; margin-bottom: 20px; text-align: center;
  }
  .back-link {
    display: block; text-align: center; margin-top: 20px;
    font-size: 13px; color: rgba(255,255,255,0.35);
    text-decoration: none;
  }
  .back-link:hover { color: #eab308; }
`;

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div className="login-root">
        <div className="login-card">
          <div className="login-logo">Scholar<span>haat</span></div>
          <div className="login-subtitle">Admin Panel</div>
          <div className="login-title">🔐 Login করুন</div>
          {error && <div className="error-msg">⚠️ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input" type="email" placeholder="admin@scholarhaat.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? '⏳ Logging in...' : '🚀 Dashboard এ যান'}
            </button>
          </form>
          <a href="/" className="back-link">← Landing Page এ ফিরুন</a>
        </div>
      </div>
    </>
  );
}