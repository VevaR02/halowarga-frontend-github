import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, User, ChevronRight, ChevronDown, Save, X, Shield, Users, Phone, MapPin } from 'lucide-react';
import { getWargaList, createWarga, deleteWarga, updateWarga } from '../services/api';

const Warga = ({ user, initialSearch }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [filterRW, setFilterRW] = useState('All');
    const [filterRT, setFilterRT] = useState('All');
    const [expandedFamilies, setExpandedFamilies] = useState(new Set());

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const initialForm = {
        nik: '', nama: '', rt: '', rw: '05', jenis_kelamin: 'L',
        status_hunian: 'Tetap', no_hp: '', no_kk: '', hubungan_keluarga: 'Kepala Keluarga'
    };
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
        if (window.confirm("Yakin ingin menghapus data warga ini?")) {
            try {
                await deleteWarga(id, user);
                loadData();
                alert("Data berhasil dihapus.");
            } catch (error) {
                alert(error.response?.data?.message || "Gagal menghapus data.");
            }
        }
    };

    const toggleFamily = (no_kk) => {
        const newExpanded = new Set(expandedFamilies);
        if (newExpanded.has(no_kk)) {
            newExpanded.delete(no_kk);
        } else {
            newExpanded.add(no_kk);
        }
        setExpandedFamilies(newExpanded);
    };

    const isMyCitizen = (item) => {
        if (!user) return false;
        if (['admin', 'desa'].includes(user?.role)) return true;

        const itemRT = Number(item.rt);
        const itemRW = Number(item.rw);
        const userRT = Number(user.rt_scope);
        const userRW = Number(user.rw_scope);

        if (user?.role === 'rw') return itemRW === userRW;
        if (user?.role === 'rt') return itemRT === userRT && itemRW === userRW;
        return false;
    };

    // Group data by no_kk (family card)
    const groupedData = useMemo(() => {
        let filtered = [...data];

        // Apply filters
        if (filterRW !== 'All') {
            filtered = filtered.filter(item => item.rw === filterRW);
            if (filterRT !== 'All') filtered = filtered.filter(item => item.rt === filterRT);
        }
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.nama.toLowerCase().includes(lowerTerm) ||
                item.nik.includes(lowerTerm) ||
                (item.no_kk && item.no_kk.includes(lowerTerm))
            );
        }

        // Group by no_kk
        const families = {};
        const standalone = [];

        filtered.forEach(person => {
            if (person.no_kk) {
                if (!families[person.no_kk]) {
                    families[person.no_kk] = [];
                }
                families[person.no_kk].push(person);
            } else {
                standalone.push(person);
            }
        });

        // Sort each family: Kepala Keluarga first
        Object.keys(families).forEach(kk => {
            families[kk].sort((a, b) => {
                if (a.hubungan_keluarga === 'Kepala Keluarga') return -1;
                if (b.hubungan_keluarga === 'Kepala Keluarga') return 1;
                return a.nama.localeCompare(b.nama);
            });
        });

        return { families, standalone };
    }, [data, filterRW, filterRT, searchTerm]);

    const uniqueRWs = ['All', ...new Set(data.map(item => item.rw))].sort();
    const availableRTs = useMemo(() => {
        if (filterRW === 'All') return [];
        const rwData = data.filter(item => item.rw === filterRW);
        return ['All', ...new Set(rwData.map(item => item.rt))].sort();
    }, [data, filterRW]);

    const handleRWChange = (rw) => { setFilterRW(rw); setFilterRT('All'); };

    const totalFamilies = Object.keys(groupedData.families).length;
    const totalPeople = data.length;

    return (
        <div className="space-y-6 animate-fade-in pb-10">

            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Data Kependudukan</h2>
                    <div className="flex items-center text-sm text-gray-500 mt-1 gap-2 flex-wrap">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">{totalFamilies} KK</span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">{totalPeople} Jiwa</span>
                        {filterRW !== 'All' && <><ChevronRight size={14} /> <span>RW {filterRW}</span></>}
                        {filterRT !== 'All' && <><ChevronRight size={14} /> <span>RT {filterRT}</span></>}
                    </div>
                </div>
                {canCreate && !showForm && (
                    <button onClick={() => { setEditId(null); setFormData(initialForm); setShowForm(true); }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 sm:px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-yellow-200 transition text-sm sm:text-base">
                        <Plus size={18} className="mr-2" /> Tambah Warga
                    </button>
                )}
            </div>

            {/* Filters - Responsive */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                {/* RW Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase shrink-0">RW:</span>
                    <div className="flex gap-2">
                        {uniqueRWs.map(rw => (
                            <button key={rw} onClick={() => handleRWChange(rw)}
                                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${filterRW === rw ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}>
                                {rw === 'All' ? 'Semua' : `RW ${rw}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* RT Filter */}
                {filterRW !== 'All' && (
                    <div className="flex items-center gap-2 overflow-x-auto animate-fade-in">
                        <span className="text-xs font-bold text-gray-400 uppercase shrink-0">RT:</span>
                        <div className="flex gap-2">
                            {availableRTs.map(rt => (
                                <button key={rt} onClick={() => setFilterRT(rt)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filterRT === rt ? 'bg-yellow-400 text-black shadow-sm' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                                        }`}>
                                    {rt === 'All' ? 'Semua' : `RT ${rt}`}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari Nama, NIK, atau No. KK..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition text-sm font-medium"
                    />
                </div>
            </div>

            {/* Form - Responsive */}
            {showForm && (
                <div className="bg-white p-4 sm:p-6 rounded-2xl border border-yellow-200 shadow-lg ring-4 ring-yellow-50">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                            {editId ? <><Edit size={20} className="text-blue-500" /> Edit Data</> : <><User size={20} className="text-green-500" /> Input Baru</>}
                        </h3>
                        <button onClick={handleCancel} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500">No. Kartu Keluarga</label>
                            <input className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-200"
                                value={formData.no_kk} onChange={e => setFormData({ ...formData, no_kk: e.target.value })} placeholder="16 Digit" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500">Hubungan Keluarga</label>
                            <select className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-200"
                                value={formData.hubungan_keluarga} onChange={e => setFormData({ ...formData, hubungan_keluarga: e.target.value })}>
                                <option value="Kepala Keluarga">Kepala Keluarga</option>
                                <option value="Istri">Istri</option>
                                <option value="Anak">Anak</option>
                                <option value="Orang Tua">Orang Tua</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500">NIK</label>
                            <input required className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-200"
                                value={formData.nik} onChange={e => setFormData({ ...formData, nik: e.target.value })} placeholder="16 Digit" disabled={!!editId} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500">Nama Lengkap</label>
                            <input required className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-200"
                                value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} placeholder="Sesuai KTP" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-bold text-gray-500">RT</label>
                                <input required disabled={userRole === 'rt'}
                                    className={`w-full border p-3 rounded-lg ${userRole === 'rt' ? 'bg-gray-200 text-gray-500' : 'bg-gray-50 focus:ring-2 focus:ring-yellow-200'}`}
                                    value={userRole === 'rt' ? user.rt_scope : formData.rt}
                                    onChange={e => setFormData({ ...formData, rt: e.target.value })} placeholder="001" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">RW</label>
                                <input required disabled={['rt', 'rw'].includes(userRole)}
                                    className={`w-full border p-3 rounded-lg ${['rt', 'rw'].includes(userRole) ? 'bg-gray-200 text-gray-500' : 'bg-gray-50 focus:ring-2 focus:ring-yellow-200'}`}
                                    value={['rt', 'rw'].includes(userRole) ? user.rw_scope : formData.rw}
                                    onChange={e => setFormData({ ...formData, rw: e.target.value })} placeholder="05" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500">Jenis Kelamin</label>
                            <select className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-200"
                                value={formData.jenis_kelamin} onChange={e => setFormData({ ...formData, jenis_kelamin: e.target.value })}>
                                <option value="L">Laki-laki</option><option value="P">Perempuan</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500">Status Hunian</label>
                            <select className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-200"
                                value={formData.status_hunian} onChange={e => setFormData({ ...formData, status_hunian: e.target.value })}>
                                <option value="Tetap">Warga Tetap</option><option value="Kontrak">Kontrak</option><option value="Sementara">Sementara</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500">No. HP</label>
                            <input className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-200"
                                value={formData.no_hp || ''} onChange={e => setFormData({ ...formData, no_hp: e.target.value })} placeholder="08xxxxxxxxxx" />
                        </div>

                        <div className="sm:col-span-2 flex gap-3 pt-2">
                            <button type="button" onClick={handleCancel} className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition">Batal</button>
                            <button type="submit" className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition ${editId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                                <Save size={18} /> {editId ? 'Simpan' : 'Tambah'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Family Cards - Responsive Grid */}
            {loading ? (
                <div className="p-12 text-center text-gray-400">Memuat data...</div>
            ) : (
                <div className="space-y-4">
                    {/* Families with No KK */}
                    {Object.entries(groupedData.families).map(([no_kk, members]) => {
                        const kepala = members.find(m => m.hubungan_keluarga === 'Kepala Keluarga') || members[0];
                        const isExpanded = expandedFamilies.has(no_kk);
                        const hasAccess = isMyCitizen(kepala);
                        const otherMembers = members.filter(m => m.id !== kepala.id);

                        return (
                            <div key={no_kk} className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${!hasAccess && 'opacity-80'}`}>
                                {/* Kepala Keluarga Card */}
                                <div
                                    className={`p-4 sm:p-5 cursor-pointer hover:bg-gray-50 transition ${isExpanded && 'border-b border-gray-100'}`}
                                    onClick={() => otherMembers.length > 0 && toggleFamily(no_kk)}
                                >
                                    <div className="flex items-start sm:items-center gap-4">
                                        {/* Avatar */}
                                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 ${kepala.jenis_kelamin === 'L' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                            <User size={24} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                <h3 className="font-bold text-gray-900 truncate">{kepala.nama}</h3>
                                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold w-fit">Kepala Keluarga</span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                                                <span className="flex items-center gap-1"><MapPin size={12} /> RT {kepala.rt} / RW {kepala.rw}</span>
                                                {kepala.no_hp && <span className="flex items-center gap-1"><Phone size={12} /> {kepala.no_hp}</span>}
                                                <span className="font-mono">NIK: {kepala.nik}</span>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-400">
                                                No. KK: {no_kk}
                                            </div>
                                        </div>

                                        {/* Actions & Expand */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            {hasAccess && (
                                                <div className="flex gap-1">
                                                    {canEdit && (
                                                        <button onClick={(e) => { e.stopPropagation(); handleEdit(kepala); }}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                            <Edit size={16} />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(kepala.id); }}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {otherMembers.length > 0 && (
                                                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${isExpanded ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    <Users size={14} />
                                                    <span className="text-xs font-bold">+{otherMembers.length}</span>
                                                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Family Members (Expanded) */}
                                {isExpanded && otherMembers.length > 0 && (
                                    <div className="bg-gray-50 divide-y divide-gray-100">
                                        {otherMembers.map(member => (
                                            <div key={member.id} className="p-4 pl-6 sm:pl-8 flex items-center gap-4 hover:bg-gray-100 transition">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${member.jenis_kelamin === 'L' ? 'bg-blue-50 text-blue-500' : 'bg-pink-50 text-pink-500'}`}>
                                                    <User size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                        <span className="font-bold text-gray-800 truncate">{member.nama}</span>
                                                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full w-fit">{member.hubungan_keluarga || 'Anggota'}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3">
                                                        <span className="font-mono">NIK: {member.nik}</span>
                                                        <span>{member.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                                                    </div>
                                                </div>
                                                {hasAccess && (
                                                    <div className="flex gap-1 shrink-0">
                                                        {canEdit && (
                                                            <button onClick={() => handleEdit(member)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                                <Edit size={14} />
                                                            </button>
                                                        )}
                                                        {canDelete && (
                                                            <button onClick={() => handleDelete(member.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Standalone (no KK) */}
                    {groupedData.standalone.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-100">
                                <h4 className="font-bold text-gray-600 text-sm">Warga Tanpa No. KK ({groupedData.standalone.length})</h4>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {groupedData.standalone.map(person => {
                                    const hasAccess = isMyCitizen(person);
                                    return (
                                        <div key={person.id} className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition ${!hasAccess && 'opacity-60'}`}>
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${person.jenis_kelamin === 'L' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                                <User size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="font-bold text-gray-800 truncate block">{person.nama}</span>
                                                <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3">
                                                    <span>RT {person.rt} / RW {person.rw}</span>
                                                    <span className="font-mono">NIK: {person.nik}</span>
                                                </div>
                                            </div>
                                            {hasAccess && (
                                                <div className="flex gap-1 shrink-0">
                                                    {canEdit && (
                                                        <button onClick={() => handleEdit(person)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                            <Edit size={14} />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button onClick={() => handleDelete(person.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {Object.keys(groupedData.families).length === 0 && groupedData.standalone.length === 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                            <Users className="mx-auto text-gray-300 mb-3" size={48} />
                            <h3 className="font-bold text-gray-800">Data Kosong</h3>
                            <p className="text-gray-500 text-sm mt-1">Tidak ada warga ditemukan</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Warga;