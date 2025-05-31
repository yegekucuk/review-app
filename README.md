
# Reviews App

Bu proje, Docker Compose ile çalışan basit bir Node.js uygulaması ve MySQL veritabanı içerir. Uygulama, `reviews` adlı bir veritabanını kullanarak kullanıcı yorumlarını yönetir.

---

## İçindekiler

- [Özellikler](#özellikler)
- [Gereksinimler](#gereksinimler)
- [Kurulum ve Çalıştırma](#kurulum-ve-çalıştırma)
- [Veritabanına Erişim](#veritabanına-erişim)

---

## Özellikler

- Node.js tabanlı backend
- MySQL 8.0 veritabanı
- Docker Compose ile kolay kurulum ve çalıştırma
- Ortam değişkenleri ile yapılandırma desteği

---

## Gereksinimler

- Docker (https://docs.docker.com/get-docker/)
- Docker Compose (https://docs.docker.com/compose/install/)

---

## Kurulum ve Çalıştırma

1. Depoyu klonlayın veya dosyaları indirip proje dizinine gidin.

2. Docker Compose ile servisi başlatın:
   ```bash
   docker compose up --build
   ```

3. Uygulama aşağıdaki adreste çalışacaktır:
   ```
   http://localhost:3000
   ```

---

## Veritabanına Erişim

MySQL konteynerine bağlanmak için:

```bash
docker compose exec mysql mysql -p reviews
```
Parola sorulduğunda `secret` girin.

Veritabanını seçip tablodaki tüm kayıtları görmek için:

```sql
SELECT * FROM reviews;
```
