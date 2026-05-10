import { Plane, LogIn, Globe, Map, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Theme';
import { motion } from 'motion/react';

export function Login() {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-50/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-100/50 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-12 text-center relative z-10 border border-border-subtle"
      >
        <div className="mb-8">
           <h1 className="text-3xl font-black tracking-tighter text-primary">Traveloop</h1>
           <div className="w-8 h-1 bg-primary mx-auto mt-2 rounded-full" />
        </div>
        
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 mb-2">Welcome Back</h2>
        <p className="text-text-muted font-medium mb-12">Sign in to manage your latest journeys.</p>

        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-4 text-left p-4 hover:bg-slate-50 transition-colors rounded-2xl border border-transparent hover:border-slate-100">
             <Globe size={24} className="text-slate-300" />
             <div>
               <p className="font-bold text-sm text-slate-800">Global Exploration</p>
               <p className="text-xs text-slate-500 font-medium leading-relaxed">Search and discover cities worldwide.</p>
             </div>
          </div>
          <div className="flex items-center gap-4 text-left p-4 hover:bg-slate-50 transition-colors rounded-2xl border border-transparent hover:border-slate-100">
             <Map size={24} className="text-slate-300" />
             <div>
               <p className="font-bold text-sm text-slate-800">Interactive Planning</p>
               <p className="text-xs text-slate-500 font-medium leading-relaxed">Drag, drop and design your stops.</p>
             </div>
          </div>
        </div>

        <Button 
          onClick={signIn} 
          className="w-full py-4 text-base" 
          icon={LogIn}
          id="google-login-button"
        >
          Sign in with Google
        </Button>

        <div className="mt-10 flex items-center justify-center gap-2 text-slate-300">
           <div className="h-px w-8 bg-slate-100" />
           <Shield size={14} />
           <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]">Verified Secure</p>
           <div className="h-px w-8 bg-slate-100" />
        </div>
      </motion.div>

      <p className="mt-12 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
        &copy; 2026 Traveloop Global • All Rights Reserved
      </p>
    </div>
  );
}
