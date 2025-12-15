import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getAllKas, createKas, deleteKas, getKasChart, getRWListFromCitizens, getRTListFromCitizens } from '../services/api';
import { Building2, Users, Home, Plus, Trash2, TrendingUp, TrendingDown, Wallet, Eye, Lock } from 'lucide-react';

const Finance = ({ userRole, user }) => {
    const [transaksi, setTransaksi] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [saldo, setSaldo] = useState(0);
    const [pemasukan, setPemasukan] = useState(0);
    const [pengeluaran, setPengeluaran] = useState(0);

    const [activeLevel, setActiveLevel] = useState('desa');
    const [rwList, setRwList] = useState([]);
    const [rtList, setRtList] = useState([]);
    const [selectedRW, setSelectedRW] = useState('');
    const [selectedRT, setSelectedRT] = useState('');

    const [form, setForm] = useState({ type: 'in', amount: '', description: '', date: '' });
    const [showForm, setShowForm] = useState(false);

    const userRWScope = user?.rw_scope || '';
    const userRTScope = user?.rt_scope || '';

    const canEdit = (level, rw = selectedRW, rt = selectedRT) => {
        if (userRole === 'warga') return false;

        if (['admin', 'desa'].includes(userRole) && level === 'desa') return true;

        if (userRole === 'rw' && level === 'rw') {
            return rw === userRWScope;
        }

        if (userRole === 'rt' && level === 'rt') {
            return rw === userRWScope && rt === userRTScope;
        }

        return false;
    };

    const levels = [
        { id: 'desa', label: 'Kas Desa', icon: Building2, color: 'blue', desc: 'Keuangan tingkat desa' },
        { id: 'rw', label: 'Kas RW', icon: Users, color: 'purple', desc: 'Keuangan per RW' },
        { id: 'rt', label: 'Kas RT', icon: Home, color: 'green', desc: 'Keuangan per RT' }
    ];

    useEffect(() => {
        loadRWList();
    }, []);

    useEffect(() => {
        if (activeLevel === 'rw' && rwList.length > 0 && !selectedRW) {
            if (userRole === 'rw' && userRWScope) {
                setSelectedRW(userRWScope);
            } else {
                setSelectedRW(rwList[0]);
            }
        }
        if (activeLevel === 'rt' && rwList.length > 0 && !selectedRW) {
            if (['rt', 'rw'].includes(userRole) && userRWScope) {
                setSelectedRW(userRWScope);
            } else {
                setSelectedRW(rwList[0]);
            }
        }
    }, [activeLevel, rwList, userRole, userRWScope]);

    useEffect(() => {
        if (activeLevel === 'rt' && selectedRW) {
            loadRTList(selectedRW);
        }
    }, [selectedRW, activeLevel]);

    useEffect(() => {
        if (activeLevel === 'rt' && rtList.length > 0 && !selectedRT) {
            if (userRole === 'rt' && userRTScope && rtList.includes(userRTScope)) {
                setSelectedRT(userRTScope);
            } else {
                setSelectedRT(rtList[0]);
            }
        }
    }, [rtList, userRole, userRTScope, activeLevel]);

    useEffect(() => {
        loadData();
    }, [activeLevel, selectedRW, selectedRT]);

    const loadRWList = async () => {
        try {
            const data = await getRWListFromCitizens();
            setRwList(data || []);
        } catch (err) { console.error(err); }
    };

    const loadRTList = async (rw) => {
        try {
            const data = await getRTListFromCitizens(rw);
            setRtList(data || []);
        } catch (err) { console.error(err); }
    };

    const loadData = async () => {
        try {
            let rw = null, rt = null;
            if (activeLevel === 'rw') rw = selectedRW;
            if (activeLevel === 'rt') { rw = selectedRW; rt = selectedRT; }

            const data = await getAllKas(activeLevel, rw, rt);
            setTransaksi(data || []);

            const totalMasuk = (data || []).reduce((acc, curr) => curr.type === 'in' ? acc + Number(curr.amount) : acc, 0);
            const totalKeluar = (data || []).reduce((acc, curr) => curr.type === 'out' ? acc + Number(curr.amount) : acc, 0);

            setPemasukan(totalMasuk);
            setPengeluaran(totalKeluar);
            setSaldo(totalMasuk - totalKeluar);

            const chart = await getKasChart(activeLevel, rw, rt);
            setChartData(chart || []);
        } catch (err) {
            console.error("Gagal load data keuangan:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canEdit(activeLevel)) {
            alert("Anda tidak memiliki izin untuk menambah transaksi di wilayah ini.");
            return;
        }
        try {
            const payload = {
                ...form,
                kas_level: activeLevel,
                rw_number: activeLevel !== 'desa' ? selectedRW : null,
                rt_number: activeLevel === 'rt' ? selectedRT : null
            };
            await createKas(payload, user);
            setForm({ type: 'in', amount: '', description: '', date: '' });
            setShowForm(false);
            alert("Transaksi berhasil disimpan!");
            loadData();
        } catch (error) {
            alert("Gagal menyimpan transaksi");
        }
    };

    const handleDelete = async (id) => {
        if (!canEdit(activeLevel)) {
            alert("Anda tidak memiliki izin untuk menghapus transaksi di wilayah ini.");
            return;
        }
        if (window.confirm("Hapus data ini?")) {
            await deleteKas(id, user);
            loadData();
        }
    };

    const handleLevelChange = (level) => {
        setActiveLevel(level);
        setSelectedRW('');
        setSelectedRT('');
    };

    const getActiveColor = () => {
        const colors = {
            desa: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
            rw: { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
            rt: { bg: 'bg-green-500', light: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' }
        };
        return colors[activeLevel];
    };

    const color = getActiveColor();
    const currentCanEdit = canEdit(activeLevel);

    return (
        <div className="space-y-6 animate-fade-in pb-10">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    {levels.map(level => {
                        const Icon = level.icon;
                        const isActive = activeLevel === level.id;
                        return (
                            <button
                                key={level.id}
                                onClick={() => handleLevelChange(level.id)}
                                className={`flex-1 flex items-center gap-3 p-4 rounded-xl transition-all duration-300 border-2 ${isActive
                                    ? `${level.color === 'blue' ? 'bg-blue-500 border-blue-500' : level.color === 'purple' ? 'bg-purple-500 border-purple-500' : 'bg-green-500 border-green-500'} text-white shadow-lg`
                                    : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                            >
                                <Icon size={24} />
                                <div className="text-left">
                                    <p className="font-bold">{level.label}</p>
                                    <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>{level.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {activeLevel !== 'desa' && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-3 items-center">

                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">RW:</span>
                                <div className="flex flex-wrap gap-2">
                                    {rwList.map(rw => {
                                        const isUserRW = rw === userRWScope;
                                        const canEditThis = (activeLevel === 'rw' && userRole === 'rw' && isUserRW) || ['admin', 'desa'].includes(userRole);
                                        return (
                                            <button
                                                key={rw}
                                                onClick={() => { setSelectedRW(rw); setSelectedRT(''); }}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1 ${selectedRW === rw
                                                    ? 'bg-purple-500 text-white shadow-md'
                                                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                                    } ${isUserRW && userRole === 'rw' ? 'ring-2 ring-yellow-400' : ''}`}
                                            >
                                                RW {rw}
                                                {activeLevel === 'rw' && isUserRW && userRole === 'rw' && <Lock size={12} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>


                            {activeLevel === 'rt' && selectedRW && rtList.length > 0 && (
                                <div className="flex items-center gap-2 ml-0 sm:ml-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase">RT:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {rtList.map(rt => {
                                            const isUserRT = rt === userRTScope && selectedRW === userRWScope;
                                            return (
                                                <button
                                                    key={rt}
                                                    onClick={() => setSelectedRT(rt)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1 ${selectedRT === rt
                                                        ? 'bg-green-500 text-white shadow-md'
                                                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                                                        } ${isUserRT && userRole === 'rt' ? 'ring-2 ring-yellow-400' : ''}`}
                                                >
                                                    RT {rt}
                                                    {isUserRT && userRole === 'rt' && <Lock size={12} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}


                <div className={`mt-4 p-3 rounded-xl text-sm flex items-center gap-2 ${currentCanEdit
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                    }`}>
                    {currentCanEdit ? (
                        <>
                            <Lock size={16} />
                            <span className="font-medium">Mode Edit - Anda dapat mengelola kas di wilayah ini</span>
                        </>
                    ) : (
                        <>
                            <Eye size={16} />
                            <span className="font-medium">Mode Lihat - Anda hanya dapat melihat data kas di wilayah ini</span>
                        </>
                    )}
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-5 rounded-2xl border ${color.border} ${color.light}`}>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500 rounded-xl text-white">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Pemasukan</p>
                            <h3 className="text-xl font-black text-green-600">Rp {pemasukan.toLocaleString('id-ID')}</h3>
                        </div>
                    </div>
                </div>
                <div className={`p-5 rounded-2xl border ${color.border} ${color.light}`}>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-500 rounded-xl text-white">
                            <TrendingDown size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Pengeluaran</p>
                            <h3 className="text-xl font-black text-red-600">Rp {pengeluaran.toLocaleString('id-ID')}</h3>
                        </div>
                    </div>
                </div>
                <div className={`p-5 rounded-2xl border ${color.border} ${color.light}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-3 ${color.bg} rounded-xl text-white`}>
                            <Wallet size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Sisa Saldo</p>
                            <h3 className={`text-xl font-black ${color.text}`}>Rp {saldo.toLocaleString('id-ID')}</h3>
                        </div>
                    </div>
                </div>
            </div>


            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Arus Kas Bulanan</h3>
                <div className="h-64 sm:h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barGap={5}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} width={60} />
                            <Tooltip
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
                            />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            <Bar dataKey="masuk" name="Pemasukan" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="keluar" name="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>


            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Riwayat Transaksi</h3>
                        {currentCanEdit && (
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="sm:hidden p-2 bg-yellow-400 rounded-lg text-gray-900"
                            >
                                <Plus size={20} />
                            </button>
                        )}
                    </div>

                    <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                        {transaksi.length > 0 ? transaksi.map((item) => (
                            <div key={item.id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition">
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-800 truncate">{item.description}</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span className="text-xs text-gray-400">
                                            {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        {item.rw_number && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">RW {item.rw_number}</span>}
                                        {item.rt_number && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">RT {item.rt_number}</span>}
                                    </div>
                                </div>
                                <div className="text-right ml-4">
                                    <p className={`font-bold ${item.type === 'in' ? 'text-green-600' : 'text-red-500'}`}>
                                        {item.type === 'in' ? '+' : '-'} Rp {Number(item.amount).toLocaleString('id-ID')}
                                    </p>
                                    {currentCanEdit && (
                                        <button onClick={() => handleDelete(item.id)} className="text-xs text-red-400 hover:text-red-600 mt-1">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-400 py-8">Belum ada transaksi</p>
                        )}
                    </div>
                </div>

                {currentCanEdit && (
                    <div className={`bg-gray-800 text-white p-5 rounded-2xl shadow-lg h-fit ${showForm ? 'block' : 'hidden lg:block'}`}>
                        <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
                            <Plus size={20} /> Transaksi Baru
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold">Tipe</label>
                                <select className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                                    value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                    <option value="in">Pemasukan (+)</option>
                                    <option value="out">Pengeluaran (-)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold">Jumlah (Rp)</label>
                                <input type="number" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                                    value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required placeholder="0" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold">Keterangan</label>
                                <input type="text" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="Contoh: Iuran Warga" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold">Tanggal</label>
                                <input type="date" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                                    value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                            </div>
                            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition">
                                Simpan
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Finance;