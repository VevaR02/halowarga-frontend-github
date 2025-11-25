import React, { useEffect, useState } from 'react';
import { Send, CheckCircle, Clock } from 'lucide-react';
import { getAllAspirasi, createAspirasi, updateAspirasiStatus, deleteAspirasi } from '../services/api';

const Aspirasi = ({ userRole, userId, userName }) => {
  const [aspirations, setAspirations] = useState([]);
  const [newContent, setNewContent] = useState('');
  
  const isWarga = userRole === 'warga';

  useEffect(() => { loadAspirasi(); }, []);

  const loadAspirasi = async () => {
    try { const data = await getAllAspirasi(); setAspirations(data); } 
    catch (err) { console.error(err); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if(!newContent.trim()) return;
    await createAspirasi({ author_name: userName, content: newContent, user_id: userId });
    setNewContent('');
    loadAspirasi();
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateAspirasiStatus(id, newStatus, userId);
    loadAspirasi();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus aspirasi ini? Tindakan ini akan dicatat di Audit Log.")) {
        try {
            await deleteAspirasi(id, userId);
            loadAspirasi();
            alert("Aspirasi berhasil dihapus.");
        } catch (error) {
            console.error(error);
            alert("Gagal menghapus aspirasi.");
        }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Forum Aspirasi</h2>
        <p className="text-gray-500 text-sm">Saluran partisipasi warga.</p>
      </div>

      <div className={`p-4 rounded-xl shadow-sm border flex gap-3 ${isWarga ? 'bg-white' : 'bg-gray-100 opacity-70'}`}>
         {isWarga ? (
           <>
             <input 
               value={newContent}
               onChange={(e) => setNewContent(e.target.value)}
               placeholder="Tulis keluhan/saran Anda di sini..." 
               className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
             />
             <button onClick={handleSend} className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 rounded-lg font-bold flex items-center">
               <Send size={18} className="mr-2"/> Kirim
             </button>
           </>
         ) : (
           <div className="w-full text-center text-gray-500 text-sm italic py-2">
             Login sebagai Pengurus. Silakan kelola status aspirasi warga di bawah.
           </div>
         )}
      </div>

      <div className="grid gap-4">
        {aspirations.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl border shadow-sm relative">
             <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                     {item.author_name ? item.author_name[0] : '?'}
                   </div>
                   <div>
                      <div className="font-bold text-sm">{item.author_name}</div>
                      <div className="text-xs text-gray-400">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Hari ini'}
                      </div>
                   </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border 
                  ${item.status === 'Selesai' ? 'bg-green-100 text-green-700 border-green-200' : 
                    item.status === 'Proses' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                    'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                  {item.status}
                </span>
             </div>
             
             <p className="text-gray-700 mt-2 ml-10 mb-4">{item.content}</p>
              {['rt', 'rw', 'desa', 'admin'].includes(userRole) && (
               <div className="mt-4 ml-10 flex gap-2 pt-3 border-t border-gray-100">
                  <button onClick={() => handleStatusChange(item.id, 'Proses')} className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 border border-blue-200">
                    <Clock size={12}/> Proses
                  </button>
                  <button onClick={() => handleStatusChange(item.id, 'Selesai')} className="text-xs flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100 border border-green-200">
                    <CheckCircle size={12}/> Selesai
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs flex items-center gap-1 text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition">
                    <Trash2 size={14}/> Hapus
                  </button>
               </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Aspirasi;