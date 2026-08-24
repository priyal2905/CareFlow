# CareFlow 🩺

**A full-stack healthcare appointment and patient management platform built with the MERN stack.**

CareFlow is a web-based healthcare management system designed to simplify the interaction between **patients, doctors, and administrators** through a single platform.

The project focuses on solving a common problem in healthcare management: appointment scheduling, patient records, doctor availability, and consultation management are often handled through disconnected systems or manual processes.

CareFlow brings these workflows together into one centralized application.

---

## 📌 Why CareFlow?

Healthcare appointment management can become complicated when patients have to search for doctors, check availability, schedule appointments, and keep track of their medical records through separate processes.

Doctors also need an efficient way to manage their appointments and access information about their patients.

This led to the idea of building **CareFlow** — a centralized platform where:

* Patients can discover doctors and book appointments.
* Doctors can manage their appointments and patients.
* Administrators can manage doctors, patients, and appointments.
* Appointment availability is generated based on doctor working hours.
* Medical history can be maintained within the platform.

The goal is to make the healthcare appointment workflow **simpler, organized, and easier to manage**.

---

## 🎯 Problem Statement

Traditional or fragmented healthcare appointment workflows can result in:

* Difficulty finding suitable doctors.
* Lack of visibility into doctor availability.
* Manual appointment scheduling.
* Difficulty tracking upcoming and previous appointments.
* Separate handling of patient medical records.
* Increased administrative workload.
* Limited coordination between patients, doctors, and administrators.

CareFlow addresses these issues by providing a **role-based healthcare management platform**.

---

## 💡 Solution

CareFlow provides different dashboards and workflows based on the user's role.

### 👤 Patient

Patients can:

* Register and log in.
* Browse available doctors.
* Search doctors by name or specialization.
* View doctor profiles.
* View doctor experience, qualification, consultation fee, and slot duration.
* Select an appointment date.
* View available appointment slots.
* Book appointments.
* View upcoming and previous appointments.
* Access medical history.

### 👨‍⚕️ Doctor

Doctors can:

* Log in through the doctor portal.
* View their dashboard.
* View appointment statistics.
* View today's appointments.
* View upcoming appointments.
* View patients.
* Manage appointment-related workflows.
* Start consultations.
* Manage their working hours.

### 🛡️ Administrator

Administrators can:

* Access the admin dashboard.
* Manage doctors.
* Manage patients.
* Manage appointments.
* Create doctor profiles.
* Manage doctor-related information.

---

# ✨ Key Features

## 🔐 Authentication & Authorization

CareFlow implements authentication using **JWT-based authentication**.

Users are assigned roles:

* `patient`
* `doctor`
* `admin`

Protected routes ensure that users can only access functionality appropriate to their role.

---

## 🩺 Doctor Discovery

Patients can browse doctors and search based on:

* Doctor name
* Specialization

Each doctor has a profile containing information such as:

* Name
* Specialization
* Qualification
* Experience
* Consultation fee
* Appointment slot duration
* Working hours
* Availability

---

## 📅 Appointment Scheduling

Patients can:

1. Select a doctor.
2. Choose an appointment date.
3. View available time slots.
4. Select a slot.
5. Confirm the appointment.

Available slots are generated using the doctor's configured working hours and existing appointments.

This helps prevent overlapping appointment bookings.

---

## 👨‍⚕️ Doctor Dashboard

The doctor dashboard provides an overview of:

* Total appointments
* Active appointments
* Completed appointments
* Cancelled appointments
* No-shows
* Today's appointments
* Upcoming appointments

Doctors can also access their appointment and patient management pages.

---

## 📋 Medical History

Patients can access their medical records through the medical history section.

The system is designed to support information such as:

* Diagnoses
* Prescriptions
* Previous consultation records

---

## 🛡️ Role-Based Access Control

Different users receive different functionality.

| Role    | Main Capabilities                                                   |
| ------- | ------------------------------------------------------------------- |
| Patient | Find doctors, book appointments, view appointments, medical history |
| Doctor  | Manage appointments, view patients, conduct consultations           |
| Admin   | Manage doctors, patients, and appointments                          |

---

# 🏗️ System Architecture

CareFlow follows a client-server architecture.

