# Petualangan Mengumpulkan Koin (Game 2D Platformer)
Proyek Ujian Praktik Game Developer 2D &bull; SMK Plus Pelita Nusantara Bogor

## Ringkasan Proyek
Game platformer 2D petualangan dengan karakter sprite dinamis yang bertugas mengumpulkan koin emas, melewati rintangan berbahaya, mengalahkan monster dengan mekanisme injak (*stomp*), dan mencapai portal finis.

## Ketentuan LKPD yang Dipenuhi
1. Karakter utama menggunakan sprite 2D dengan animasi gerak (diam, lari, lompat, terluka).
2. Latar belakang permainan multi-lapis (*parallax scrolling*) hutan dan gua.
3. Karakter dapat bergerak ke kanan dan kiri secara responsif.
4. Karakter dapat melompat dengan fisika gravitasi dan *coyote time*.
5. Lebih dari 10 objek koin (Level 1: 16 koin, Level 2: 20 koin).
6. Minimal 3 jenis rintangan/musuh: Slime hijau patroli, Kelelawar ungu terbang, Duri tajam baja.
7. Sistem skor bertambah saat mengumpulkan koin (+100) dan mengalahkan musuh (+200).
8. Sistem nyawa karakter (3 hati) dengan imunitas sementara saat terluka.
9. Tampilan Game Over saat nyawa habis dengan tombol coba lagi.
10. Tampilan You Win saat mencapai finis dengan statistik koin dan skor.
11. Musik latar (BGM) dan efek suara sintetis (Web Audio API).
12. Menu utama, menu jeda, dan tombol mulai ulang level.
13. Minimal 2 level permainan (Level 1: Hutan Pelita, Level 2: Gua Kristal).
14. Minimal 5 objek interaktif: Koin, Ramuan Darah, Peti Misteri, Platform Bergerak, Bendera Finis.

## Cara Menjalankan Game
1. Jalankan langsung skrip pembantu di terminal:
   ```bash
   ./run_game.sh
   ```
2. Atau buka berkas `index.html` langsung menggunakan peramban web favorit Anda (Google Chrome, Mozilla Firefox, Microsoft Edge, dll).

## Kontrol Permainan
- **A** atau **&larr;** : Bergerak ke kiri
- **D** atau **&rarr;** : Bergerak ke kanan
- **Spasi** atau **W** atau **&uarr;** : Melompat
- **P** atau **Esc** : Jeda permainan
- **Tombol Sentuh di Layar** : Tersedia otomatis untuk gawai mobile / layar sentuh.
