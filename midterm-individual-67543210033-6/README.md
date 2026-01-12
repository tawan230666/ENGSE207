# Library Management System - Layered Architecture

## 📋 Project Information
- **Student Name:** [ธาวัน ทิพคุณ]
- **Student ID:** [67543210033-6]
- **Course:** ENGSE207 Software Architecture

## 🏗️ Architecture Style
Refactored from Monolithic to **Layered Architecture (3-tier)**.

## 🎯 Refactoring Summary
### ปัญหาของ Monolithic (เดิม):
1. **High Coupling:** Logic การยืมคืนปนกับการต่อ Database ในไฟล์เดียว
2. **Hard to Maintain:** แก้ไข server.js ยากเพราะโค้ดเยอะเกินไป
3. **No Validation Separation:** Logic การเช็ค ISBN ปนกับ HTTP Request

### วิธีแก้ไขด้วย Layered Architecture:
1. **Presentation Layer:** รับผิดชอบแค่ HTTP req/res (Controller)
2. **Business Layer:** จัดการ Validation และกฎการยืมคืน (Service)
3. **Data Layer:** ดูแลการ Query SQL อย่างเดียว (Repository)

### ประโยชน์ที่ได้รับ:
- แยกหน้าที่ชัดเจน (Separation of Concerns)
- ทดสอบง่ายขึ้น (Testability)
- ทีมทำงานพร้อมกันได้ (Scalability in development)

## 🚀 How to Run
\`\`\`bash
npm install
npm start
\`\`\`