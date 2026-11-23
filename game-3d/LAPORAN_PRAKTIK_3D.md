# LAPORAN UJIAN PRAKTIK PEMBUATAN GAME 3D
**ASESMEN SUMATIF AKHIR SEMESTER GANJIL TAHUN AJARAN 2026-2027**  
**SMK PLUS PELITA NUSANTARA BOGOR**  
Mata Pelajaran: Game Developer  
Guru Bidang Studi: Septianto Raharso, S.Kom., M.Pd.

---

## IDENTITAS PENGUMPULAN PROYEK SISWA (BAGIAN G)
- **Nama Siswa**: Peserta Didik XI RPL
- **Kelas**: XI RPL (Rekayasa Perangkat Lunak)
- **Jenis Proyek**: Game 3D
- **Judul Game**: Petualangan Dunia 3D
- **Software yang Digunakan**: Three.js WebGL Engine (r128 lokal), JavaScript ES6+, Web Audio API, CSS3
- **Metode Pengerjaan**: Individu

---

## 1. Judul dan Nama Game
**Judul Proyek**: Petualangan Dunia 3D (*3D World Adventure*)

## 2. Tujuan Pembuatan Game
1. Memenuhi target Asesmen Sumatif Akhir Semester Ganjil mata pelajaran Game Developer di SMK Plus Pelita Nusantara.
2. Mengembangkan kemampuan logika matematika ruang 3D (vektor posisi 3D, orientasi sudut Euler/kuaternion, proyeksi perspektif kamera orbital).
3. Menerapkan sistem rendering grafis WebGL dengan pencahayaan dinamis, bayangan nyata (*soft shadows*), dan kabut atmosferik (*exponential fog*).
4. Membangun gameplay interaktif tiga dimensi meliputi sistem platform melayang, platform bergerak kinematis, pegas pelontar vertikal, rintangan dinamis (palang duri berputar dan drone patroli), serta kondisi menang dan kalah.

## 3. Konsep dan Genre Game
- **Genre**: 3D Third-Person Platformer / Adventure
- **Tema**: Eksplorasi kepulauan melayang di atas langit dengan reruntuhan kuil mistis dan teknologi penjaga kuno.
- **Target Audiens**: Pemain kasual dan penggemar petualangan platformer 3D (seperti Super Mario 3D Land / Astro Bot).
- **Core Loop**: Menjelajahi pulau terapung &rarr; Mengatur sudut kamera 3D &rarr; Menghindari rintangan dan jurang &rarr; Mengumpulkan kristal energi &rarr; Mencapai altar kemenangan.

## 4. Software dan Teknologi yang Digunakan
- **Mesin Grafis**: Three.js r128 (disimpan secara lokal di direktori `js/three.min.js`, bekerja 100% offline).
- **Renderer**: WebGLRenderer dengan antialiasing dan PCFSoftShadowMap.
- **Bahasa Pemrograman**: JavaScript ES6+.
- **Desain & UI**: HTML5 Semantik dan CSS3 Flexbox.
- **Audio Engine**: Web Audio API (sintesis instrumen ruang angkasa & efek suara interaktif).
- **Platform**: Web Browser modern (Google Chrome, Firefox, Safari, Edge) tanpa instalasi plugin pihak ketiga.

## 5. Game Design Document (GDD) Sederhana
### A. Mekanika Inti (Core Mechanics)
1. **Pergerakan 3D Relatif Kamera**:
   - Kontrol W, A, S, D atau tombol panah menggerakkan karakter dalam ruang tiga dimensi.
   - Vektor pergerakan dihitung secara dinamis mengacu pada sudut azimut kamera (`cameraAngle`), sehingga tombol "Maju" selalu menggerakkan karakter ke arah depan pandangan kamera.
2. **Kamera 3D Orbital Chase**:
   - Kamera mengikuti di belakang karakter petualang secara mulus (*smooth lerp interpolation*).
   - Pemain dapat memutar sudut kamera 360 derajat secara bebas dengan mengklik dan menyeret mouse (*mouse drag orbit*).
3. **Fisika dan Lompatan**:
   - Karakter dipengaruhi oleh gravitasi dan inersia vertikal.
   - Deteksi pendaratan pada platform menggunakan kalkulasi batas kotak pembatas (*3D Axis-Aligned Bounding Box / AABB*).
4. **Platform Bergerak Kinematis**:
   - Platform batu melayang yang bergerak bolak-balik membawa karakter yang sedang berpijak di atasnya.
