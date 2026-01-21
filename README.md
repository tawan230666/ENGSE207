# ENGSE207 Software Architecture Labs 🏗️

Repository นี้รวบรวม Source Code แบบฝึกหัด (Labs) รายงาน และโปรเจกต์สอบกลางภาค (Midterm Exam) สำหรับรายวิชา **ENGSE207: Software Architecture**
**สาขาวิศวกรรมซอฟต์แวร์ (Software Engineering)** มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา เชียงใหม่ (RMUTL)

---

## 👨‍💻 Student Information
- **Name:** Tawan Tipkhun (Team)
- **GitHub:** [tawan230666](https://github.com/tawan230666)
- **Student ID:** [67543210033-6]
- **Section:** [SEC1]

---

## 📂 Repository Structure

โปรเจกต์นี้แบ่งออกเป็นโฟลเดอร์ตามหัวข้อการเรียนรู้ในแต่ละสัปดาห์ ดังนี้:

### 📘 Labs & Assignments
| Folder | Description | Architecture Pattern |
| :--- | :--- | :--- |
| `week3-starter-code` | โค้ดเริ่มต้นสำหรับการเรียนรู้โครงสร้างพื้นฐาน | Basic Structure |
| `week4-layered` | การประยุกต์ใช้สถาปัตยกรรมแบบแยกเลเยอร์ (Presentation, Domain, Data) | **Layered Architecture** |
| `week5-client-server` | การจำลองระบบฝั่ง Client เชื่อมต่อกับ Server (Backend APIs) | **Client-Server Architecture** |

### 📝 Midterm Examination
| Folder | Description |
| :--- | :--- |
| `exam/product-layered` | Source Code ของโจทย์สอบกลางภาค พัฒนาโดยใช้ Layered Architecture |
| `ENGSE207-Midterm-Submission` | รายงานเปรียบเทียบสถาปัตยกรรม (Comprehensive Architecture Comparison Report) |

---

## 🛠️ Tech Stack & Tools
- **Environment:** Windows Subsystem for Linux (WSL2 / Ubuntu)
- **Language:** JavaScript / Node.js
- **Version Control:** Git & GitHub

---

## 🚀 How to Run (Instruction)

1. **Clone Repository** ลงมาที่เครื่อง (ผ่าน WSL):
   ```bash
   git clone git@github.com:tawan230666/ENGSE207-Software-Architecture-Labs.git
   cd ENGSE207-Software-Architecture-Labs

2. **เลือกสัปดาห์ที่ต้องการรัน** (ตัวอย่าง Week 4):
    ```bash
    cd week4-layered

3. **Install Dependencies & Start:**
    ```bash
    npm install
    npm start