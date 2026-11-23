#!/usr/bin/env bash
# Script untuk menjalankan Game 3D Petualangan Dunia 3D
# SMK Plus Pelita Nusantara Bogor

PORT=8081
echo "=========================================================="
echo "  Petualangan Dunia 3D - Game Developer 3D"
echo "  SMK Plus Pelita Nusantara Bogor"
echo "=========================================================="
echo "Menjalankan server lokal pada port $PORT..."
echo "Buka peramban di http://localhost:$PORT"

if command -v xdg-open > /dev/null; then
  (sleep 1 && xdg-open "http://localhost:$PORT") &
elif command -v open > /dev/null; then
  (sleep 1 && open "http://localhost:$PORT") &
fi

python3 -m http.server $PORT
