# 🚀 Modern Blog Platformu

Bu proje, **Next.js** tabanlı modern bir blog platformudur. Teknoloji ve inovasyon konularında içerik paylaşımı için geliştirilmiş, güçlü yönetim paneli ve kullanıcı rol sistemi içeren kapsamlı bir web uygulamasıdır.

## 📋 Proje Tanımı

Bu platform aşağıdaki temel problemleri çözmek için geliştirilmiştir:

- **İçerik Yönetimi**: Kullanıcıların kolayca blog yazısı paylaşabilmesi
- **Moderasyon**: Admin onayı ile kaliteli içerik kontrolü
- **Kategorizasyon**: İçeriklerin düzenli kategorilerde sınıflandırılması
- **Kullanıcı Yönetimi**: Rol tabanlı erişim kontrolü
- **Modern UX**: Responsive ve kullanıcı dostu arayüz

### 🎯 Özellikler

- ✅ **Kullanıcı Kimlik Doğrulama** - NextAuth ile güvenli giriş sistemi
- ✅ **Rol Tabanlı Erişim** - USER ve ADMIN rolleri ile yetkilendirme
- ✅ **Blog Yönetimi** - Yazı oluşturma, düzenleme ve onaylama
- ✅ **Kategori Sistemi** - İçeriklerin organize edilmesi
- ✅ **Admin Paneli** - Kapsamlı yönetim arayüzü
- ✅ **Mesajlaşma** - Kullanıcılar arası iletişim
- ✅ **Responsive Tasarım** - Tüm cihazlarda uyumlu
- ✅ **Middleware Güvenlik** - Otomatik yetki kontrolü

## 🛠️ Kullanılan Teknolojiler

### **Frontend & Backend**
- **Next.js 15.3.3** - React framework (App Router)
- **React 19.0.0** - UI kütüphanesi
- **TailwindCSS 4** - Modern CSS framework
- **NextAuth 4.24.11** - Authentication sistemi

### **Veritabanı & ORM**
- **Prisma 6.9.0** - Modern ORM
- **SQLite** - Hafif ve hızlı veritabanı

### **Güvenlik & Şifreleme**
- **bcryptjs** - Şifre hashleme
- **Middleware** - Route koruması

### **Geliştirme Araçları**
- **ESLint** - Kod kalitesi
- **Turbopack** - Hızlı development server

## 🚀 Kurulum Talimatları

### **Gereksinimler**
- Node.js 18+ 
- npm veya yarn

### **1. Projeyi İndirin**
```bash
git clone <repository-url>
cd web-proje
```

### **2. Bağımlılıkları Yükleyin**
```bash
npm install
```

### **3. Environment Değişkenlerini Ayarlayın**
`.env.local` dosyası oluşturun:
```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"
```

### **4. Veritabanını Hazırlayın**
```bash
# Prisma client'ı generate edin
npx prisma generate

# Veritabanı migration'larını çalıştırın
npx prisma migrate dev

# Örnek verileri yükleyin (admin kullanıcısı dahil)
npm run seed
```

### **5. Geliştirme Sunucusunu Başlatın**
```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 👤 Admin Giriş Bilgileri

Test amaçlı admin hesabı bilgileri:

```
Email: admin@example.com
Şifre: admin123
```


### **Test Kullanıcıları**
```
# Normal Kullanıcı
Email: test@example.com
Şifre: test123

# Diğer kullanıcılar seed işlemi ile otomatik oluşturulur
```

## 📁 Proje Yapısı

```
web-proje/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin paneli sayfaları
│   ├── api/               # API endpoints
│   ├── blog/              # Blog sayfaları
│   ├── dashboard/         # Kullanıcı dashboard
│   └── ...
├── components/            # Yeniden kullanılabilir bileşenler
├── lib/                   # Utility fonksiyonları
├── prisma/               # Veritabanı şemaları ve migration'lar
├── public/               # Static dosyalar
└── middleware.js         # Route koruması
```

## 🔐 Güvenlik Özellikleri

### **Middleware Koruması**
- `/admin/*` rotaları sadece ADMIN rolü ile erişilebilir
- `/dashboard/*` rotaları giriş yapmış kullanıcılar için
- Otomatik yönlendirme sistemi

### **API Güvenliği**
- Session tabanlı doğrulama
- Role-based access control
- Input validation

### **Şifre Güvenliği**
- bcryptjs ile hash'leme
- Güvenli session yönetimi

## 🌟 Kullanım Kılavuzu

### **Normal Kullanıcı**
1. Kayıt olun veya giriş yapın
2. Ana sayfada blog yazılarını inceleyin
3. "Blog Yaz" seçeneği ile içerik oluşturun
4. Kategoriler ile içerikleri filtreleyin

### **Admin Kullanıcı**
1. Admin hesabı ile giriş yapın
2. `/admin` paneline erişin
3. Blog yazılarını onaylayın/reddedin
4. Kullanıcı rollerini yönetin
5. Kategorileri düzenleyin



## 🔧 Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production sunucusu
npm run start

# Kod kalitesi kontrolü
npm run lint

# Veritabanı seed'i
npm run seed

# Prisma Studio (DB yönetimi)
npx prisma studio
```

## 📞 İletişim

Proje ile ilgili sorularınız için:
- GitHub Issues açın
- Email: [contact@mustafa-ozcan.com]

