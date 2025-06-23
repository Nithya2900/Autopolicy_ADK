# 🚗 AutoPolicy – AI-Powered Insurance Claim Evaluator

AutoPolicy is an intelligent web application designed to simplify and accelerate the evaluation of car insurance claims using a coordinated system of autonomous AI agents. Developed as a submission for the Agent Development Kit (ADK) Hackathon powered by Google Cloud, this project showcases the potential of multi-agent orchestration in real-world insurance workflows.
The solution features a clean, modern React + TypeScript frontend, offering a seamless user experience for submitting claims, uploading documents, and viewing results. On the backend, a robust FastAPI-based multi-agent pipeline—built using Google’s open-source Agent Development Kit (ADK)—manages various tasks such as intake, document verification, fraud detection, policy matching, and damage estimation.
Integrated with Firebase for authentication, storage, and user profile management, AutoPolicy brings together cloud-native technologies and intelligent automation to create a powerful, scalable solution for insurance companies and users alike.

---

## 🌟 Key Features

- 🤖 **Multi-Agent Intelligence**:
  - Intake Agent
  - Document Verification Agent
  - Fraud Detection Agent
  - Policy Matching Agent
  - Damage Estimation Agent
  - Decision Summarizer Agent

- 📤 **Document Upload**: Attach supporting documents like FIR copies, repair bills, medical reports, etc.

- 🔐 **Email Authentication & Verification**:
  - Firebase Auth for sign-up/login
  - Email verification before dashboard access

- 👤 **User Profile**: Displays user info from Firestore

- 🧠 **Real-time Agent Simulation**: Frontend visualizes each agent’s processing stage dynamically

---

## 🌐 Live Hosting

- 🔥 **Frontend (React + Firebase)** and **Backend (FastAPI + Render)**
- Here is the live link 👉🏻: [https://autopolicy-afcb3.web.app](https://autopolicy-afcb3.web.app)

---

## 🛠️ Tech Stack

### Frontend
- React + TypeScript + Vite
- Tailwind CSS
- Firebase (Auth + Firestore + Storage)
- Axios, Lucide Icons, React Hot Toast

### Backend
- Python + FastAPI
- Google Agent Development Kit (ADK)
- Pydantic, Uvicorn

---

## ⚙️ Setup Instructions

### 🔧 1. Clone the Repository

```bash
git clone https://github.com/your-username/AutoPolicyProject.git

cd AutoPolicyProject

Backend Setup (FastAPI + ADK)
cd backend
python -m venv venv
venv\Scripts\activate    # or source venv/bin/activate (Linux/Mac)
pip install -r requirements.txt
uvicorn main:app --reload
Backend runs locally at http://localhost:8000

Frontend Setup (React + Firebase)
cd project
npm install
npm run dev
Frontend runs locally at http://localhost:5173
 ```
---
## 📷 Images

<img src="https://github.com/user-attachments/assets/94de9b6c-900c-4133-a33d-4ae55319e5ae" width="400" height="200"/>

<img src="https://github.com/user-attachments/assets/9bd0cb4a-38e2-4c9f-8f30-d4eed1782079" width="400"/>

<img src="https://github.com/user-attachments/assets/fdc4d50d-34d1-4503-8d8c-a8c21c3a632b" width="400"/>

<img src="https://github.com/user-attachments/assets/37c04595-9fdb-4fda-9fcd-fe3d746a9c3b" width="400"/>

---

## 🚀 Future Directions

AutoPolicy is designed with scalability in mind. Here are some possible enhancements for future versions:

- 🔐 **Cloud-Backed Document Upload**  
  Currently, documents are uploaded using Firebase Storage. With additional funding or credits, the platform can integrate **Google Cloud Storage** for secure, scalable, and enterprise-grade file handling.

- 🕓 **Claim History Tracking**  
  Future updates can include a **Claim History Dashboard**, allowing users to view and manage all past submissions. This will enhance transparency and improve customer experience.

- 🧠 **Smarter Decision Logic**  
  With access to real-world insurance data and cloud-based ML services like **Vertex AI**, we can evolve AutoPolicy to make even more accurate fraud predictions and policy decisions.

- 📱 **Mobile Compatibility & PWA**  
  Turning AutoPolicy into a **Progressive Web App (PWA)** will improve accessibility on mobile devices, especially in rural or low-bandwidth areas.

- 📨 **Notification & Alerts**  
  SMS/email alerts for claim status updates using **Twilio**, **Firebase Cloud Messaging**, or **SendGrid**.




