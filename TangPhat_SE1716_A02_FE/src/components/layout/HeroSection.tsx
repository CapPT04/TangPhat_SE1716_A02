import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <motion.div
      className="max-w-2xl flex flex-col justify-center items-center relative px-8"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Logo */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50">
            <Newspaper className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">FU News</h1>
            <p className="text-blue-300 text-sm">Management System</p>
          </div>
        </div>
      </motion.div>

      {/* Inspirational Quote */}
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-3xl font-light text-white mb-4 italic">
          "Kết nối thông tin,{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium neon-text">
            Chia sẻ tri thức
          </span>"
        </h2>
        <p className="text-slate-300 text-lg mb-6">
          Hệ thống quản lý tin tức hiện đại cho FPT University
        </p>
        <div className="w-24 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full shadow-lg shadow-blue-400/50"></div>
      </motion.div>
    </motion.div>
  );
};
