# MUARA: paket website untuk Render

Paket ini berisi kode dan hasil build company profile MUARA. Tampilan memuat peta interaktif, pratinjau Paspor MUARA, pilihan layanan, alur bahan, visual pendampingan pemasok, FAQ, dan formulir kebutuhan.

## Yang perlu Anda kerjakan

1. Ekstrak ZIP ini di komputer.
2. Masuk ke GitHub dan buat repository baru bernama `muara-company-profile`.
3. Pilih Public untuk jalur akses kode paling sederhana. Paket ini tidak berisi kata sandi, API key, file Excel, atau data pelanggan. Jika memilih Private, hubungkan repository tersebut dengan akun Render terlebih dahulu.
4. Tambahkan README saat membuat repository agar tombol Add file tersedia. Setelah repository dibuat, pilih Add file > Upload files.
5. Buka folder hasil ekstraksi. Seret seluruh ISINYA, termasuk folder `dist`, `src`, dan `public`, ke area unggah GitHub. Jangan mengunggah ZIP-nya. Jangan membungkus semua isi dalam satu folder tambahan.
6. Simpan dengan Commit changes atau alur Propose changes dan merge jika GitHub mengarahkannya ke pull request.
7. Pastikan `index.html`, `package.json`, `README.md`, dan folder `dist` terlihat pada halaman utama repository, pada branch `main`.
8. Kirim URL repository melalui chat. Publikasi Render dan penyambungan formulir akan dilanjutkan dari sana.

## Pengaturan Render

Jenis layanan: Static Site, bukan Web Service.
Nama: muara-company-profile, atau nama tersedia yang disepakati.
Branch: main.
Build Command: true
Publish Directory: dist
Environment variable: SKIP_INSTALL_DEPS=true

Folder dist sudah berisi hasil build, jadi Render cukup menerbitkan file yang tersedia. Untuk mengubah kode sumber, jalankan build lagi dan sertakan hasil dist terbaru sebelum mendorong perubahan.

## Formulir kontak saat pindah alamat

Penyimpanan permintaan tetap berada pada backend MUARA yang sekarang. Paket ini tidak menyalin data permintaan, credential, atau database ke repository.

Frontend mengarah ke endpoint MUARA yang sekarang. Backend hanya mengizinkan origin yang telah disetujui. Setelah Render memberikan alamat sebenarnya, alamat baru tersebut harus ditambahkan secara eksak pada pengaturan backend dan permintaan harus diuji dari domain baru. Langkah ini akan ditangani saat publikasi dilanjutkan. Sampai tahap itu selesai, jangan membagikan alamat Render sebagai website final dengan formulir aktif.

Migrasi antarmuka tidak sama dengan migrasi database. Website yang sudah terbit saat ini tetap dapat dipakai dengan formulir yang berjalan melalui origin-nya sendiri.

## Membangun ulang

Gunakan Node.js yang didukung Vite 8. Pasang dependensi dengan npm install, lalu jalankan npm run build. Hasilnya masuk ke dist.

Jika alamat API diubah, atur VITE_INQUIRY_ENDPOINT saat build. Nilai ini merupakan URL publik endpoint, bukan secret.

## Referensi panduan

GitHub. Creating a new repository. https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository
GitHub. Adding a file to a repository. https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
Render. Static Sites. https://render.com/docs/static-sites
