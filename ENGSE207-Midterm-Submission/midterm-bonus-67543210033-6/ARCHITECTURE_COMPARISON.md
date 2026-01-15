# Architecture Comparison Report
**Project:** Library Management System Refactoring
**Student ID:** 67543210033-6

---

## 1. Before: Layered Architecture (Monolithic)
ในเวอร์ชันเดิม ระบบถูกออกแบบเป็น **Monolithic Application** โดยใช้ Layered Pattern ซึ่งทุกส่วนประกอบ (Frontend, Backend, Database Logic) รวมอยู่ในโปรเจกต์เดียวกันและรันอยู่บน Process เดียวกัน

### Structure
* **Single Server:** ทั้ง HTML Rendering และ Business Logic รันอยู่บน Node.js Port 3000 เดียวกัน
* **Tight Coupling:** Frontend ไม่สามารถทำงานได้ถ้าไม่มี Backend และการเปลี่ยน UI มักกระทบกับ Server Code
* **Data Flow:** Browser Request -> Server Router -> Controller -> Service -> Repository -> Database

### Pros & Cons
* ✅ **Pros:** ง่ายต่อการเริ่มต้น (Setup เดียวจบ), ไม่ต้องจัดการเรื่อง CORS หรือ Network Latency ระหว่าง Services
* ❌ **Cons:**
    * **Hard to Scale:** ไม่สามารถแยกขยายเฉพาะส่วน Frontend หรือ Backend ได้
    * **Dependent:** หาก Server ล่ม หน้าเว็บก็เข้าไม่ได้เลย
    * **Limited Frontend:** ยากที่จะเปลี่ยนไปใช้ Modern Framework (เช่น React/Vue) เพราะผูกติดกับ Server-Side Rendering หรือ Static file serve ของ Backend

---

## 2. After: Client-Server Architecture (Refactored)
ในเวอร์ชัน Bonus นี้ ผมได้ทำการแยกส่วน (Decouple) ระบบออกเป็น 2 ส่วนอิสระที่สื่อสารกันผ่าน **RESTful API**

### Structure
1.  **Frontend (Client):**
    * รันบน: `Localhost:8000` (Python Simple HTTP Server)
    * หน้าที่: แสดงผล UI (HTML/CSS) และจัดการ Logic ฝั่งผู้ใช้ด้วย JavaScript (Fetch API)
    * **No Database Access:** ไม่มีการเชื่อมต่อ Database โดยตรง

2.  **Backend (Server):**
    * รันบน: `VM (Ubuntu) IP 172.31.117.173:3000`
    * หน้าที่: ให้บริการ REST API (Endpoints), Validation, Business Logic และจัดการ SQLite Database
    * **Stateless:** ไม่เก็บ Session ของหน้าเว็บ เน้นรับ-ส่งข้อมูลแบบ JSON

### Communication
* **Protocol:** HTTP (REST API)
* **Data Format:** JSON
* **Methods:** `GET` (ดึงข้อมูล), `POST` (เพิ่ม), `PUT` (แก้ไข), `PATCH` (ยืม/คืน), `DELETE` (ลบ)

---

## 3. Key Differences Table (ตารางเปรียบเทียบ)

| Feature | Layered (Before) | Client-Server (After) |
| :--- | :--- | :--- |
| **Hosting** | Single Machine (Localhost) | **Distributed** (Local + VM) |
| **Coupling** | High (Tightly Coupled) | **Low (Loosely Coupled)** |
| **Communication** | Internal Function Calls / Server Serve | **HTTP Network Requests (API)** |
| **Data Exchange** | Variables / HTML | **JSON** |
| **Frontend Tech** | ผูกติดกับ Backend Structure | **Independent** (Can use any tech) |
| **Scalability** | Scale ทั้งก้อน | **Scale แยกส่วนได้** (เช่น เพิ่ม Server Backend ได้โดยไม่ต้องแก้ Frontend) |

---

## 4. Conclusion
การ Refactor ไปสู่ **Client-Server Architecture** ช่วยให้ระบบมีความยืดหยุ่นสูงขึ้น (Flexibility) ง่ายต่อการดูแลรักษา (Maintainability) และรองรับการขยายตัวในอนาคต (Scalability) ได้ดีกว่าเดิม อีกทั้งยังจำลองสถานการณ์การทำงานจริงในระดับ Production ที่มักจะแยก Server และ Client ออกจากกันคนละเครื่อง
