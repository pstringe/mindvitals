# mindvitals
# Mindvitals Technical Specification

## Overview

The **Mindvitals** application is designed to facilitate mental health assessments through an intuitive digital platform. This document outlines the application's core functionality, API endpoints, frontend components, and development roadmap.

## Table of Contents

- [Problem & Goals](#problem--goals)
- [User Workflows](#user-workflows)
- [Data Model](#data-model)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [API Endpoints](#api-endpoints)
- [Frontend Routes](#frontend-routes)
- [Development Roadmap](#development-roadmap)

---

## Problem & Goals

This project aims to provide a streamlined way to conduct mental health assessments by implementing:

- A guided patient workflow
- A provider dashboard for patient management
- A backend for storing and retrieving assessment data

---

## User Workflows

### **Patient Workflow**

1. Patient initiates an assessment via:
   - Email link
   - QR code scan
2. The system guides the patient through a series of questions.
3. After completion, the patient receives:
   - A summary of results
   - An option to receive a copy via email
   - An option to be contacted by a care navigator
   -

### **Provider Workflow**

1. Provider logs in to the **Mindvitals** clinic dashboard.
2. The provider can:
   - View a list of patients
   - Access patient details and past assessments
   - Initiate new patient assessments via:
     - Text
     - Email
     - QR code

**Workflow Diagram:**

### **Patient Detail Page**

- Displays profile information, assessment history, and scores.
- Includes options to:
  - Send an assessment request
  - Refer a patient for further care

---

## Data Model

### **Entities**

- **Clinic**: Represents an organization.
- **Personnel**: Clinic staff with different access privileges.
- **Patient**: Individuals undergoing assessments.
- **Assessment**: Stores completed assessment data.
- **Questionnaire**: Contains questions used in assessments.



---

## System Architecture

- Multi-clinic database separation
- Authentication via clinic-based credentials
- Clustered database model for scalability

**System Architecture Diagram:**

---

## Technology Stack

| Requirement           | Proposed Solution                    |
| --------------------- | ------------------------------------ |
| **App Server**        | Google Cloud Platform (GCP)          |
| **Database**          | MongoDB Atlas (supports sharding)    |
| **Backend Framework** | NestJS (built on Express)            |
| **Frontend**          | React (Create React App)             |
| **Testing**           | Jest, React Testing Library, Cypress |
| **Monitoring**        | Sentry                               |

---

## API Endpoints

### **Patient APIs**

- `GET /assessments/:patient_id` → Retrieve patient assessments
- `POST /assessments/:patient_id` → Create new assessment
- `PUT /assessments/:assessment_id` → Update an assessment

### **Provider APIs**

- `GET /patients` → Retrieve patients in provider’s care
- `POST /actions/notify/:patient_id` → Notify patient to take an assessment
- `POST /patients/refer/:patient_id` → Submit referral request

### **Authentication APIs**

- `POST /login` → Authenticate provider
- `POST /register` → Register new provider

---

## Frontend Routes

| Route                        | Description                       |
| ---------------------------- | --------------------------------- |
| `/start-assessment/:uuid`    | Patient assessment start page     |
| `/assessment/:assessment_id` | Active assessment session         |
| `/patients`                  | Provider dashboard                |
| `/patients/:patient_id`      | Patient detail page               |
| `/admin`                     | Personnel management (Admin only) |

## Notes

- The **Main Provider Workflow** should be completed first, followed by patient workflows and admin dashboards.
- Further discussion is needed on clinic onboarding strategies and role-based access control.
