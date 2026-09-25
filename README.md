# Silancar Prototype

Prototype frontend untuk dashboard omnichannel, sales, order dan produksi, KPI/OKR, serta hak akses Silancar.

## Menjalankan development server

```bash
npm install
npm run dev -- --port 5174
```

Server akan menerima koneksi melalui `0.0.0.0`, sehingga dapat diakses menggunakan VS Code Port Forwarding atau Microsoft Dev Tunnels.

Pastikan port yang diteruskan sama dengan port yang ditampilkan Vite. Jika terminal menampilkan `5173`, forward port `5173`. Jika menampilkan `5174`, forward port `5174`.

## Menjalankan production preview

```bash
npm run build
npm run preview -- --port 5174
```

Untuk demo yang tidak membutuhkan hot reload, production preview biasanya lebih stabil melalui port forwarding.
