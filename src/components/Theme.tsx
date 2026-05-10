import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Plane, LogOut, LayoutDashboard, Map, Calculator, CheckSquare, Plus, Compass } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

interface PageContainerProps {
  children: ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showNav?: boolean;
}

export function PageContainer({ children, activeTab, onTabChange, showNav = true }: PageContainerProps) {
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trips', label: 'My Journeys', icon: Map },
    { id: 'explorer', label: 'Global Explorer', icon: Compass },
    { id: 'budget', label: 'Budget & Costs', icon: Calculator },
    { id: 'packing', label: 'Packing List', icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar - Hidden on mobile */}
      {showNav && user && (
        <nav className="hidden md:flex w-60 bg-white border-r border-border-subtle flex-col z-20 h-full">
          <div className="p-8">
            <h1 className="text-2xl font-extrabold tracking-tighter text-primary">Traveloop</h1>
          </div>

          <div className="flex-1 space-y-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange?.(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-8 py-3.5 transition-all duration-200 font-semibold text-sm border-l-4",
                  activeTab === item.id 
                    ? "bg-primary-light text-primary border-primary" 
                    : "text-text-muted hover:bg-gray-50 hover:text-text-main border-transparent"
                )}
                id={`nav-${item.id}`}
              >
                <item.icon size={18} className={cn(activeTab === item.id ? "text-primary" : "text-slate-400")} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="p-6 border-t border-slate-50 mt-auto">
            <div className="flex items-center gap-3 mb-6">
              <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Profile" className="w-9 h-9 rounded-full bg-slate-100" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.displayName || 'Traveler'}</p>
                <p className="text-[11px] text-text-muted truncate uppercase tracking-wider font-bold">Premium Voyager</p>
              </div>
            </div>
            <button 
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all text-sm font-bold"
              id="logout-button"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </nav>
      )}

      {/* Mobile Bottom Navigation */}
      {showNav && user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border-subtle flex justify-around p-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] backdrop-blur-lg bg-white/90">
          {navItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                activeTab === item.id ? "text-primary scale-110" : "text-slate-400"
              )}
            >
              <item.icon size={22} className={cn(activeTab === item.id ? "fill-primary/10" : "")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label.split(' ')[0]}</span>
            </button>
          ))}
          <button
            onClick={() => onTabChange?.('settings')}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
              activeTab === 'settings' ? "text-primary" : "text-slate-400"
            )}
          >
            <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-200">
              <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Profile" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Me</span>
          </button>
        </nav>
      )}

      {/* Main Content */}
      <main className={cn("flex-1 overflow-y-auto bg-bg-main relative", showNav && user && "pb-24 md:pb-0")}>
        <div className="max-w-7xl mx-auto px-8 py-10 md:px-12 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div>
        <div className="w-10 h-1.5 bg-primary mb-3 rounded-full" />
        <h2 className="text-3xl font-extrabold tracking-tight text-text-main">{title}</h2>
        {subtitle && <p className="text-text-muted mt-1 text-base font-medium">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center shrink-0">{action}</div>}
    </div>
  );
}

export function Card({ children, className, onClick, id }: { children: ReactNode; className?: string; onClick?: () => void; id?: string }) {
  return (
    <div 
      id={id}
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border border-border-subtle shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 overflow-hidden transition-all duration-200",
        onClick && "cursor-pointer hover:border-amber-400 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Button({ children, variant = 'primary', className, onClick, icon: Icon, id, type = "button", disabled }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; className?: string; onClick?: () => void; icon?: any; id?: string; type?: "button" | "submit"; disabled?: boolean }) {
  const variants = {
    primary: "bg-primary text-white hover:bg-amber-600 shadow-sm active:translate-y-px",
    secondary: "bg-text-main text-white hover:bg-slate-800 shadow-sm active:translate-y-px",
    outline: "border border-border-subtle text-text-main hover:border-primary hover:text-primary active:translate-y-px",
    ghost: "text-text-muted hover:bg-slate-50 active:translate-y-px",
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
