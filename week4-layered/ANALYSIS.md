# Analysis: Monolithic vs Layered Architecture

## 1. การเปรียบเทียบโครงสร้าง (Structural Comparison)

| หัวข้อเปรียบเทียบ | Monolithic (Week 3) | Layered (Week 4) |
| :--- | :--- | :--- |
| **จำนวนไฟล์** | 1 ไฟล์หลัก (`server.js`) | 6+ ไฟล์ (Controller, Service, Repository, Model, Config, Utils) |
| **จำนวนบรรทัดโค้ด** | น้อยกว่า (รวมกระจุกเดียว) | มากกว่า (เพราะมี Boilerplate code และการ import/export) |
| **ความซับซ้อน (Complexity)** | ต่ำในช่วงแรก แต่สูงมากเมื่อโค้ดเยอะ | ปานกลาง แต่เป็นระเบียบและจัดการง่ายในระยะยาว |
| **การไหลของข้อมูล** | ตรงไปตรงมา (Request -> DB) | เป็นลำดับชั้น (Controller -> Service -> Repository -> DB) |

**วิเคราะห์:** Layered Architecture มีความซับซ้อนด้านโครงสร้างมากกว่า และมีจำนวนไฟล์เยอะกว่า แต่ช่วยลดความซับซ้อนของ Logic ภายในแต่ละไฟล์ ทำให้แต่ละไฟล์อ่านง่ายและสั้นลง

## 2. การวิเคราะห์สถานการณ์จริง (Scenario Analysis)

### สถานการณ์ A: ต้องการเพิ่มฟีเจอร์ "Assign Task to User"
* **Monolithic:** ต้องแทรกโค้ด SQL และ Logic เกี่ยวกับ User ลงไปในไฟล์ `server.js` เดิมที่มี Task อยู่แล้ว ทำให้ไฟล์บวมและเสี่ยงแก้ผิดที่
* **Layered:** สร้าง `UserController.js`, `UserService.js`, `UserRepository.js` ใหม่แยกออกมาได้เลย โดยไม่ต้องไปแตะต้องไฟล์ Task เดิม ปลอดภัยกว่ามาก

### สถานการณ์ B: มีบั๊กที่ Validation Logic (เช่น เช็คความยาวชื่อผิด)
* **Monolithic:** ต้องค้นหาในไฟล์ `server.js` ซึ่งปนเปกับโค้ด Database
* **Layered:** พุ่งเป้าไปแก้ที่ `src/services/taskService.js` ได้ทันที เพราะเรารู้ว่า Business Logic อยู่ที่นั่นที่เดียว

### สถานการณ์ C: เปลี่ยน Database จาก SQLite เป็น PostgreSQL
* **Monolithic:** ต้องไล่แก้ SQL Query ทุกบรรทัดในไฟล์ `server.js` ซึ่งเสี่ยงมาก
* **Layered:** แก้ไขเฉพาะไฟล์ในโฟลเดอร์ `src/repositories/` เท่านั้น ส่วน Controller และ Service ทำงานต่อได้เลยโดยไม่ต้องแก้โค้ด

## 3. จุดแข็ง-จุดอ่อน (Strengths & Weaknesses)

### จุดแข็ง (Strengths)
1. **Maintainability:** ดูแลรักษาง่าย เพราะแยกส่วนชัดเจน (Separation of Concerns)
2. **Testability:** ทดสอบง่าย สามารถเขียน Unit Test แยก Service หรือ Controller ได้โดยไม่ต้องต่อ Database จริง
3. **Team Collaboration:** แบ่งงานกันทำได้ง่าย เช่น คนนึงทำ Controller อีกคนทำ Repository

### จุดอ่อน (Weaknesses)
1. **Complexity:** โครงสร้างซับซ้อนสำหรับโปรเจกต์ขนาดเล็ก
2. **Performance Overhead:** การเรียกผ่านหลาย Layer อาจช้ากว่าการเรียกตรงๆ เล็กน้อย (แต่แลกมาด้วยความคุ้มค่าในการดูแล)
3. **Development Speed:** ในช่วงเริ่มแรกจะช้ากว่า เพราะต้องสร้างไฟล์และวางโครงสร้างเยอะ

## 4. Decision Tree: เลือกใช้อะไรดี?

* **ใช้ Monolithic เมื่อ:**
    * ทีมขนาดเล็ก (1-2 คน)
    * โปรเจกต์เล็ก (POC, MVP, Assignment สั้นๆ)
    * ต้องการความรวดเร็วสูงสุดในการขึ้นระบบ

* **ใช้ Layered Architecture เมื่อ:**
    * ทีมขนาดกลาง-ใหญ่ (3 คนขึ้นไป)
    * โปรเจกต์ระยะยาว ที่ต้องมีการดูแลรักษาและเพิ่มฟีเจอร์
    * Business Logic มีความซับซ้อน
    * ต้องการเขียน Test หรือรองรับการขยายตัวในอนาคต