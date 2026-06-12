# PawGate — Systemarkitektur & Forretningsmodell

## Teknisk arkitektur

```
[App: iOS / Android / Nettlesar]
         ↕ HTTPS / WebSocket
[Skyserver: Digital Ocean + Mosquitto MQTT]
         ↕ MQTT over WiFi
[Gateway: Raspberry Pi 4 — éin per bygg]
         ↕ MQTT / WiFi / BLE
[Binge-noder: ESP32 per binge]
  ├── IP-kamera → Cloudflare Stream
  ├── Hundeluke (relé/motor)
  └── Spylesystem (relé/magnetventil)
```

## Hardware per binge
| Komponent | Type | Ca. kostnad |
|---|---|---|
| Mikrokontroller | ESP32 | ~80 kr |
| Relémodul | 2-kanals | ~50 kr |
| IP-kamera | RTSP-kompatibel | ~300–800 kr |
| Hundeluke motor | DC-motor + skinne | ~200–500 kr |
| Magnetventil spyling | 12V | ~150–300 kr |

## Tilkoplingstypar (støtta)
- PawGate-modul (eigen hardware)
- WiFi (ESP32/Arduino)
- Bluetooth BLE
- Shelly relé (IP)
- Sonoff relé (IP)
- MQTT (eige system)
- GPIO direkte (Raspberry Pi)

## Forretningsmodell

### Hardware-sal (eingong)
- Startpakke 3 bingar: 15 000–20 000 kr
- Per ekstra binge: 3 000–5 000 kr
- Din kostnad HW (3 bingar): ~4 000 kr
- **Bruttomargin: ~11 000 kr**

### SaaS-lisens (månedleg)
- Kundepris: 399 kr/mnd
- Skykostnad: ~50–80 kr/mnd
- **Netto per kunde: ~320 kr/mnd**

### Skalering
| Kundar | Månedleg passiv inntekt |
|---|---|
| 10 | 3 200 kr |
| 20 | 6 400 kr |
| 50 | 16 000 kr |

### Salgsverdi (SaaS-multiplikator 10–20x)
| Kundar | Årsomsetning | Salgsverdi |
|---|---|---|
| 20 | 77 000 kr | ~750 000 kr |
| 50 | 192 000 kr | ~2 000 000 kr |
| 100 | 384 000 kr | ~4 000 000 kr |
