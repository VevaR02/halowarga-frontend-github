import React, { useEffect, useState } from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getAllKas, createKas, deleteKas } from '../services/api';
import axios from 'axios';

const Finance = ({ userRole }) => {
  const [transaksi, setTransaksi] = useState([]);
  const [chartData, setChartData] = useState([]); 
  const [saldo, setSaldo] = useState(0);
  const [pemasukan, setPemasukan] = useState(0);
  const [pengeluaran, setPengeluaran] = useState(0);
  
  const [form, setForm] = useState({ type: 'in', amount: '', description: '', date: '' });
  const isStaff = ['rt', 'rw', 'desa', 'admin'].includes(userRole);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
        const data = await getAllKas();
        setTransaksi(data || []);

        const totalMasuk = data.reduce((acc, curr) => curr.type === 'in' ? acc + Number(curr.amount) : acc, 0);
        const totalKeluar = data.reduce((acc, curr) => curr.type === 'out' ? acc + Number(curr.amount) : acc, 0);
        
        setPemasukan(totalMasuk);
        setPengeluaran(totalKeluar);
        setSaldo(totalMasuk - totalKeluar);

        const chartRes = await axios.get('http://localhost:5000/api/kas/chart');
        if(chartRes.data.success) {
            console.log("Data Grafik:", chartRes.data.data);
            setChartData(chartRes.data.data);
        }
    } catch (err) {
        console.error("Gagal load data keuangan:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!isStaff) return;
    try {
        await createKas(form);
        setForm({ type: 'in', amount: '', description: '', date: '' }); 
        alert("Transaksi berhasil disimpan!");
        loadData();
    } catch (error) {
        alert("Gagal menyimpan transaksi");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Hapus data ini?")) {
        await deleteKas(id);
        loadData();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      <div>
         <h2 className="text-3xl font-bold text-gray-800 mb-6">Laporan Keuangan</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Pemasukan (Debit)" value={pemasukan} color="text-green-600" bg="bg-green-50" />
            <StatCard label="Pengeluaran (Kredit)" value={pengeluaran} color="text-yellow-600" bg="bg-yellow-50" />
            <StatCard label="Sisa Saldo" value={saldo} color="text-blue-600" bg="bg-blue-50" />
         </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
         <h3 className="font-bold text-lg mb-6 text-gray-800">Arus Kas Bulanan (Tahun Ini)</h3>
         <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} barGap={10}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                    formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="masuk" name="Pemasukan" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="keluar" name="Pengeluaran" fill="#eab308" radius={[4, 4, 0, 0]} barSize={30} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Riwayat Transaksi Terakhir</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {transaksi.length > 0 ? transaksi.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 border border-gray-50 rounded-xl hover:bg-gray-50 transition">
                        <div>
                            <p className="font-bold text-gray-800">{item.description}</p>
                            <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="text-right">
                            <p className={`font-bold ${item.type === 'in' ? 'text-green-600' : 'text-red-500'}`}>
                                {item.type === 'in' ? '+' : '-'} Rp {Number(item.amount).toLocaleString('id-ID')}
                            </p>
                            {isStaff && (
                                <button onClick={() => handleDelete(item.id)} className="text-xs text-red-400 hover:text-red-600 underline mt-1">Hapus</button>
                            )}
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-400 py-4">Belum ada data transaksi.</p>
                )}
            </div>
         </div>

         {isStaff && (
             <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg h-fit">
                <h3 className="font-bold mb-4 text-lg">Catat Transaksi Baru</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold">Tipe</label>
                        <select className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-yellow-400" 
                            value={form.type} onChange={e=>setForm({...form, type: e.target.value})}>
                            <option value="in">Pemasukan (+)</option>
                            <option value="out">Pengeluaran (-)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold">Jumlah (Rp)</label>
                        <input type="number" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-yellow-400" 
                            value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})} required placeholder="0" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold">Keterangan</label>
                        <input type="text" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-yellow-400" 
                            value={form.description} onChange={e=>setForm({...form, description: e.target.value})} required placeholder="Contoh: Iuran Warga" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold">Tanggal</label>
                        <input type="date" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-yellow-400" 
                            value={form.date} onChange={e=>setForm({...form, date: e.target.value})} required />
                    </div>
                    <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition mt-2">
                        Simpan Data
                    </button>
                </form>
             </div>
         )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, bg }) => (
    <div className={`p-6 rounded-2xl border border-gray-100 shadow-sm ${bg}`}>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        <h3 className={`text-2xl font-black ${color}`}>Rp {value.toLocaleString('id-ID')}</h3>
    </div>
);

export default Finance;