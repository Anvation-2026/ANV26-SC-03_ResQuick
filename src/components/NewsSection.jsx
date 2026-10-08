import React, { useState } from 'react';
import { 
  X, 
  Globe2, 
  AlertTriangle, 
  Users, 
  Building, 
  Clock, 
  ExternalLink, 
  ShieldAlert, 
  Flame, 
  CloudRain,
  PlusCircle,
  Save,
  CheckCircle2,
  Newspaper
} from 'lucide-react';
import { INDIA_DISASTER_NEWS } from '../data/indiaNews';
import { playDispatchPing } from '../utils/soundEffects';

export function NewsModal({
  isOpen,
  onClose,
  currentLanguage = 'en',
  newsList = [],
  onUpdateNews,
  isAdmin = false
}) {
  const [selectedHazard, setSelectedHazard] = useState('ALL');
  const [showEditor, setShowEditor] = useState(false);

  // Admin New Story Form State
  const [newTitle, setNewTitle] = useState('');
  const [newState, setNewState] = useState('Karnataka');
  const [newDistrict, setNewDistrict] = useState('Bengaluru Urban');
  const [newHazard, setNewHazard] = useState('Monsoonal Inundation & Culvert Overflow');
  const [newLevel, setNewLevel] = useState('HIGH');
  const [newSummary, setNewSummary] = useState('');
  const [newEvacuated, setNewEvacuated] = useState('850');
  const [newCamps, setNewCamps] = useState(4);
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewImageUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const currentFeed = (newsList && newsList.length > 0) ? newsList : INDIA_DISASTER_NEWS;

  // Pure single-language titles with zero mixed languages
  const TITLES = {
    en: {
      title: 'National Disaster Situational News',
      subtitle: 'Verified crisis updates and disaster management measures across states of India',
      badge: 'Live Feed',
      allAlerts: 'All Alerts'
    },
    kn: {
      title: 'ರಾಷ್ಟ್ರೀಯ ವಿಪತ್ತು ಪರಿಸ್ಥಿತಿ ವರದಿಗಳು',
      subtitle: 'ಭಾರತದ ವಿವಿಧ ರಾಜ್ಯಗಳ ನೈಜ ವಿಪತ್ತು ನಿರ್ವಹಣಾ ಮುಖ್ಯಾಂಶಗಳು',
      badge: 'ನೈಜ ಮಾಹಿತಿ',
      allAlerts: 'ಎಲ್ಲಾ ಎಚ್ಚರಿಕೆಗಳು'
    },
    hi: {
      title: 'राष्ट्रीय आपदा स्थिति समाचार',
      subtitle: 'भारत के विभिन्न राज्यों से आपदा प्रबंधन एवं राहत की ताज़ा जानकारी',
      badge: 'लाइव अपडेट',
      allAlerts: 'सभी अलर्ट'
    },
    ta: {
      title: 'தேசிய பேரிடர் நிலைமை செய்திகள்',
      subtitle: 'இந்திய மாநிலங்களின் பேரிடர் மேலாண்மை கள நிலவரங்கள்',
      badge: 'நேரலை',
      allAlerts: 'அனைத்து எச்சரிக்கைகள்'
    },
    te: {
      title: 'జాతీయ విపత్తు పరిస్థితి వార్తలు',
      subtitle: 'భారతదేశ రాష్ట్రాల్లోని విపత్తు నిర్వహణ సహాయక చర్యలు',
      badge: 'లైవ్ ఫీడ్',
      allAlerts: 'అన్ని హెచ్చరికలు'
    }
  };

  const text = TITLES[currentLanguage] || TITLES.en;

  const filteredNews = selectedHazard === 'ALL'
    ? currentFeed
    : currentFeed.filter(n => n.level === selectedHazard);

  const handlePublishNews = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newArticle = {
      id: `news-${Date.now()}`,
      state: newState,
      district: newDistrict,
      hazard: newHazard,
      level: newLevel,
      title: newTitle.trim(),
      summary: newSummary.trim() || 'Updated situational report issued by Municipal Disaster Response Authority.',
      updated: 'Just now',
      source: 'The Economic Times / State Disaster Authority',
      evacuated: newEvacuated,
      campsActive: Number(newCamps) || 1,
      image: newImageUrl
    };

    if (onUpdateNews) {
      onUpdateNews(newArticle);
    }
    playDispatchPing();
    setShowEditor(false);
    setNewTitle('');
    setNewSummary('');
  };

  const handleQuickAddEconomicTimes = () => {
    const etStory = {
      id: `news-et-${Date.now()}`,
      state: 'Karnataka',
      district: 'Bengaluru East (Indiranagar & Halasuru)',
      hazard: 'Severe Storm Surge & Inundation',
      level: 'CRITICAL',
      title: 'BBMP & NDRF Deploy High-Power Sludge Dewatering Pumps Across Metro Inundation Belts',
      summary: 'Heavy overnight showers triggered 1.4m standing water in Halasuru lake basin. Ingress underpass sealed for safety; 350 residents moved to dry community hall.',
      updated: 'Just now (ET Live)',
      source: 'The Economic Times - India Natural Disasters',
      evacuated: '920',
      campsActive: 5,
      image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
    };

    if (onUpdateNews) {
      onUpdateNews(etStory);
    }
    playDispatchPing();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl glass-modal p-5 sm:p-7 border border-white/20 text-slate-100 shadow-2xl my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pr-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-600/30 shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2 flex-wrap">
                <span>{text.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40">
                  {text.badge}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {text.subtitle}
              </p>
            </div>
          </div>

          {/* Economic Times Direct Portal Link */}
          <div className="flex items-center gap-2">
            <a
              href="https://economictimes.indiatimes.com/topic/india-natural-disasters"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-orange-600/30 hover:bg-orange-600 text-orange-200 hover:text-white border border-orange-500/40 text-xs font-bold flex items-center gap-1.5 transition"
              title="Open The Economic Times Natural Disasters page"
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>The Economic Times News</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {isAdmin && (
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{showEditor ? 'Cancel' : 'Update Disaster News'}</span>
              </button>
            )}
          </div>
        </div>

        {/* ADMIN DISASTER NEWS EDITOR FORM */}
        {isAdmin && showEditor && (
          <form onSubmit={handlePublishNews} className="mb-5 p-4 rounded-xl bg-slate-900 border border-blue-500/40 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Situational News Publisher (Economic Times Source)</span>
              </span>
              <button
                type="button"
                onClick={handleQuickAddEconomicTimes}
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline"
              >
                ⚡ Quick Load ET Bengaluru Report
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. NDRF Dispatches Rescue Flotilla to Inundated Basin"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Hazard Category *</label>
                <input
                  type="text"
                  required
                  value={newHazard}
                  onChange={(e) => setNewHazard(e.target.value)}
                  placeholder="e.g. Flash Flood, Cloudburst, Landslide"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">District / Region</label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Severity</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Evacuated</label>
                  <input
                    type="text"
                    value={newEvacuated}
                    onChange={(e) => setNewEvacuated(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Relief Camps</label>
                  <input
                    type="number"
                    value={newCamps}
                    onChange={(e) => setNewCamps(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Summary / Ground Description</label>
              <textarea
                rows={2}
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                placeholder="Enter verified disaster briefing from ground inspectors..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Photo of the News Upload (Requirement 7) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span>Article Photo / Ground Evidence *</span>
                <span className="text-[10px] text-cyan-400 font-mono">Upload Photo or Image URL</span>
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <label className="flex-1 py-2 px-3 rounded-xl bg-slate-950 border border-dashed border-white/20 text-slate-300 text-xs text-center cursor-pointer hover:border-cyan-400 transition flex items-center justify-center gap-2">
                  <span>📷 Upload News Photo File</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Or paste image URL"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
                {newImageUrl && (
                  <div className="w-14 h-10 rounded-lg overflow-hidden border border-white/20 shrink-0 self-center">
                    <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Publish Official Bulletin to Both Portals</span>
              </button>
            </div>
          </form>
        )}

        {/* Hazard Severity Filter Tabs */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedHazard(lvl)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
                selectedHazard === lvl
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                  : 'bg-slate-900/60 text-slate-400 border-white/10 hover:border-white/20'
              }`}
            >
              {lvl === 'ALL' ? text.allAlerts : lvl}
            </button>
          ))}
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
          {filteredNews.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition group flex flex-col justify-between"
            >
              <div>
                {/* Image and Badges */}
                <div className="relative h-32 rounded-lg overflow-hidden border border-white/10 mb-3">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                      📍 {item.state} ({item.district})
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                      item.level === 'CRITICAL' ? 'bg-red-600 text-white' :
                      item.level === 'HIGH' ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-slate-950'
                    }`}>
                      {item.level}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1">
                  {item.hazard}
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition mb-1.5">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                  {item.summary}
                </p>
              </div>

              {/* Bottom Meta & Stats */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <strong>{item.evacuated}</strong> Evacuated
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-emerald-400" />
                    <strong>{item.campsActive}</strong> Shelters
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Clock className="w-3 h-3" /> {item.updated}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
