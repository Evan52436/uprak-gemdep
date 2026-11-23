# Petualangan Dunia 3D (Game 3D Adventure Platformer)
Proyek Ujian Praktik Game Developer 3D &bull; SMK Plus Pelita Nusantara Bogor

## Ringkasan Proyek
Game petualangan 3D penjelajahan pulau terapung berbasis WebGL (Three.js lokal). Pemain mengendalikan karakter petualang 3D dengan kamera orbital chase, mengumpulkan kristal permata, melewati palang duri berputar dan drone patroli, menggunakan pegas pelontar serta cincin akselerasi, hingga mencapai altar kemenangan.

## Ketentuan LKPD yang Dipenuhi (14 Poin)
1. Lingkungan permainan 3D (pulau melayang, pepohonan, bebatuan, jembatan, pilar kuil, kabut atmosferik).
2. Karakter utama berbentuk model 3D terartikulasi (kepala, topi, mata, badan, lengan, kaki).
3. Terrain dan permukaan lingkungan bervariasi dengan ketinggian berbeda.
4. Kamera dengan sudut pandang 3D (orbital chase camera dengan navigasi seret mouse 360 derajat).
5. Karakter dapat bergerak ke depan, belakang, kanan, dan kiri secara relatif terhadap arah pandang kamera.
6. Karakter dapat melompat dengan fisika gravitasi realistis.
7. Minimal 10 objek kristal yang dapat dikumpulkan (Level 1: 12 kristal, Level 2: 15 kristal).
8. Minimal 3 rintangan (Jurang hampa, palang duri berputar, drone sentinel patroli).
9. Sistem skor dan perolehan kristal pada HUD terpadu.
10. Sistem tabrakan 3D (AABB Collision Detection) untuk platform, rintangan, dan pendaratan.
11. Pencahayaan matahari dinamis dan proyeksi bayangan nyata (*soft shadows*).
12. Animasi karakter (siklus berjalan, lompat, dan pernapasan saat diam).
13. Menu utama 3D dengan pratinjau kamera memutar, menu jeda, dan layar Game Over.
14. Kondisi menang saat pemain berhasil mencapai altar tujuan akhir.
15. Minimal 2 level permainan (Level 1: Dataran Hijau Nusantara, Level 2: Kuil Terapung Misteri).
16. Minimal 5 objek interaktif: Kristal Permata, Pegas Pelontar (Jump Pad), Cincin Kecepatan (Speed Boost Ring), Kristal Darah, Altar Finis.

## Cara Menjalankan Game
1. Jalankan langsung skrip pembantu di terminal:
   ```bash
   ./run_game.sh
   ```
2. Atau buka berkas `index.html` menggunakan peramban web modern (Google Chrome, Firefox, Safari, Edge). Berkas Three.js r128 sudah tersimpan lokal di `js/three.min.js` sehingga bekerja 100% offline tanpa internet.

## Kontrol Permainan
- **W** atau **&uarr;** : Bergerak maju
- **S** atau **&darr;** : Bergerak mundur
- **A** atau **&larr;** : Bergerak ke kiri
- **D** atau **&rarr;** : Bergerak ke kanan
- **Spasi** : Melompat
- **Klik &amp; Seret Mouse** : Memutar sudut pandang kamera 3D
- **P** atau **Esc** : Jeda permainan
- **D-pad &amp; Tombol Layar Sentuh** : Tersedia otomatis pada layar sentuh/perangkat mobile.
