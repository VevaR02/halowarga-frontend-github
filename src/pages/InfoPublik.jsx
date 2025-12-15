import React, { useEffect, useState } from 'react';
import { Calendar, User, Trash2, Plus, Edit, X, Save, ArrowRight, Newspaper } from 'lucide-react';
import { getAllInfo, createInfo, deleteInfo, updateInfo } from '../services/api';

const InfoPublik = ({ userRole, userName, onViewDetail }) => {
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
      if (confirm("Yakin ingin menghapus berita ini?")) {
         await deleteInfo(id);
         loadInfo();
      }
   };

   const getCategoryColor = (category) => {
      const colors = {
         'Kesehatan': 'bg-blue-500',
         'Lingkungan': 'bg-green-500',
         'Keamanan': 'bg-red-500',
         'Kegiatan': 'bg-orange-500',
         'Umum': 'bg-yellow-500'
      };
      return colors[category] || 'bg-gray-500';
   };

   return (
      <div className="space-y-6 animate-fade-in pb-10">

         {/* Header - Responsive */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
               <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Info & Berita</h2>
               <p className="text-gray-500 text-sm mt-1">Update terbaru seputar kegiatan lingkungan.</p>
            </div>
            {isAdmin && !showForm && (
               <button
                  onClick={() => { handleCancel(); setShowForm(true); }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 sm:px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-yellow-200 transition text-sm"
               >
                  <Plus size={18} className="mr-2" /> Buat Berita
               </button>
            )}
         </div>

         {/* Form - Responsive */}
         {showForm && (
            <div className="bg-white p-4 sm:p-6 rounded-2xl border-2 border-yellow-200 shadow-lg">
               <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                     {editId ? <><Edit size={20} className="text-blue-500" /> Edit Berita</> : <><Plus size={20} className="text-green-500" /> Tulis Berita</>}
                  </h3>
                  <button onClick={handleCancel} className="text-gray-400 hover:text-red-500 p-1"><X size={24} /></button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Judul Berita</label>
                     <input
                        required
                        placeholder="Contoh: Kerja Bakti Minggu Ini"
                        className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 outline-none transition"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                     />
                  </div>

                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Isi Berita</label>
                     <textarea
                        required
                        placeholder="Tulis detail informasi di sini..."
                        className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 h-32 focus:bg-white focus:ring-2 focus:ring-yellow-300 outline-none transition resize-none"
                        value={form.content}
                        onChange={e => setForm({ ...form, content: e.target.value })}
                     />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Kategori</label>
                        <select
                           className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white outline-none cursor-pointer"
                           value={form.category}
                           onChange={e => setForm({ ...form, category: e.target.value })}
                        >
                           <option value="Umum">Umum</option>
                           <option value="Kesehatan">Kesehatan</option>
                           <option value="Lingkungan">Lingkungan</option>
                           <option value="Keamanan">Keamanan</option>
                           <option value="Kegiatan">Kegiatan</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tanggal</label>
                        <input
                           required
                           type="date"
                           className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white outline-none cursor-pointer"
                           value={form.date}
                           onChange={e => setForm({ ...form, date: e.target.value })}
                        />
                     </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                     <button type="button" onClick={handleCancel} className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition">
                        Batal
                     </button>
                     <button type="submit" className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition ${editId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                        <Save size={18} /> {editId ? 'Simpan' : 'Publish'}
                     </button>
                  </div>
               </form>
            </div>
         )}

         {/* News Grid - Responsive */}
         {news.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
               <Newspaper size={48} className="mx-auto text-gray-300 mb-3" />
               <h3 className="font-bold text-gray-800">Belum Ada Berita</h3>
               <p className="text-gray-500 text-sm mt-1">Berita yang dipublikasikan akan muncul di sini.</p>
            </div>
         ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
               {news.map(item => (
                  <div key={item.id} className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                     {/* Category Bar */}
                     <div className={`h-1.5 w-full ${getCategoryColor(item.category)}`}></div>

                     <div className="p-4 sm:p-5 flex-1 flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                           <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider text-white ${getCategoryColor(item.category)}`}>
                              {item.category}
                           </span>

                           {isAdmin && (
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => handleEdit(item)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition">
                                    <Edit size={14} />
                                 </button>
                                 <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition">
                                    <Trash2 size={14} />
                                 </button>
                              </div>
                           )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-900 leading-tight group-hover:text-yellow-600 transition-colors line-clamp-2">
                           {item.title}
                        </h3>

                        {/* Content Preview */}
                        <p className="text-sm text-gray-500 mb-4 flex-1 leading-relaxed line-clamp-2">
                           {item.content}
                        </p>

                        {/* CTA Button */}
                        <button
                           onClick={() => onViewDetail && onViewDetail(item)}
                           className="w-full py-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all group/btn"
                        >
                           Baca Selengkapnya
                           <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>

                        {/* Meta */}
                        <div className="pt-3 mt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                           <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                           </div>
                           <div className="flex items-center gap-1 truncate max-w-[100px]">
                              <User size={12} />
                              <span className="truncate">{item.author}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default InfoPublik;