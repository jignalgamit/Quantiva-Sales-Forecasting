import { useState } from "react";
import { LucideIcon, Home, LogIn, Info, HelpCircle, History, User, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, isActive, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
      isActive
        ? "bg-white/10 text-white"
        : "text-white/60 hover:text-white hover:bg-white/5"
    }`}
  >
    <Icon size={18} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({ isLoggedIn, onLogin, onLogout }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      onLogout();
      console.log("Logged out locally");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-between items-center px-8">
      {/* Logo */}
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => navigate("/")}
      >
        <div className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">Q</span>
        </div>
        <span className="text-white font-bold text-xl tracking-tight">Quantiva</span>
      </div>

      {/* Pill Menu Bar (Moved to Right Side) */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-1.5 rounded-full flex items-center gap-1">
        <NavItem 
          icon={Home} 
          label="Home" 
          isActive={location.pathname === "/"} 
          onClick={() => navigate("/")} 
        />
        {!isLoggedIn && <NavItem icon={LogIn} label="Login" onClick={onLogin} />}
        {(location.pathname === "/" || location.pathname === "/about") && (
          <NavItem 
            icon={Info} 
            label="About" 
            isActive={location.pathname === "/about"}
            onClick={() => navigate("/about")}
          />
        )}
        {isLoggedIn && (
          <NavItem 
            icon={LogOut} 
            label="Logout" 
            onClick={handleLogout} 
          />
        )}
        <NavItem 
          icon={HelpCircle} 
          label="Help" 
          isActive={location.pathname === "/help"} 
          onClick={() => navigate("/help")} 
        />
        <NavItem 
          icon={User} 
          label="Account" 
          isActive={location.pathname === "/account"} 
          onClick={() => {
            if (isLoggedIn) {
              navigate("/account");
            } else {
              navigate("/login");
            }
          }} 
        />
      </div>
    </nav>
  );
}
