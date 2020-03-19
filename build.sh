#!/bin/sh

echo "[*] Checking for python3"
which python3 || (echo "[!] Python3 missing"; exit 1)
echo "[*] Checking for node"
which node || (echo "[!] node missing"; exit 1)
echo "[*] Checking for npm"
which npm || (echo "[!] npm missing"; exit 1)
cd ui
echo "[*] Installing NPM Packages"
npm install
echo "[*] Clearing old build"
rm -rf build
echo "[*] Building..."
npm run-script build
echo "[*] Clearing current live"
rm -rf ../live
echo "[*] Moving to live directory"
mv build ../live
echo "[*] Generating new data"
cd ..
python3 generate.py
