# CPS Dragonfly Web Dashboard 🎯

## Overview
CPS Dragonfly Web Dashboard is a comprehensive React-based web application for managing industrial drone operations and inventory tracking. The platform provides real-time drone control, flight session analysis, inventory management, and advanced data visualization capabilities.

## Related Repositories
- 📱 [Mobile Scanner App Repository](https://github.com/aidilaqif/cps_dragonfly_mobile_app)

## Features 🌟

### Drone Control Interface
- **Manual Pilot Mode**: 
  - Precise directional controls with customizable distances
  - Real-time video feed
  - Battery monitoring
  - Emergency stop capabilities
  - IMU calibration
  - Movement logging

- **AutoPilot Mode**:
  - Flight session management
  - Predefined flight patterns
  - Session recording and playback
  - Automated movement sequences
  - Star/favorite flight patterns

### Analytics Dashboard
- **Battery Efficiency Analysis**:
  - Consumption patterns
  - Efficiency metrics
  - Time-based usage analysis
  - Visual trend representation

- **Movement Pattern Analysis**:
  - Success rate tracking
  - Pattern correlations
  - Efficiency metrics
  - Visual pattern mapping

- **Performance Analysis**:
  - Flight duration metrics
  - Command analysis
  - Battery usage optimization
  - Success rate tracking

### Inventory Management
- **Item Tracking**:
  - Status monitoring
  - Location tracking
  - Type categorization
  - History logging

- **Location Management**:
  - Rack organization
  - Type categorization
  - Utilization tracking
  - Capacity management

### Data Export
- **Multiple Format Support**:
  - Excel export
  - CSV generation
  - Filtered data export
  - Custom report generation

## Technical Architecture 🏗️

### Frontend Technologies
- **Framework**: React
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Hooks
- **Icons**: Lucide React
- **UI Components**: shadcn/ui

### Key Components
```jsx
components/
├── dashboard/         # Analytics and metrics
├── drone/            # Drone control interfaces
│   ├── autopilot/    # Automated control
│   ├── manualpilot/  # Manual control
│   └── shared/       # Common components
├── exports/          # Data export functionality
├── items/           # Item management
├── locations/       # Location management
└── navigation/      # App navigation
```

### Styling Structure
```css
assets/styles/
├── index.css                # Base styles
├── components/
│   ├── AIAnalysis.css      # Analysis components
│   ├── Dashboard.css       # Dashboard layout
│   ├── Export.css          # Export interface
│   ├── ItemManagement.css  # Item management
│   ├── LocationManagement.css
│   └── NavigationTab.css
```

## Integration Points 🔄

### Mobile App Integration
- Synchronized inventory data
- Shared location tracking
- Common item management
- Status synchronization

### API Services
```javascript
services/
├── analysis.service.js    # Analytics processing
├── dashboard.service.js   # Dashboard data
├── export.service.js      # Export handling
├── item.service.js        # Item management
└── location.service.js    # Location control
```

## Installation & Setup ⚙️

### Prerequisites
- Node.js
- npm/yarn
- Modern web browser

### Environment Setup
1. Clone the repository
2. Create `.env` file:
```
REACT_APP_API_URL="DRONE_API_URL"
REACT_APP_API_BASE_URL="CPS_API_URL"
```
3. Install dependencies:
```bash
npm install
```
4. Start development server:
```bash
npm start
```

## Development Guidelines 📝

### Code Structure
- Component-based architecture
- Service-based API communication
- Centralized styling
- Modular functionality

### State Management
- React Hooks for local state
- Context for global state
- Service layer for API calls

## Features in Development 🛣️

- [ ] Enhanced movement analysis
- [ ] Advanced battery optimization
- [ ] Multi-drone support
- [ ] Custom flight patterns
- [ ] Advanced data visualization


---
Built with React and modern web technologies for industrial automation
