import React, { useState, useEffect } from 'react';
import './App.css';

interface Report {
  id: string;
  classroom: string;
  date: string;
  time: string;
  reporter: string;
  status: 'pending' | 'verified' | 'resolved';
}

function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    classroom: '',
    date: '',
    time: '',
    reporter: ''
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'resolved'>('all');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Load reports from localStorage
    const savedReports = localStorage.getItem('reports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  useEffect(() => {
    // Save reports to localStorage
    if (reports.length > 0) {
      localStorage.setItem('reports', JSON.stringify(reports));
    }
  }, [reports]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: Report = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending'
    };
    setReports([newReport, ...reports]);
    setFormData({ classroom: '', date: '', time: '', reporter: '' });
    setShowForm(false);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const updateStatus = (id: string, status: 'pending' | 'verified' | 'resolved') => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, status } : report
    ));
  };

  const deleteReport = (id: string) => {
    setReports(reports.filter(report => report.id !== id));
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(report => report.status === filter);

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="background-gradient"></div>
      <div className="background-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <h1 className="title">
              <span className="icon">📚</span>
              Laporan Kelas Kosong
            </h1>
            <p className="subtitle">Sistem Pelaporan Kelas Kosong Modern</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <span className="btn-icon">+</span>
            {showForm ? 'Tutup Form' : 'Buat Laporan'}
          </button>
        </header>

        {/* Form */}
        {showForm && (
          <div className="form-container slide-in">
            <form onSubmit={handleSubmit} className="form">
              <h2 className="form-title">Buat Laporan Baru</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="classroom">Kelas</label>
                  <input
                    type="text"
                    id="classroom"
                    placeholder="Contoh: X-IPA 1"
                    value={formData.classroom}
                    onChange={(e) => setFormData({...formData, classroom: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date">Tanggal</label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time">Waktu</label>
                  <input
                    type="time"
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reporter">Pelapor</label>
                  <input
                    type="text"
                    id="reporter"
                    placeholder="Nama Anda"
                    value={formData.reporter}
                    onChange={(e) => setFormData({...formData, reporter: e.target.value})}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-submit">
                <span className="btn-icon">✓</span>
                Submit Laporan
              </button>
            </form>
          </div>
        )}

        {/* Filter */}
        <div className="filter-container">
          <div className="filter-buttons">
            {(['all', 'pending', 'verified', 'resolved'] as const).map((status) => (
              <button
                key={status}
                className={`filter-btn ${filter === status ? 'active' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status === 'all' ? '🔍 Semua' :
                 status === 'pending' ? '⏳ Pending' :
                 status === 'verified' ? '✓ Verified' :
                 '✅ Resolved'}
              </button>
            ))}
          </div>
          <div className="report-count">
            Total: <span>{filteredReports.length}</span> laporan
          </div>
        </div>

        {/* Reports List */}
        <div className="reports-container">
          {filteredReports.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Belum Ada Laporan</h3>
              <p>Klik tombol "Buat Laporan" untuk menambahkan laporan baru</p>
            </div>
          ) : (
            <div className="reports-grid">
              {filteredReports.map((report, index) => (
                <div 
                  key={report.id} 
                  className={`report-card ${isAnimating && index === 0 ? 'pop-in' : 'fade-in'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="report-header">
                    <h3 className="report-classroom">{report.classroom}</h3>
                    <span className={`status-badge status-${report.status}`}>
                      {report.status === 'pending' ? '⏳ Pending' :
                       report.status === 'verified' ? '✓ Verified' :
                       '✅ Resolved'}
                    </span>
                  </div>
                  <div className="report-details">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span>{new Date(report.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🕐</span>
                      <span>{report.time}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">👤</span>
                      <span>{report.reporter}</span>
                    </div>
                  </div>
                  <div className="report-actions">
                    {report.status === 'pending' && (
                      <button 
                        className="btn btn-small btn-verify"
                        onClick={() => updateStatus(report.id, 'verified')}
                      >
                        ✓ Verify
                      </button>
                    )}
                    {report.status === 'verified' && (
                      <button 
                        className="btn btn-small btn-resolve"
                        onClick={() => updateStatus(report.id, 'resolved')}
                      >
                        ✅ Resolve
                      </button>
                    )}
                    <button 
                      className="btn btn-small btn-delete"
                      onClick={() => deleteReport(report.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>© 2025 Laporan Kelas Kosong V2 • Made with ❤️ by arifwbo</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
