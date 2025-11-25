import React from 'react';
import { Home, Bookmark, GraduationCap, DollarSign, LogOut, FileText, Shield, Users as UsersIcon, X, HelpCircleIcon } from 'lucide-react';
import Help from '../pages/Help';

const Sidebar = ({ user, currentPage, setCurrentPage, handleLogout, isOpen, setIsOpen }) => {
  
  const MenuItem = ({ icon: Icon, label, page }) => {
    const isActive = currentPage === page;
    return (
      <button 
        onClick={() => {
            setCurrentPage(page);
            setIsOpen(false);
        }}
        className={`w-full flex items-center gap-4 px-6 py-3 mb-2 transition-all duration-200 
          ${isActive 
            ? 'bg-[#FFC107] text-black font-bold shadow-sm rounded-r-full mr-4' 
            : 'text-gray-700 hover:bg-black/5 font-medium' 
          }`}
      >
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-sm tracking-wide uppercase">{label}</span>
      </button>
    );
  };

  return (
    <>
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-[#F5F2EB] border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
      `}>
        
        <div className="pt-6 pb-6 flex justify-center items-center px-6">
           <div className="flex justify-center w-full md:w-auto">
              <img src="/logo.png" alt="HaloWarga" className="h-10 w-auto object-contain item-center justify-center" onError={(e) => e.target.style.display='none'} />
           </div>
           <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 hover:text-red-500">
              <X size={24} />
           </button>
        </div>

        <div className="flex flex-col items-center pb-8 px-4 text-center">
          <h3 className="font-black text-lg text-black uppercase tracking-wide truncate w-full">
            {user?.full_name || 'User'}
          </h3>
          <p className="text-xs font-bold text-yellow-600 mt-1 uppercase tracking-widest">
             {user?.role || 'Warga'}
          </p>
        </div>

        <nav className="flex-1 w-full overflow-y-auto no-scrollbar">
          <MenuItem icon={Home} label="Home" page="dashboard" />
          <MenuItem icon={Bookmark} label="Informasi" page="info" />
          <MenuItem icon={GraduationCap} label="Aspirasi" page="aspirasi" />
          <MenuItem icon={DollarSign} label="Kas" page="finance" />
          <MenuItem icon={HelpCircleIcon} label="Bantuan" page="help" />
          
          {['rw', 'desa', 'admin', 'rt'].includes(user?.role) && (
             <MenuItem icon={FileText} label="Data Warga" page="warga" />
          )}

          {['rw', 'desa', 'admin'].includes(user?.role) && (
             <div className="mt-4 pt-4 border-t border-gray-300/50">
                <p className="px-6 text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Admin Zone</p>
                {['desa', 'admin'].includes(user?.role) && (
                    <MenuItem icon={UsersIcon} label="Kelola Akun" page="users" />
                )}
                <MenuItem icon={Shield} label="Audit Logs" page="audit" />
             </div>
          )}
        </nav>

        <div className="p-8 border-t border-gray-200/50">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 text-black hover:text-red-600 transition font-bold text-sm w-full justify-center md:justify-start"
          >
              <span>Logout</span>
              <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;