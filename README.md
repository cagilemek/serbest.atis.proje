# 🏀 Serbest Atış Projesi

Stacks blockchain üzerinde geliştirilen basketbol serbest atış tahmin oyunu. Oyuncular 3 atış için tahminlerini yapar, gerçek atışları gerçekleştirir ve tahminleri doğruysa STX token kazanır!

## 🎯 Oyun Nasıl Çalışır

1. **Tahmin Aşaması**: 3 serbest atış için tahminlerinizi yapın (girer/girmez)
2. **Atış Aşaması**: Gerçek atışlarınızı simüle edin
3. **Ödül Aşaması**: Tahminleriniz atışlarınızla tam eşleşirse 1 STX token kazanın!

## 🛠️ Teknoloji Stack

### Blockchain
- **Clarity Smart Contracts**: Oyun mantığı ve token yönetimi
- **Stacks Blockchain**: Bitcoin güvenliği ile akıllı sözleşme platformu
- **STX Token**: Ödül sistemi için native token

### Frontend
- **Next.js 14**: React tabanlı modern web framework
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: Modern ve responsive UI
- **Stacks.js**: Blockchain entegrasyonu

### Geliştirme Araçları
- **Clarinet**: Smart contract geliştirme ve test ortamı
- **Vitest**: Test framework
- **ESLint & Prettier**: Kod kalitesi

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Clarinet CLI
- Hiro Wallet veya Xverse Wallet

### Kurulum
```bash
# Projeyi klonlayın
git clone <proje-url>
cd serbest-atis-proje

# Dependencies'leri yükleyin
npm install

# Smart contract testlerini çalıştırın
npm test

# Development server'ı başlatın
npm run dev
```

### Production Build
```bash
# Production build oluşturun
npm run build

# Production server'ı başlatın
npm start
```

## 🔧 Smart Contract

### Ana Fonksiyonlar

- `start-game(predictions)`: Yeni oyun başlatır
- `take-shots(shots)`: Atışları gerçekleştirir
- `reset-game()`: Oyunu sıfırlar
- `get-game-stats(player)`: Oyuncu istatistiklerini getirir

### Veri Yapıları

```clarity
{
  predictions: (list 3 bool),
  shots: (list 3 bool),
  completed: bool,
  reward-claimed: bool
}
```

## 🎮 Kullanım

1. **Cüzdan Bağlantısı**: Hiro Wallet veya Xverse ile bağlanın
2. **Tahmin Yapma**: Her atış için "Girer" veya "Girmez" seçin
3. **Oyun Başlatma**: Tahminlerinizi blockchain'e gönderin
4. **Atış Yapma**: Sırayla 3 atışınızı gerçekleştirin
5. **Sonuç**: Tahminler doğruysa otomatik olarak token kazanın

## 📱 Özellikler

- ✅ Responsive tasarım (mobil uyumlu)
- ✅ Real-time blockchain entegrasyonu
- ✅ Animasyonlu basketbol sahası
- ✅ Detaylı istatistik takibi
- ✅ Güvenli cüzdan bağlantısı
- ✅ Türkçe arayüz

## 🧪 Test

```bash
# Smart contract testleri
npm test

# Test raporları
npm run test:reports

# Watch mode
npm run test:watch
```

## 📝 Contract Deployment

### Testnet
```bash
clarinet deployments generate --devnet
clarinet deployments apply --devnet
```

### Mainnet
```bash
clarinet deployments generate --mainnet
clarinet deployments apply --mainnet
```

## 🔐 Güvenlik

- ✅ Post-condition'lar ile güvenli işlemler
- ✅ Input validasyonu
- ✅ Overflow/underflow koruması
- ✅ Reentrancy koruması

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 🔗 Bağlantılar

- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Language](https://docs.stacks.co/clarity)
- [Hiro Wallet](https://wallet.hiro.so)
- [Xverse Wallet](https://www.xverse.app)

## 💡 Gelecek Özellikler

- [ ] Multiplayer mod
- [ ] Turnuva sistemi
- [ ] NFT ödülleri
- [ ] Liderlik tablosu
- [ ] Sosyal özellikler
- [ ] Mobil uygulama

## ⚠️ Not

Bu proje eğitim amaçlı geliştirilmiştir. Mainnet'te kullanmadan önce kapsamlı testler yapın.

---

**Geliştirici**: Stacks & Clarity Smart Contracts ile geliştirilmiştir
**Blockchain**: Stacks (Bitcoin Layer 2)
**Framework**: Next.js + TypeScript + Tailwind CSS
