# Chy-Nodejs-Framework Multiple Prefix Support - Değişiklik Notları

SubAccountController üzerinde birden fazla `@controller` decorator'ünün çalışabilmesi için framework üzerinde aşağıdaki güncellemeler yapılmıştır.

## Yapılan Değişiklikler

1. **`src/decorator/controller.ts`**:
   - `@controller` decorator'ü artık `prefix` metadatasını ezmek yerine her çağrıldığında `prefixes` adında bir array metadatasına ekleme yapacak şekilde güncellendi.
   - Geriye uyumluluk için `prefix` metadatası da en son çağrılan decorator değeriyle güncellenmeye devam ediyor.

2. **`src/BaseChyz.ts`**:
   - `loadController` metodunda controller yüklenirken `prefixes` metadatası okunuyor. Eğer bulunamazsa geriye uyumluluk amacıyla tekil `prefix` veya boş string okunuyor.
   - `prefixes` array'indeki her bir prefix için ilgili controller rotaları dinamik olarak Express/provider uygulamasına tanımlanıyor (`for (const prefix of prefixes)` döngüsü eklendi).
   - Metot sonundaki parantez (bracket) kapatma hatası giderilerek derleme hatası düzeltildi.
   - Yanlışlıkla `src/node_modules` klasörü altına kopyalanmış olan ve tip çakışmalarına yol açan mükerrer `node_modules` klasörü temizlendi.

---

## Gerçekleştirilen Adımlar ve Son Durum

1. **Framework Derlendi (Build)**:
   - Framework dizininde `yarn build` başarıyla tamamlandı.
2. **Sunucuya Aktarıldı (Deployment/Integration)**:
   - Derlenen `dist/` klasörü doğrudan `hubboxIo-Server/node_modules/chyz/` dizinine kopyalanarak güncellendi.
3. **Controller Tanımlaması Yapıldı**:
   - `hubboxIo-Server/Controllers/SubAccountController.ts` dosyasında `@controller('/api/v4/subaccount')` decorator'ü eklendi.
4. **Derleme Kontrolü Yapıldı**:
   - Hem framework (`Chy-Nodejs-Framework`) hem de sunucu (`hubboxIo-Server`) projelerinde TypeScript derleme kontrolleri (`npx tsc --noEmit`) sorunsuz şekilde başarıyla tamamlandı.

Artık hem `/api/subaccount/...` hem de `/api/v4/subaccount/...` endpoint'leri üzerinden istek yapılabilecektir.
