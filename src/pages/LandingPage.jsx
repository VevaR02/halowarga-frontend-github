import React, { useState, useEffect } from 'react';
import { Users, DollarSign, MessageSquare, Bell, Shield, ArrowRight, Menu, X, CheckCircle } from 'lucide-react';
import heroImage from '../assets/images/login-bg.png';
import logoImage from '../assets/images/logo.png';

const LandingPage = ({ onLoginClick }) => {
   const [isScrolled, setIsScrolled] = useState(false);
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

   useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 50);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   return (
      <div className="min-h-screen font-sans bg-white text-gray-800 selection:bg-yellow-200">

         <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

               <div className={`px-4 py-2 rounded-full flex items-center gap-3 transition-all ${isScrolled ? 'bg-yellow-50 border border-yellow-100' : 'bg-white/20 backdrop-blur-md border border-white/30'}`}>
                  <img
                     src={logoImage}
                     alt="HaloWarga Logo"
                     className="h-8 w-auto object-contain"
                  />
                  <span className={`font-bold tracking-widest text-sm uppercase ${isScrolled ? 'text-gray-800' : 'text-white'}`}>HALOWARGA</span>
               </div>

               <div className={`hidden md:flex items-center gap-8 font-medium text-sm ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}>
                  <a href="#fitur" className="hover:text-yellow-400 transition">Fitur</a>
                  <a href="#manfaat" className="hover:text-yellow-400 transition">Manfaat</a>
                  <a href="#kontak" className="hover:text-yellow-400 transition">Kontak</a>
                  <button
                     onClick={onLoginClick}
                     className={`px-6 py-2.5 rounded-full font-bold transition transform hover:-translate-y-0.5 shadow-lg ${isScrolled
                           ? 'bg-yellow-400 text-white hover:bg-yellow-500 shadow-yellow-200'
                           : 'bg-white text-yellow-500 hover:bg-gray-50 shadow-black/10'
                        }`}
                  >
                     Masuk Sistem
                  </button>
               </div>

               <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`md:hidden ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                  {mobileMenuOpen ? <X /> : <Menu />}
               </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
               <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
                  <div className="flex flex-col p-4 space-y-3">
                     <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-yellow-50 rounded-lg font-medium">Fitur</a>
                     <a href="#manfaat" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-yellow-50 rounded-lg font-medium">Manfaat</a>
                     <a href="#kontak" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-yellow-50 rounded-lg font-medium">Kontak</a>
                     <button
                        onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
                        className="w-full bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold shadow-lg mt-2"
                     >
                        Masuk Sistem
                     </button>
                  </div>
               </div>
            )}
         </nav>

         <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[#FFC300] overflow-hidden rounded-b-[50px] lg:rounded-b-[80px]">

            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-300/50 rounded-full blur-3xl mix-blend-overlay pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-400/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
               <div className="text-center lg:text-left text-white">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur border border-white/20 text-sm font-bold mb-6">
                     <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                     Digitalisasi Desa 4.0
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                     Kelola Lingkungan <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-100">Lebih Transparan.</span>
                  </h1>
                  <p className="text-lg text-yellow-50 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                     Platform terintegrasi untuk administrasi RT/RW, laporan keuangan kas, dan aspirasi warga dalam satu genggaman tangan.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                     <button onClick={onLoginClick} className="bg-white text-yellow-500 px-8 py-4 rounded-2xl font-extrabold shadow-xl shadow-black/5 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                        Mulai Sekarang <ArrowRight size={20} />
                     </button>
                     <button className="px-8 py-4 rounded-2xl font-bold border-2 border-white/30 hover:bg-white/10 transition text-white">
                        Pelajari Dulu
                     </button>
                  </div>
               </div>

               <div className="relative hidden lg:block">
                  <div className="relative z-10 transform">
                     <img
                        src={heroImage}
                        alt="App Dashboard"
                        className="relative z-10 w-[90%] max-w-[800px] h-auto max-h-[90vh] object-contain object-right transform translate-x-40 drop-shadow-2xl"
                     />

                  </div>
               </div>
            </div>
         </header>

         <section id="fitur" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
               <div className="text-center mb-16 max-w-3xl mx-auto">
                  <h2 className="text-yellow-500 font-bold tracking-widest text-sm uppercase mb-2">Fitur Unggulan</h2>
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Solusi Lengkap Kebutuhan Warga</h3>
                  <p className="text-gray-500">Kami menyediakan modul lengkap untuk memenuhi kebutuhan administrasi dari tingkat RT hingga Kelurahan secara digital.</p>
               </div>

               <div className="grid md:grid-cols-3 gap-8">
                  <FeatureCard icon={Users} title="Data Warga Terpusat" desc="Database kependudukan digital yang aman, mudah dicari, dan selalu terupdate real-time oleh pengurus." />
                  <FeatureCard icon={DollarSign} title="Transparansi Kas" desc="Laporan kas masuk dan keluar yang dapat dipantau langsung oleh seluruh warga untuk menjaga kepercayaan." />
                  <FeatureCard icon={MessageSquare} title="E-Aspirasi" desc="Saluran pengaduan dan saran warga yang terstruktur, privat, dan termonitor status tindak lanjutnya." />
                  <FeatureCard icon={Bell} title="Info Publik Digital" desc="Papan pengumuman digital untuk menyebarkan berita desa, jadwal posyandu, dan kerja bakti secara instan." />
                  <FeatureCard icon={Shield} title="Keamanan Data" desc="Sistem keamanan berlapis dengan Audit Log untuk memantau setiap perubahan data sensitif." />
                  <FeatureCard icon={CheckCircle} title="Akses Mudah" desc="Dapat diakses kapan saja dan di mana saja melalui perangkat desktop maupun mobile." />
               </div>
            </div>
         </section>

         <footer className="bg-gray-900 text-white pt-20 pb-10 rounded-t-[50px] mt-[-50px] relative z-20">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 border-b border-gray-800 pb-12">
               <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                     <img src={logoImage} alt="Logo" className="h-8 w-auto brightness-0 invert" />
                     <span className="text-2xl font-bold">HaloWarga</span>
                  </div>
                  <p className="text-gray-400 max-w-sm leading-relaxed">
                     Mewujudkan tata kelola lingkungan yang modern, transparan, dan partisipatif untuk Indonesia yang lebih baik.
                  </p>
               </div>
               <div>
                  <h4 className="font-bold text-lg mb-6">Menu</h4>
                  <ul className="space-y-3 text-gray-400">
                     <li><a href="#" className="hover:text-yellow-400 transition">Beranda</a></li>
                     <li><a href="#" className="hover:text-yellow-400 transition">Tentang Kami</a></li>
                     <li><a href="#" className="hover:text-yellow-400 transition">Kebijakan Privasi</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-lg mb-6">Hubungi Kami</h4>
                  <p className="text-gray-400 mb-2">Jl. Desa Maju No. 123, Bandung</p>
                  <p className="text-gray-400 mb-2">support@halowarga.id</p>
                  <p className="text-gray-400">(022) 1234-5678</p>
               </div>
            </div>
            <div className="text-center pt-8 text-gray-600 text-sm">
               &copy; 2025 Kelompok 4 MPPL - HaloWarga System. All rights reserved.
            </div>
         </footer>

      </div>
   );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
   <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
         <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
   </div>
);

export default LandingPage;