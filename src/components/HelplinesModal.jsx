import React from 'react';
import { 
  X, 
  PhoneCall, 
  ShieldAlert, 
  HeartPulse, 
  Flame, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { EMERGENCY_HELPLINES } from '../data/indiaNews';

export function HelplinesModal({
  isOpen,
  onClose,
  currentLanguage = 'en'
}) {
  if (!isOpen) return null;

  // Single language headers without any mixed text
  const HEADERS = {
    en: {
      title: '24/7 Emergency Helplines',
      subtitle: 'Direct emergency dispatch contact numbers for immediate civilian assistance',
      badge: 'Toll-Free 24/7',
      disclaimer: 'For life-critical emergencies, dial 112 immediately. ResQuick is an automated municipal dispatch assistant.'
    },
    kn: {
      title: '24/7 ತುರ್ತು ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆಗಳು',
      subtitle: 'ನಾಗರಿಕರ ರಕ್ಷಣೆಗಾಗಿ ತಕ್ಷಣದ ತುರ್ತು ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಳು',
      badge: 'ಶುಲ್ಕರಹಿತ 24/7',
      disclaimer: 'ಜೀವನ್ಮರಣದ ತುರ್ತು ಸಂದರ್ಭಗಳಲ್ಲಿ ತಕ್ಷಣ 112 ಕರೆ ಮಾಡಿ. ರೆಸ್ಕ್ವಿಕ್ ಪಾಲಿಕೆಯ ಸ್ವಯಂಚಾಲಿತ ರಕ್ಷಣಾ ಸಹಾಯಕವಾಗಿದೆ.'
    },
    hi: {
      title: '24/7 आपातकालीन हेल्पलाइन नंबर',
      subtitle: 'त्वरित नागरिक सहायता हेतु आपातकालीन संपर्क नंबर',
      badge: 'टोल-फ्री 24/7',
      disclaimer: 'अति गंभीर आपात स्थिति में तुरंत 112 डायल करें। रेस्किविक एक स्वचालित आपातकालीन सहायता प्रणाली है।'
    },
    ta: {
      title: '24/7 அவசர உதவி எண்கள்',
      subtitle: 'உடனடி குடிமக்கள் உதவிக்கான அவசர தொடர்பு எண்கள்',
      badge: 'கட்டணமில்லா 24/7',
      disclaimer: 'உடனடி ஆபத்து என்றால் உடனடியாக 112 எண்ணை அழைக்கவும்.'
    },
    te: {
      title: '24/7 అత్యవసర హెల్ప్‌లైన్ నంబర్లు',
      subtitle: 'తక్షణ పౌర సహాయం కోసం అత్యవసర సంప్రదింపు నంబర్లు',
      badge: 'టోల్-ఫ్రీ 24/7',
      disclaimer: 'తీవ్రమైన అత్యవసర పరిస్థితుల్లో వెంటనే 112 కు డయల్ చేయండి.'
    }
  };

  const text = HEADERS[currentLanguage] || HEADERS.en;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl glass-modal p-5 sm:p-7 border border-white/20 text-slate-100 shadow-2xl my-auto">
        
        {/* Close Button with dedicated top-right spacing */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Clean Alignment & No Mixed Language */}
        <div className="flex items-start gap-3.5 mb-5 pr-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 shrink-0 mt-0.5">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-black text-white m-0">
                {text.title}
              </h2>
              {/* Perfectly aligned horizontal Toll-Free pill */}
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/40 inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {text.badge}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {text.subtitle}
            </p>
          </div>
        </div>

        {/* Helplines List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
          {EMERGENCY_HELPLINES.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition flex items-start justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 text-[10px] font-bold">
                    {item.badge}
                  </span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> 24x7
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition mb-0.5">
                  {item.name}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {item.desc}
                </p>
              </div>

              {/* Direct Dial Call Button */}
              <a
                href={`tel:${item.number.replace(/-/g, '')}`}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-black text-xs border border-cyan-500/40 transition shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{item.number}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Disclaimer Footer */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/10 text-center text-xs text-slate-400">
          ⚠️ <em>{text.disclaimer}</em>
        </div>

      </div>
    </div>
  );
}
