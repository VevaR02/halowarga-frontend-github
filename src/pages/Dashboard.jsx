import React, { useEffect, useState } from 'react';
import { Users, DollarSign, MessageSquare, Bell, Filter } from 'lucide-react';
import { getDashboardStats } from '../services/api';

const Dashboard = ({ userRole }) => {
  const [stats, setStats] = useState({ total_warga: 0, saldo_kas: 0, aspirasi_pending: 0 });
  const [chartData, setChartData] = useState([]);
  const [rwList, setRwList] = useState([]); 
  const [selectedRW, setSelectedRW] = useState('All'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getDashboardStats(selectedRW);
        
        if(res.success) {
           setStats(res.stats);
           setChartData(Array.isArray(res.chart) ? res.chart : []);
           
           if (res.rw_list && rwList.length === 0) {
               setRwList(res.rw_list);
           }
        }
      } catch (error) {
        console.error("Gagal load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedRW]); 

  const normalizeData = (item) => {
      const val = Number(item.value || item.count || 0);
      const label = item.label || "?";
      return { val, label };
  };

  const values = chartData.map(d => normalizeData(d).val);
  const maxChartValue = values.length > 0 ? Math.max(...values, 5) : 10;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard title="Total Warga" value={stats.total_warga} icon={Users} color="bg-blue-500" />
         <StatCard title="Saldo Kas" value={`Rp ${stats.saldo_kas.toLocaleString('id-ID')}`} icon={DollarSign} color="bg-emerald-500" />
         <StatCard title="Aspirasi Pending" value={stats.aspirasi_pending} icon={MessageSquare} color="bg-orange-500" />
         <StatCard title="Info Publik" value="Aktif" icon={Bell} color="bg-purple-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         
         <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
               <div>
                   <h3 className="font-bold text-xl text-gray-900">
                       {selectedRW === 'All' ? 'Populasi per RW' : `Detail Populasi RW ${selectedRW}`}
                   </h3>
                   <p className="text-sm text-gray-500 mt-1">
                       {selectedRW === 'All' 
                         ? 'Menampilkan perbandingan jumlah warga antar RW.' 
                         : 'Menampilkan sebaran warga di setiap RT.'}
                   </p>
               </div>
               
               <div className="relative">
                   <select 
                       value={selectedRW} 
                       onChange={(e) => setSelectedRW(e.target.value)}
                       className="appearance-none bg-yellow-50 border border-yellow-200 text-yellow-800 font-bold py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer text-sm hover:bg-yellow-100 transition"
                   >
                       <option value="All">Semua RW (Desa)</option>
                       {rwList.map(rw => (
                           <option key={rw} value={rw}>RW {rw}</option>
                       ))}
                   </select>
                   <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-600 pointer-events-none"/>
               </div>
            </div>
            
            <div className="h-64 flex items-end gap-6 px-4 pb-4 border-b border-gray-100 relative">
               {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 text-gray-400 text-sm">
                      Memuat data...
                  </div>
               ) : chartData.length > 0 ? (
                  chartData.map((item, i) => {
                     const { val, label } = normalizeData(item);
                     const heightPct = (val / maxChartValue) * 100;
                     
                     return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer h-full justify-end">
                           <div 
                              className="w-full bg-yellow-400 rounded-t-xl group-hover:bg-yellow-500 transition-all relative flex justify-center shadow-sm"
                              style={{ height: `${Math.max(heightPct, 5)}%` }} 
                           >
                              <div className="absolute -top-10 bg-gray-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0 z-10 shadow-xl whitespace-nowrap">
                                 {val} Warga
                              </div>
                           </div>
                           <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                               {selectedRW === 'All' ? `RW ${label}` : `RT ${label}`}
                           </span>
                        </div>
                     );
                  })
               ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                    <p>Belum ada data warga.</p>
                  </div>
               )}
            </div>
         </div>

         <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-fit">
            <h3 className="font-bold text-lg text-gray-900 mb-6">Informasi</h3>
            <div className="space-y-6">
                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                        <Users size={20}/>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-gray-800">Mode Tampilan</h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {selectedRW === 'All' 
                                ? "Grafik menampilkan total populasi masing-masing RW." 
                                : `Grafik menampilkan detail populasi per RT di wilayah RW ${selectedRW}.`
                            }
                        </p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-500">
                    <strong>Tips:</strong> Gunakan filter di atas grafik untuk berpindah antara tampilan Desa dan RW spesifik.
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-default">
    <div className="flex justify-between items-start mb-4">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-100 transition-transform group-hover:scale-110 ${color}`}>
         <Icon size={22} strokeWidth={2.5} />
       </div>
    </div>
    <div>
      <h4 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h4>
      <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-wide">{title}</p>
    </div>
  </div>
);

export default Dashboard;