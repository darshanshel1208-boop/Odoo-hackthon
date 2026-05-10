import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SectionHeader, Card, Button } from './Theme';
import { User, Mail, Globe, Shield, Trash2, Camera } from 'lucide-react';

export function ProfileSettings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <SectionHeader 
        title="Account Settings" 
        subtitle="Manage your profile, preferences, and security."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="flex flex-col items-center p-8 text-center">
            <div className="relative group">
              <img 
                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                className="w-32 h-32 rounded-full border-4 border-primary/20 p-1 mb-4" 
                alt="Profile"
              />
              <button className="absolute bottom-4 right-0 p-2 bg-white rounded-full shadow-lg border border-slate-100 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={16} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-slate-800">{user?.displayName || 'Traveler'}</h3>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">Premium Member</p>
          </Card>

          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start" icon={Globe}>Language: English</Button>
            <Button variant="outline" className="w-full justify-start" icon={Shield}>Security & Privacy</Button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="p-8">
            <h4 className="text-lg font-bold text-slate-800 mb-6">Profile Information</h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-primary transition-all font-bold"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    type="email" 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-primary transition-all font-bold text-slate-400"
                    value={email}
                    disabled
                  />
                </div>
              </div>
              <Button className="w-full md:w-auto px-10 py-4 text-base">Update Profile</Button>
            </div>
          </Card>

          <Card className="p-8 border-red-50 bg-red-50/10">
            <h4 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h4>
            <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="ghost" className="text-red-500 hover:bg-red-500 hover:text-white" icon={Trash2}>Delete Account</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
