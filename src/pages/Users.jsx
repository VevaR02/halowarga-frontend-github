import React, { useEffect, useState } from 'react';
import { UserPlus, Edit, Trash2, Shield, Key, User } from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';

const Users = ({ user }) => {
   const [users, setUsers] = useState([]);
   const [showForm, setShowForm] = useState(false);
   const [editId, setEditId] = useState(null);

   const initialForm = { username: '', password: '', full_name: '', role: 'warga', rt: '', rw: '' };
   const [form, setForm] = useState(initialForm);

   useEffect(() => { loadUsers(); }, []);

   const loadUsers = async () => {
      try {
         const data = await getUsers();
         setUsers(data);
      } catch (err) { console.error(err); }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         if (editId) {
            await updateUser(editId, form, user);
            alert('User diperbarui!');
         } else {
            await createUser(form, user);
            alert('User dibuat!');
         }
         setShowForm(false);
         setForm(initialForm);
         setEditId(null);
         loadUsers();
      } catch (error) {
         alert(error.response?.data?.message || "Gagal menyimpan user");
      }
   };

   const handleEdit = (item) => {
      setForm({ ...item, password: '' });
      setEditId(item.id);
      setShowForm(true);
   };

   const handleDelete = async (id) => {
      if (confirm('Hapus user ini?')) {
         await deleteUser(id, user);
         loadUsers();
      }
   };

   return (
      <div className="space-y-6 animate-fade-in pb-10">
         <div className="flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-extrabold text-gray-900">Manajemen Pengguna</h2>
               <p className="text-gray-500 text-sm">Kelola akun login untuk Admin, RW, RT, dan Warga.</p>
            </div>
            <button onClick={() => { setEditId(null); setForm(initialForm); setShowForm(!showForm); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg hover:bg-blue-700 transition">
               <UserPlus size={18} className="mr-2" /> Tambah User
            </button>
         </div>

         {showForm && (
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-xl">
               <h3 className="font-bold text-lg mb-4 text-gray-800">Form User</h3>
               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs font-bold text-gray-500">Username</label>
                     <input required className="w-full border p-3 rounded-lg bg-gray-50" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-500">Password {editId && '(Kosongkan jika tetap)'}</label>
                     <input type="password" className="w-full border p-3 rounded-lg bg-gray-50" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="******" required={!editId} />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-500">Nama Lengkap</label>
                     <input required className="w-full border p-3 rounded-lg bg-gray-50" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-500">Role (Jabatan)</label>
                     <select className="w-full border p-3 rounded-lg bg-gray-50" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                        <option value="warga">Warga</option>
                        <option value="rt">Ketua RT</option>
                        <option value="rw">Ketua RW</option>
                        <option value="desa">Admin Desa</option>
                     </select>
                  </div>

                  {(form.role === 'rt' || form.role === 'rw') && (
                     <div className="md:col-span-2 grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        {form.role === 'rt' && (
                           <div>
                              <label className="text-xs font-bold text-blue-600">Wilayah RT (Contoh: 01)</label>
                              <input required className="w-full border p-2 rounded bg-white" value={form.rt} onChange={e => setForm({ ...form, rt: e.target.value })} placeholder="01" />
                           </div>
                        )}
                        <div>
                           <label className="text-xs font-bold text-blue-600">Wilayah RW (Contoh: 05)</label>
                           <input required className="w-full border p-2 rounded bg-white" value={form.rw} onChange={e => setForm({ ...form, rw: e.target.value })} placeholder="05" />
                        </div>
                     </div>
                  )}

                  <div className="md:col-span-2 pt-2">
                     <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">Simpan User</button>
                  </div>
               </form>
            </div>
         )}

         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
               <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-bold text-gray-500">
                  <tr><th className="p-5">User</th><th className="p-5">Role</th><th className="p-5">Wilayah</th><th className="p-5 text-right">Aksi</th></tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {users.map(u => (
                     <tr key={u.id} className="hover:bg-blue-50/30 transition">
                        <td className="p-5">
                           <div className="font-bold text-gray-800">{u.full_name}</div>
                           <div className="text-xs text-gray-400 flex items-center gap-1"><User size={10} /> {u.username}</div>
                        </td>
                        <td className="p-5">
                           <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'desa' ? 'bg-purple-100 text-purple-700' :
                                 u.role === 'rw' ? 'bg-yellow-100 text-yellow-700' :
                                    u.role === 'rt' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                              {u.role}
                           </span>
                        </td>
                        <td className="p-5 text-sm text-gray-600">
                           {u.role === 'desa' ? 'Seluruh Desa' :
                              u.role === 'rw' ? `RW ${u.rw}` :
                                 u.role === 'rt' ? `RT ${u.rt} / RW ${u.rw}` : '-'}
                        </td>
                        <td className="p-5 flex justify-end gap-2">
                           <button onClick={() => handleEdit(u)} className="p-2 text-gray-400 hover:text-blue-600"><Edit size={18} /></button>
                           <button onClick={() => handleDelete(u.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default Users;