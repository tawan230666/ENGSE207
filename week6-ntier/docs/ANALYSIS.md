# การวิเคราะห์และเปรียบเทียบ Architecture (Week 3-6)

**ชื่อ-นามสกุล:** [ธาวัน ทิพคุณ]
**รหัสนักศึกษา:** [67543210033-6]
**สาขา:** วิศวกรรมซอฟต์แวร์

---

## 1. เปรียบเทียบ Architecture

จากการทดลองทำ Lab ตั้งแต่สัปดาห์ที่ 3 ถึง 6 สามารถเปรียบเทียบข้อดี-ข้อเสีย ได้ดังนี้:

| หัวข้อเปรียบเทียบ | Week 3: Monolithic | Week 4: Layered | Week 5: Client-Server | Week 6: N-Tier (Current) |
|-------------------|-------------------|-----------------|-----------------------|--------------------------|
| **โครงสร้าง (Structure)** | รวมทุกอย่าง (UI, Logic, DB) ในไฟล์เดียว หรือ Process เดียว | แบ่ง Code เป็นชั้น (Controller, Service, Repo) แต่ยังรันใน Process เดียว | แยก Frontend และ Backend ออกจากกัน (คนละ Port/Process) | แยก Web Server, App Server และ Database Server ออกจากกันอย่างชัดเจน (Physical Separation) |
| **ความง่าย (Simplicity)** | ง่ายที่สุด เหมาะกับโปรเจกต์เล็ก | ปานกลาง โค้ดเป็นระเบียบขึ้น | ปานกลาง เริ่มมีการจัดการ CORS และ API | ซับซ้อนที่สุด ต้อง Config Nginx, SSL และ Database connection |
| **ความปลอดภัย (Security)** | ต่ำ (เข้าถึง DB ตรงๆ) | ต่ำ | ดีขึ้น (ซ่อน Logic ไว้หลัง API) | **สูงที่สุด** (มี Nginx บัง Backend, มี SSL/HTTPS, Database ไม่เปิด Public IP) |
| **การขยายตัว (Scalability)** | ยาก (Vertical Scaling เท่านั้น) | ยาก | แยก Scale Frontend/Backend ได้ | **ดีมาก** สามารถเพิ่มจำนวน Server ในแต่ละ Tier ได้อิสระ (Horizontal Scaling) |

---

## 2. คำถามวิเคราะห์เชิงลึก

### 2.1 ข้อดีที่สุดของการใช้ Nginx เป็น Reverse Proxy ใน Lab นี้คืออะไร?
**ตอบ:**
ในมุมมองของ Security และ Performance การใช้ Nginx มีข้อดีหลักคือ:
1.  **SSL Termination:** Nginx ช่วยจัดการเรื่อง HTTPS/TLS Encryption ทำให้ Node.js Backend ไม่ต้องรับภาระในการถอดรหัสข้อมูล ช่วยลด Load ของ App Server
2.  **Security/Anonymity:** โลกภายนอกจะเห็นแค่ Port 443 ของ Nginx แต่จะไม่รู้ว่า Backend จริงๆ รันอยู่ที่ Port 3000 หรือใช้เทคโนโลยีอะไร (Hide Backend Topology)
3.  **Static File Serving:** Nginx ทำงานกับ Static files (HTML, CSS, JS) ได้เร็วกว่า Node.js มาก ช่วยเพิ่ม Performance ให้กับฝั่ง Frontend

### 2.2 ทำไมเราถึงต้องเปลี่ยนจาก SQLite (Week 3-5) มาเป็น PostgreSQL (Week 6)?
**ตอบ:**
1.  **Concurrency:** SQLite เป็นไฟล์ (File-based) เมื่อมีการเขียนข้อมูลจะเกิด File Lock ทำให้รองรับผู้ใช้งานพร้อมกันจำนวนมากไม่ได้ แต่ PostgreSQL เป็น Server-based รองรับ Concurrent Connections ได้สูง
2.  **Data Types & Features:** PostgreSQL มี Data Types และฟีเจอร์ระดับ Enterprise ที่ครบถ้วนกว่า (เช่น JSONB, Geo-spatial) เหมาะกับการทำระบบจริง (Production Grade)
3.  **Network Access:** ในสถาปัตยกรรม N-Tier เราต้องแยก Database ไว้อีก Tier หนึ่ง ซึ่ง PostgreSQL รองรับการเชื่อมต่อผ่าน TCP/IP ทำให้แยกเครื่อง Server ได้จริง ต่างจาก SQLite ที่ต้องอยู่เครื่องเดียวกับ App

### 2.3 จงอธิบายความแตกต่างระหว่าง "Logical Layer" (Week 4) กับ "Physical Tier" (Week 6)
**ตอบ:**
* **Logical Layer (Layered Arch):** คือการแบ่ง "หน้าที่" ของโค้ดภายในโปรแกรมเดียวกัน (เช่น แยกไฟล์ Controller, Service, Repository) เพื่อให้โค้ดอ่านง่ายและดูแลรักษาง่าย แต่ตอนรันจริง ทุกอย่างยังอยู่ใน Memory และ Process เดียวกัน
* **Physical Tier (N-Tier Arch):** คือการแบ่ง "โครงสร้างพื้นฐาน" ทางกายภาพ โดยแยก Process หรือเครื่อง Server ออกจากกัน (เช่น Web Server เครื่องหนึ่ง, Database Server อีกเครื่องหนึ่ง) ซึ่งช่วยเรื่อง Security และ Scalability แต่แลกมาด้วยความซับซ้อนในการจัดการ Network Latency

---

## 3. สรุปสิ่งที่ได้เรียนรู้และปัญหาที่พบ

### สิ่งที่ได้เรียนรู้:
* การติดตั้งและ Config **Nginx** เพื่อทำหน้าที่เป็น Reverse Proxy และจัดการ **Self-signed SSL Certificate** เพื่อทำ HTTPS
* การเปลี่ยน Database จาก SQLite เป็น **PostgreSQL** และการใช้ Connection Pooling ใน Node.js
* ความสำคัญของการแยก Tier เพื่อความปลอดภัย โดยเฉพาะการที่ Database ไม่ควรถูกเข้าถึงโดยตรงจาก Internet

### ปัญหาที่พบและวิธีแก้ไข:
* **ปัญหา 502 Bad Gateway:** เกิดจาก Nginx หา Backend ไม่เจอ หรือ Node.js รันเป็น IPv6 แก้ไขโดยบังคับให้ Node.js listen ที่ IP `0.0.0.0`
* **ปัญหา Script Error:** Script Test API มีปัญหากับคำสั่ง curl เมื่อใช้ HTTPS แก้ไขโดยปรับแก้ Syntax ใน Shell Script ให้ถูกต้อง
* **ปัญหา Connection Refused:** ต้องตรวจสอบ Firewall (UFW) ว่าเปิด Port 80, 443 และ 3000 ครบถ้วนหรือไม่