import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#fcfbf9] text-[#171717] font-sans antialiased selection:bg-indigo-100 selection:text-indigo-800">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="border-t border-[#e5e5e5] py-10 bg-white/50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-charcoal/50 gap-4">
              <div>// NOMNOM LINK ARCHITECTURE — ORGANIC INTELLIGENCE</div>
              <div>PRESS WITH INTENT</div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
