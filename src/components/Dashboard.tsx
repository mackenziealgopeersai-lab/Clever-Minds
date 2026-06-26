import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Beaker, 
  History as HistoryIcon, 
  BookOpen, 
  Globe, 
  Palette, 
  Send, 
  ArrowLeft,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  BrainCircuit,
  GraduationCap,
  Briefcase,
  Languages,
  Handshake,
  Cpu,
  Users,
  MessageSquare
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Subject, Message, SubjectInfo } from '../types';
import { SUBJECTS } from '../constants';
import { ai } from '../lib/gemini';

const ICON_MAP = {
  Calculator,
  Beaker,
  History: HistoryIcon,
  BookOpen,
  Globe,
  Palette,
  BrainCircuit,
  Briefcase,
  Languages,
  Handshake,
  Cpu,
  Users,
  MessageSquare
};

export default function Dashboard() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isHomeworkMode, setIsHomeworkMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const subject = SUBJECTS.find(s => s.id === selectedSubject);
      
      let systemPrompt = `You are "Clever Minds AI", a friendly, helpful, and highly intelligent AI tutor for students of all ages. 
      You are currently helping with the subject: ${subject?.name || 'General Studies'}.
      Explain concepts clearly and use analogies. Keep your tone encouraging and lively. Use emojis occasionally.`;

      if (isHomeworkMode) {
        systemPrompt += `
        CRITICAL: YOU ARE IN HOMEWORK HELPER MODE. 
        - Do NOT give the final answer immediately.
        - Instead, provide HINTS and ask leading questions to help the student find the answer themselves.
        - Explain the underlying CONCEPTS first.
        - If they are stuck on a multi-step problem, show them how to do the FIRST STEP only, then ask them what they think the next step is.
        - Foster independent learning and confidence.
        - Only provide the full step-by-step solution if the student specifically asks for a demonstration of a similar problem or if they are truly stuck after several hints.`;
      } else {
        systemPrompt += `
        - Provide direct explanations and answers when asked.
        - Focus on engaging conversation and quick facts.`;
      }

      const chat = ai.chats.create({
        model: isHomeworkMode ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview",
        config: {
          systemInstruction: systemPrompt,
        }
      });

      const result = await chat.sendMessage({
        message: input,
      });

      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result.text || "I'm sorry, I'm having a little trouble thinking. Could you try asking again?",
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Oops! My brain froze for a second. Please try asking again!",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    const subjectInfo = SUBJECTS.find(s => s.id === subject);
    setMessages([{
      id: 'welcome',
      role: 'model',
      text: `Hi there! I'm your ${subjectInfo?.name} tutor. What can I help you learn today? You can ask me for homework help, explanations of concepts, or just some fun facts!`,
      timestamp: Date.now()
    }]);
  };

  const resetChat = () => {
    setSelectedSubject(null);
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={resetChat}>
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Clever Minds</h1>
        </div>
        
        {selectedSubject && (
          <button 
            onClick={resetChat}
            className="flex items-center gap-2 text-slate-500 hover:text-orange-500 transition-colors font-medium px-4 py-2 rounded-full hover:bg-orange-50"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Change Subject</span>
          </button>
        )}
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col">
        <AnimatePresence mode="wait">
          {!selectedSubject ? (
            <motion.div
              key="subject-selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-10 text-center">
                <h2 className="text-4xl font-bold mb-3">What are we learning today?</h2>
                <p className="text-slate-500 text-lg">Pick a subject to start your learning journey!</p>
              </div>

              {/* Quick Tip Section */}
              <div className="mb-10 p-6 bg-linear-to-r from-orange-100 to-pink-100 rounded-3xl border border-orange-200 flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <BrainCircuit className="text-orange-500" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-orange-900">Learning Tip:</h4>
                  <p className="text-orange-800 text-sm">Did you know? Taking short breaks every 25 minutes (the Pomodoro technique) helps your brain stay sharp! 🧠</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SUBJECTS.map((subject) => {
                  const Icon = ICON_MAP[subject.icon as keyof typeof ICON_MAP];
                  return (
                    <motion.button
                      key={subject.id}
                      whileHover={{ scale: 1.03, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubjectSelect(subject.id)}
                      className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all text-left flex flex-col border border-slate-100 group"
                    >
                      <div className={`w-14 h-14 ${subject.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-6 transition-transform`}>
                        <Icon size={28} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{subject.name}</h3>
                      <p className="text-slate-500 flex-1">{subject.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat-interface"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 mb-6"
            >
              {/* Chat Header */}
              <div className={`p-4 ${SUBJECTS.find(s => s.id === selectedSubject)?.color} text-white flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    {(() => {
                      const subject = SUBJECTS.find(s => s.id === selectedSubject);
                      const Icon = ICON_MAP[subject?.icon as keyof typeof ICON_MAP] || Calculator;
                      return <Icon size={20} />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-bold">{SUBJECTS.find(s => s.id === selectedSubject)?.name} Tutor</h3>
                    <div className="flex items-center gap-1.5 opacity-80">
                      <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                      <span className="text-xs font-medium">Ready to help</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-xs border border-white/10">
                    <GraduationCap size={16} />
                    <span className="text-xs font-semibold hidden sm:inline">Homework Mode</span>
                    <button 
                      onClick={() => setIsHomeworkMode(!isHomeworkMode)}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isHomeworkMode ? 'bg-white' : 'bg-white/30'}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-orange-500 shadow ring-0 transition duration-200 ease-in-out ${isHomeworkMode ? 'translate-x-5' : 'translate-x-0'}`}
                      />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setMessages(messages.slice(0, 1))}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Reset conversation"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 relative">
                {isHomeworkMode && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky top-0 z-10 mx-auto max-w-md bg-orange-100 border border-orange-200 text-orange-800 px-4 py-2 rounded-xl text-xs font-medium shadow-sm flex items-center justify-center gap-2"
                  >
                    <GraduationCap size={14} />
                    <span>Homework Helper Active: I'll provide hints and concepts!</span>
                  </motion.div>
                )}
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                        message.role === 'user' ? 'bg-slate-900' : 'bg-orange-500'
                      }`}>
                        {message.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                      </div>
                      <div className={`p-4 rounded-2xl ${
                        message.role === 'user' 
                          ? 'bg-slate-900 text-white rounded-tr-none' 
                          : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                      }`}>
                        <div className={`prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert text-white' : 'text-slate-800'}`}>
                          <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                        <Bot size={16} className="text-white" />
                      </div>
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-100">
                <form 
                  onSubmit={handleSendMessage}
                  className="relative flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isHomeworkMode ? "Paste your homework question here..." : `Ask your ${selectedSubject} question...`}
                    disabled={isLoading}
                    className="w-full bg-slate-100 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500 transition-all text-slate-800 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:hover:bg-slate-900 shadow-lg"
                  >
                    <Send size={20} />
                  </button>
                </form>
                <p className="text-[10px] text-center text-slate-400 mt-3">
                  Clever Minds AI can make mistakes. Always double check important homework!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
