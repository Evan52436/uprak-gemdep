# LAPORAN UJIAN PRAKTIK PEMBUATAN GAME 2D
**ASESMEN SUMATIF AKHIR SEMESTER GANJIL TAHUN AJARAN 2026-2027**  
**SMK PLUS PELITA NUSANTARA BOGOR**  
Mata Pelajaran: Game Developer  
Guru Bidang Studi: Septianto Raharso, S.Kom., M.Pd.

---

## IDENTITAS PENGUMPULAN PROYEK SISWA (BAGIAN G)
- **Nama Siswa**: Peserta Didik XI RPL
- **Kelas**: XI RPL (Rekayasa Perangkat Lunak)
- **Jenis Proyek**: Game 2D
- **Judul Game**: Petualangan Mengumpulkan Koin
- **Software yang Digunakan**: HTML5 Canvas, JavaScript (ES6+), Web Audio API, CSS3
- **Metode Pengerjaan**: Individu

---

## 1. Judul dan Nama Game
**Judul Proyek**: Petualangan Mengumpulkan Koin (*Coin Collector Adventure 2D*)

## 2. Tujuan Pembuatan Game
1. Memenuhi tugas Asesmen Sumatif Akhir Semester Ganjil mata pelajaran Game Developer di SMK Plus Pelita Nusantara.
2. Mengimplementasikan logika pemrograman fisika platformer 2D, meliputi pergerakan horizontal, gravitasi, lompatan (*coyote time*), deteksi tabrakan (*AABB collision detection*), serta respon pantulan.
3. Membangun sistem interaksi permainan yang mencakup sistem nyawa, skor, rintangan dinamis, musuh berpatroli, objek interaktif (peti harta, ramuan nyawa), serta transisi antar level.
4. Menyediakan produk game yang dapat dimainkan langsung pada peramban web modern tanpa membutuhkan instalasi perangkat lunak berbayar yang berat.

## 3. Konsep dan Genre Game
- **Genre**: 2D Side-Scrolling Platformer / Adventure
- **Tema**: Petualangan penjelajah muda mengumpulkan koin emas di kawasan Hutan Pelita dan Gua Kristal.
- **Target Audiens**: Pemain kasual dari segala usia, khususnya pecinta platformer klasik 8-bit/16-bit.
- **Core Loop**: Berlari &rarr; Melompat &rarr; Menghindari duri &rarr; Menginjak musuh &rarr; Mengumpulkan koin &rarr; Meraih portal akhir.

## 4. Software dan Teknologi yang Digunakan
- **Bahasa Pemrograman**: JavaScript ES6+
- **Renderer Visual**: HTML5 `<canvas>` API (rendering 60 FPS pixel-perfect)
- **Desain Antarmuka**: CSS3 Flexbox & Grid
- **Audio Engine**: Web Audio API (sintesis frekuensi chiptune prosedural tanpa ketergantungan file eksternal)
- **Teks Editor / IDE**: Visual Studio Code / Antigravity IDE
- **Platform Distribusi**: Web Browser (Chrome, Firefox, Safari, Edge)

## 5. Game Design Document (GDD) Sederhana
### A. Mekanika Inti (Core Mechanics)
1. **Pergerakan Horizontal**: Kontrol A / D atau tombol panah kiri/kanan dengan akselerasi halus dan gesekan (*friction*).
2. **Lompatan**: Kontrol tombol Spasi / W / panah atas. Dilengkapi dengan gravitasi konstan dan toleransi *coyote time* (6 frame) untuk kenyamanan pemain saat melompat di tepi jurang.
3. **Mekanisme Menginjak Musuh (*Stomp Mechanic*)**: Apabila pemain melompat tepat di atas musuh yang sedang bergerak, musuh akan tereliminasi, pemain memantul ke atas, dan skor bertambah +200.
4. **Sistem Darah / Nyawa**: Karakter memiliki 3 nyawa. Jika terkena duri atau musuh dari samping, pemain kehilangan 1 nyawa, terpental ke belakang, dan mendapatkan waktu kebal sementara (*invulnerability frames*) selama 1,5 detik dengan efek visual berkedip.
5. **Kondisi Kalah (*Game Over*)**: Terjadi ketika nyawa habis menjadi 0 atau karakter jatuh ke dalam jurang.
6. **Kondisi Menang (*Victory*)**: Terjadi ketika pemain berhasil menyentuh bendera finis (Level 1) atau portal kristal (Level 2).

