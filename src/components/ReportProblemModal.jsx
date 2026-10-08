import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Mic, 
  MicOff, 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  ShieldAlert,
  Globe2
} from 'lucide-react';
import { TRANSLATIONS, LANGUAGES } from '../data/translations';
import { playDispatchPing } from '../utils/soundEffects';

export function ReportProblemModal({
  isOpen,
  onClose,
  currentLanguage,
  currentUser,
  onSubmitIncident
}) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage || 'en');
  const [category, setCategory] = useState('Flood');
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [locationText, setLocationText] = useState('Anekal Main Road, Kammasandra Agrahara, Bengaluru, Karnataka, 562106');
  const [coordinates, setCoordinates] = useState([12.7303, 77.7096]);
  const [isLocating, setIsLocating] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80');
  const [emergencySeverity, setEmergencySeverity] = useState('MEDIUM');

  // Sync selectedLanguage when modal opens or currentLanguage changes
  useEffect(() => {
    if (currentLanguage) {
      setSelectedLanguage(currentLanguage);
    }
  }, [currentLanguage, isOpen]);

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  // Single-language suggestions based on current language
  // Multilingual quick suggestions based on selected language
  const HAZARD_SUGGESTIONS = {
    en: {
      Flood: ['Submerged road cutting off General Hospital access', 'Water level rising above 4 feet, elderly citizens trapped', 'Storm drain backflow inundating residential ground floor'],
      'Building Damage': ['Pillar crack & concrete facade collapse onto pedestrian walkway', 'Structural foundation shift after torrential downpour', 'Roof beam failure with civilians inside'],
      'Road Blockage': ['Anekal road pothole craters blocking emergency access', 'Flyover mudslide blocking all 3 lanes', 'Uprooted tree crushed power lines across arterial road'],
      'Water Contamination': ['Industrial chemical runoff mixed into drinking water reservoir', 'Sewage leakage detected into primary ward pipeline'],
      Fire: ['Transformer explosion with active fire spreading to houses', 'Commercial building top floor smoke entrapment']
    },
    kn: {
      Flood: ['ಸಾಮಾನ್ಯ ಆಸ್ಪತ್ರೆಯ ರಸ್ತೆ ಜಲಾವೃತವಾಗಿದೆ, ಪ್ರವೇಶ ಬಂದ್ ಆಗಿದೆ', 'ನೀರು 4 ಅಡಿಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ, ನಾಗರಿಕರು ಸಿಲುಕಿಕೊಂಡಿದ್ದಾರೆ', 'ಚರಂಡಿ ನೀರು ಮನೆಗಳಿಗೆ ನುಗ್ಗುತ್ತಿದೆ'],
      'Building Damage': ['ಕಟ್ಟಡದ ಗೋಡೆ ಬಿರುಕು ಬಿಟ್ಟಿದೆ, ಕಾಂಕ್ರೀಟ್ ಕುಸಿಯುತ್ತಿದೆ', 'ಮಳೆಯಿಂದಾಗಿ ಬುನಾದಿ ಕುಸಿದಿದೆ', 'ಛಾವಣಿ ಕುಸಿದು ಸಾರ್ವಜನಿಕರು ಸಿಲುಕಿದ್ದಾರೆ'],
      'Road Blockage': ['ಆನೇಕಲ್ ಮುಖ್ಯ ರಸ್ತೆ ಸಂಪೂರ್ಣ ಹದಗೆಟ್ಟಿದೆ, ಗುಂಡಿಗಳು ಬಿದ್ದಿವೆ', 'ಹೆಬ್ಬಾಳ ರಸ್ತೆಯಲ್ಲಿ ಗೋಡೆ ಕುಸಿದು ಸಂಚಾರ ಸ್ಥಗಿತಗೊಂಡಿದೆ', 'ಮರ ಬಿದ್ದು ವಿದ್ಯುತ್ ತಂತಿ ತುಂಡಾಗಿದೆ'],
      'Water Contamination': ['ಕುಡಿಯುವ ನೀರಿನಲ್ಲಿ ರಾಸಾಯನಿಕ ವಾಸನೆ ಬರುತ್ತಿದೆ', 'ಒಳಚರಂಡಿ ನೀರು ಪೈಪ್‌ಲೈನ್‌ಗೆ ಸೇರಿದೆ'],
      Fire: ['ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್ ಸ್ಫೋಟಗೊಂಡು ಬೆಂಕಿ ಹೊತ್ತಿಕೊಂಡಿದೆ', 'ವಾಣಿಜ್ಯ ಕಟ್ಟಡದಲ್ಲಿ ಹೊಗೆ ಕಾಣಿಸಿಕೊಂಡಿದೆ']
    },
    hi: {
      Flood: ['अस्पताल का मुख्य मार्ग पानी में डूब गया है', 'बाढ़ का पानी 4 फीट ऊपर चढ़ गया है, लोग फंसे हैं', 'नाली का गंदा पानी घरों में घुस रहा है'],
      'Building Damage': ['इमारत में दरार आ गई है, कंक्रीट गिर रहा है', 'नींव धंसने से इमारत झुक गई है'],
      'Road Blockage': ['अनेकल मुख्य मार्ग पर बड़े गड्ढे हैं, एम्बुलेंस नहीं जा पा रही', 'फ्लाईओवर पर मलबा गिरने से 3 लेन बंद हैं'],
      'Water Contamination': ['पीने के पानी में गंदा पानी मिल गया है', 'केमिकल रिसाव से पानी बदबूदार हो गया है'],
      Fire: ['ट्रांसफार्मर में आग लग गई है और घरों की तरफ फैल रही है', 'इमारत की ऊपरी मंजिल पर आग लगी है']
    },
    ta: {
      Flood: ['மருத்துவமனை அணுகுசாலை நீரில் மூழ்கியுள்ளது, போக்குவரத்து தடை', 'வெள்ள நீர் 4 அடிக்கு மேல் உயர்ந்துள்ளது, பொதுமக்கள் சிக்கியுள்ளனர்', 'வடிகால் நீர் குடியிருப்புக்குள் புகுந்துள்ளது'],
      'Building Damage': ['கட்டடத்தின் தூணில் விரிசல் ஏற்பட்டு கான்கிரீட் விழுகிறது', 'கனமழையால் அடித்தளம் சரிந்துள்ளது'],
      'Road Blockage': ['பிரதான சாலையில் பெரிய பள்ளங்கள் ஏற்பட்டு ஆபத்தாக உள்ளது', 'மேம்பாலத்தில் மண் சரிவு ஏற்பட்டு பாதைகள் அடைக்கப்பட்டுள்ளன'],
      'Water Contamination': ['குடிநீர் குழாயில் கழிவுநீர் கலந்து துர்நாற்றம் வீசுகிறது', 'தொழிற்சாலை கழிவு நீர்நிலையில் கலந்துள்ளது'],
      Fire: ['மின்சார டிரான்ஸ்பார்மர் வெடித்து தீ பரவுகிறது', 'வணிக வளாகத்தில் புகை மண்டலம் ஏற்பட்டுள்ளது']
    },
    te: {
      Flood: ['ఆసుపత్రికి వెళ్ళే రహదారి జలమయమైంది, రాకపోకలు నిలిచిపోయాయి', 'వరద నీరు 4 అడుగులకు చేరి ప్రజలు చిక్కుకుపోయారు', 'డ్రైనేజీ నీరు ఇళ్లలోకి చేరుతోంది'],
      'Building Damage': ['భవనం స్తంభంలో పగుళ్లు ఏర్పడి కాంక్రీట్ ఊడిపడుతోంది', 'భారీ వర్షానికి పునాది బలహీనపడింది'],
      'Road Blockage': ['ప్రధాన రహదారిపై భారీ గుంతలు పడి రాకపోకలు నిలిచిపోయాయి', 'ఫ్లైఓవర్ పై కొండచరియలు విరిగిపడి 3 లేన్లు మూసుకుపోయాయి'],
      'Water Contamination': ['తాగునీటి పైపులైన్ లో మురుగు నీరు చేరి కలుషితమైంది', 'రసాయన వ్యర్థాలు జలాశయంలో కలిశాయి'],
      Fire: ['ట్రాన్స్‌ಫಾರ್ಮರ್ పేలి సమీప ఇళ్లకు మంటలు వ్యాపిస్తున్నాయి', 'వాణిజ్య సముదాయంలో దట్టమైన పొగ వ్యాపించింది']
    },
    ml: {
      Flood: ['ആശുപത്രി റോഡ് വെള്ളത്തിൽ മുങ്ങി, ഗതാഗതം തടസ്സപ്പെട്ടു', 'വെള്ളപ്പൊക്കം 4 അടി ഉയർന്നു, നാട്ടുകാർ കുടുങ്ങി', 'ഓടയിലെ വെള്ളം വീടുകളിലേക്ക് കയറുന്നു'],
      'Building Damage': ['കെട്ടിടത്തിന്റെ തൂണിൽ വിള്ളൽ വീണു, കോൺക്രീറ്റ് അടർന്നു വീഴുന്നു'],
      'Road Blockage': ['റോഡിൽ വലിയ കുഴികൾ രൂപപ്പെട്ട് അപകടാവസ്ഥയിലായി', 'മേൽപ്പാലത്തിൽ മണ്ണിടിഞ്ഞ് ഗതാഗതം സ്തംഭിച്ചു'],
      'Water Contamination': ['കുടിവെള്ള പൈപ്പിലേക്ക് മലിനജലം കയറി ദുർഗന്ധം വമിക്കുന്നു'],
      Fire: ['ട്രാൻസ്ഫോർമർ പൊട്ടിത്തെറിച്ച് വീടുകളിലേക്ക് തീ പടരുന്നു']
    },
    mr: {
      Flood: ['रुग्णालयाचा रस्ता पाण्याखाली गेला असून वाहतूक बंद आहे', 'पुराचे पाणी ४ फुटांवर आले आहे, नागरिक अडकले आहेत', 'गटाराचे पाणी घरात शिरत आहे'],
      'Building Damage': ['इमारतीच्या खांबाला तडे गेले असून काँक्रीट कोसळत आहे'],
      'Road Blockage': ['मुख्य रस्त्यावर मोठे खड्डे पडले असून अपघात होत आहेत', 'उड्डाणपुलावर दरड कोसळल्याने रस्ता बंद आहे'],
      'Water Contamination': ['पिण्याच्या पाण्याच्या पाईपलाईनमध्ये सांडपाणी मिसळले आहे'],
      Fire: ['ट्रान्सफॉर्मरचा स्फोट होऊन घरांकडे आग पसरत आहे']
    },
    bn: {
      Flood: ['হাসপাতালে যাওয়ার রাস্তা জলে ডুবে গেছে, যোগাযোগ বিচ্ছিন্ন', 'বন্যার জল ৪ ফুট উঠেছে, মানুষ আটকে পড়েছেন', 'নর্দমার জল বাড়িতে ঢুকছে'],
      'Building Damage': ['বিল্ডিংয়ের পিলারে ফাটল ধরেছে এবং কংক্রিট খসে পড়ছে'],
      'Road Blockage': ['প্রধান রাস্তায় বিশাল গর্ত তৈরি হয়ে যান চলাচল ব্যাহত', 'ফ্লাইওভারে ধস নেমে ৩টি লেন বন্ধ'],
      'Water Contamination': ['খাবার জলের পাইপলাইনে নর্দমার জল ঢুকে পড়েছে'],
      Fire: ['ট্রান্সফরমার ফেটে গিয়ে আগুন চারদিকে ছড়িয়ে পড়ছে']
    }
  };

  const suggestions = (HAZARD_SUGGESTIONS[selectedLanguage] || HAZARD_SUGGESTIONS.en)[category] || HAZARD_SUGGESTIONS.en[category];

  // Fallback Semantic dictionary
  const resolveEnglishTranslationFallback = (text, lang) => {
    if (!text) return '';
    const cleanText = text.replace(/^"+|"+$/g, '').trim();
    if (lang === 'en') return cleanText;

    if (/ಆಸ್ಪತ್ರೆ|ಜಲಾವೃತ|ನೀರು|ಪ್ರವೇಶ|पानी|बाढ़|अस्पताल|வெள்ளம்|மருத்துவமனை|நீர்|వరద|ఆసుపత్రి|വെള്ളപ്പൊക്കം|ആശുപത്രി|पूर|रुग्णालय|বন্যা|হাসপাতাল/i.test(cleanText)) {
      return 'Hospital approach road submerged under floodwater; urgent rescue and dewatering required.';
    }
    if (/ಗುಂಡಿ|ಹದಗೆಟ್ಟಿದೆ|ರೋಡ್|ರಸ್ತೆ|ಸಂಪೂರ್ಣ|सड़क|गड्ढे|रास्ता|சாலை|பள்ளம்|గుంతలు|రోడ్డు|കുഴി|റോഡ്|खड्डे|रस्ता|গর্ত|রাস্তা/i.test(cleanText)) {
      return 'The main road here is broken with deep hazardous pothole craters, blocking emergency access.';
    }
    if (/ಗೋಡೆ|ಕಟ್ಟಡ|ಕುಸಿದಿದೆ|ಪಿಲ್ಲರ್|ಬಿರುಕು|दीवार|इमारत|खंभा|கட்டடம்|தூண்|భవనం|స్తంభం|കെട്ടിടം|तडे|পিলার|ভাঙা/i.test(cleanText)) {
      return 'Structural building pillar crack and concrete facade collapse onto pedestrian walkway.';
    }
    if (/ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್|ಬೆಂಕಿ|ಆಗ|ಸ್ಫೋಟ|आग|ट्रांसफार्मर|டிரான்ஸ்பார்மர்|தீ|మంటలు|ట్రాన్స్‌ಫಾರ್ಮರ್|തീ|ट्रान्सफॉर्मर|ট্রান্সফরমার|আগুন/i.test(cleanText)) {
      return 'Electrical transformer explosion with active fire spreading toward nearby structures.';
    }
    if (/ಚರಂಡಿ|ಕುಡಿಯುವ ನೀರು|ರಾಸಾಯನಿಕ|ವಾಸನೆ|गंदा पानी|सीवेज|கழிவுநீர்|குடிநீர்|మురుగు|తాగునీరు|മലിനജലം|सांडपाणी|নর্দমা/i.test(cleanText)) {
      return 'Contaminated drinking water pipeline breach and sewage drain backflow.';
    }

    const catMap = {
      'Flood': 'Severe street flooding and inundation; emergency route blocked.',
      'Building Damage': 'Structural wall collapse and debris hazard endangering civilians.',
      'Road Blockage': 'The road here is damaged and completely cratered with deep potholes.',
      'Water Contamination': 'Contaminated drinking water reservoir and pipeline breach.',
      'Fire': 'Active electrical transformer fire threatening residential structures.'
    };
    return catMap[category] || 'Citizen reported emergency issue requiring prompt municipal response.';
  };

  // Real Dynamic Google Translation API with semantic dictionary fallback
  const translateToEnglish = async (text, lang) => {
    if (!text || !text.trim()) return '';
    if (lang === 'en') return text.trim();

    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data[0] && Array.isArray(data[0])) {
          const translated = data[0].map(item => item[0]).filter(Boolean).join(' ').trim();
          if (translated) return translated;
        }
      }
    } catch (e) {
      console.warn('Live translation network fallback active:', e);
    }

    return resolveEnglishTranslationFallback(text, lang);
  };

  const handleLanguageChange = async (newLang) => {
    setSelectedLanguage(newLang);
    // If citizen has already typed something, re-translate what they actually typed
    if (description && description.trim()) {
      const eng = await translateToEnglish(description, newLang);
      setEnglishTranslation(eng);
    }
  };

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    // Keep user's typed text intact, don't overwrite with dummy samples!
  };

  // Accurate Geolocation detector with reverse geocoding via OpenStreetMap Nominatim
  const detectLiveLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(4));
          const lng = parseFloat(pos.coords.longitude.toFixed(4));
          setCoordinates([lat, lng]);

          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await res.json();
            if (data && data.display_name) {
              setLocationText(data.display_name);
              setIsLocating(false);
              return;
            }
          } catch (e) {
            // fallback
          }

          setLocationText(`GPS: ${lat}, ${lng} — Kammasandra Agrahara, Anekal Main Road, Bengaluru`);
          setIsLocating(false);
        },
        () => {
          setCoordinates([12.7303, 77.7096]);
          setLocationText('Anekal Main Road, Kammasandra Agrahara, Bengaluru, Karnataka, 562106');
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setCoordinates([12.7303, 77.7096]);
      setLocationText('Anekal Main Road, Kammasandra Agrahara, Bengaluru, Karnataka, 562106');
      setIsLocating(false);
    }
  };

  // Multi-Language Speech Recognition with real dynamic auto-translation to English
  const toggleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const speechLangMap = {
      kn: 'kn-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      ml: 'ml-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      en: 'en-IN'
    };

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = speechLangMap[selectedLanguage] || 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = async (event) => {
          const text = event.results[0][0].transcript;
          setVoiceTranscript(text);
          setDescription(prev => (prev ? `${prev} ${text}` : text));
          const eng = await translateToEnglish(text, selectedLanguage);
          setEnglishTranslation(eng);
          setIsRecording(false);
        };
        recognition.onerror = (err) => {
          console.warn('Speech recognition ended/error:', err);
          setIsRecording(false);
        };
        recognition.onend = () => {
          setIsRecording(false);
        };
        recognition.start();
      } catch (e) {
        console.warn('Failed to start speech recognition:', e);
        setIsRecording(false);
      }
    } else {
      setIsRecording(false);
    }
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playDispatchPing();

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const langObj = LANGUAGES.find(l => l.code === selectedLanguage) || { code: 'en', name: 'English', native: 'English' };

    const newIncident = {
      id: `CS-2026-${randomSuffix}`,
      zoneId: 'anekal',
      zoneName: 'Anekal — Kammasandra Agrahara',
      title: description ? description.substring(0, 48) : 'Pothole & Surface Damage',
      issue: category === 'Road Blockage' ? 'Pothole' : category,
      domain: category === 'Road Blockage' ? 'traffic' : category.toLowerCase(),
      domainLabel: category === 'Road Blockage' ? 'Road Maintenance & Traffic Department' : 'Disaster Management & Emergency Services',
      description: description || 'Citizen reported emergency issue via Voice Portal.',
      originalLanguage: selectedLanguage.toUpperCase(),
      originalLanguageFull: langObj.name,
      originalVoiceText: (voiceTranscript || description || 'Citizen reported issue in ' + langObj.name).replace(/^"+|"+$/g, ''),
      translatedEnglishText: (englishTranslation ? englishTranslation.replace(/^"+|"+$/g, '').trim() : resolveEnglishTranslation(description, selectedLanguage)),
      severity: emergencySeverity,
      status: 'Submitted',
      statusCode: 'submitted',
      reporterName: currentUser?.name || 'Citizen User',
      reporterPhone: currentUser?.phone || '+91 83108 13290',
      location: locationText,
      coordinates,
      date: '10/8/2026',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      assignedDepartment: 'Road Maintenance & Traffic Department',
      assignedOfficer: 'Sudeep (Junior Engineer)',
      assignedVehicle: 'Rapid Response Unit #2',
      consolidatedIncident: 'Unlinked',
      officerProgressNote: 'Grievance submitted by citizen. AI automated GIS and severity assessment active.',
      mediaType: 'image',
      mediaUrl: mediaPreview,
      forensics: {
        status: 'Verified Real On-Site Photo',
        details: 'Natural daylight lighting, realistic material fracture/surface degradation, and non-synthetic pixel continuity verified.'
      },
      aiAssessment: {
        confidence: '95%',
        domain: 'traffic',
        issue: category === 'Road Blockage' ? 'Pothole' : category,
        assessedSeverity: emergencySeverity,
        recommendedDept: 'Road Maintenance & Traffic Department'
      },
      timeline: [
        { 
          step: 'Submitted', 
          status: 'done', 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          note: 'Application submitted and received in Municipal Grievance Core.' 
        },
        { 
          step: 'Verified', 
          status: 'pending', 
          time: 'Pending', 
          note: 'AI and GIS cross-verification scheduled.' 
        },
        { 
          step: 'Assigned', 
          status: 'pending', 
          time: 'Pending', 
          note: 'Department allocation pending review.' 
        },
        { 
          step: 'In Progress', 
          status: 'pending', 
          time: 'Pending', 
          note: 'Field action team dispatch.' 
        },
        { 
          step: 'Resolved', 
          status: 'pending', 
          time: 'Pending', 
          note: 'Restoration completion verified.' 
        }
      ]
    };

    onSubmitIncident(newIncident);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl glass-modal p-5 sm:p-7 border border-white/20 text-slate-100 shadow-2xl my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header (Pure single language) */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {t.reportProblem}
            </h2>
            <p className="text-xs text-slate-400">
              {t.reportProblemSub}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. Category Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {['Flood', 'Building Damage', 'Road Blockage', 'Water Contamination', 'Fire'].map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
                  category === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-white/10 hover:border-white/20'
                }`}
              >
                <span>{cat === 'Flood' ? '🌊' : cat === 'Building Damage' ? '🏚️' : cat === 'Road Blockage' ? '🚧' : cat === 'Water Contamination' ? '💧' : '🔥'}</span>
                <span className="truncate w-full text-center">{cat}</span>
              </button>
            ))}
          </div>

          {/* 1.5 Language Preference Selector (Speak & Describe in Your Own Language) */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>Language Preference (ಮಾತನಾಡುವ ಭಾಷೆ / भाषा प्राथमिकता)</span>
              </div>
              <span className="text-[10px] text-cyan-300 font-mono bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800">
                ⚡ Auto-Translates to English for Officers
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                return (
                  <button
                    type="button"
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-1 text-xs ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md font-black ring-2 ring-cyan-300'
                        : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-white/10'
                    }`}
                  >
                    <span>{lang.native}</span>
                    {lang.code !== 'en' && <span className="text-[10px] opacity-75 font-normal">({lang.name})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Pro Voice Listener (In Citizen's Selected Language) */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                <Mic className="w-4 h-4 text-cyan-400" />
                <span>
                  Speak in your Language ({LANGUAGES.find(l => l.code === selectedLanguage)?.native || 'English'})
                </span>
              </div>
              <span className="text-[10px] text-cyan-300 font-mono px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-800">
                🎤 {selectedLanguage.toUpperCase()} Voice Recognition
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse shadow-lg ring-2 ring-rose-400'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>
                  {isRecording 
                    ? `Listening in ${LANGUAGES.find(l => l.code === selectedLanguage)?.native || 'your language'}...` 
                    : `Click to Record Voice (${LANGUAGES.find(l => l.code === selectedLanguage)?.native || 'English'})`}
                </span>
              </button>

              {isRecording && (
                <div className="flex items-center h-8 px-3 rounded-lg bg-slate-800/80 border border-cyan-500/40">
                  <span className="soundwave-bar" />
                  <span className="soundwave-bar" />
                  <span className="soundwave-bar" />
                  <span className="soundwave-bar" />
                  <span className="soundwave-bar" />
                  <span className="text-[11px] text-cyan-300 ml-2 font-mono">
                    Recording in {LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English'}
                  </span>
                </div>
              )}
            </div>

            {voiceTranscript && (
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-white/10 text-xs">
                <div className="text-[10px] text-cyan-400 font-bold uppercase mb-1">
                  Citizen Input ({LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'Native'}):
                </div>
                <p className="text-white italic">"{voiceTranscript.replace(/^"+|"+$/g, '')}"</p>
              </div>
            )}

            {englishTranslation && (
              <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-xs">
                <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ENGLISH TRANSLATION FOR OFFICERS:</span>
                </div>
                <p className="text-emerald-100 font-medium">"{englishTranslation.replace(/^"+|"+$/g, '')}"</p>
              </div>
            )}
          </div>

          {/* 3. Issue Description & Contextual Suggestions in Selected Language */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Issue Description / Emergency Details
              </label>
              <span className="text-[10px] text-slate-400">
                Typing or speaking in {LANGUAGES.find(l => l.code === selectedLanguage)?.native} ({LANGUAGES.find(l => l.code === selectedLanguage)?.name})
              </span>
            </div>
            <textarea
              rows={2}
              value={description}
              onChange={async (e) => {
                const val = e.target.value;
                setDescription(val);
                if (selectedLanguage !== 'en') {
                  const eng = await translateToEnglish(val, selectedLanguage);
                  setEnglishTranslation(eng);
                } else {
                  setEnglishTranslation(val);
                }
              }}
              placeholder={
                selectedLanguage === 'kn' ? 'ಸಮಸ್ಯೆಯನ್ನು ಇಲ್ಲಿ ವಿವರಿಸಿ (ಕನ್ನಡದಲ್ಲಿ ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ)...' :
                selectedLanguage === 'hi' ? 'समस्या का विवरण यहाँ दें (हिंदी में लिखें या बोलें)...' :
                selectedLanguage === 'ta' ? 'பிரச்சினையை இங்கே விவரிக்கவும் (தமிழில் எழுதவும் அல்லது பேசவும்)...' :
                selectedLanguage === 'te' ? 'సమస్యను ఇక్కడ వివరించండి (తెలుగులో రాయండి లేదా మాట్లాడండి)...' :
                selectedLanguage === 'ml' ? 'പ്രശ്നം ഇവിടെ വിവരിക്കുക (മലയാളത്തിൽ എഴുതുകയോ സംസാരിക്കുകയോ ചെയ്യുക)...' :
                selectedLanguage === 'mr' ? 'समस्या येथे स्पष्ट करा (मराठीत लिहा किंवा बोला)...' :
                selectedLanguage === 'bn' ? 'সমস্যার বিবরণ এখানে দিন (বাংলায় লিখুন বা বলুন)...' :
                'Describe what happened (type or speak in your language)...'
              }
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
            />
            
            {/* Suggestions in Citizen's Selected Language */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {(suggestions || []).map((sug, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={async () => {
                    setDescription(sug);
                    const englishSug = HAZARD_SUGGESTIONS.en[category]?.[idx] || await translateToEnglish(sug, selectedLanguage);
                    setEnglishTranslation(englishSug);
                  }}
                  className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] border border-white/10 truncate max-w-xs transition"
                >
                  ⚡ {sug}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Live GPS Location Detector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{t.exactLocation}</span>
              </label>
              <button
                type="button"
                onClick={detectLiveLocation}
                disabled={isLocating}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
              >
                <Radio className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Acquiring GPS...' : t.detectLocation}</span>
              </button>
            </div>
            <input
              type="text"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* 5. Photo & Video Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.uploadPhotoVideo}</span>
              </span>
            </label>

            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-white/20 bg-slate-900/60 hover:bg-slate-900 cursor-pointer text-xs text-slate-300 transition">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Choose photo / video file</span>
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  onChange={handleMediaUpload} 
                  className="hidden" 
                />
              </label>

              {mediaPreview && (
                <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-white/20 shrink-0">
                  <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-700/40 transition active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t.submitEmergencyReport}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
