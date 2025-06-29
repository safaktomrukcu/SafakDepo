# SafakDepo

SafakDepo, portföyüm için hazırladığım, depo ve stok yönetimini kolaylaştırmayı amaçlayan basit ve işlevsel bir projedir. Modern web teknolojileriyle geliştirilmiş olup hem güçlü bir API hem de kullanıcı dostu bir web arayüzü içerir. Amacım, yeni projelerde çalışarak farklı bilgiler edinmek ve kendimi sürekli olarak geliştirmek.

---

## 🚀 Proje Hakkında

- **Backend (API):** C# ve .NET Core tabanlı, SafakDepoAPI klasöründe.
- **Frontend (Web Arayüzü):** React ve TailwindCSS ile hazırlanmış, safak-depo-react klasöründe.

---

## 📦 Klasör Yapısı

```
SafakDepo/
├── SafakDepoAPI/           # .NET Core API (Backend)
│   ├── Controllers/
│   ├── DTOs/
│   ├── Data/
│   ├── Helpers/
│   ├── Models/
│   ├── Program.cs
│   └── ...
└── safak-depo-react/       # React tabanlı web arayüzü (Frontend)
    ├── public/
    ├── src/
    ├── package.json
    └── ...
```

---

## 🛠️ Kullanılan Teknolojiler

**Backend**
- C#, .NET Core Web API
- Entity Framework Core
- SQL Server (veya uyumlu bir veritabanı)
- JWT Authentication

**Frontend**
- React.js
- TailwindCSS
- Axios

---

## ⚡ Kurulum ve Çalıştırma

### 1. Backend (API) Kurulumu

```bash
cd SafakDepoAPI
# Gerekli NuGet paketlerini yükleyin
dotnet restore
# Geliştirme ortamı için veritabanı bağlantınızı appsettings.json dosyasında güncelleyin
dotnet run
```

API varsayılan olarak `https://localhost:7018` adresinde çalışır.

### 2. Frontend (Web Arayüzü) Kurulumu

```bash
cd safak-depo-react
npm install
npm start
```

Web arayüzü varsayılan olarak `http://localhost:3000` adresinde çalışır.

---

## 🎯 Özellikler

- Ürün, kategori, stok ve sevkiyat yönetimi
- Kullanıcı dostu, hızlı ve modern web arayüzü
- Güçlü API ile diğer sistemlerle kolay entegrasyon
- Yetkilendirme ve kimlik doğrulama (JWT)
- Responsive tasarım

---

## 📄 Lisans

Bu proje MIT lisansı ile lisanslanmıştır.

---

## 📬 İletişim

Her türlü soru ve öneriniz için [GitHub profilim](https://github.com/safaktomrukcu) üzerinden ulaşabilirsiniz.

---

> “Yazılım, hayatı kolaylaştırır. Kod ise bu kolaylığın anahtarıdır.”