### B. Desain Level (Level Progression)
- **Level 1 (Hutan Pelita)**:
  - Lebar map: 3.200 pixel.
  - Nuansa: Hutan hijau dengan langit cerah, bukit berlapis (*parallax scrolling*).
  - Konten: 16 koin emas, 3 slime patroli, 1 kelelawar terbang, 3 platform bergerak, 4 area duri tajam, 1 peti harta misteri, 1 ramuan penambah darah, dan 1 bendera kemenangan.
- **Level 2 (Gua Kristal)**:
  - Lebar map: 3.600 pixel.
  - Nuansa: Gua bawah tanah bertema kristal ungu-gelap.
  - Konten: 20 koin emas, 4 slime patroli, 3 kelelawar terbang sinusoidal, 4 platform bergerak (sumbu X dan Y), 5 jebakan duri, 2 peti harta misterius, 2 ramuan penambah darah, dan 1 portal magis kemenangan akhir.

## 6. Desain Karakter dan Objek
1. **Karakter Utama (The Adventurer)**: Karakter petualang berkemeja biru dengan topi merah, mata ekspresif, dan celana gelap. Memiliki sprite state: Diam (*idle*), Berlari (*run 2-frame*), Melompat (*jump pose*), dan Terluka (*hurt pose*).
2. **Koin Emas**: Objek sirkular dengan efek kilap bersinar dan animasi putaran 6 frame.
3. **Musuh Slime Hijau**: Monster kenyal berpatroli bolak-balik pada platform, memantul secara berkala.
4. **Musuh Kelelawar Ungu**: Musuh udara yang terbang dengan gelombang sinusoidal vertikal.
5. **Duri Tajam (Spikes)**: Rintangan statis tajam berwarna abu-abu baja di permukaan tanah.
6. **Platform Bergerak**: Balok batu mekanis yang bergeser bolak-balik untuk menyeberangi rintangan.
7. **Peti Harta (Mystery Chest)**: Peti kayu berpita besi yang terbuka saat disentuh, mengeluarkan 3 koin emas bonus.
8. **Ramuan Hati (Health Potion)**: Kristal merah melayang yang memulihkan 1 nyawa pemain.

## 7. Flowchart Alur Permainan

```
[ Menu Utama ]
      |
      v
[ Pilih Mulai Permainan ]
      |
      v
[ Muat Level 1: Hutan Pelita ] <-------------------------\
      |                                                  |
      +---> [ Input Pemain (A/D/Lompat) ]                |
      |          |                                       |
      |          v                                       |
      |     [ Cek Tabrakan Fisika ]                      |
      |          |                                       |
      |          +--> [ Ambil Koin (+100) ]              |
      |          +--> [ Buka Peti (+300 & Koin Bonus) ]  |
      |          +--> [ Injak Musuh (+200) ]             |
      |          +--> [ Terkena Duri / Musuh ]           |
      |                     |                            |
      |                     v                            |
      |               [ Nyawa - 1 ]                      |
      |                     |                            |
      |            (Apakah Nyawa <= 0?)                  |
      |              /            \                      |
      |           Ya/              \Tidak                |
      |            v                v                    |
      |    [ Tampilan Game Over ]  [ Kebal 1.5 Detik ]   |
      |            |                                     |
      |            v                                     |
      |      [ Mulai Ulang ]                             |
      |                                                  |
      v                                                  |
(Sentuh Bendera Finis?)                                  |
      | Ya                                               |
      v                                                  |
[ Tampilan Kemenangan Level 1 ]                          |
      |                                                  |
      v (Pilih Lanjut)                                   |
[ Muat Level 2: Gua Kristal ]                            |
      |                                                  |
      v (Sentuh Portal Kristal)                          |
[ Kemenangan Akhir (You Win All Levels) ]                |
      |                                                  |
      v                                                  |
[ Kembali ke Menu Utama ] -------------------------------/
```

