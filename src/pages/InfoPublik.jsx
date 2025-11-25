import React, { useEffect, useState } from 'react';
import { Calendar, User, Trash2, Plus, Edit, X, Save } from 'lucide-react';
import { getAllInfo, createInfo, deleteInfo, updateInfo } from '../services/api';

const InfoPublik = ({ userRole, userName }) => {
  const [news, setNews] = useState([]);
  
  const initialForm = { title: '', content: '', category: 'Umum', date: new Date().toISOString().split('T')[0] };
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const isAdmin = ['rt', 'rw', 'desa', 'admin'].includes(userRole);

  useEffect(() => { loadInfo(); }, []);

  const loadInfo = async () => {
    try {
        const data = await getAllInfo();
        setNews(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

 
  const handleEdit = (item) => {
      setForm(item);        
      setEditId(item.id);   
      setShowForm(true);    
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
      setShowForm(false);
      setEditId(null);
      setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (editId) {
            await updateInfo(editId, { ...form, author: userName });
            alert("Berita berhasil diperbarui!");
        } else {
            await createInfo({ ...form, author: userName });
            alert("Berita berhasil diterbitkan!");
        }
        
        handleCancel();
        loadInfo();  
    } catch (error) {
        console.error(error);
        alert("Gagal menyimpan berita.");
    }
  };

  const handleDelete = async (id) => {
    if(confirm("Yakin ingin menghapus berita ini?")) {
      await deleteInfo(id);
      loadInfo();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
       <div className="flex justify-between items-center">
          <div>
             <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Info & Berita Desa</h2>
             <p className="text-gray-500 text-sm mt-1">Update terbaru seputar kegiatan lingkungan.</p>
          </div>
          {isAdmin && !showForm && (
             <button onClick={() => { handleCancel(); setShowForm(true); }} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-yellow-200 transition transform hover:-translate-y-0.5">
               <Plus size={18} className="mr-2"/> Buat Berita
             </button>
          )}
       </div>

       {showForm && (
         <div className="bg-white p-6 rounded-2xl border border-yellow-200 shadow-lg ring-4 ring-yellow-50 transition-all">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                   {editId ? <><Edit size={20} className="text-blue-500"/> Edit Berita</> : <><Plus size={20} className="text-green-500"/> Tulis Berita Baru</>}
                </h3>
                <button onClick={handleCancel} className="text-gray-400 hover:text-red-500 transition"><X size={24}/></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Judul Berita</label>
                    <input required placeholder="Contoh: Kerja Bakti Minggu Ini" className="w-full border p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-yellow-200 outline-none transition" value={form.title} onChange={e=>setForm({...form, title: e.target.value})}/>
                </div>
                
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Isi Berita</label>
                    <textarea required placeholder="Tulis detail informasi di sini..." className="w-full border p-3 rounded-xl bg-gray-50 h-32 focus:bg-white focus:ring-2 focus:ring-yellow-200 outline-none transition resize-none" value={form.content} onChange={e=>setForm({...form, content: e.target.value})}/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Kategori</label>
                        <select className="w-full border p-3 rounded-xl bg-gray-50 focus:bg-white outline-none cursor-pointer" value={form.category} onChange={e=>setForm({...form, category: e.target.value})}>
                            <option value="Umum">Umum</option>
                            <option value="Kesehatan">Kesehatan</option>
                            <option value="Lingkungan">Lingkungan</option>
                            <option value="Keamanan">Keamanan</option>
                            <option value="Kegiatan">Kegiatan</option>
                        </select>
                   </div>
                   <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tanggal</label>
                        <input required type="date" className="w-full border p-3 rounded-xl bg-gray-50 focus:bg-white outline-none cursor-pointer" value={form.date} onChange={e=>setForm({...form, date: e.target.value})}/>
                   </div>
                </div>
                
                <div className="pt-4 flex gap-3">
                    <button type="button" onClick={handleCancel} className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition">Batal</button>
                    <button type="submit" className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition ${editId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                        <Save size={18}/> {editId ? 'Simpan Perubahan' : 'Publish Berita'}
                    </button>
                </div>
            </form>
         </div>
       )}

       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(item => (
             <div key={item.id} className="flex flex-col h-full bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
                <div className={`h-2 w-full ${item.category === 'Kesehatan' ? 'bg-blue-400' : item.category === 'Lingkungan' ? 'bg-green-400' : item.category === 'Keamanan' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
                
                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-600">
                        {item.category}
                      </span>
                      
                      {isAdmin && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 right-6 bg-white shadow-sm rounded-lg p-1 border border-gray-100">
                           <button onClick={() => handleEdit(item)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition" title="Edit">
                                <Edit size={16}/>
                           </button>
                           <div className="w-px bg-gray-200 my-1"></div>
                           <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Hapus">
                                <Trash2 size={16}/>
                           </button>
                        </div>
                      )}
                   </div>
                   
                   <h3 className="text-xl font-bold mb-3 text-gray-900 leading-tight group-hover:text-yellow-600 transition-colors">
                     {item.title}
                   </h3>
                   <p className="text-sm text-gray-500 mb-6 flex-1 leading-relaxed line-clamp-4">
                     {item.content}
                   </p>
                   
                   <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium">
                      <div className="flex items-center gap-1.5">
                         <Calendar size={14}/> {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                         <User size={14}/> {item.author}
                      </div>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default InfoPublik;