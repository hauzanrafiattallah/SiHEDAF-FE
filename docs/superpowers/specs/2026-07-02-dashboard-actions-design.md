# Dashboard Actions Design

## Tujuan

Mengaktifkan seluruh kontrol dashboard yang saat ini masih dekoratif: pilihan rentang monitoring, navigasi profil, filter tanggal, pagination, upload avatar, penyimpanan profil, perubahan kata sandi, dan logout.

## Keputusan desain

- Interaksi menggunakan state React lokal sebagai simulasi frontend. Batas data dan event handler dibuat eksplisit agar mudah diganti dengan query/mutation backend.
- Calendar memakai `@daypicker/react` dalam mode range, dibungkus komponen `DateRangePicker` agar dependency tidak menyebar ke view.
- Modal akun memakai satu primitive `DashboardModal` dengan backdrop, penutupan lewat Escape, label dialog, dan action yang jelas.
- Upload avatar memakai input file tersembunyi, validasi tipe gambar, dan preview `FileReader`; file belum dikirim ke server.
- Pagination melakukan slice pada 20 data mock dan mereset halaman saat jumlah item atau range tanggal berubah.
- Navigasi internal memakai `next/link`; navigasi hasil action memakai `useRouter`.

## Batasan

Tidak ada authentication session, persistence profile, upload endpoint, atau API history. Keberhasilan simpan/password ditampilkan sebagai simulasi UI; logout mengarahkan ke `/login`.