## 8. Penjelasan Script dan Kode Program
Struktur kode modular dan rapi diatur ke dalam beberapa berkas:
1. `index.html`: Struktur semantik UI, kanvas 960x540, modal panduan, tombol audio, dan layar overlay.
2. `css/style.css`: Gaya modern, responsif untuk desktop dan layar sentuh gawai mobile.
3. `js/audio.js`: Modul `SoundSystem` menggunakan Web Audio API. Mengolah osilator audio (`sine`, `square`, `sawtooth`, `triangle`) untuk menghasilkan efek suara lompat, koin, luka, injak musuh, menang, kalah, serta musik latar (BGM) retro.
4. `js/sprites.js`: Modul `SpriteManager` menggambar tekstur sprite pixel art secara prosedural ke kanvas terisolasi, menghasilkan animasi karakter, koin berputar, musuh, dan lingkungan tanpa lag.
5. `js/levels.js`: Berisi data konfigurasi Level 1 dan Level 2 (koordinat platform, koin, musuh, rintangan, dan posisi akhir).
6. `js/game.js`: Mesin utama yang mengatur:
   - Loop permainan 60 FPS (`requestAnimationFrame`).
   - Sistem gerak fisika pemain, gravitasi, gesekan, dan *coyote time*.
   - Deteksi tabrakan AABB terhadap platform statis dan bergerak.
   - Kamera dinamis mengikuti pergerakan pemain dengan batas viewport kanvas.
   - HUD kanvas yang menampilkan nyawa (ikon hati), perolehan skor, jumlah koin, dan nama level.

## 9. Hasil Pengujian Game
| Komponen yang Diuji | Skenario Pengujian | Hasil yang Diharapkan | Status |
|---------------------|--------------------|-----------------------|--------|
| Kontrol Gerak | Menekan tombol A, D, Panah | Karakter bergerak ke kiri dan kanan dengan lancar | **BERHASIL** |
| Kontrol Lompat | Menekan tombol Spasi / W | Karakter melompat dan mendarat di atas platform | **BERHASIL** |
| Pengumpulan Koin | Menabrak objek koin | Koin hilang, bunyi denting koin berbunyi, skor +100 | **BERHASIL** |
| Injak Musuh | Melompat tepat di atas slime | Slime musnah, karakter terpental naik, skor +200 | **BERHASIL** |
| Deteksi Duri | Karakter menyentuh duri | Nyawa berkurang 1, karakter terpental, efek kedip | **BERHASIL** |
| Peti Harta | Menabrak peti tertutup | Peti terbuka, memunculkan 3 koin bonus, skor +300 | **BERHASIL** |
| Pergantian Level | Menyentuh bendera finis Level 1 | Muncul layar You Win, tombol lanjut memuat Level 2 | **BERHASIL** |
| Kondisi Game Over | Nyawa habis menjadi 0 | Layar Game Over muncul dengan opsi Coba Lagi | **BERHASIL** |
| Sistem Audio | Klik tombol Nyala/Mati Suara | Musik dan SFX aktif atau nonaktif seketika | **BERHASIL** |

## 10. Link dan File Game
- Berkas utama: `game-2d/index.html`
- Skrip eksekusi cepat: `game-2d/run_game.sh`
- Cara menjalankan: Buka `index.html` pada peramban web apa pun, atau jalankan `./run_game.sh` di terminal.

## 11. Kesimpulan
Game 2D "Petualangan Mengumpulkan Koin" telah berhasil diselesaikan dengan memenuhi seluruh 12 ketentuan pembuatan game 2D dari Lembar Kerja Peserta Didik (LKPD). Game dilengkapi dengan fisika platformer yang responsif, visual menarik, audio sintetis chiptune, dan 2 variasi level yang menantang.
