import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { loginUser } from '../services/api';
import heroImage from '../assets/images/login-bg.png'; 
import logoImage from '../assets/images/logo.png';

const Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser({ username, password });
      
      console.log("Login Result:", result);

      if (result.success) {
        onLoginSuccess(result.data || result.user);
      } else {
        alert(result.message || "Username atau Password salah");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen font-sans overflow-hidden bg-white">
      
      <div className="hidden md:flex w-1/2 bg-[#FFC300] h-full relative flex-col overflow-hidden">
         
         <div className="absolute top-8 left-8 z-30">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full flex items-center gap-3 w-auto shadow-sm">
                <img src={logoImage} alt="Logo" className="h-6 object-contain" />
                <span className="font-bold text-white tracking-widest text-sm uppercase">HALOWARGA</span>
            </div>
         </div>

         <div className="relative w-full h-full flex items-center justify-end">
             <div className="absolute left-1/4 top-1/4 w-[500px] h-[500px] bg-yellow-400/50 rounded-full blur-3xl z-0"></div>
             
             <img 
               src={heroImage} 
               alt="HaloWarga UI" 
               className="relative z-10 w-[90%] max-w-[800px] h-auto max-h-[90vh] object-contain object-right transform translate-x-8 drop-shadow-2xl"
             />
         </div>

         <div className="absolute bottom-10 left-10 z-20 max-w-md text-left">
            <h3 className="text-3xl font-extrabold text-white mb-2 leading-tight drop-shadow-md">
              Digitalisasi Desa <br/> Lebih Mudah.
            </h3>
            <p className="text-white/90 text-sm font-medium drop-shadow-sm">
              Satu akun untuk semua layanan administrasi RT/RW.
            </p>
         </div>
      </div>

      <div className="w-full md:w-1/2 h-full bg-white flex flex-col justify-center items-center p-8 md:p-12 relative z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-md">
            
            <div className="pb-6 border-b border-gray-100 mb-8">
                <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
                    HaloWarga
                </h3>
                <p className="text-gray-400 text-sm">Sistem Informasi Manajemen Desa</p>
            </div>
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">LOGIN</h2>
            <p className="text-gray-500 mb-8 text-sm font-medium">Masuk sesuai Peran anda</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800 ml-1">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl bg-[#F8F9FA] border border-gray-100 text-gray-900 focus:bg-white focus:border-[#FFC300] focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800 ml-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl bg-[#F8F9FA] border border-gray-100 text-gray-900 focus:bg-white focus:border-[#FFC300] focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
                  required 
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                 <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#FFC300] focus:ring-[#FFC300]" />
                    <span className="text-xs font-bold text-gray-500 group-hover:text-gray-800 transition">Ingat Saya</span>
                 </label>
                 <a href="#" className="text-xs text-[#FFC300] font-bold hover:underline">Lupa Password?</a>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#FFC300] hover:bg-[#FFB700] text-gray-900 font-extrabold text-sm tracking-widest uppercase py-4 rounded-xl shadow-lg shadow-yellow-200 transform active:scale-[0.99] transition-all flex justify-center items-center mt-6"
              >
                {loading ? <Loader className="animate-spin text-gray-900" /> : 'LOGIN SEKARANG'}
              </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Login;