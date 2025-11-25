import React from 'react';
import { Phone, MapPin, Mail, HelpCircle } from 'lucide-react';

const Help = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
       <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Pusat Bantuan HaloWarga</h2>
          <p className="text-gray-500">Butuh bantuan? Kami siap membantu Anda.</p>
       </div>

       <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border text-center hover:shadow-md transition">
             <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3"><Phone size={20}/></div>
             <h4 className="font-bold text-sm">WhatsApp</h4><p className="text-sm text-gray-600">0812-3456-7890</p>
          </div>
          <div className="bg-white p-4 rounded-xl border text-center hover:shadow-md transition">
             <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3"><Mail size={20}/></div>
             <h4 className="font-bold text-sm">Email</h4><p className="text-sm text-gray-600">help@halowarga.id</p>
          </div>
          <div className="bg-white p-4 rounded-xl border text-center hover:shadow-md transition">
             <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3"><MapPin size={20}/></div>
             <h4 className="font-bold text-sm">Kantor Desa</h4><p className="text-sm text-gray-600">Jl. Merdeka No. 45</p>
          </div>
       </div>

       <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2"><HelpCircle size={20}/> FAQ (Tanya Jawab)</h3>
          <div className="space-y-3">
             <details className="group cursor-pointer bg-gray-50 rounded-lg p-3">
                <summary className="font-medium flex justify-between items-center list-none">Bagaimana cara merubah data KK? <span>▼</span></summary>
                <p className="mt-2 text-sm text-gray-600">Hubungi ketua RT setempat dengan membawa KK asli dan KTP untuk diverifikasi.</p>
             </details>
             <details className="group cursor-pointer bg-gray-50 rounded-lg p-3">
                <summary className="font-medium flex justify-between items-center list-none">Siapa yang bisa melihat aspirasi saya? <span>▼</span></summary>
                <p className="mt-2 text-sm text-gray-600">Aspirasi Anda akan masuk ke dashboard RT, RW, dan Admin Desa untuk ditindaklanjuti.</p>
             </details>
          </div>
       </div>
    </div>
  );
};
export default Help;