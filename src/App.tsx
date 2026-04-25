/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import TransactionPage from "./pages/TransactionPage";
import Reports from "./pages/Reports";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import PremiumModal from "./components/PremiumModal";
import { AuthProvider } from "./context/AuthContext";
import { useState } from "react";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const [showPremium, setShowPremium] = useState(false);
  const isAuth = window.location.pathname !== '/login' && window.location.pathname !== '/signup';

  return (
    <>
      <PremiumModal isOpen={showPremium} onClose={() => setShowPremium(false)} />
      <div className="min-h-screen bg-[#F8F9FA] flex">
        {isAuth && <Sidebar />}
        <div className={classNames("flex-1 flex flex-col min-h-screen", isAuth ? "lg:ml-64" : "")}>
          {isAuth && <Navbar />}
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/signup" element={<AuthPage mode="signup" />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<TransactionPage type="expense" title="Expenses" onPremiumFeature={() => setShowPremium(true)} />} />
              <Route path="/income" element={<TransactionPage type="income" title="Income" onPremiumFeature={() => setShowPremium(true)} />} />
              <Route path="/reports" element={<Reports onPremiumFeature={() => setShowPremium(true)} />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
