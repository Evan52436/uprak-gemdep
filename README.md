# Proyek Ujian Praktik Pembuatan Game 2D & 3D
**Asesmen Sumatif Akhir Semester Ganjil TA 2026-2027**  
**SMK Plus Pelita Nusantara Bogor &bull; Jurusan Rekayasa Perangkat Lunak (XI RPL)**  
Guru Pengampu: Septianto Raharso, S.Kom., M.Pd.

Proyek ini dibuat berdasarkan panduan resmi [SOAL UPRAK PEMBUATAN GAME 2D-3D.pdf](file:///home/chargerleptop/Documents/Proyek%20lokal/uprak-gemdep/SOAL%20UPRAK%20PEMBUATAN%20GAME%202D-3D.pdf), terbagi menjadi 2 direktori terpisah untuk Game 2D dan Game 3D.

---

## Struktur Direktori

```
uprak-gemdep/
├── SOAL UPRAK PEMBUATAN GAME 2D-3D.pdf   # Dokumen panduan & soal ujian praktik
├── README.md                              # Dokumentasi ringkas proyek keseluruhan
│
├── game-2d/                               # Direktori Game 2D (Petualangan Mengumpulkan Koin)
│   ├── index.html                         # Berkas utama Game 2D
│   ├── css/
│   │   └── style.css                      # Tata letak responsif antarmuka 2D
│   ├── js/
│   │   ├── audio.js                       # Mesin audio Web Audio API sintetis chiptune
│   │   ├── sprites.js                     # Pustaka sprite & animasi prosedural 2D
│   │   ├── levels.js                      # Desain Level 1 (Hutan) & Level 2 (Gua)
│   │   └── game.js                        # Mesin fisika, tabrakan, dan loop game 2D
│   ├── run_game.sh                        # Skrip cepat menjalankan server lokal Game 2D
│   ├── README.md                          # Panduan & deskripsi Game 2D
│   └── LAPORAN_PRAKTIK_2D.md              # Laporan praktik lengkap sesuai Format Bagian E & G
│
└── game-3d/                               # Direktori Game 3D (Petualangan Dunia 3D)
    ├── index.html                         # Berkas utama Game 3D
    ├── css/
    │   └── style.css                      # Tata letak antarmuka 3D & kontrol sentuh
    ├── js/
    │   ├── three.min.js                   # Mesin Three.js r128 lokal (100% offline)
    │   ├── audio.js                       # Sintesis audio petualangan 3D
    │   ├── player.js                      # Model 3D artikulasi, fisika, & animasi berjalan
    │   ├── levels.js                      # Lingkungan pulau melayang, rintangan, & kristal
    │   └── game.js                        # Mesin Three.js, kamera orbital, bayangan, & HUD
    ├── run_game.sh                        # Skrip cepat menjalankan server lokal Game 3D
    ├── README.md                          # Panduan & deskripsi Game 3D
    └── LAPORAN_PRAKTIK_3D.md              # Laporan praktik lengkap sesuai Format Bagian E & G
```

---

## 1. Game 2D: "Petualangan Mengumpulkan Koin"
- **Lokasi**: [game-2d/](file:///home/chargerleptop/Documents/Proyek%20lokal/uprak-gemdep/game-2d/)
- **Laporan Lengkap**: [LAPORAN_PRAKTIK_2D.md](file:///home/chargerleptop/Documents/Proyek%20lokal/uprak-gemdep/game-2d/LAPORAN_PRAKTIK_2D.md)
- **Karakteristik**:
  - Sprite animasi petualang (diam, lari, melompat, terluka).
  - Latar belakang multi-lapis (*parallax scrolling*).
  - Mekanisme melompat, menginjak musuh (*stomp*), dan mengambil koin (+100).
  - 3 variasi rintangan: Slime patroli, Kelelawar terbang, dan Duri baja.
  - 5 objek interaktif: Koin emas, Ramuan hati, Peti harta misteri, Platform bergerak, dan Bendera finis.
  - 2 Level (Level 1: Hutan Pelita, Level 2: Gua Kristal).
  - Suara dan musik sintetis Web Audio API dengan kontrol jeda dan bisu suara.
- **Cara Menjalankan**:
  ```bash
  cd game-2d
  ./run_game.sh
  ```
  Atau buka berkas `game-2d/index.html` pada peramban web.

---

## 2. Game 3D: "Petualangan Dunia 3D"
- **Lokasi**: [game-3d/](file:///home/chargerleptop/Documents/Proyek%20lokal/uprak-gemdep/game-3d/)
- **Laporan Lengkap**: [LAPORAN_PRAKTIK_3D.md](file:///home/chargerleptop/Documents/Proyek%20lokal/uprak-gemdep/game-3d/LAPORAN_PRAKTIK_3D.md)
- **Karakteristik**:
  - Model karakter 3D artikulasi dengan siklus berjalan dinamis dan bayangan nyata (*soft shadows*).
  - Kamera 3D orbital chase dengan kendali rotasi mouse 360 derajat.
  - Pergerakan 3D halus relatif terhadap sudut pandang kamera saat ini.
  - 3 variasi rintangan: Jurang hampa, Palang duri berputar, dan Drone sentinel otomatis.
  - 5 objek interaktif: Kristal permata berkilau, Pegas pelontar (Jump Pad), Cincin turbo (Speed Boost), Kristal darah penambah HP, dan Altar kemenangan akhir.
  - 2 Level (Level 1: Dataran Hijau Nusantara, Level 2: Kuil Terapung Misteri).
  - Three.js r128 tersimpan lokal di `js/three.min.js`, bekerja 100% tanpa internet.
- **Cara Menjalankan**:
  ```bash
  cd game-3d
  ./run_game.sh
  ```
  Atau buka berkas `game-3d/index.html` pada peramban web.
