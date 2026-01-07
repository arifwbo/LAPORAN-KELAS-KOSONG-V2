# 🔧 Panduan Troubleshooting Akses dari Luar Jaringan

## Checklist Langkah-langkah

### 1️⃣ Verifikasi Server Berjalan dengan Benar

**Jalankan server:**
```bash
npm run build
npm run start:server
```

**Cek apakah server listening di 0.0.0.0:**
```bash
# Windows
netstat -an | findstr "1991"

# Linux/Mac
netstat -an | grep "1991"
```

**Output yang benar:**
```
TCP    0.0.0.0:1991          0.0.0.0:0              LISTENING
```

Jika output menunjukkan `127.0.0.1:1991`, server masih bind ke localhost. Pastikan menggunakan kode terbaru (commit 97615f1).

---

### 2️⃣ Cek IP Address Lokal

**Windows:**
```bash
ipconfig
```

**Linux/Mac:**
```bash
ifconfig
# atau
ip addr show
```

Catat **IPv4 Address** Anda (contoh: `192.168.1.100`)

---

### 3️⃣ Test Akses dari Jaringan Lokal

Dari device lain di jaringan yang sama (HP, laptop lain):
```
http://[IP-LOCAL-ANDA]:1991
```

Contoh: `http://192.168.1.100:1991`

✅ **Jika berhasil:** Server berjalan dengan baik, lanjut ke langkah 4  
❌ **Jika gagal:** Masalah di firewall lokal, lanjut ke langkah 5

---

### 4️⃣ Cek IP Public

**Cari IP Public Anda:**
- Buka: https://whatismyipaddress.com/
- Atau Google: "what is my ip"

Catat IP Public Anda (contoh: `203.123.45.67`)

---

### 5️⃣ Konfigurasi Windows Firewall

**Cara 1 - Allow Port (Recommended):**

1. Buka **Windows Defender Firewall with Advanced Security**
2. Klik **Inbound Rules** → **New Rule**
3. Pilih **Port** → Next
4. Pilih **TCP**, masukkan port **1991** → Next
5. Pilih **Allow the connection** → Next
6. Centang **Domain**, **Private**, **Public** → Next
7. Nama: `SiswaConnect Port 1991` → Finish

**Cara 2 - Disable Firewall (Temporary untuk Testing):**
```bash
# HANYA UNTUK TESTING!
# Windows + R → firewall.cpl → Turn Windows Defender Firewall off
```

⚠️ **INGAT:** Nyalakan kembali firewall setelah testing!

---

### 6️⃣ Konfigurasi Router Port Forwarding

**Langkah Umum:**

1. **Akses Router:**
   - Buka browser: `http://192.168.1.1` atau `http://192.168.0.1`
   - Login (biasanya: admin/admin atau lihat stiker di router)

2. **Cari Menu Port Forwarding:**
   - Bisa di: **Advanced** → **NAT Forwarding** → **Port Forwarding**
   - Atau: **Firewall** → **Virtual Servers**
   - Atau: **WAN** → **Virtual Server/Port Forwarding**

3. **Tambah Rule Baru:**
   ```
   Service Name: SiswaConnect
   External Port: 1991 (atau port lain seperti 8080)
   Internal Port: 1991
   Internal IP: [IP-LOCAL-PC-ANDA] (contoh: 192.168.1.100)
   Protocol: TCP atau TCP/UDP
   Status: Enabled
   ```

4. **Save/Apply**

**Contoh untuk Router Populer:**

**TP-Link:**
- Advanced → NAT Forwarding → Virtual Servers
- Add → Service Port: 1991, Internal Port: 1991, IP: 192.168.1.100

**Tenda:**
- Advanced Settings → Port Forwarding
- Add → External Port: 1991, Internal Port: 1991, IP: 192.168.1.100

**Huawei/ZTE (Indihome):**
- Application → Port Forwarding
- Add → Name: SiswaConnect, WAN Port: 1991, LAN Port: 1991, Server IP: 192.168.1.100

---

### 7️⃣ Test Akses dari Internet

**Dari HP (matikan WiFi, gunakan data seluler):**
```
http://[IP-PUBLIC-ANDA]:1991
```

Contoh: `http://203.123.45.67:1991`

