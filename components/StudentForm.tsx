import React, { useState, useEffect } from 'react';
import { mockService } from '../services/mockService';
import { FormData, Teacher, ClassRoom } from '../types';
import { 
  BookOpen, 
  Users, 
  Clock, 
  FileText, 
  Camera, 
  CheckCircle, 
  AlertCircle,
  X,
  Search
} from 'lucide-react';

interface StudentFormProps {
  onBack: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onBack }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchTeacher, setSearchTeacher] = useState('');
  const [inputCode, setInputCode] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    kelas: '',
    guru: '',
    waktu: '',
    keterangan: '',
    foto: null,
  });

  const [errors, setErrors] = useState({
    kelas: '',
    guru: '',
    waktu: '',
    keterangan: '',
    foto: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [teachersData, classesData] = await Promise.all([
        mockService.getTeachers(),
        mockService.getClasses(),
      ]);
      setTeachers(teachersData);
      setClasses(classesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setInputCode(code);
    
    const matchedClass = classes.find(c => c.kode === code);
    if (matchedClass) {
      setFormData(prev => ({ ...prev, kelas: matchedClass.nama }));
      setErrors(prev => ({ ...prev, kelas: '' }));
    } else if (code === '') {
      setFormData(prev => ({ ...prev, kelas: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, foto: 'Ukuran file maksimal 5MB' }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, foto: 'File harus berupa gambar' }));
        return;
      }
      setFormData(prev => ({ ...prev, foto: file }));
      setErrors(prev => ({ ...prev, foto: '' }));
    }
  };

  const filteredTeachers = teachers.filter(t =>
    t.nama.toLowerCase().includes(searchTeacher.toLowerCase()) ||
    t.mapel.toLowerCase().includes(searchTeacher.toLowerCase())
  );

  const validateForm = (): boolean => {
    const newErrors = {
      kelas: formData.kelas ? '' : 'Kelas harus diisi',
      guru: formData.guru ? '' : 'Guru harus dipilih',
      waktu: formData.waktu ? '' : 'Waktu harus diisi',
      keterangan: formData.keterangan.trim() ? '' : 'Keterangan harus diisi',
      foto: formData.foto ? '' : 'Foto harus dilampirkan',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await mockService.submitReport(formData);
      setShowSuccessModal(true);
      // Reset form
      setFormData({
        kelas: '',
        guru: '',
        waktu: '',
        keterangan: '',
        foto: null,
      });
      setInputCode('');
      setSearchTeacher('');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Gagal mengirim laporan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  Laporan Kelas Kosong
                </h1>
                <p className="text-slate-600">Laporkan kelas yang tidak ada guru</p>
              </div>
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            {/* Input Kode Kelas */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Kode Kelas
              </label>
              <input
                type="text"
                value={inputCode}
                onChange={handleCodeChange}
                placeholder="Masukkan kode kelas (contoh: 0091)"
                className="w-full pl-4 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
              {/* Class Indicator */}
              <div className={`mt-2 p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${formData.kelas ? 'bg-primary/5 border-primary/20' : 'bg-slate-50 border-slate-200'}`}>
                {formData.kelas ? (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-slate-800">{formData.kelas}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">Masukkan kode untuk memilih kelas</span>
                  </div>
                )}
              </div>
              {errors.kelas && (
                <p className="mt-2 text-sm text-red-600">{errors.kelas}</p>
              )}
            </div>

            {/* Input Guru Mata Pelajaran */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Guru Mata Pelajaran
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTeacher}
                  onChange={(e) => setSearchTeacher(e.target.value)}
                  placeholder="Cari nama guru atau mata pelajaran..."
                  className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
              </div>
              
              {searchTeacher && (
                <div className="mt-2 max-h-60 overflow-y-auto border border-slate-200 rounded-xl bg-white shadow-lg">
                  {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher) => (
                      <button
                        key={teacher.id}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, guru: teacher.nama }));
                          setSearchTeacher(teacher.nama);
                          setErrors(prev => ({ ...prev, guru: '' }));
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors border-b border-slate-100 last:border-0"
                      >
                        <div className="font-medium text-slate-800">{teacher.nama}</div>
                        <div className="text-sm text-slate-600">{teacher.mapel}</div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-slate-500 text-sm">
                      Guru tidak ditemukan
                    </div>
                  )}
                </div>
              )}
              {errors.guru && (
                <p className="mt-2 text-sm text-red-600">{errors.guru}</p>
              )}
            </div>

            {/* Waktu */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Jam Ke-
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['1 - 2', '3 - 4', '5 - 6', '7 - 8'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, waktu: time }));
                      setErrors(prev => ({ ...prev, waktu: '' }));
                    }}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      formData.waktu === time
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              {errors.waktu && (
                <p className="mt-2 text-sm text-red-600">{errors.waktu}</p>
              )}
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Keterangan
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <textarea
                  value={formData.keterangan}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, keterangan: e.target.value }));
                    setErrors(prev => ({ ...prev, keterangan: '' }));
                  }}
                  placeholder="Jelaskan kondisi kelas kosong (contoh: Guru tidak hadir, hanya memberikan tugas, dll.)"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none min-h-[120px]"
                />
              </div>
              {errors.keterangan && (
                <p className="mt-2 text-sm text-red-600">{errors.keterangan}</p>
              )}
            </div>

            {/* Upload Foto */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Camera className="w-4 h-4 inline mr-2" />
                Foto Bukti
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="foto-input"
                />
                <label
                  htmlFor="foto-input"
                  className="block w-full p-6 border-2 border-dashed border-slate-300 rounded-xl text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                >
                  {formData.foto ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">{formData.foto.name}</span>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      <p className="text-slate-600">Klik untuk upload foto</p>
                      <p className="text-sm text-slate-500 mt-1">Maksimal 5MB</p>
                    </>
                  )}
                </label>
              </div>
              {errors.foto && (
                <p className="mt-2 text-sm text-red-600">{errors.foto}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Kirim Laporan</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Laporan Berhasil Dikirim!</h2>
            <p className="text-slate-600 mb-6">
              Terima kasih atas laporannya. Admin akan segera memverifikasi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-3 px-6 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
              >
                Buat Laporan Lagi
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-3 px-6 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentForm;
