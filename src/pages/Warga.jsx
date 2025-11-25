import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, Filter, ArrowUpDown, User, ChevronRight, Save, X, Shield } from 'lucide-react';
import { getWargaList, createWarga, deleteWarga, updateWarga } from '../services/api';

const Warga = ({ user, initialSearch }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');
  const [filterRW, setFilterRW] = useState('All'); 
  const [filterRT, setFilterRT] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'nama', direction: 'asc' });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null); 
  
  const initialForm = { nik: '', nama: '', rt: '', rw: '05', jenis_kelamin: 'L', status_hunian: 'Tetap' };
  const [formData, setFormData] = useState(initialForm);

  const userRole = user?.role;
  const canCreate = ['admin', 'desa', 'rw', 'rt'].includes(userRole);
  const canEdit = ['admin', 'desa', 'rw', 'rt'].includes(userRole);
  const canDelete = ['admin', 'desa', 'rw', 'rt'].includes(userRole);

  useEffect(() => { 
      if (user) loadData(); 
  }, [user]);

  useEffect(() => {
      if (initialSearch) setSearchTerm(initialSearch);
  }, [initialSearch]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getWargaList(user);
      setData(Array.isArray(result) ? result : []);
    } catch (err) { console.error(err); setData([]); } 
    finally { setLoading(false); }
  };


  const handleEdit = (item) => {
      setFormData(item);
      setEditId(item.id);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
      setShowForm(false);
      setEditId(null);
      setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (editId) {
            await updateWarga(editId, formData, user);
            alert("Data berhasil diperbarui!");
        } else {
            await createWarga(formData, user);
            alert("Data berhasil ditambahkan!");
        }
        
        handleCancel();
        loadData();
    } catch (error) { 
        console.error(error);
        alert(error.response?.data?.message || "Gagal menyimpan data."); 
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Yakin ingin menghapus data warga ini?")) { 
        try {
            await deleteWarga(id, user); 
            loadData();
            alert("Data berhasil dihapus.");
        } catch (error) {
            alert(error.response?.data?.message || "Gagal menghapus data.");
        }
    }
  };

  const isMyCitizen = (item) => {
      if (!user) return false;
      
      if (['admin', 'desa'].includes(user?.role)) return true;

      const itemRT = Number(item.rt);
      const itemRW = Number(item.rw);
      const userRT = Number(user.rt_scope);
      const userRW = Number(user.rw_scope);
      
      if (user?.role === 'rw') {
          return itemRW === userRW;
      }
      
      if (user?.role === 'rt') {
          return itemRT === userRT && itemRW === userRW;
      }
      
      return false;
  };

  const processedData = useMemo(() => {
    let filtered = [...data];
    if (filterRW !== 'All') {
      filtered = filtered.filter(item => item.rw === filterRW);
      if (filterRT !== 'All') filtered = filtered.filter(item => item.rt === filterRT);
    }
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(item => item.nama.toLowerCase().includes(lowerTerm) || item.nik.includes(lowerTerm));
    }
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [data, filterRW, filterRT, searchTerm, sortConfig]);

  const uniqueRWs = ['All', ...new Set(data.map(item => item.rw))].sort();
  const availableRTs = useMemo(() => {
      if (filterRW === 'All') return [];
      const rwData = data.filter(item => item.rw === filterRW);
      return ['All', ...new Set(rwData.map(item => item.rt))].sort();
  }, [data, filterRW]);

  const handleRWChange = (rw) => { setFilterRW(rw); setFilterRT('All'); };
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
       
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Data Kependudukan</h2>
            <div className="flex items-center text-sm text-gray-500 mt-1 gap-2">
                <span>Desa</span>
                {filterRW !== 'All' && <><ChevronRight size={14}/> <span>RW {filterRW}</span></>}
                {filterRT !== 'All' && <><ChevronRight size={14}/> <span>RT {filterRT}</span></>}
            </div>
          </div>
          {canCreate && !showForm && (
             <button onClick={() => { setEditId(null); setFormData(initialForm); setShowForm(true); }} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-yellow-200 transition">
               <Plus size={18} className="mr-2"/> Tambah Warga
             </button>
          )}
       </div>
       <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-50">
             <span className="text-xs font-bold text-gray-400 uppercase mr-2">Wilayah:</span>
             {uniqueRWs.map(rw => (
               <button key={rw} onClick={() => handleRWChange(rw)} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${filterRW === rw ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                 {rw === 'All' ? 'Semua RW' : `RW ${rw}`}
               </button>
             ))}
          </div>
          
          {filterRW !== 'All' && (
              <div className="flex items-center gap-2 animate-fade-in">
                  <span className="text-xs font-bold text-gray-400 uppercase mr-2">Lingkungan:</span>
                  {availableRTs.map(rt => (
                    <button key={rt} onClick={() => setFilterRT(rt)} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filterRT === rt ? 'bg-yellow-400 text-black shadow-sm' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'}`}>
                        {rt === 'All' ? 'Semua RT' : `RT ${rt}`}
                    </button>
                  ))}
              </div>
          )}
          
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
             <input 
               type="text" 
               placeholder="Cari Nama atau NIK warga..." 
               value={searchTerm} 
               onChange={(e) => setSearchTerm(e.target.value)} 
               className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition text-sm font-medium"
             />
          </div>
       </div>

       {showForm && (
         <div className="bg-white p-6 rounded-2xl border border-yellow-200 shadow-lg ring-4 ring-yellow-50 transition-all">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                   {editId ? <><Edit size={20} className="text-blue-500"/> Edit Data Warga</> : <><User size={20} className="text-green-500"/> Input Data Baru</>}
                </h3>
                <button onClick={handleCancel} className="text-gray-400 hover:text-red-500"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500">NIK</label>
                    <input required className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-200" value={formData.nik} onChange={e=>setFormData({...formData, nik: e.target.value})} placeholder="16 Digit" disabled={!!editId} /> 
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500">Nama Lengkap</label>
                    <input required className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-200" value={formData.nama} onChange={e=>setFormData({...formData, nama: e.target.value})} placeholder="Sesuai KTP"/>
                </div>
                <div className="flex gap-2">
                    <div className="w-1/2">
                        <label className="text-xs font-bold text-gray-500">RT</label>
                        <input 
                            required 
                            disabled={userRole === 'rt'}
                            className={`w-full border p-3 rounded-lg ${userRole === 'rt' ? 'bg-gray-200 text-gray-500' : 'bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-200'}`}
                            value={userRole === 'rt' ? user.rt_scope : formData.rt} 
                            onChange={e=>setFormData({...formData, rt: e.target.value})} 
                            placeholder="001"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="text-xs font-bold text-gray-500">RW</label>
                        <input 
                            required 
                            disabled={['rt', 'rw'].includes(userRole)}
                            className={`w-full border p-3 rounded-lg ${['rt', 'rw'].includes(userRole) ? 'bg-gray-200 text-gray-500' : 'bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-200'}`}
                            value={['rt', 'rw'].includes(userRole) ? user.rw_scope : formData.rw} 
                            onChange={e=>setFormData({...formData, rw: e.target.value})} 
                            placeholder="005"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500">Jenis Kelamin</label>
                    <select className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-200" value={formData.jenis_kelamin} onChange={e=>setFormData({...formData, jenis_kelamin: e.target.value})}>
                        <option value="L">Laki-laki</option><option value="P">Perempuan</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-500">Status Hunian</label>
                    <select className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-200" value={formData.status_hunian} onChange={e=>setFormData({...formData, status_hunian: e.target.value})}>
                        <option value="Tetap">Warga Tetap</option><option value="Kontrak">Kontrak</option><option value="Sementara">Sementara</option>
                    </select>
                </div>
                
                <div className="md:col-span-2 flex gap-3 pt-2">
                    <button type="button" onClick={handleCancel} className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition">Batal</button>
                    <button type="submit" className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition ${editId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                        <Save size={18}/> {editId ? 'Simpan Perubahan' : 'Simpan Data Baru'}
                    </button>
                </div>
            </form>
         </div>
       )}

       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
             <div className="p-12 text-center text-gray-400">Memuat data...</div>
          ) : processedData.length === 0 ? (
             <div className="p-16 text-center">
                <Filter className="mx-auto text-gray-300 mb-2 w-12 h-12"/>
                <h3 className="font-bold text-gray-800">Data Kosong</h3>
                <p className="text-gray-500 text-sm mt-1">Tidak ada warga ditemukan di filter ini.</p>
             </div>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                           <SortableHeader label="NIK" field="nik" sortConfig={sortConfig} requestSort={requestSort} />
                           <SortableHeader label="Nama" field="nama" sortConfig={sortConfig} requestSort={requestSort} />
                           <SortableHeader label="Lokasi" field="rt" sortConfig={sortConfig} requestSort={requestSort} />
                           <th className="p-5">Gender</th>
                           <th className="p-5">Status</th>
                           <th className="p-5 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {processedData.map((item) => {
                            const hasAccess = isMyCitizen(item);

                            return (
                                <tr key={item.id} className={`transition-colors group ${hasAccess ? 'hover:bg-yellow-50/30' : 'bg-gray-50/20 opacity-80'}`}>
                                    <td className="p-5 font-mono text-sm text-gray-600">{item.nik}</td>
                                    <td className="p-5 font-bold text-gray-800">{item.nama}</td>
                                    <td className="p-5 text-sm">
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-bold mr-1">RT {item.rt}</span>
                                        <span className="text-gray-400">RW {item.rw}</span>
                                    </td>
                                    <td className="p-5 text-sm">{item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                    <td className="p-5">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.status_hunian === 'Tetap' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {item.status_hunian}
                                        </span>
                                    </td>
                                    <td className="p-5 flex justify-end gap-2">
                                        {hasAccess ? (
                                            <>
                                                {canEdit && (
                                                    <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit Data">
                                                        <Edit size={18}/>
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus Data">
                                                        <Trash2 size={18}/>
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic py-2 px-2 flex items-center gap-1">
                                                <Shield size={12}/> Read Only
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
             </div>
          )}
          
          <div className="p-4 bg-gray-50 text-xs text-gray-500 border-t border-gray-100 flex justify-between">
             <span>Menampilkan {processedData.length} data</span>
             <span>Filter Aktif: {filterRW === 'All' ? 'Semua Wilayah' : `RW ${filterRW}`}</span>
          </div>
       </div>
    </div>
  );
};

const SortableHeader = ({ label, field, sortConfig, requestSort }) => (
  <th className="p-5 cursor-pointer hover:text-gray-800 transition select-none" onClick={() => requestSort(field)}>
    <div className="flex items-center gap-1">
      {label} <ArrowUpDown size={12} className={sortConfig.key === field ? 'text-yellow-500' : 'text-gray-300'}/>
    </div>
  </th>
);

export default Warga;