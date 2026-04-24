import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  .dash-root {
    min-height: 100vh;
    background: #080d18;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    display: flex;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 240px;
    min-height: 100vh;
    background: #0d1424;
    border-right: 1px solid rgba(255,255,255,0.06);
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0; top: 0; bottom: 0;
    z-index: 50;
    flex-shrink: 0;
  }

  .sidebar-logo {
    padding: 24px 20px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .sidebar-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: #eab308;
    letter-spacing: -0.3px;
  }
  .sidebar-logo-text span { color: #fff; }
  .sidebar-logo-sub {
    font-size: 10px;
    color: rgba(255,255,255,0.25);
    margin-top: 3px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
  }

  .sidebar-nav {
    flex: 1;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s ease;
    color: rgba(255,255,255,0.45);
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    white-space: nowrap;
  }
  .nav-item:hover {
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.85);
  }
  .nav-item.active {
    background: rgba(234,179,8,0.12);
    color: #eab308;
    font-weight: 600;
  }

  .nav-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 15px;
    line-height: 1;
  }

  .sidebar-footer {
    padding: 12px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .logout-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s ease;
    color: rgba(255,255,255,0.35);
    width: 100%;
    background: none;
    border: none;
    text-align: left;
  }
  .logout-btn:hover {
    background: rgba(239,68,68,0.08);
    color: #f87171;
  }

  /* ── MAIN ── */
  .main {
    margin-left: 240px;
    flex: 1;
    min-width: 0;
  }

  .topbar {
    padding: 18px 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(8,13,24,0.85);
    backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 40;
  }
  .topbar-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
  }
  .topbar-admin {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 100px;
    padding: 7px 14px;
    font-size: 12.5px;
    color: rgba(255,255,255,0.55);
  }
  .admin-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22c55e;
    flex-shrink: 0;
    box-shadow: 0 0 6px rgba(34,197,94,0.5);
  }

  .content { padding: 28px 32px; }

  /* ── STAT CARDS ── */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 28px;
  }
  .stat-card {
    background: #0d1424;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    animation: fadeInUp 0.45s ease both;
  }
  .stat-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: 2px 2px 0 0;
  }
  .stat-card.gold::after { background: linear-gradient(90deg, #eab308 0%, #f59e0b 60%, transparent 100%); }
  .stat-card.blue::after { background: linear-gradient(90deg, #3b82f6 0%, #6366f1 60%, transparent 100%); }
  .stat-card.green::after { background: linear-gradient(90deg, #22c55e 0%, #10b981 60%, transparent 100%); }

  .stat-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    font-size: 18px;
  }
  .stat-card.gold .stat-icon-wrap { background: rgba(234,179,8,0.1); }
  .stat-card.blue .stat-icon-wrap { background: rgba(59,130,246,0.1); }
  .stat-card.green .stat-icon-wrap { background: rgba(34,197,94,0.1); }

  .stat-label {
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase;
    letter-spacing: 1.2px;
    margin-bottom: 8px;
  }
  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 6px;
  }
  .stat-card.gold .stat-value { color: #eab308; }
  .stat-card.blue .stat-value { color: #60a5fa; font-size: 22px; padding-top: 4px; }
  .stat-card.green .stat-value { color: #4ade80; font-size: 20px; padding-top: 4px; }
  .stat-sub {
    font-size: 12px;
    color: rgba(255,255,255,0.28);
  }

  /* ── SECTION CARDS ── */
  .section-card {
    background: #0d1424;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 28px;
    margin-bottom: 24px;
    animation: fadeInUp 0.45s ease 0.08s both;
  }
  .section-header { margin-bottom: 20px; }
  .section-card-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }
  .section-card-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.35);
  }

  /* ── QUICK ACTIONS ── */
  .actions-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }
  .action-btn.primary {
    background: #eab308;
    color: #000;
  }
  .action-btn.primary:hover {
    background: #f59e0b;
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(234,179,8,0.25);
  }
  .action-btn.secondary {
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.75);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .action-btn.secondary:hover {
    background: rgba(255,255,255,0.09);
    color: #fff;
  }
  .action-btn.outline {
    background: transparent;
    color: rgba(255,255,255,0.55);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .action-btn.outline:hover {
    border-color: rgba(234,179,8,0.4);
    color: #eab308;
    background: rgba(234,179,8,0.05);
  }

  /* ── UPLOAD ── */
  .upload-zone {
    border: 1.5px dashed rgba(234,179,8,0.2);
    border-radius: 14px;
    padding: 36px;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s ease;
    background: rgba(234,179,8,0.02);
    position: relative;
  }
  .upload-zone:hover, .upload-zone.dragover {
    border-color: rgba(234,179,8,0.5);
    background: rgba(234,179,8,0.04);
  }
  .upload-zone input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
  .upload-icon-big {
    width: 48px;
    height: 48px;
    background: rgba(234,179,8,0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin: 0 auto 14px;
  }
  .upload-text { font-size: 14px; font-weight: 500; margin-bottom: 5px; color: rgba(255,255,255,0.85); }
  .upload-hint { font-size: 12.5px; color: rgba(255,255,255,0.3); }
  .upload-selected {
    margin-top: 14px;
    padding: 11px 18px;
    background: rgba(234,179,8,0.07);
    border: 1px solid rgba(234,179,8,0.18);
    border-radius: 10px;
    font-size: 13.5px;
    color: #eab308;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .progress-bar {
    height: 3px;
    background: rgba(255,255,255,0.07);
    border-radius: 2px;
    margin-top: 14px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #eab308, #f59e0b);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .current-pdf {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    background: rgba(34,197,94,0.05);
    border: 1px solid rgba(34,197,94,0.15);
    border-radius: 12px;
  }
  .pdf-icon-wrap {
    width: 40px;
    height: 40px;
    background: rgba(34,197,94,0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .pdf-info { flex: 1; min-width: 0; }
  .pdf-name { font-size: 13.5px; font-weight: 600; color: #4ade80; }
  .pdf-date { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 2px; }
  .pdf-link {
    font-size: 12.5px;
    color: #eab308;
    text-decoration: none;
    padding: 6px 14px;
    border: 1px solid rgba(234,179,8,0.25);
    border-radius: 8px;
    transition: all 0.18s;
    white-space: nowrap;
  }
  .pdf-link:hover { background: rgba(234,179,8,0.08); }

  /* ── SEARCH / TABLE ── */
  .search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }
  .search-input {
    flex: 1;
    padding: 10px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    outline: none;
    transition: all 0.2s;
    min-width: 0;
  }
  .search-input:focus {
    border-color: rgba(234,179,8,0.35);
    background: rgba(234,179,8,0.02);
  }
  .search-input::placeholder { color: rgba(255,255,255,0.2); }

  .btn-sm {
    padding: 9px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: rgba(255,255,255,0.6);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
  }
  .btn-sm:hover {
    background: rgba(234,179,8,0.07);
    border-color: rgba(234,179,8,0.25);
    color: #eab308;
  }

  .table-wrap {
    overflow-x: auto;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.06);
  }
  table { width: 100%; border-collapse: collapse; }
  thead tr {
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  th {
    padding: 12px 18px;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255,255,255,0.35);
    letter-spacing: 1px;
    text-transform: uppercase;
    white-space: nowrap;
  }
  td {
    padding: 13px 18px;
    font-size: 13.5px;
    color: rgba(255,255,255,0.75);
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: rgba(255,255,255,0.02); }
  .td-name { font-weight: 600; color: #fff !important; }
  .td-email { color: rgba(255,255,255,0.45) !important; font-size: 12.5px !important; }
  .td-phone { font-family: monospace; color: #60a5fa !important; font-size: 13px; }
  .td-date { color: rgba(255,255,255,0.3) !important; font-size: 12px !important; }
  .td-num { color: rgba(255,255,255,0.25) !important; font-size: 11.5px !important; }

  .delete-btn {
    padding: 5px 12px;
    background: rgba(239,68,68,0.07);
    border: 1px solid rgba(239,68,68,0.15);
    border-radius: 7px;
    color: #f87171;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.18s;
    font-family: 'DM Sans', sans-serif;
  }
  .delete-btn:hover {
    background: rgba(239,68,68,0.12);
    border-color: rgba(239,68,68,0.3);
  }

  .empty-state {
    text-align: center;
    padding: 48px 20px;
    color: rgba(255,255,255,0.25);
  }
  .empty-icon { font-size: 36px; margin-bottom: 10px; }

  /* ── PAGINATION ── */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 18px;
    font-size: 12.5px;
    color: rgba(255,255,255,0.35);
  }
  .page-btns { display: flex; gap: 6px; }
  .page-btn {
    padding: 6px 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: rgba(255,255,255,0.5);
    cursor: pointer;
    font-size: 12.5px;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.18s;
  }
  .page-btn:hover:not(:disabled) {
    background: rgba(234,179,8,0.08);
    border-color: rgba(234,179,8,0.25);
    color: #eab308;
  }
  .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .page-btn.current {
    background: rgba(234,179,8,0.12);
    border-color: rgba(234,179,8,0.4);
    color: #eab308;
    font-weight: 600;
  }

  /* ── TOAST ── */
  .toast-msg {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 13.5px;
    font-weight: 500;
    animation: fadeInUp 0.35s ease;
    max-width: 320px;
    backdrop-filter: blur(8px);
  }
  .toast-msg.success {
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.25);
    color: #4ade80;
  }
  .toast-msg.error {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.25);
    color: #f87171;
  }

  .spinner {
    width: 15px;
    height: 15px;
    border: 2px solid rgba(0,0,0,0.2);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
    flex-shrink: 0;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 600;
  }
  .badge-green { background: rgba(34,197,94,0.1); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }
  .badge-yellow { background: rgba(234,179,8,0.1); color: #eab308; border: 1px solid rgba(234,179,8,0.2); }

  @media (max-width: 900px) {
    .sidebar { display: none; }
    .main { margin-left: 0; }
    .stats-row { grid-template-columns: 1fr 1fr; }
    .content { padding: 20px 16px; }
    .topbar { padding: 14px 20px; }
  }
  @media (max-width: 600px) {
    .stats-row { grid-template-columns: 1fr; }
  }
`;

function Toast({ msg, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);
    return <div className={`toast-msg ${type}`}>{msg}</div>;
}

export default function AdminDashboard() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [leads, setLeads] = useState([]);
    const [totalLeads, setTotalLeads] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [loadingLeads, setLoadingLeads] = useState(false);
    const [ebookInfo, setEbookInfo] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [toast, setToast] = useState(null);
    const fileRef = useRef();
    const searchTimer = useRef();

    const showToast = (msg, type = 'success') => setToast({ msg, type });

    const fetchLeads = async (p = 1, q = '') => {
        setLoadingLeads(true);
        try {
            const res = await API.get(`/leads?page=${p}&limit=10&search=${q}`);
            setLeads(res.data.leads);
            setTotalLeads(res.data.total);
            setPages(res.data.pages);
            setPage(p);
        } catch { showToast('Failed to load leads', 'error'); }
        finally { setLoadingLeads(false); }
    };

    const fetchEbook = async () => {
        try {
            const res = await API.get('/ebook');
            setEbookInfo(res.data);
        } catch { }
    };

    useEffect(() => {
        fetchLeads();
        fetchEbook();
    }, []);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => fetchLeads(1, val), 500);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setUploadProgress(20);
        const formData = new FormData();
        formData.append('pdf', selectedFile);
        try {
            setUploadProgress(55);
            await API.post('/ebook/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploadProgress(100);
            showToast('✅ PDF সফলভাবে আপলোড হয়েছে!');
            setSelectedFile(null);
            fetchEbook();
        } catch (err) {
            showToast(err.response?.data?.message || 'Upload failed', 'error');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('এই lead টি delete করবেন?')) return;
        try {
            await API.delete(`/leads/${id}`);
            showToast('Lead deleted');
            fetchLeads(page, search);
        } catch { showToast('Delete failed', 'error'); }
    };

    const handleLogout = () => { logout(); navigate('/admin/login'); };

    const exportCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Date'];
        const rows = leads.map(l => [
            l.name, l.email, l.phone,
            new Date(l.createdAt).toLocaleString('en-BD')
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scholarhaat-leads-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('CSV exported!');
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-BD', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    const navItems = [
        { id: 'overview', icon: '📊', label: 'Overview' },
        { id: 'leads', icon: '👥', label: 'Customer Leads' },
        { id: 'ebook', icon: '📄', label: 'E-Book Upload' },
    ];

    const tabTitle = {
        overview: 'Dashboard Overview',
        leads: 'Customer Leads',
        ebook: 'E-Book Management',
    };

    return (
        <>
            <style>{styles}</style>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap" rel="stylesheet" />

            {toast && (
                <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
            )}

            <div className="dash-root">
                {/* ── SIDEBAR ── */}
                <aside className="sidebar">
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-text">Scholar<span>haat</span></div>
                        <div className="sidebar-logo-sub">Admin Panel</div>
                    </div>

                    <nav className="sidebar-nav">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    if (item.id === 'leads') fetchLeads(1, search);
                                }}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <button className="logout-btn" onClick={handleLogout}>
                            <span className="nav-icon">🚪</span>
                            Logout
                        </button>
                    </div>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <main className="main">
                    <div className="topbar">
                        <div className="topbar-title">{tabTitle[activeTab]}</div>
                        <div className="topbar-admin">
                            <span className="admin-dot" />
                            {admin?.email || 'Admin'}
                        </div>
                    </div>

                    <div className="content">

                        {/* ── OVERVIEW TAB ── */}
                        {activeTab === 'overview' && (
                            <>
                                <div className="stats-row">
                                    <div className="stat-card gold" style={{ animationDelay: '0s' }}>
                                        <div className="stat-icon-wrap">👥</div>
                                        <div className="stat-label">Total Leads</div>
                                        <div className="stat-value">{totalLeads}</div>
                                        <div className="stat-sub">E-book downloaders</div>
                                    </div>

                                    <div className="stat-card blue" style={{ animationDelay: '0.08s' }}>
                                        <div className="stat-icon-wrap">📄</div>
                                        <div className="stat-label">E-Book Status</div>
                                        <div className="stat-value">
                                            {ebookInfo?.pdfUrl
                                                ? <span className="badge badge-green">Active</span>
                                                : <span className="badge badge-yellow">Not Set</span>
                                            }
                                        </div>
                                        <div className="stat-sub">
                                            {ebookInfo?.uploadedAt
                                                ? `Updated: ${formatDate(ebookInfo.uploadedAt)}`
                                                : 'No PDF uploaded yet'}
                                        </div>
                                    </div>

                                    <div className="stat-card green" style={{ animationDelay: '0.16s' }}>
                                        <div className="stat-icon-wrap">🚀</div>
                                        <div className="stat-label">Next Course</div>
                                        <div className="stat-value">Coming Soon</div>
                                        <div className="stat-sub">Powerful Public Speaking</div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="section-card">
                                    <div className="section-header">
                                        <div className="section-card-title">⚡ Quick Actions</div>
                                        <div className="section-card-sub">Dashboard থেকে সরাসরি কাজ করুন</div>
                                    </div>
                                    <div className="actions-row">
                                        <button className="action-btn primary" onClick={() => setActiveTab('ebook')}>
                                            📤 PDF Upload করুন
                                        </button>
                                        <button
                                            className="action-btn secondary"
                                            onClick={() => { setActiveTab('leads'); fetchLeads(1, ''); }}
                                        >
                                            👥 Leads দেখুন
                                        </button>
                                        <button className="action-btn outline" onClick={exportCSV}>
                                            📥 CSV Export
                                        </button>
                                    </div>
                                </div>

                                {/* Recent leads preview */}
                                {leads.length > 0 && (
                                    <div className="section-card">
                                        <div className="section-header">
                                            <div className="section-card-title">🕐 সর্বশেষ Leads</div>
                                            <div className="section-card-sub">সবচেয়ে সাম্প্রতিক ৫ জন customer</div>
                                        </div>
                                        <div className="table-wrap">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>নাম</th>
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                        <th>তারিখ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {leads.slice(0, 5).map(l => (
                                                        <tr key={l._id}>
                                                            <td className="td-name">{l.name}</td>
                                                            <td className="td-email">{l.email}</td>
                                                            <td className="td-phone">{l.phone}</td>
                                                            <td className="td-date">{formatDate(l.createdAt)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ── LEADS TAB ── */}
                        {activeTab === 'leads' && (
                            <div className="section-card" style={{ animation: 'fadeInUp 0.4s ease' }}>
                                <div className="section-header">
                                    <div className="section-card-title">👥 সকল Customer Leads</div>
                                    <div className="section-card-sub">E-book ডাউনলোড করা সকল customer-দের তথ্য</div>
                                </div>

                                <div className="search-bar">
                                    <input
                                        className="search-input"
                                        placeholder="নাম, email বা phone দিয়ে খুঁজুন..."
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                    <button className="btn-sm" onClick={exportCSV}>📥 Export</button>
                                    <button className="btn-sm" onClick={() => fetchLeads(1, search)}>🔄 Refresh</button>
                                </div>

                                {loadingLeads ? (
                                    <div className="empty-state">
                                        <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
                                        Loading leads...
                                    </div>
                                ) : leads.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-icon">📭</div>
                                        <div>এখনো কোনো lead নেই</div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="table-wrap">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>নাম</th>
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                        <th>তারিখ</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {leads.map((l, i) => (
                                                        <tr key={l._id}>
                                                            <td className="td-num">{(page - 1) * 10 + i + 1}</td>
                                                            <td className="td-name">{l.name}</td>
                                                            <td className="td-email">{l.email}</td>
                                                            <td className="td-phone">{l.phone}</td>
                                                            <td className="td-date">{formatDate(l.createdAt)}</td>
                                                            <td>
                                                                <button
                                                                    className="delete-btn"
                                                                    onClick={() => handleDelete(l._id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="pagination">
                                            <span>মোট {totalLeads} জন customer</span>
                                            <div className="page-btns">
                                                <button
                                                    className="page-btn"
                                                    disabled={page <= 1}
                                                    onClick={() => fetchLeads(page - 1, search)}
                                                >← Prev</button>
                                                {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
                                                    <button
                                                        key={p}
                                                        className={`page-btn ${p === page ? 'current' : ''}`}
                                                        onClick={() => fetchLeads(p, search)}
                                                    >{p}</button>
                                                ))}
                                                <button
                                                    className="page-btn"
                                                    disabled={page >= pages}
                                                    onClick={() => fetchLeads(page + 1, search)}
                                                >Next →</button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* ── EBOOK TAB ── */}
                        {activeTab === 'ebook' && (
                            <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                                <div className="section-card">
                                    <div className="section-header">
                                        <div className="section-card-title">☁️ PDF আপলোড করুন</div>
                                        <div className="section-card-sub">Cloudinary-তে E-book upload করুন — landing page-এ automatically সংযুক্ত হবে</div>
                                    </div>

                                    <div
                                        className="upload-zone"
                                        onClick={() => fileRef.current?.click()}
                                    >
                                        <input
                                            ref={fileRef}
                                            type="file"
                                            accept="application/pdf"
                                            onChange={e => setSelectedFile(e.target.files[0])}
                                        />
                                        <div className="upload-icon-big">📄</div>
                                        <div className="upload-text">PDF ফাইল এখানে drop করুন অথবা ক্লিক করুন</div>
                                        <div className="upload-hint">শুধুমাত্র PDF • সর্বোচ্চ 50MB</div>
                                    </div>

                                    {selectedFile && (
                                        <div className="upload-selected">
                                            📎 {selectedFile.name}
                                            <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                                                {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                                            </span>
                                        </div>
                                    )}

                                    {uploading && (
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                                        </div>
                                    )}

                                    <div style={{ marginTop: 18 }}>
                                        <button
                                            className="action-btn primary"
                                            onClick={handleUpload}
                                            disabled={!selectedFile || uploading}
                                            style={{ opacity: (!selectedFile || uploading) ? 0.5 : 1, cursor: (!selectedFile || uploading) ? 'not-allowed' : 'pointer' }}
                                        >
                                            {uploading
                                                ? <><span className="spinner" /> Uploading...</>
                                                : '☁️ Cloudinary-তে Upload করুন'
                                            }
                                        </button>
                                    </div>
                                </div>

                                <div className="section-card">
                                    <div className="section-header">
                                        <div className="section-card-title">📌 বর্তমান E-Book</div>
                                        <div className="section-card-sub">Landing page-এ যে PDF দেখাচ্ছে</div>
                                    </div>

                                    {ebookInfo?.pdfUrl ? (
                                        <div className="current-pdf">
                                            <div className="pdf-icon-wrap">📕</div>
                                            <div className="pdf-info">
                                                <div className="pdf-name">PDF সক্রিয় আছে</div>
                                                <div className="pdf-date">
                                                    {ebookInfo.uploadedAt
                                                        ? `আপলোড: ${formatDate(ebookInfo.uploadedAt)}`
                                                        : 'Date unknown'}
                                                </div>
                                            </div>
                                            <a href={ebookInfo.pdfUrl} target="_blank" rel="noreferrer" className="pdf-link">
                                                PDF দেখুন →
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="empty-state" style={{ padding: 28 }}>
                                            <div className="empty-icon">⚠️</div>
                                            <div>এখনো কোনো PDF আপলোড করা হয়নি।</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </>
    );
}