# Student Attendance System

A simple web-based system to manage student check-ins, track attendance, and generate attendance reports.

## Features

- **Student Check-In/Check-Out:** Mark students as present or absent with check-in and check-out times.
- **Dashboard:** View attendance statistics, including on-time and late arrivals.
- **Student Management:** Add or delete students, and search/filter the student list.
- **Reports:** View recent attendance records and export them as CSV.
- **Persistent Storage:** All data is saved in the browser's localStorage.

## Flow Overview

1. **Landing Page:**  
   Displays statistics (total students, present today, attendance rate, today's date) and navigation tabs.

2. **Tabs:**
   - **Check-In:**  
     List of students with check-in/check-out buttons. Search by name or grade.
   - **Dashboard:**  
     Shows today's attendance stats and currently present students.
   - **Students:**  
     Manage student records (add/delete). Search by name, grade, or email.
   - **Reports:**  
     Shows recent check-ins and allows exporting attendance data as CSV.

3. **Add Student Modal:**  
   Modal form to add a new student (name, grade, email).

4. **Toast Notifications:**  
   Feedback for actions (e.g., student added, checked in/out, errors).

## Main Functions

- `showTab(tabName)`: Switches between tabs.
- `updateStats()`: Updates statistics in the header.
- `displayStudents()`: Renders the check-in student list.
- `displayAllStudents()`: Renders the student management list.
- `createStudentCard(student, isCheckIn)`: Creates a student card for display.
- `checkIn(studentId)`: Marks a student as present and records check-in time.
- `checkOut(studentId)`: Marks a student as absent and records check-out time.
- `addStudent(name, grade, email)`: Adds a new student.
- `deleteStudent(studentId)`: Deletes a student.
- `filterStudents()`: Filters students in the check-in tab.
- `filterAllStudents()`: Filters students in the management tab.
- `displayDashboard()`: Shows dashboard statistics and present students.
- `displayReports()`: Shows recent attendance records.
- `exportToCSV()`: Exports attendance records as a CSV file.
- `showToast(message, type)`: Shows a toast notification.
- `saveData()`: Saves students and attendance records to localStorage.
- `updateUI()`: Updates all UI components.

## Data Structure

- **students:**  
  Array of student objects:  
  `{ id, name, grade, email, isPresent, checkInTime, checkOutTime }`

- **attendanceRecords:**  
  Array of attendance record objects:  
  `{ id, studentId, studentName, date, checkInTime, checkOutTime, status }`

## Usage

1. Open `attendance-system.html` in your browser.
2. Use the tabs to check in/out students, manage student records, and view/export reports.
3. All data is saved automatically in your browser.

---