```text
                    ┌──────────────────────┐
                    │       CareFlow       │
                    │      Frontend        │
                    │   React + Vite       │
                    └──────────┬───────────┘
                               │
                         REST API / HTTP
                               │
                    ┌──────────▼───────────┐
                    │       Backend        │
                    │ Node.js + Express    │
                    └──────────┬───────────┘
                               │
                         Mongoose / MongoDB
                               │
                    ┌──────────▼───────────┐
                    │       MongoDB        │
                    │      Database        │
                    └──────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* React
* React Router
* Axios
* Vite
* CSS

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt
* REST APIs

## Database

* MongoDB
* Mongoose

## Development Tools

* Git
* GitHub
* Nodemon
* Vite

---

# 📂 Project Structure

```text
CareFlow/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       │   ├── auth/
│       │   ├── patient/
│       │   ├── doctor/
│       │   └── admin/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# 🔄 Application Workflow

### Patient Workflow

```text
Register
   ↓
Login
   ↓
Patient Dashboard
   ↓
Find Doctor
   ↓
View Doctor Profile
   ↓
Select Date
   ↓
View Available Slots
   ↓
Book Appointment
   ↓
View Appointment
```

### Doctor Workflow

```text
Login
   ↓
Doctor Dashboard
   ↓
View Appointments
   ↓
View Patient
   ↓
Start Consultation
   ↓
Update Consultation / Medical Record
```

### Admin Workflow

```text
Login
   ↓
Admin Dashboard
   ↓
Manage Doctors
   ↓
Manage Patients
   ↓
Manage Appointments
```

---

# 🔒 Security Considerations

CareFlow includes several basic security mechanisms:

* Password hashing using bcrypt.
* JWT-based authentication.
* Protected API routes.
* Role-based authorization.
* Password fields excluded from user responses.
* Authentication tokens attached to API requests.
* Environment variables used for sensitive configuration.

> **Important:** Never commit the `.env` file or database credentials to GitHub.

---

# ⚙️ Installation & Setup

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/CareFlow.git
cd CareFlow
```

---

## 2. Install frontend dependencies

```bash
cd client
npm install
```

---

## 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

---

## 4. Configure environment variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Use your own MongoDB connection string and JWT secret.

---

## 5. Start the backend

Inside the `server` directory:

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:5000
```

---

## 6. Start the frontend

Inside the `client` directory:

```bash
npm run dev
```

The frontend should run on:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

---

# 🧪 Testing the Application

A basic end-to-end workflow can be tested using the following sequence.

### Patient

1. Register as a patient.
2. Log in.
3. Open **Find Doctors**.
4. Select a doctor.
5. Select an available date.
6. Select an appointment slot.
7. Confirm the appointment.
8. Verify the appointment under **My Appointments**.

### Doctor

1. Log in as a doctor.
2. Open the Doctor Dashboard.
3. Check appointment statistics.
4. Open appointments.
5. View the patient.
6. Start the consultation for a confirmed appointment.

### Admin

1. Log in as an administrator.
2. Open the Admin Dashboard.
3. Manage doctors.
4. Manage patients.
5. Manage appointments.

---

# 🚀 Future Improvements

CareFlow can be extended with additional healthcare features such as:

* Online video consultations.
* Email/SMS appointment reminders.
* Prescription generation.
* Payment gateway integration.
* Doctor ratings and reviews.
* Advanced appointment filtering.
* Patient notifications.
* Hospital/clinic management.
* File uploads for medical reports.
* Analytics and reporting.
* Cloud deployment with CI/CD.

---

# 📈 What This Project Demonstrates

CareFlow demonstrates practical implementation of:

* Full-stack MERN development.
* REST API design.
* Authentication and authorization.
* Role-based access control.
* MongoDB data modeling.
* Appointment scheduling logic.
* React state management.
* Client-server communication.
* Protected routes.
* CRUD operations.
* Git and GitHub workflow.
* Frontend and backend integration.

---

# 🎓 Project Motivation

CareFlow was developed as a practical full-stack project to understand how a real-world healthcare application can be designed and implemented from the ground up.

Rather than building only a basic CRUD application, the project focuses on a realistic workflow involving **multiple user roles, authentication, appointment scheduling, availability management, and patient records**.

The project can serve as a foundation for a larger healthcare platform.

---

# 👨‍💻 Author

**Priyal**


---

## ⭐ Project

If you find the project interesting, consider giving the repository a star on GitHub.
