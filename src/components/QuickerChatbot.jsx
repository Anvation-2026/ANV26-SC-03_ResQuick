import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  X, 
  Sparkles
} from 'lucide-react';
import { LANGUAGES } from '../data/translations';
import { playDispatchPing } from '../utils/soundEffects';

export function QuickerChatbot({
  currentLanguage,
  onOpenReportModal,
  onOpenTrackModal,
  onOpenHelplinesModal,
  incidents
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatLang, setChatLang] = useState(currentLanguage || 'en');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! 👋 I am Quicker, your friendly ResQuick AI assistant. You can speak or type in your language. How can I assist you today?',
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Voice listener for chatbot
  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    setIsRecording(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = chatLang === 'kn' ? 'kn-IN' : chatLang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.onresult = (e) => {
        const spoken = e.results[0][0].transcript;
        setInputText(spoken);
        setIsRecording(false);
      };
      recognition.onerror = () => {
        simulateVoiceQuery();
      };
      try {
        recognition.start();
      } catch (e) {
        simulateVoiceQuery();
      }
    } else {
      simulateVoiceQuery();
    }
  };

  const simulateVoiceQuery = () => {
    setTimeout(() => {
      const queries = {
        kn: 'ಹಲೋ ಕ್ವಿಕ್ಕರ್, ನನ್ನ ದೂರು CS-2026-00001 ಸ್ಥಿತಿ ಏನು?',
        hi: 'नमस्ते, क्या मेरे इलाके में कोई खतरा है?',
        en: 'Hi Quicker, what is the status of complaint CS-2026-00001?'
      };
      setInputText(queries[chatLang] || queries.en);
      setIsRecording(false);
    }, 1800);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    playDispatchPing();
    const queryText = inputText.trim();
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    const lower = queryText.toLowerCase();

    setTimeout(() => {
      let replyText = '';
      let quickAction = null;

      // Friendly greetings
      if (['hi', 'hello', 'hey', 'namaste', 'namaskara', 'ಹಾಯ್', 'ಹಲೋ', 'ನಮಸ್ಕಾರ', 'வணக்கம்'].some(w => lower.startsWith(w) || lower === w)) {
        if (chatLang === 'kn') {
          replyText = 'ನಮಸ್ಕಾರ! 😊 ನಾನು ಕ್ವಿಕ್ಕರ್. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ? ನೀವು ಯಾವುದೇ ವಿಪತ್ತು ಅಥವಾ ನಾಗರಿಕ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಬಹುದು, ಅರ್ಜಿಯ ಸ್ಥಿತಿ ತಿಳಿಯಬಹುದು ಅಥವಾ ತುರ್ತು ಸಹಾಯ ಪಡೆಯಬಹುದು.';
        } else if (chatLang === 'hi') {
          replyText = 'नमस्ते! 😊 मैं क्विकर हूँ। मैं आपकी क्या मदद कर सकता हूँ? आप किसी भी समस्या की रिपोर्ट कर सकते हैं या आपातकालीन सहायता ले सकते हैं।';
        } else {
          replyText = 'Hello there! 😊 Great to connect with you. I am Quicker, your 24/7 disaster response assistant. What is happening in your neighborhood today? Need to report an issue or track an active dispatch?';
        }
      } 
      // How are you?
      else if (lower.includes('how are you') || lower.includes('ಹೇಗಿದ್ದೀರಾ') || lower.includes('कैसे हो')) {
        replyText = chatLang === 'kn' 
          ? 'ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ, ಧನ್ಯವಾದಗಳು! ನಾನು ನಗರದ ರಕ್ಷಣಾ ಕೇಂದ್ರದೊಂದಿಗೆ ಸಕ್ರಿಯವಾಗಿದ್ದೇನೆ. ನಿಮಗೆ ಏನಾದರೂ ಸಹಾಯ ಬೇಕೇ?'
          : 'I am active and monitoring all city zones! Standing by to assist you and keep your area safe. What can I do for you?';
      }
      // Shelters
      else if (lower.includes('shelter') || lower.includes('relief') || lower.includes('ಆಶ್ರಯ') || lower.includes('शिविर')) {
        replyText = '🏠 Active Emergency Shelters in Bengaluru:\n1. Halasuru Community Center (Capacity: 800, Food & Medical On-site)\n2. Indiranagar Club Auditorium (Capacity: 450)\n3. Hebbal Indoor Sports Complex (Capacity: 1,200)\nAll shelters have potable drinking water, first-aid paramedics, and power backup.';
      } 
      // Helplines
      else if (lower.includes('helpline') || lower.includes('number') || lower.includes('phone') || lower.includes('ಸಂಖ್ಯೆ') || lower.includes('नंबर')) {
        replyText = '📞 Important Emergency Helplines:\n• 112: Universal National Emergency (Police, Fire, Ambulance)\n• 1078: NDRF Central Disaster Control\n• 108: Trauma Ambulance Dispatch\n• 101: Fire & Extrication Rescue';
        quickAction = { label: 'Open Helplines Directory', handler: onOpenHelplinesModal };
      } 
      // Tracking
      else if (lower.includes('track') || lower.includes('status') || lower.includes('cs-') || lower.includes('00001') || lower.includes('8492') || lower.includes('ಸ್ಥಿತಿ')) {
        const lead = incidents[0];
        replyText = `🔍 Application ${lead?.id || 'CS-2026-00001'} (${lead?.issue || 'Pothole'}):\nCurrent Status: [${lead?.status || 'Assigned'}]\nAssigned Dept: ${lead?.assignedDepartment}\nOfficer: ${lead?.assignedOfficer || 'Sudeep (Junior Engineer)'}\nLocation: ${lead?.location}`;
        quickAction = { label: 'Open Live Application Review', handler: onOpenTrackModal };
      } 
      // Reporting problem
      else if (lower.includes('report') || lower.includes('problem') || lower.includes('pothole') || lower.includes('flood') || lower.includes('water') || lower.includes('ದೂರು') || lower.includes('ಗುಂಡಿ')) {
        replyText = 'You can submit an emergency report right now! You can use your voice, take a live photo, or let our GPS find your exact address.';
        quickAction = { label: 'Open Report Problem Form', handler: onOpenReportModal };
      } 
      // Default intelligent response
      else {
        replyText = chatLang === 'kn'
          ? `ತಿಳಿದುಕೊಂಡೆ. ನಾನು ನಿಮ್ಮ ಮಾತನ್ನು ಗಮನಿಸುತ್ತಿದ್ದೇನೆ. ನಿಮಗೆ ತುರ್ತು ವೈದ್ಯಕೀಯ, ಪ್ರವಾಹ ಅಥವಾ ರಸ್ತೆ ದುರಸ್ತಿ ನೆರವು ಬೇಕಿದ್ದರೆ ದಯವಿಟ್ಟು ತಿಳಿಸಿ.`
          : `Got it! I am actively tracking the situation. If you are experiencing waterlogging, road damage, or require rescue assistance, please let me know and I will immediately guide your dispatch.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: replyText,
          quickAction,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 500);
  };

  return (
    <>
      {/* Floating Quicker AI Button */}
      <div className="fixed bottom-5 right-5 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white shadow-2xl shadow-cyan-500/40 border border-white/20 group hover:scale-105 active:scale-95 transition-all"
          >
            <div className="relative">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black tracking-tight leading-tight">
                Ask Quicker AI
              </div>
              <div className="text-[10px] text-cyan-200 leading-tight">
                Conversational & Voice
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-96 max-w-[calc(100vw-2rem)] h-[500px] rounded-2xl glass-modal border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white">Quicker AI</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                    ● Online
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Emergency & Municipal Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <select
                value={chatLang}
                onChange={(e) => setChatLang(e.target.value)}
                className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] text-slate-200 border border-white/10"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.native}</option>
                ))}
              </select>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                      : 'bg-slate-900/90 text-slate-200 border border-white/10 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {m.quickAction && (
                    <button
                      onClick={m.quickAction.handler}
                      className="mt-2 block w-full py-1.5 px-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-[11px] font-bold text-center transition"
                    >
                      ⚡ {m.quickAction.label}
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Friendly Suggestion Chips */}
          <div className="px-3 py-1.5 bg-slate-950/60 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto text-[10px] text-slate-400">
            <button
              onClick={() => { setInputText('Hi Quicker!'); }}
              className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 truncate shrink-0"
            >
              👋 Say Hi
            </button>
            <button
              onClick={() => { setInputText('Track status of CS-2026-00001'); }}
              className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 truncate shrink-0"
            >
              🔍 Track CS-2026-00001
            </button>
            <button
              onClick={() => { setInputText('Where is the nearest emergency shelter?'); }}
              className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 truncate shrink-0"
            >
              🏠 Nearest Shelters
            </button>
            <button
              onClick={() => { setInputText('What is the emergency helpline number?'); }}
              className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 truncate shrink-0"
            >
              📞 Helplines
            </button>
          </div>

          {/* Input Box with Voice */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-950/90 border-t border-white/10 flex items-center gap-2">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-xl transition ${
                isRecording 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700'
              }`}
              title="Speak in your language"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isRecording ? 'Listening...' : 'Type or speak your question...'}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
