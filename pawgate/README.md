# PawGate – App Prototype

Komplett interaktiv prototype for PawGate kennelstyringssystem.

---

## 🚀 Kom i gang i VS Code

### 1. Opne prosjektet
```
File → Open Folder → vel pawgate-mappa
```

### 2. Installer tilrådde extensions
Søk i Extensions-panelet (`Ctrl+Shift+X`):
- **Live Server** (Ritwick Dey) — live reload i nettlesar
- **Prettier** — kodeformatering
- **ESLint** — kodekvalitet
- **GitLens** — Git-integrasjon (du har allereie GitHub)

### 3. Start Live Server
- Høgreklikk på `public/prototype.html`
- Vel **"Open with Live Server"**
- Appen opnar på `http://localhost:5500/public/prototype.html`

---

## 📱 Test på telefon (same WiFi-nettverk)

### Metode 1 — Live Server (enklast)
1. Start Live Server som over
2. Finn IP-adressa di på PC-en:
   - **Mac:** `ifconfig | grep "inet "` → ser ut som `192.168.x.x`
   - **Windows:** `ipconfig` → "IPv4 Address" 
3. Opne på telefonen: `http://192.168.x.x:5500/public/prototype.html`
4. ✅ Endringar du gjer i VS Code oppdaterer seg automatisk på telefonen

### Metode 2 — ngrok (test frå kor som helst)
```bash
# Installer ngrok (einmal)
npm install -g ngrok

# Start Live Server fyrst, deretter:
ngrok http 5500
```
Du får ein `https://xxxx.ngrok.io`-lenke du kan sende til kven som helst.

### Metode 3 — VS Code Dev Tunnels (innebygd)
1. `Ctrl+Shift+P` → "Forward a Port"
2. Skriv inn `5500`
3. Klikk på globus-ikonet for å få ei offentleg lenke

### Tips for mobiltesting
- Legg lenka til som **heim-skjerm-snarveg** på iPhone/Android
  → Safari: Del-knapp → "Legg til på heimskjerm"
  → Chrome Android: Meny → "Legg til på heimskjerm"
- Appen vil då opne i fullskjerm utan nettlesar-UI — lik ein ekte app

---

## 📁 Prosjektstruktur (neste steg)

```
pawgate/
├── public/
│   └── prototype.html      ← Ferdig prototype (start her)
├── src/
│   ├── components/         ← Framtidige React-komponentar
│   ├── screens/            ← Ein fil per skjerm
│   ├── state/              ← Global state (Zustand/Context)
│   └── utils/              ← Hjelpefunksjonar (sanitize, format osb.)
├── docs/
│   └── ARKITEKTUR.md       ← Systemarkitektur og forretningsmodell
├── .vscode/
│   └── settings.json       ← VS Code-innstillingar
└── README.md
```

---

## 🔧 Neste utviklingssteg

Når du er klar til å gå frå prototype til ekte app:

### 1. Del opp i komponentar (React Native)
```bash
npx create-expo-app pawgate --template blank-typescript
```

### 2. Prioritert rekkjefølgje
1. **State management** — flytt all `let`-data til Zustand store
2. **Navigasjon** — React Navigation (Stack + Tab)
3. **Binge-oversikt** → eigen komponent
4. **Binge-detalj** → eigen komponent  
5. **Innstillingar** → eigen stack
6. **Backend** — Supabase eller Firebase (auth + database)
7. **Hardware** — MQTT-klient (react-native-mqtt)

### 3. Tilrådde pakkar
```json
{
  "react-navigation": "navigasjon",
  "zustand": "state management",
  "react-native-mqtt": "kommunikasjon med ESP32",
  "expo-camera": "kamera",
  "expo-notifications": "push-varslingar",
  "supabase-js": "database og auth"
}
```

---

## 🔐 Sikkerheit (allereie implementert i prototype)

- `sanitize()` køyrer på all brukarinput før DOM-injeksjon
- Ingen eval() eller innerHTML utan sanitering
- Modalar lukkar med Escape + sveip ned

---

## 📞 Kontakt

Neste steg: Flytt prototype til React Native med Expo.
