import React, { useEffect, useState } from 'react';
import { Send, CheckCircle, Clock, Trash2, MessageSquare, AlertCircle } from 'lucide-react';
import { getAllAspirasi, createAspirasi, updateAspirasiStatus, deleteAspirasi } from '../services/api';

const Aspirasi = ({ userRole, userId, userName }) => {
  const [aspirations, setAspirations] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(false);

  const isWarga = userRole === 'warga';
  const isAdmin = ['rt', 'rw', 'desa', 'admin'].includes(userRole);

  useEffect(() => { loadAspirasi(); }, []);

  const loadAspirasi = async () => {
    try { const data = await getAllAspirasi(); setAspirations(data || []); }
    catch (err) { console.error(err); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    setLoading(true);
    try {
      await createAspirasi({ author_name: userName, content: newContent, user_id: userId });
      setNewContent('');
      loadAspirasi();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateAspirasiStatus(id, newStatus, userId);
    loadAspirasi();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus aspirasi ini?")) {
      try {
        await deleteAspirasi(id, userId);
        loadAspirasi();
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus aspirasi.");
      }
    }
  };

  const pendingCount = aspirations.filter(a => a.status === 'Pending').length;
  const prosesCount = aspirations.filter(a => a.status === 'Proses').length;
  const selesaiCount = aspirations.filter(a => a.status === 'Selesai').length;

  return (
    <div className="space-y-6 animate-fade-in pb-10">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Forum Aspirasi</h2>
          <p className="text-gray-500 text-sm mt-1">Saluran partisipasi warga untuk menyampaikan aspirasi.</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full text-xs font-bold">{pendingCount} Pending</span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold">{prosesCount} Proses</span>
          <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold">{selesaiCount} Selesai</span>
        </div>
      </div>

      <div className={`p-4 sm:p-5 rounded-2xl shadow-sm border-2 transition-all ${isWarga ? 'bg-white border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
        {isWarga ? (
          <form onSubmit={handleSend} className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase">Tulis Aspirasi Anda</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Tulis keluhan, saran, atau masukan untuk lingkungan Anda..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white min-h-[80px] sm:min-h-[60px] resize-none transition"
                rows={2}
              />
              <button
                type="submit"
                disabled={loading || !newContent.trim()}
                className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-yellow-200 transition shrink-0"
              >
                <Send size={18} />
                <span className="hidden sm:inline">Kirim</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-3 text-gray-500 text-sm py-2">
            <AlertCircle size={20} className="text-yellow-500" />
            <span>Anda login sebagai <strong className="text-gray-700">{userRole?.toUpperCase()}</strong>. Kelola status aspirasi warga di bawah.</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {aspirations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-bold text-gray-800">Belum Ada Aspirasi</h3>
            <p className="text-gray-500 text-sm mt-1">Jadilah yang pertama menyampaikan aspirasi!</p>
          </div>
        ) : (
          aspirations.map((item) => (
            <div key={item.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${item.status === 'Selesai' ? 'bg-green-500' : item.status === 'Proses' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}>
                    {item.author_name ? item.author_name[0].toUpperCase() : '?'}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{item.author_name}</div>
                    <div className="text-xs text-gray-400">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Hari ini'}
                    </div>
                  </div>
                </div>

                <span className={`self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit ${item.status === 'Selesai' ? 'bg-green-50 text-green-700 border-green-200' :
                  item.status === 'Proses' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                  {item.status === 'Selesai' ? <CheckCircle size={12} /> : item.status === 'Proses' ? <Clock size={12} /> : <AlertCircle size={12} />}
                  {item.status}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl text-sm sm:text-base">
                {item.content}
              </p>

              {isAdmin && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(item.id, 'Proses')}
                    className={`text-xs flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition ${item.status === 'Proses'
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                      }`}
                  >
                    <Clock size={14} /> Proses
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, 'Selesai')}
                    className={`text-xs flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition ${item.status === 'Selesai'
                      ? 'bg-green-500 text-white'
                      : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                      }`}
                  >
                    <CheckCircle size={14} /> Selesai
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition ml-auto"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Aspirasi;