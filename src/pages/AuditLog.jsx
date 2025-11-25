import React, { useEffect, useState } from 'react';
import { Shield, Clock } from 'lucide-react';
import { getAuditLogs } from '../services/api';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getAuditLogs().then(res => setLogs(res || [])).catch(() => setLogs([]));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
           <Shield className="text-purple-500"/> Audit Log (Riwayat Aktivitas)
        </h2>
        <p className="text-gray-500 text-sm">Memantau perubahan data sistem demi keamanan & akuntabilitas.</p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
             <tr><th className="p-4">Waktu</th><th className="p-4">User</th><th className="p-4">Aktivitas</th></tr>
          </thead>
          <tbody>
             {logs.map((log, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                   <td className="p-4 flex items-center gap-2 text-gray-500">
                      <Clock size={14}/> {new Date(log.created_at).toLocaleString('id-ID')}
                   </td>
                   <td className="p-4 font-bold">{log.actor_name}</td>
                   <td className="p-4">{log.action}</td>
                </tr>
             ))}
             {logs.length === 0 && <tr><td colSpan="3" className="p-6 text-center text-gray-500">Belum ada aktivitas tercatat.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AuditLog;