# ResQuick AI - Municipal Grievance and Disaster Dispatch Core

ResQuick AI is an integrated municipal grievance management and real-time emergency disaster dispatch platform. Engineered for municipal corporations, emergency operations centers, and civic administration teams, ResQuick provides automated multi-lingual incident intake, spatial risk prioritization, dynamic emergency broadcasting, and officer resource dispatching.

---

## Live Links and Access

- **GitHub Repository**: [https://github.com/Anvation-2026/ResQuick](https://github.com/Anvation-2026/ResQuick)
- **Local Development Live URL**: [http://localhost:5173](http://localhost:5173)
- **Production Build Preview**: [http://localhost:4173](http://localhost:4173)

---

## Core System Capabilities

### 1. Citizen Emergency and Grievance Response Portal
- **Rapid Incident Intake**: Citizens can file emergency and municipal complaints across categories such as Flooding, Structural Collapses, Power Grid Failures, Gas Leaks, and Water Pipeline Bursts.
- **Dynamic Multilingual Speech Recognition**: Integrated Web Speech voice-to-text input supporting English, Hindi, and Kannada.
- **Audio Translation Engine**: Real-time translation enabling users to speak or type grievances in their native tongue with automated English translation for administrative consistency.
- **Transparent Status Tracking**: Real-time grievance tracking providing citizens with assigned sub-officer details, assigned resource counts, current status, and resolution timelines.

### 2. Administrative Operations and Resource Dispatch Center
- **Dedicated Admin Authentication**: Secure credential validation with Indian Standard Time (IST) contextual greeting routines (Morning, Afternoon, Evening).
- **Sub-Officer and Team Deployment**: Administrators can directly assign specialized sub-officers (Disaster Management Officers, Chief Engineers, Medical Leads, Relief Coordinators) to specific emergencies.
- **Dynamic Resource Allocation**: Direct allocation and tracking of NDRF teams, municipal fire tenders, dewatering pumps, civil ambulances, and earth-moving machinery.
- **Interactive Status Timeline**: Historical audit trails of status updates (Reported, In Progress, Resolved) recorded with timestamps and responsible officers.

### 3. Spatial GIS Risk Prioritization Engine
- **Municipal Coordinate Heatmap**: Interactive vector GIS mapping covering Bengaluru municipal zones (Indiranagar, Koramangala, Whitefield, Jayanagar, Electronic City, and HSR Layout).
- **Composite Risk Scoring Algorithm**: Calculates composite risk severity indices based on incident severity, time decay, urban vulnerability, and local population density.
- **Interactive Street View Inspection**: Direct coordinate inspections with real-time zone statistics, alert levels, and photo documentation.

### 4. Emergency SMS and WhatsApp Broadcast Dispatcher
- **Targeted Citizen Alerts**: Instantaneous mobile SMS and WhatsApp dispatching to registered citizens in affected ward clusters.
- **Preconfigured Safety Templates**: Standardized evacuation notices, road diversion advisories, and flood safety guidelines.

### 5. National Disaster Situational News Desk
- **Editorial Disaster Desk**: Administrative interface to broadcast live disaster updates, weather warnings, and verified situational photos.
- **Real-Time Citizen Sync**: Immediate synchronization with the citizen portal feed without page reloads.

---

## Technology Stack

- **Frontend Core**: React 19, JavaScript (ES2023+), HTML5, CSS3
- **Build Tool & Bundler**: Vite
- **Styling Architecture**: Tailwind CSS, PostCSS, Custom Design System
- **Vector GIS & Mapping**: Scalable Vector Graphics (SVG), Leaflet-compatible coordinate mapping
- **Speech & Audio**: Web Speech API (SpeechRecognition and SpeechSynthesis)
- **Icons**: Lucide React
- **PDF & Reporting Engine**: Native HTML5 print and CSS Paged Media

---

## Project Structure

```text
ResQuick/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── ResQuick_AI_Technical_Project_Report.pdf
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── AdminPortal.jsx
│   │   ├── AIReportModal.jsx
│   │   ├── ApplicationManageModal.jsx
│   │   ├── BroadcastSMSModal.jsx
│   │   ├── CitizenPortal.jsx
│   │   ├── EscalationModal.jsx
│   │   ├── GovtReportModal.jsx
│   │   ├── Header.jsx
│   │   ├── HelplinesModal.jsx
│   │   ├── LoginModal.jsx
│   │   ├── NewsSection.jsx
│   │   ├── QuickerChatbot.jsx
│   │   ├── ReportProblemModal.jsx
│   │   ├── RiskMap.jsx
│   │   ├── TrackStatusModal.jsx
│   │   └── WeatherForecastWidget.jsx
│   ├── data/
│   │   ├── indiaNews.js
│   │   ├── resourcesData.js
│   │   ├── sampleIncidents.js
│   │   ├── translations.js
│   │   └── zonesData.js
│   ├── utils/
│   │   ├── resourceEngine.js
│   │   ├── riskEngine.js
│   │   └── soundEffects.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── ResQuick_AI_Technical_Project_Report.pdf
└── README.md
```

---

## Installation and Local Setup

### Prerequisites
- Node.js (version 18.x or later recommended)
- npm (version 9.x or later)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Anvation-2026/ResQuick.git
   cd ResQuick
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## Project Report

A technical architecture report is included in the root directory:
`ResQuick_AI_Technical_Project_Report.pdf`

This report provides comprehensive breakdowns of:
- Multi-tier system architecture and state management
- Mathematical risk prioritization formulation
- Resource scheduling algorithms
- Speech and translation pipeline specification
- Field testing and performance benchmarks

---

## License

This project is developed for municipal emergency operations and grievance resolution under the Anvation 2026 initiative.
