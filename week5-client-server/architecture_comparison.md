# Architecture Analysis: Monolithic vs Layered vs Client-Server

## 1. ตารางเปรียบเทียบ

| ด้าน | Monolithic (Week 3) | Layered (Week 4) | Client-Server (Week 5) |
| --- | --- | --- | --- |
| โครงสร้างโค้ด | ไฟล์เดียว | แยกเป็น Layer | แยก Client / Server |
| ความซับซ้อน | ต่ำ | ปานกลาง | สูง |
| การ Deploy | ง่าย | ง่าย | ซับซ้อน |
| Performance | สูง | สูง | ลดลงเล็กน้อย |
| Scalability | ต่ำ | ปานกลาง | สูง |
| Maintenance | ยาก | ง่าย | ง่ายมาก |

## 2. สถานการณ์ใช้งานจริง

### Startup MVP
- เลือก: Monolithic
- เหตุผล: พัฒนาเร็ว Deploy ง่าย

### E-Commerce
- เลือก: Layered
- เหตุผล: โค้ดเป็นระบบ ดูแลระยะยาวง่าย

### Mobile Banking
- เลือก: Client-Server
- เหตุผล: ปลอดภัย รองรับผู้ใช้จำนวนมาก

## 3. Key Takeaways
1. PM2 ช่วยให้ Backend ทำงานต่อเนื่อง
2. Network และ Firewall สำคัญมาก
3. CORS ต้องจัดการที่ฝั่ง Server