5. **Objek Interaktif (Interactive Objects)**:
   - *Pegas Pelontar (Jump Pad)*: Melontarkan karakter ke atas dengan kecepatan vertikal tinggi (`velocity.y = 0.65`).
   - *Cincin Akselerasi (Speed Boost Ring)*: Melipatgandakan kecepatan lari karakter selama 6 detik.
   - *Kristal Darah Merah*: Memulihkan energi HP sebesar +30 poin.
   - *Kristal Permata*: Mengumpulkan poin skor (+100).
   - *Altar Finis*: Memicu kondisi menang saat berada dalam radius altar.
6. **Kondisi Kalah**:
   - Nyawa (HP) mencapai 0 akibat terkena rintangan atau terjatuh ke dalam jurang hampa di bawah pulau (`y < -6.0`).
7. **Kondisi Menang**:
   - Pemain berhasil menavigasi rintangan dan mencapai Altar Kemenangan bercahaya.

### B. Desain Level (Level Progression)
- **Level 1 (Dataran Hijau Nusantara)**:
  - Lingkungan: Pulau hijau terapung dengan pepohonan, bebatuan alam, jembatan penghubung, dan langit biru cerah.
  - Jumlah Kristal: 12 buah (melebihi batas minimal 10 buah).
  - Rintangan: Jurang hampa, palang duri berputar pada pulau tengah, dan drone penjaga berpatroli di jembatan.
  - Fitur: Pegas pelontar ke dataran tinggi, cincin kecepatan, dan kuil tujuan akhir.
- **Level 2 (Kuil Terapung Misteri)**:
  - Lingkungan: Reruntuhan kuil kuno di langit malam berbintang dengan pilar marmer mistis.
  - Jumlah Kristal: 15 buah.
  - Rintangan: Jurang luas, palang duri ganda berputar, 2 drone sentinel otomatis, dan platform bergerak melayang (sumbu X dan sumbu Z).
  - Fitur: Cincin turbo, kristal darah pemulih, pegas pelontar jarak jauh, dan Altar Agung Kemenangan.

## 6. Desain Karakter dan Objek 3D
1. **Karakter Petualang (The 3D Adventurer)**:
   - Dibuat secara modular hierarkis menggunakan geometri Three.js: Badan berkemeja biru, ransel petualang cokelat, kepala dengan ekspresi wajah, topi petualang merah bervisir, serta lengan dan kaki yang dapat bergerak.
   - Memiliki animasi artikulasi prosedural (ayunan langkah kaki dan tangan saat berjalan, postur melompat, dan pernapasan saat diam).
2. **Kristal Permata (Collectibles)**:
   - Geometri Oktahedron dengan material Phong berkilau (*shininess: 90*), berputar dan mengapung naik-turun.
3. **Palang Duri Berputar (Rotating Spike Bar)**:
   - Batang merah dengan poros baja silindris yang berputar konstan, mengharuskan pemain melompat tepat waktu.
4. **Drone Sentinel (Patrol Drone)**:
   - Robot melayang bulat dengan mata merah bercahaya dan cincin stabilisator emas yang berpatroli antar batas pulau.
5. **Pegas Pelontar (Jump Pad)**:
   - Piringan pegas oranye bercahaya yang langsung memantulkan karakter ke atas saat diinjak.
6. **Altar Kemenangan (Goal Altar)**:
   - Altar melingkar dengan 4 pilar marmer putih dan pilar cahaya silindris vertikal transparan.

## 7. Flowchart Alur Permainan 3D

```
[ Menu Utama 3D (Kamera Mengorbit Pulau) ]
                     |
                     v
             [ Mulai Petualangan ]
                     |
                     v
      [ Muat Level 1: Dataran Hijau ] <----------------------\
                     |                                       |
                     +---> [ Input Pemain (WASD + Spasi) ]   |
                     |     [ Kontrol Kamera (Seret Mouse) ]  |
                     |                |                      |
                     |                v                      |
                     |       [ Kalkulasi Vektor 3D ]         |
                     |                |                      |
                     |                v                      |
                     |       [ Deteksi Tabrakan 3D ]         |
                     |                |                      |
                     |                +--> [ Ambil Kristal (+100) ]
                     |                +--> [ Injak Jump Pad (Melontar Naik) ]
                     |                +--> [ Ambil Cincin Kecepatan ]
                     |                +--> [ Terbentur Duri / Drone / Jurang ]
                     |                           |           |
                     |                           v           |
                     |                      [ HP Berkurang ] |
                     |                           |           |
                     |                  (Apakah HP <= 0?)    |
                     |                     /          \      |
                     |                  Ya/            \Tidak|
                     |                   v              v    |
                     |           [ Game Over ]    [ Efek Imun ]
                     |                   |                   |
                     |                   v                   |
                     |             [ Coba Lagi ]             |
                     v                                       |
          (Mencapai Altar Finis?)                            |
                     | Ya                                    |
                     v                                       |
       [ Layar Kemenangan Level 1 ]                          |
                     |                                       |
                     v (Pilih Lanjut)                        |
       [ Muat Level 2: Kuil Terapung ]                       |
                     |                                       |
                     v (Mencapai Altar Kemenangan Akhir)     |
       [ Kemenangan Sempurna (All Completed) ]               |
                     |                                       |
                     v                                       |
       [ Kembali ke Menu Utama ] ----------------------------/
```