**Atau gunakan online tool:**
- https://www.yougetsignal.com/tools/open-ports/
- Masukkan IP Public dan port 1991
- Klik "Check"

---

### 8️⃣ Solusi IP Dinamis (Opsional)

Jika IP Public berubah-ubah, gunakan Dynamic DNS:

**No-IP (Gratis):**
1. Daftar: https://www.noip.com/
2. Buat hostname: `myapp.ddns.net`
3. Download No-IP DUC (Dynamic Update Client)
4. Install dan login di PC
5. Akses dengan: `http://myapp.ddns.net:1991`

**DuckDNS (Gratis):**
1. Daftar: https://www.duckdns.org/
2. Buat subdomain: `myapp.duckdns.org`
3. Install client sesuai OS
4. Akses dengan: `http://myapp.duckdns.org:1991`

---

## 🐛 Troubleshooting Common Issues

### Issue: "Connection Refused"
**Penyebab:**
- Server tidak berjalan
- Port salah
- Firewall memblok

**Solusi:**
1. Pastikan server running: `netstat -an | findstr 1991`
2. Cek firewall Windows
3. Restart server

---

### Issue: "Connection Timeout"
**Penyebab:**
- Router tidak forward port
- ISP memblok port
- IP Public salah

**Solusi:**
1. Cek port forwarding di router
2. Test dengan port lain (8080, 3000)
3. Hubungi ISP jika port tetap diblok

---

### Issue: "Works locally but not from internet"
**Penyebab:**
- Port forwarding belum dikonfigurasi
- ISP menggunakan CG-NAT (Carrier Grade NAT)
- Double NAT

**Solusi:**
1. Konfigurasi port forwarding dengan benar
2. Jika ISP pakai CG-NAT, minta IP Public Static (biasanya berbayar)
3. Atau gunakan VPN/Tunneling seperti:
   - **ngrok:** `ngrok http 1991`
   - **localtunnel:** `lt --port 1991`
   - **serveo:** `ssh -R 80:localhost:1991 serveo.net`

---

## 🚀 Alternatif: Gunakan Tunneling Service

Jika port forwarding terlalu rumit atau tidak memungkinkan:

### Ngrok (Recommended)
```bash
# 1. Download dari https://ngrok.com/download
# 2. Extract dan jalankan:
ngrok http 1991

# Output akan berikan URL seperti:
# https://abc123.ngrok.io
```

### Localtunnel
```bash
# Install
npm install -g localtunnel

# Jalankan
lt --port 1991

# Output: https://random-name.loca.lt
```

**Kelebihan:**
- Tidak perlu konfigurasi router
- Langsung dapat HTTPS
- Mudah digunakan

**Kekurangan:**
- URL berubah setiap restart (kecuali pakai akun premium)
- Tergantung service pihak ketiga

---

## 📋 Checklist Debugging

- [ ] Server berjalan (`npm run start:server`)
- [ ] Server listening di 0.0.0.0:1991 (cek dengan `netstat`)
- [ ] Bisa akses dari `http://localhost:1991`
- [ ] Tahu IP local (contoh: 192.168.1.100)
- [ ] Bisa akses dari device lain di WiFi yang sama
- [ ] Windows Firewall allow port 1991
- [ ] Router port forwarding dikonfigurasi
- [ ] Tahu IP Public (dari whatismyipaddress.com)
- [ ] Test akses dari HP (data seluler): `http://[IP-PUBLIC]:1991`

---

## 💡 Tips

1. **Gunakan port yang tidak umum** untuk keamanan (bukan 80, 443, 8080)
2. **Backup konfigurasi router** sebelum edit
3. **Catat username/password router** untuk akses di kemudian hari
4. **Restart router** setelah konfigurasi port forwarding
5. **Gunakan HTTPS** jika deploy ke internet (gunakan Cloudflare Tunnel atau Let's Encrypt)

---

## 📞 Butuh Bantuan Lebih?

Jika masih bermasalah, berikan info berikut:

1. **Output dari `netstat -an | findstr 1991`**
2. **Screenshot konfigurasi port forwarding di router**
3. **Merk dan model router**
4. **ISP yang digunakan**
5. **Error message yang muncul**
6. **Apakah bisa akses dari jaringan lokal?**

---

**Dibuat untuk membantu deployment SiswaConnect**  
Last updated: 2026-01-07
