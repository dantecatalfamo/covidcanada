#!/bin/sh

cd ui
echo "[*] Installing NPM Packages"
npm install
echo "[*] Clearing old build"
rm -rf build
echo "[*] Building..."
npm run-script build
echo "[*] Moving to live directory"
mv build ../live
