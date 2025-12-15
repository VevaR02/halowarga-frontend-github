import React, { useState } from 'react';
import { Phone, MapPin, Mail, HelpCircle, ChevronDown, ChevronUp, MessageSquare, DollarSign, Users, Shield, FileText } from 'lucide-react';

const Help = () => {
   const [openFaq, setOpenFaq] = useState(null);

   const toggleFaq = (index) => {
      setOpenFaq(openFaq === index ? null : index);
   };

   const faqItems = [
      {
         category: 'Umum',
         icon: HelpCircle,
         color: 'yellow',
         questions: [
            {
               q: 'Apa itu HaloWarga?',
               a: 'HaloWarga adalah platform digital untuk mengelola administrasi RT/RW, laporan keuangan kas, dan aspirasi warga secara terintegrasi.'
            },
            {
               q: 'Siapa saja yang bisa menggunakan HaloWarga?',
               a: 'Semua warga yang terdaftar di wilayah RT/RW bisa menggunakan HaloWarga. Pengurus RT/RW dan Admin Desa memiliki akses tambahan untuk mengelola data.'
            },
            {
               q: 'Bagaimana cara mendaftar akun?',
               a: 'Hubungi pengurus RT setempat untuk didaftarkan ke sistem. Setelah terdaftar, Anda akan menerima username dan password untuk login.'
            }
         ]
      },
      {
         category: 'Data Kependudukan',
         icon: Users,
         color: 'blue',
         questions: [
            {
               q: 'Bagaimana cara mengubah data KK/KTP?',
               a: 'Hubungi ketua RT setempat dengan membawa dokumen asli (KK/KTP) untuk diverifikasi. Perubahan akan dilakukan oleh pengurus RT/RW.'
            },
            {
               q: 'Siapa yang bisa melihat data saya?',
               a: 'Data Anda hanya bisa dilihat oleh pengurus RT/RW wilayah Anda dan Admin Desa. Data sensitif seperti NIK dilindungi.'
            },
            {
               q: 'Bagaimana jika data saya salah?',
               a: 'Segera laporkan ke pengurus RT dengan membawa bukti dokumen yang benar untuk dilakukan koreksi.'
            }
         ]
      },
      {
         category: 'Keuangan (Kas)',
         icon: DollarSign,
         color: 'green',
         questions: [
            {
               q: 'Siapa yang mengelola kas RT/RW?',
               a: 'Kas RT dikelola oleh pengurus RT, Kas RW oleh pengurus RW, dan Kas Desa oleh Admin Desa. Setiap pengurus hanya bisa mengelola kas di wilayahnya.'
            },
            {
               q: 'Apakah warga bisa melihat laporan kas?',
               a: 'Ya! Semua warga bisa melihat laporan kas RT, RW, dan Desa untuk transparansi keuangan. Namun, warga tidak bisa mengubah data kas.'
            },
            {
               q: 'Bagaimana cara membayar iuran?',
               a: 'Pembayaran iuran bisa dilakukan langsung ke bendahara RT/RW. Setelah pembayaran, transaksi akan dicatat di sistem HaloWarga.'
            }
         ]
      },
      {
         category: 'Aspirasi',
         icon: MessageSquare,
         color: 'orange',
         questions: [
            {
               q: 'Bagaimana cara mengirim aspirasi?',
               a: 'Login ke akun warga Anda, buka menu Aspirasi, lalu tulis keluhan atau saran Anda. Aspirasi akan dikirim ke pengurus RT/RW untuk ditindaklanjuti.'
            },
            {
               q: 'Siapa yang bisa melihat aspirasi saya?',
               a: 'Aspirasi Anda akan masuk ke dashboard pengurus RT, RW, dan Admin Desa untuk ditindaklanjuti. Pengurus akan mengubah status menjadi "Proses" atau "Selesai".'
            },
            {
               q: 'Berapa lama aspirasi diproses?',
               a: 'Waktu pemrosesan tergantung pada jenis aspirasi. Anda bisa memantau status aspirasi di menu Aspirasi.'
            }
         ]
      },
      {
         category: 'Keamanan',
         icon: Shield,
         color: 'red',
         questions: [
            {
               q: 'Apakah data saya aman?',
               a: 'Ya, data Anda dilindungi dengan sistem keamanan berlapis. Semua perubahan data tercatat di Audit Log untuk transparansi.'
            },
            {
               q: 'Bagaimana jika lupa password?',
               a: 'Hubungi Admin Desa atau pengurus RT/RW untuk mereset password Anda.'
            }
         ]
      }
   ];

   const getColorClasses = (color) => {
      const colors = {
         yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
         blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
         green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
         orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
         red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' }
      };
      return colors[color] || colors.yellow;
   };

   return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">

         {/* Header */}
         <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Pusat Bantuan</h2>
            <p className="text-gray-500 mt-2">Temukan jawaban atas pertanyaan yang sering diajukan</p>
         </div>

         {/* Contact Cards */}
         <div className="grid sm:grid-cols-3 gap-4">
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
               className="bg-white p-5 rounded-2xl border border-gray-100 text-center hover:shadow-lg hover:border-green-300 transition-all group">
               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500 group-hover:text-white transition">
                  <Phone size={22} />
               </div>
               <h4 className="font-bold text-gray-800">WhatsApp</h4>
               <p className="text-sm text-gray-500 mt-1">0812-3456-7890</p>
            </a>
            <a href="mailto:help@halowarga.id"
               className="bg-white p-5 rounded-2xl border border-gray-100 text-center hover:shadow-lg hover:border-blue-300 transition-all group">
               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500 group-hover:text-white transition">
                  <Mail size={22} />
               </div>
               <h4 className="font-bold text-gray-800">Email</h4>
               <p className="text-sm text-gray-500 mt-1">help@halowarga.id</p>
            </a>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 text-center hover:shadow-lg hover:border-yellow-300 transition-all group">
               <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-500 group-hover:text-white transition">
                  <MapPin size={22} />
               </div>
               <h4 className="font-bold text-gray-800">Kantor Desa</h4>
               <p className="text-sm text-gray-500 mt-1">Jl. Merdeka No. 45</p>
            </div>
         </div>

         {/* FAQ Section */}
         <div className="space-y-6">
            <div className="flex items-center gap-2">
               <FileText className="text-yellow-500" size={24} />
               <h3 className="text-xl font-bold text-gray-900">FAQ (Pertanyaan Umum)</h3>
            </div>

            {faqItems.map((category, catIndex) => {
               const Icon = category.icon;
               const colorClasses = getColorClasses(category.color);

               return (
                  <div key={catIndex} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                     {/* Category Header */}
                     <div className={`p-4 ${colorClasses.bg} border-b ${colorClasses.border} flex items-center gap-3`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses.text} bg-white shadow-sm`}>
                           <Icon size={20} />
                        </div>
                        <h4 className={`font-bold ${colorClasses.text}`}>{category.category}</h4>
                     </div>

                     {/* Questions */}
                     <div className="divide-y divide-gray-50">
                        {category.questions.map((item, qIndex) => {
                           const globalIndex = `${catIndex}-${qIndex}`;
                           const isOpen = openFaq === globalIndex;

                           return (
                              <div key={qIndex}>
                                 <button
                                    onClick={() => toggleFaq(globalIndex)}
                                    className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                                 >
                                    <span className="font-medium text-gray-800 pr-4">{item.q}</span>
                                    {isOpen ? (
                                       <ChevronUp size={20} className="text-gray-400 shrink-0" />
                                    ) : (
                                       <ChevronDown size={20} className="text-gray-400 shrink-0" />
                                    )}
                                 </button>
                                 {isOpen && (
                                    <div className="px-4 pb-4">
                                       <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">
                                          {item.a}
                                       </p>
                                    </div>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  </div>
               );
            })}
         </div>

         {/* Still Need Help */}
         <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6 rounded-2xl text-center">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Masih butuh bantuan?</h4>
            <p className="text-gray-800 text-sm mb-4">Hubungi pengurus RT/RW Anda atau kirim aspirasi melalui menu Aspirasi.</p>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition">
               <Phone size={18} /> Hubungi Kami
            </a>
         </div>
      </div>
   );
};

export default Help;