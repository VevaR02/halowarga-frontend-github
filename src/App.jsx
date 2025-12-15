import React, { useState } from 'react';
import { Search, Menu } from 'lucide-react';

import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Warga from './pages/Warga';
import Finance from './pages/Finance';
import InfoPublik from './pages/InfoPublik';
import InfoDetail from './pages/InfoDetail';
import Aspirasi from './pages/Aspirasi';
import AuditLog from './pages/AuditLog';
import Help from './pages/Help';
import UsersPage from './pages/Users';
import Sidebar from './components/Sidebar';

const App = () => {
   const [user, setUser] = useState(null);
   const [currentPage, setCurrentPage] = useState('landing');
   const [globalSearchTerm, setGlobalSearchTerm] = useState('');
   const [selectedInfo, setSelectedInfo] = useState(null);

   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   const handleLoginSuccess = (userData) => {
      setUser(userData);
      setCurrentPage('dashboard');
   };

   const handleLogout = () => {
      setUser(null);
      setCurrentPage('landing');
   };

   const handleGlobalSearch = (e) => {
      if (e.key === 'Enter') {
         const term = globalSearchTerm.toLowerCase();
         const features = {
            'dashboard': 'dashboard', 'home': 'dashboard',
            'warga': 'warga', 'penduduk': 'warga',
            'kas': 'finance', 'uang': 'finance',
            'aspirasi': 'aspirasi', 'lapor': 'aspirasi',
            'info': 'info', 'berita': 'info',
            'audit': 'audit', 'admin': 'users', 'akun': 'users',
            'bantuan': 'help'
         };
         let foundPage = null;
         Object.keys(features).forEach(keyword => {
            if (term.includes(keyword)) foundPage = features[keyword];
         });
         if (foundPage) {
            setCurrentPage(foundPage);
            setGlobalSearchTerm('');
            setIsSidebarOpen(false);
         } else {
            alert(`Fitur "${globalSearchTerm}" tidak ditemukan.`);
         }
      }
   };

   const handleViewInfoDetail = (info) => {
      setSelectedInfo(info);
      setCurrentPage('info-detail');
   };

   const handleBackFromDetail = () => {
      setSelectedInfo(null);
      setCurrentPage('info');
   };

   const renderContent = () => {
      switch (currentPage) {
         case 'dashboard': return <Dashboard userRole={user.role} />;
         case 'warga': return <Warga userRole={user.role} initialSearch={globalSearchTerm} user={user} />;
         case 'finance': return <Finance userRole={user.role} user={user} />;
         case 'info': return <InfoPublik userRole={user.role} userName={user.full_name} user={user} onViewDetail={handleViewInfoDetail} />;
         case 'info-detail':
            return <InfoDetail
               info={selectedInfo}
               onBack={handleBackFromDetail}
               userRole={user.role}
               userName={user.full_name}
               onEdit={(item) => { setSelectedInfo(null); setCurrentPage('info'); }}
               onDelete={(id) => { setSelectedInfo(null); setCurrentPage('info'); }}
            />;
         case 'aspirasi':
            return <Aspirasi
               userRole={user.role}
               userId={user.id}
               userName={user.full_name}
            />;
         case 'audit': return <AuditLog />;
         case 'help': return <Help />;
         case 'users': return ['admin', 'desa'].includes(user.role) ? <UsersPage user={user} /> : <div className="p-4 text-red-500">Akses Ditolak</div>;
         default: return <Dashboard userRole={user.role} />;
      }
   };

   if (!user) {
      if (currentPage === 'landing') return <LandingPage onLoginClick={() => setCurrentPage('login')} />;
      if (currentPage === 'login') return <Login onLoginSuccess={handleLoginSuccess} />;
   }

   return (
      <div className="flex min-h-screen bg-[#FDFDFD]">

         <Sidebar
            user={user}
            currentPage={currentPage}
            setCurrentPage={(page) => { setCurrentPage(page); setSelectedInfo(null); }}
            handleLogout={handleLogout}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
         />

         <main className="flex-1 md:ml-64 p-6 md:p-10 overflow-y-auto w-full transition-all duration-300">

            <header className="flex justify-between items-center mb-8 md:mb-10">
               <div className="flex items-center gap-4">
                  <button
                     onClick={() => setIsSidebarOpen(true)}
                     className="md:hidden p-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-600 hover:bg-gray-50"
                  >
                     <Menu size={24} />
                  </button>

                  <div>
                     <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight truncate">
                        {currentPage === 'dashboard' ? 'Overview' : currentPage === 'info-detail' ? 'Detail Berita' : currentPage.toUpperCase()}
                     </h2>
                     <p className="text-gray-400 text-xs md:text-sm mt-1 hidden sm:block">Sistem Informasi Manajemen Desa Terintegrasi</p>
                  </div>
               </div>

               <div className="relative hidden sm:block w-64 md:w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                     type="text"
                     placeholder="Cari fitur (Tekan Enter)..."
                     className="bg-white border border-gray-200 rounded-full pl-12 pr-5 py-2.5 text-sm w-full focus:ring-2 focus:ring-yellow-400 outline-none shadow-sm transition-all"
                     value={globalSearchTerm}
                     onChange={(e) => setGlobalSearchTerm(e.target.value)}
                     onKeyDown={handleGlobalSearch}
                  />
               </div>
            </header>

            <div className="animate-fade-in pb-20 md:pb-0">
               {renderContent()}
            </div>
         </main>
      </div>
   );
};

export default App;