## 8. Penjelasan Script dan Kode Program
1. `index.html`: Menyediakan kanvas WebGL, HUD terintegrasi (indikator HP bar, kristal, skor, level), dan modal antarmuka.
2. `css/style.css`: Menata tampilan futuristik-petualangan dengan palet gelap beraksen cyan dan emas, serta tombol kontrol sentuh mobile.
3. `js/three.min.js`: Bundel mesin grafis Three.js r128 yang disimpan secara lokal sehingga game dapat dijalankan tanpa koneksi internet.
4. `js/audio.js`: Modul `SoundSystem3D` menggunakan Web Audio API untuk menghasilkan bunyi kristal, lompatan, pelontar pegas, benturan rintangan, melodi kemenangan, dan musik atmosferik 3D.
5. `js/player.js`: Mengatur pembuatan hierarki model 3D karakter, kinematika gerak relatif terhadap pandangan kamera, sistem gravitasi, lompatan, dan animasi artikulasi tubuh.
6. `js/levels.js`: Modul `LevelBuilder3D` yang merakit lanskap pulau melayang, platform statis dan dinamis, pepohonan, bebatuan, kristal permata, jebakan duri berputar, dan drone patroli.
7. `js/game.js`: Inti permainan yang mengelola rendering loop 60 FPS, interpolasi kamera orbital, deteksi tabrakan AABB 3D, interaksi objek, dan transisi layar.

## 9. Hasil Pengujian Game 3D
| Fitur yang Diuji | Skenario Uji | Hasil yang Diharapkan | Status |
|------------------|--------------|-----------------------|--------|
| Rendering 3D & Bayangan | Memuat peramban web | Lingkungan 3D, pencahayaan matahari, dan bayangan tampil mulus | **BERHASIL** |
| Kontrol Navigasi WASD | Menekan W/A/S/D | Karakter bergerak maju, mundur, kiri, kanan sesuai arah kamera | **BERHASIL** |
| Rotasi Kamera Mouse | Mengklik & menggeser mouse | Sudut pandang kamera berputar mengelilingi karakter secara halus | **BERHASIL** |
| Fisika Lompat & Gravitasi | Menekan Spasi | Karakter melompat ke atas dan mendarat kembali di atas platform | **BERHASIL** |
| Koleksi Kristal | Menyentuh kristal 3D | Kristal lenyap, efek suara berdenting, skor bertambah +100 | **BERHASIL** |
| Pegas Pelontar (Jump Pad) | Menginjak pegas oranye | Karakter terpental tinggi ke dataran atas | **BERHASIL** |
| Cincin Turbo | Melewati cincin cyan | Karakter berlari lebih cepat selama durasi booster (6 detik) | **BERHASIL** |
| Rintangan Palang Duri | Menyentuh palang berputar | HP karakter berkurang, efek suara terluka, karakter terpental | **BERHASIL** |
| Jatuh ke Jurang | Melompat keluar batas pulau | HP berkurang, karakter kembali ke titik spawn | **BERHASIL** |
| Transisi & Kemenangan | Memasuki Altar Finis | Muncul layar kemenangan dengan opsi lanjut ke Level 2 | **BERHASIL** |

## 10. Link dan File Game
- Berkas utama: `game-3d/index.html`
- Skrip eksekusi cepat: `game-3d/run_game.sh`
- Cara menjalankan: Buka `index.html` pada peramban web apa pun, atau jalankan `./run_game.sh` di terminal.

## 11. Kesimpulan
Game 3D "Petualangan Dunia 3D" telah selesai dibangun dengan memenuhi ke-14 ketentuan pembuatan game 3D serta seluruh persyaratan proyek tambahan LKPD. Game memiliki kualitas visual 3D yang kaya, animasi karakter ekspresif, kamera orbital dinamis, efek bayangan nyata, rintangan variatif, dan dua level yang menantang.
