import { motion } from 'motion/react';
import { Sparkles, GraduationCap, BookOpen, BrainCircuit } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div id="welcome-screen" className="min-h-screen flex flex-col items-center justify-center p-6 bg-linear-to-br from-orange-400 via-pink-400 to-indigo-500 overflow-hidden relative">
      {/* Decorative floating elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] opacity-20"
      >
        <BookOpen size={120} className="text-white" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-[15%] opacity-20"
      >
        <GraduationCap size={140} className="text-white" />
      </motion.div>
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-[10%] opacity-10"
      >
        <BrainCircuit size={180} className="text-white" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full text-center glass rounded-3xl p-10 md:p-16 z-10"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-4 bg-orange-500 rounded-2xl shadow-lg"
          >
            <Sparkles className="text-white" size={48} />
          </motion.div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-slate-900">
          Clever <span className="text-orange-500">Minds</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed">
          Your playful AI tutor that makes homework a breeze and learning a blast! 🚀
        </p>

        <motion.button
          id="btn-get-started"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-12 py-5 bg-slate-900 text-white rounded-full text-2xl font-bold hover:bg-orange-500 transition-colors shadow-2xl cursor-pointer"
        >
          Let's Go!
        </motion.button>

        <div className="mt-12 flex justify-center gap-8 text-slate-500 overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">AI Tutor Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">All Subjects</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
