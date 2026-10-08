import React from 'react';
import { 
  CloudRain, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  ShieldAlert, 
  Compass, 
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';

export function WeatherForecastWidget({ isEscalated, currentLanguage = 'en' }) {
  // Multilingual labels for Weather section
  const LABELS = {
    en: {
      title: 'Current Weather Intelligence & Predictive Disaster Forecast',
      liveBadge: 'Live Meteorological Sensor',
      temp: isEscalated ? '21°C' : '24°C',
      condition: isEscalated ? 'Extreme Torrential Downpour (Cloudburst)' : 'Monsoonal Heavy Rainfall',
      rainfall: isEscalated ? '96 mm/hr' : '48 mm/hr',
      humidity: isEscalated ? '98%' : '91%',
      wind: isEscalated ? '44 km/h (Gusting 62 km/h)' : '26 km/h SW',
      waterLevel: isEscalated ? '5.4m (CRITICAL DANGER)' : '2.8m (Warning Mark)',
      floodRisk: isEscalated ? 'CRITICAL INUNDATION' : 'HIGH SURGE ALERT',
      whatNextTitle: '🔮 AI Predictive Disaster Trajectory ("What Could Happen Next")',
      pred1Time: 'In Next 30 Mins',
      pred1: isEscalated 
        ? '🌧️ Rainfall intensity escalating past 110mm/hr. Secondary stormwater canal overflow inevitable in Halasuru Basin.' 
        : '🌧️ Rainfall expected to intensify by +35%. Ingress underpasses along Indiranagar 100ft road at risk of 1.2m pooling.',
      pred2Time: 'In Next 60 Mins',
      pred2: isEscalated 
        ? '🚧 Total road blockage of CMH Road & Old Airport Road junction. Ground floor evacuation mandatory for 8,500 residents.' 
        : '🌊 Water runoff surging into Bellandur-Yamalur catchment. Traffic corridor speed reduced to < 10 km/h.',
      pred3Time: 'In Next 120 Mins',
      pred3: isEscalated 
        ? '👥 Vulnerable population exposure increases by +2,400 citizens. Transformer feeder shutdown recommended to prevent electrocution.' 
        : '⚡ High risk of localized tree-falls and BESCOM power trips in Peenya and Hebbal sectors.',
      actionTitle: 'Automated Response Recommendation:',
      actionText: isEscalated 
        ? 'Immediate NDRF boat squad mobilization + Emergency sirens sounded. Direct water tankers and evacuation buses to Halasuru Relief Camp.' 
        : 'Pre-position 2 heavy dewatering pumps at low-lying culverts; alert Junior Engineers in South Zone.'
    },
    kn: {
      title: 'ನೈಜ ಹವಾಮಾನ ಮತ್ತು ಮುಂದಿನ ವಿಪತ್ತು ಮುನ್ಸೂಚನೆ',
      liveBadge: 'ಲೈವ್ ಹವಾಮಾನ ಸಂವೇದಕ',
      temp: isEscalated ? '21°C' : '24°C',
      condition: isEscalated ? 'ವಿಪರೀತ ಧಾರಾಕಾರ ಮಳೆ (ಮೇಘಸ್ಫೋಟ)' : 'ಮುಂಗಾರು ಭಾರಿ ಮಳೆ',
      rainfall: isEscalated ? '96 ಮಿ.ಮೀ/ಗಂಟೆ' : '48 ಮಿ.ಮೀ/ಗಂಟೆ',
      humidity: isEscalated ? '98%' : '91%',
      wind: isEscalated ? '44 ಕಿ.ಮೀ/ಗಂಟೆ' : '26 ಕಿ.ಮೀ/ಗಂಟೆ',
      waterLevel: isEscalated ? '5.4 ಮೀಟರ್ (ಅಪಾಯದ ಮಟ್ಟ)' : '2.8 ಮೀಟರ್ (ಎಚ್ಚರಿಕೆ ಮಟ್ಟ)',
      floodRisk: isEscalated ? 'ಅತ್ಯಂತ ಗಂಭೀರ ಪ್ರವಾಹ' : 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
      whatNextTitle: '🔮 AI ಮುಂದಿನ ಮುನ್ಸೂಚನೆ ("ಮುಂದೆ ಏನಾಗಬಹುದು")',
      pred1Time: 'ಮುಂದಿನ 30 ನಿಮಿಷಗಳಲ್ಲಿ',
      pred1: isEscalated 
        ? '🌧️ ಮಳೆಯ ತೀವ್ರತೆ ಹೆಚ್ಚಳ. ಹಲಸೂರು ಕೆರೆ ಪ್ರದೇಶದಲ್ಲಿ ನೀರು ನುಗ್ಗುವ ಸಾಧ್ಯತೆ.' 
        : '🌧️ ಮಳೆ +35% ಹೆಚ್ಚಾಗುವ ಸಾಧ್ಯತೆ. ಇಂದಿರಾನಗರ 100 ಅಡಿ ರಸ್ತೆಯಲ್ಲಿ ನೀರು ನಿಲ್ಲುವ ಅಪಾಯ.',
      pred2Time: 'ಮುಂದಿನ 60 ನಿಮಿಷಗಳಲ್ಲಿ',
      pred2: isEscalated 
        ? '🚧 ಪ್ರಮುಖ ರಸ್ತೆ ಸಂಚಾರ ಸ್ಥಗಿತ. ತಳಮಹಡಿಯ ನಿವಾಸಿಗಳು ತಕ್ಷಣ ಎತ್ತರದ ಸ್ಥಳಕ್ಕೆ ತೆರಳಬೇಕು.' 
        : '🌊 ಬೆಳ್ಳಂದೂರು ಪ್ರದೇಶದಲ್ಲಿ ನೀರಿನ ಮಟ್ಟ ಏರಿಕೆ. ರಸ್ತೆ ಸಂಚಾರ ನಿಧಾನ.',
      pred3Time: 'ಮುಂದಿನ 120 ನಿಮಿಷಗಳಲ್ಲಿ',
      pred3: isEscalated 
        ? '👥 8,500 ನಾಗರಿಕರ ಮೇಲೆ ಪರಿಣಾಮ. ವಿದ್ಯುತ್ ತಂತಿ ಕಡಿತ ಮುನ್ನೆಚ್ಚರಿಕೆ.' 
        : '⚡ ಪೀಣ್ಯ ಮತ್ತು ಹೆಬ್ಬಾಳ ಭಾಗದಲ್ಲಿ ಮರ ಬೀಳುವ ಸಾಧ್ಯತೆ.',
      actionTitle: 'ಶಿಫಾರಸು ಮಾಡಿದ ತುರ್ತು ಕ್ರಮ:',
      actionText: isEscalated 
        ? 'ತಕ್ಷಣ ರಕ್ಷಣಾ ದೋಣಿ ನಿಯೋಜನೆ ಮತ್ತು ಸೈರನ್ ಮೊಳಗಿಸಿ. ಪುನರ್ವಸತಿ ಶಿಬಿರ ತೆರೆಯಿರಿ.' 
        : 'ನೀರು ಹೊರಹಾಕುವ ಪಂಪ್‌ಗಳನ್ನು ಸನ್ನದ್ಧವಾಗಿಡಿ; ಕಿರಿಯ ಎಂಜಿನಿಯರ್‌ಗಳಿಗೆ ಎಚ್ಚರಿಕೆ ನೀಡಿ.'
    },
    hi: {
      title: 'वर्तमान मौसम खुफिया और आपदा का पूर्वानुमान',
      liveBadge: 'लाइव मौसम सेंसर',
      temp: isEscalated ? '21°C' : '24°C',
      condition: isEscalated ? 'अत्यधिक मूसलाधार बारिश (बादल फटना)' : 'मानसून की भारी बारिश',
      rainfall: isEscalated ? '96 मिमी/घंटा' : '48 मिमी/घंटा',
      humidity: isEscalated ? '98%' : '91%',
      wind: isEscalated ? '44 किमी/घंटा' : '26 किमी/घंटा',
      waterLevel: isEscalated ? '5.4 मीटर (गंभीर खतरा)' : '2.8 मीटर (चेतावनी स्तर)',
      floodRisk: isEscalated ? 'गंभीर बाढ़ का खतरा' : 'उच्च जलस्तर चेतावनी',
      whatNextTitle: '🔮 AI आपदा का अगला अनुमान ("आगे क्या हो सकता है")',
      pred1Time: 'अगले 30 मिनट में',
      pred1: isEscalated 
        ? '🌧️ बारिश की तीव्रता 110 मिमी/घंटा पार कर रही है। हलासुरु बेसिन में जलभराव निश्चित।' 
        : '🌧️ बारिश +35% तक बढ़ने की संभावना। इंदिरानगर 100 फीट रोड पर 1.2 मीटर पानी भरने का खतरा।',
      pred2Time: 'अगले 60 मिनट में',
      pred2: isEscalated 
        ? '🚧 प्रमुख सड़कें पूरी तरह बंद। 8,500 निवासियों को सुरक्षित स्थानों पर पहुँचाना अनिवार्य।' 
        : '🌊 बेल्लंदूर इलाके में जलस्तर बढ़ रहा है। यातायात की गति बहुत धीमी।',
      pred3Time: 'अगले 120 मिनट में',
      pred3: isEscalated 
        ? '👥 8,500 नागरिकों पर प्रभाव। करंट के खतरे से बचने के लिए बिजली फीडर बंद करने की सिफारिश।' 
        : '⚡ पीण्या और हेब्बल में पेड़ गिरने और बिजली जाने का खतरा।',
      actionTitle: 'स्वचालित आपातकालीन कार्रवाई:',
      actionText: isEscalated 
        ? 'एनडीआरएफ नाव दस्ते को तुरंत तैनात करें। राहत शिविरों में पानी के टैंकर और बसें भेजें।' 
        : 'जल निकासी पंप तैयार रखें; कनिष्ठ अभियंताओं को सतर्क करें।'
    },
    ta: {
      title: 'தற்போதைய வானிலை அறிக்கை மற்றும் பேரிடர் முன்னறிவிப்பு',
      liveBadge: 'நேரடி வானிலை சென்சார்',
      temp: isEscalated ? '21°C' : '24°C',
      condition: isEscalated ? 'கனமழை (மேகவெடிப்பு)' : 'பருவமழை தீவிரமழை',
      rainfall: isEscalated ? '96 மி.மீ/மணி' : '48 மி.மீ/மணி',
      humidity: isEscalated ? '98%' : '91%',
      wind: isEscalated ? '44 கி.மீ/மணி' : '26 கி.மீ/மணி',
      waterLevel: isEscalated ? '5.4 மீட்டர் (ஆபத்து எல்லை)' : '2.8 மீட்டர் (எச்சரிக்கை அளவு)',
      floodRisk: isEscalated ? 'தீவிர வெள்ள அபாயம்' : 'உயர் வெள்ள எச்சரிக்கை',
      whatNextTitle: '🔮 AI பேரிடர் கணிப்பு ("அடுத்து என்ன நடக்கலாம்")',
      pred1Time: 'அடுத்த 30 நிமிடங்களில்',
      pred1: isEscalated 
        ? '🌧️ மழை தீவிரம் அதிகரிக்கும். ஹலசூரு ஏரி பகுதியில் நீர் பெருகும்.' 
        : '🌧️ மழை +35% அதிகரிக்கும். இந்திராநகர் 100 அடி சாலையில் தண்ணீர் தேங்கும் அபாயம்.',
      pred2Time: 'அடுத்த 60 நிமிடங்களில்',
      pred2: isEscalated 
        ? '🚧 முக்கிய சாலைகள் அடைக்கப்படும். தரைத்தளத்தில் உள்ளவர்கள் வெளியேற வேண்டும்.' 
        : '🌊 பெல்லந்தூர் பகுதியில் நீர்வரத்து அதிகரிப்பு. போக்குவரத்து நெரிசல்.',
      pred3Time: 'அடுத்த 120 நிமிடங்களில்',
      pred3: isEscalated 
        ? '👥 8,500 பொதுமக்கள் பாதிக்கப்படலாம். மின் இணைப்புகள் துண்டிக்கப்பட வேண்டும்.' 
        : '⚡ பீன்யா மற்றும் ஹெப்பால் பகுதிகளில் மரம் விழும் அபாயம்.',
      actionTitle: 'பரிந்துரைக்கப்பட்ட அவசர நடவடிக்கை:',
      actionText: isEscalated 
        ? 'உடனடியாக மீட்புப் படகுகளை நிலைநிறுத்துங்கள் மற்றும் நிவாரண முகாம்களைத் திறக்கவும்.' 
        : 'நீர் இறைக்கும் பம்புகளை தயார் நிலையில் வையுங்கள்.'
    },
    te: {
      title: 'ప్రస్తుత వాతావరణ సమాచారం మరియు విపత్తు అంచనా',
      liveBadge: 'లైవ్ వాతావరణ సెన్సార్',
      temp: isEscalated ? '21°C' : '24°C',
      condition: isEscalated ? 'తీవ్రమైన భారీ వర్షం (మేఘవిస్ఫోటనం)' : 'రుతుపవనాల భారీ వర్షం',
      rainfall: isEscalated ? '96 మి.మీ/గంట' : '48 మి.మీ/గంట',
      humidity: isEscalated ? '98%' : '91%',
      wind: isEscalated ? '44 కి.మీ/గంట' : '26 కి.మీ/గంట',
      waterLevel: isEscalated ? '5.4 మీటర్లు (తీవ్ర ప్రమాదం)' : '2.8 మీటర్లు (హెచ్చరిక స్థాయి)',
      floodRisk: isEscalated ? 'తీవ్రమైన వరద ప్రమాదం' : 'వరద హెచ్చరిక',
      whatNextTitle: '🔮 AI ముందస్తు అంచనా ("తర్వాత ఏం జరగవచ్చు")',
      pred1Time: 'తదుపరి 30 నిమిషాల్లో',
      pred1: isEscalated 
        ? '🌧️ వర్షం తీవ్రత పెరుగుతుంది. హలసూరు ప్రాంతంలోకి వరద నీరు చేరవచ్చు.' 
        : '🌧️ వర్షం +35% పెరిగే అవకాశం. ఇందిరానగర్ 100 అడుగుల రోడ్డుపై నీరు నిలిచే ప్రమాదం.',
      pred2Time: 'తదుపరి 60 నిమిషాల్లో',
      pred2: isEscalated 
        ? '🚧 ప్రధాన రహదారులు మూసివేయబడతాయి. ప్రజలను సురక్షిత ప్రాంతాలకు తరలించాలి.' 
        : '🌊 బెల్లందూరు ప్రాంతంలో నీటి ప్రవాహం పెరుగుతుంది. ట్రాఫిక్ తీవ్ర అంతరాయం.',
      pred3Time: 'తదుపరి 120 నిమిషాల్లో',
      pred3: isEscalated 
        ? '👥 8,500 మంది పౌరులపై ప్రభావం. విద్యుత్ ప్రమాదాలను నివారించాలి.' 
        : '⚡ పీణ్య మరియు హెబ్బాళ్ ప్రాంతాల్లో చెట్లు కూలే ప్రమాదం.',
      actionTitle: 'సిఫార్సు చేసిన అత్యవసర చర్య:',
      actionText: isEscalated 
        ? 'తక్షణమే సహాయక పడవలను రంగంలోకి దించండి మరియు పునరావాస కేంద్రాలను ప్రారంభించండి.' 
        : 'నీటిని తోడే పంపులను సిద్ధంగా ఉంచండి; ఇంజనీర్లను అప్రమత్తం చేయండి.'
    }
  };

  const t = LABELS[currentLanguage] || LABELS.en;

  return (
    <div className="rounded-2xl glass-panel border border-white/15 p-5 space-y-4 shadow-xl">
      
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30 shrink-0">
            <CloudRain className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2 flex-wrap">
              <span>{t.title}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isEscalated ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              }`}>
                {t.liveBadge}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Bengaluru Municipal Catchment Grid (South & East Basins) • Telemetry Synchronized
            </p>
          </div>
        </div>

        {/* Flood Risk Pill */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border shadow-sm ${
            isEscalated ? 'bg-red-600 text-white border-red-400 animate-pulse' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}>
            {t.floodRisk}
          </span>
        </div>
      </div>

      {/* Current Real-Time Atmospheric Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Temperature</span>
            <span className="text-cyan-400">🌡️</span>
          </div>
          <div className="text-2xl font-black text-white mt-1">{t.temp}</div>
          <div className="text-[10px] text-slate-400 truncate mt-0.5">{t.condition}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Precipitation Rate</span>
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400 mt-1">{t.rainfall}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Humidity: {t.humidity}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Wind & Gusts</span>
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-black text-white mt-1">{t.wind}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Barometer: 1004 hPa (Dropping)</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Canal Water Level</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-black text-amber-400 mt-1">{t.waterLevel}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Surge Velocity: +0.4m/hr</div>
        </div>
      </div>

      {/* PREDICTIVE AI TRAJECTORY: "WHAT COULD HAPPEN NEXT" */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-blue-950/40 border border-indigo-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{t.whatNextTitle}</span>
          </h3>
          <span className="text-[10px] text-cyan-400 font-mono">Continuous Forecast</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
          
          {/* Prediction Stage 1 */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-[10px]">
                  {t.pred1Time}
                </span>
                <span className="text-[10px] text-slate-400">Phase 1</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-relaxed mt-1">
                {t.pred1}
              </p>
            </div>
          </div>

          {/* Prediction Stage 2 */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">
                  {t.pred2Time}
                </span>
                <span className="text-[10px] text-slate-400">Phase 2</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-relaxed mt-1">
                {t.pred2}
              </p>
            </div>
          </div>

          {/* Prediction Stage 3 */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono font-bold text-[10px]">
                  {t.pred3Time}
                </span>
                <span className="text-[10px] text-slate-400">Phase 3</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-relaxed mt-1">
                {t.pred3}
              </p>
            </div>
          </div>

        </div>

        {/* Action Mitigation Recommendation */}
        <div className="p-2.5 rounded-lg bg-blue-950/50 border border-blue-500/30 text-xs flex items-start gap-2 text-blue-200">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong>{t.actionTitle}</strong> {t.actionText}
          </div>
        </div>

      </div>

    </div>
  );
}
