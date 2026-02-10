# WebRTC Angular Demo

This repository contains:
- **Angular 17 project (`angular17-signals`)** using Signals for state management.
- **Angular 21 project (`angular21-nosignals`)** using NgRx store.
- **Node.js signaling server (`signaling-server`)** for WebRTC ICE/STUN/TURN candidate exchange.

---

## 🚀 Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/karthik-ui/webrtc-angular.git
cd webrtc-angular



cd signaling-server
npm install

cd ../angular17-signals
npm install

cd ../angular21-nosignals
npm install


cd signaling-server
npm start

cd angular17-signals
ng serve

cd angular21-nosignals
npx -p @angular/cli@21 ng serve

