import React, { useEffect, useState } from 'react';
import { Users, DollarSign, MessageSquare, Bell, Filter, TrendingUp, ArrowRight } from 'lucide-react';
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

        if (res.success) {
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
    <div className="space-y-6 animate-fade-in pb-6">

      <div className="bg-gradient-to-br from-yellow-400 via-yellow-400 to-orange-400 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black">Selamat Datang! 👋</h1>
          <p className="text-sm sm:text-base text-gray-800 mt-2 max-w-lg">
            Kelola data warga, keuangan, dan aspirasi masyarakat dengan mudah.
          </p>
          <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
            <span className="bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold">
              {stats.total_warga} Warga Terdaftar
            </span>
            <span className="bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold">
              {stats.aspirasi_pending} Aspirasi Menunggu
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Warga"
          value={stats.total_warga}
          icon={Users}
          color="bg-blue-500"
          lightColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatCard
          title="Saldo Kas"
          value={`Rp ${(stats.saldo_kas || 0).toLocaleString('id-ID')}`}
          icon={DollarSign}
          color="bg-emerald-500"
          lightColor="bg-emerald-50"
          textColor="text-emerald-600"
          isCompact
        />
        <StatCard
          title="Aspirasi"
          value={stats.aspirasi_pending}
          suffix="Pending"
          icon={MessageSquare}
          color="bg-orange-500"
          lightColor="bg-orange-50"
          textColor="text-orange-600"
        />
        <StatCard
          title="Info Publik"
          value="Aktif"
          icon={Bell}
          color="bg-purple-500"
          lightColor="bg-purple-50"
          textColor="text-purple-600"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">


        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-gray-900">
                {selectedRW === 'All' ? 'Populasi per RW' : `Detail RW ${selectedRW}`}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {selectedRW === 'All'
                  ? 'Perbandingan jumlah warga antar RW'
                  : 'Sebaran warga di setiap RT'}
              </p>
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={selectedRW}
                onChange={(e) => setSelectedRW(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-yellow-50 border border-yellow-200 text-yellow-800 font-bold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer text-sm"
              >
                <option value="All">Semua RW</option>
                {rwList.map(rw => (
                  <option key={rw} value={rw}>RW {rw}</option>
                ))}
              </select>
              <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-600 pointer-events-none" />
            </div>
          </div>

          <div className="h-48 sm:h-64 flex items-end gap-2 sm:gap-4 px-2 pb-4 border-b border-gray-100 relative overflow-x-auto">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                <div className="animate-pulse-soft text-gray-400 text-sm">Memuat...</div>
              </div>
            ) : chartData.length > 0 ? (
              chartData.map((item, i) => {
                const { val, label } = normalizeData(item);
                const heightPct = (val / maxChartValue) * 100;

                return (
                  <div key={i} className="flex-1 min-w-[40px] flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                    <div
                      className="w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-lg group-hover:from-yellow-600 group-hover:to-yellow-500 transition-all relative flex justify-center shadow-sm"
                      style={{ height: `${Math.max(heightPct, 8)}%` }}
                    >
                      <div className="absolute -top-8 bg-gray-800 text-white text-[10px] sm:text-xs font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 shadow-lg">
                        {val} Warga
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">
                      {selectedRW === 'All' ? `RW${label}` : `RT${label}`}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                <Users size={32} className="mb-2 opacity-50" />
                <p>Belum ada data warga</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm h-fit">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Informasi Cepat</h3>

          <div className="space-y-4">
            <div className="flex gap-3 items-start p-3 bg-blue-50 rounded-xl">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white shrink-0">
                <TrendingUp size={16} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800">Mode Tampilan</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedRW === 'All'
                    ? "Menampilkan populasi per RW"
                    : `Detail RT di RW ${selectedRW}`}
                </p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">
                <span className="font-bold text-gray-700">Tips:</span> Gunakan filter untuk melihat detail per RW.
              </p>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-sm transition">
              Lihat Semua Data
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, suffix, icon: Icon, color, lightColor, textColor, isCompact }) => (
  <div className={`${lightColor} p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group`}>
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105 ${color}`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide truncate">{title}</p>
        <h4 className={`text-lg sm:text-xl font-black ${textColor} mt-0.5 ${isCompact ? 'text-base sm:text-lg' : ''} truncate`}>
          {value}
          {suffix && <span className="text-xs font-medium text-gray-400 ml-1">{suffix}</span>}
        </h4>
      </div>
    </div>
  </div>
);

export default Dashboard;