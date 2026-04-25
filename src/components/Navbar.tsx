/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell, Search, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-gray-100 bg-white sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full bg-gray-50 border border-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
            id="global-search"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors relative" id="notifications-btn">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-gray-100 mx-2"></div>
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 cursor-pointer group" 
          id="user-profile-menu"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">{user?.displayName || 'User'}</p>
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-tighter">{user?.subscription || 'Free'} Plan</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden group-hover:border-gray-100 transition-all">
            {user?.photoURL ? (
               <img src={user.photoURL} alt="User" referrerPolicy="no-referrer" />
            ) : (
               <User className="text-gray-400" size={24} />
            )}
          </div>
          <LogOut size={16} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
        </button>
      </div>
    </header>
  );
}
