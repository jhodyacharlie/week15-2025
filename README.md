# Digeboy — Kelola Pesanan

Side project halaman pesanan terbaru dengan Next.js, Prisma, dan SQLite. Fitur yang tersedia:

- Membaca, mencari, dan memfilter daftar pesanan.
- Membuat, mengubah, dan menghapus pesanan beserta barangnya.
- Menulis atau mengubah ulasan untuk pesanan yang sudah sampai.
- Tampilan tema terang dan gelap.

## Menjalankan secara lokal

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Buka <http://localhost:3000>. Perubahan CRUD dan ulasan di mode lokal disimpan ke `prisma/dev.db`.

`npm run db:seed` mengisi enam pesanan contoh dan mengosongkan data order yang sudah ada. Jalankan hanya jika ingin mengganti isi database dengan data contoh.

## Menyiapkan data untuk Vercel

Vercel menjalankan aplikasi dalam mode read-only. Endpoint tambah, ubah, hapus, dan ulasan akan mengembalikan status `403`. Endpoint baca mengambil data dari SQLite yang disertakan di repository; file disalin ke `/tmp` pada runtime agar proses baca tidak menyentuh database sumber.

Untuk memperbarui data demo yang tampil di Vercel:

1. Jalankan aplikasi secara lokal dan lakukan CRUD seperti biasa, atau isi ulang data contoh dengan `npm run db:seed`.
2. Pastikan perubahan `prisma/dev.db` ikut di-commit dan di-push bersama kode. File tersebut tidak masuk `.gitignore`.
3. Deploy ulang di Vercel. Data database yang ada di commit itu akan tampil sebagai data read-only.

Perubahan yang dilakukan di Vercel tidak disimpan. Setelah mengubah database lokal, perlu commit, push, dan deploy ulang agar data baru tampil di sana.
