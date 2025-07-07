// Data storage
let students = JSON.parse(localStorage.getItem('students')) || [
    { id: '1', name: 'Alice Johnson', grade: '10A', email: 'alice@school.edu', isPresent: false, checkInTime: null, checkOutTime: null },
    { id: '2', name: 'Bob Smith', grade: '10A', email: 'bob@school.edu', isPresent: false, checkInTime: null, checkOutTime: null },
    { id: '3', name: 'Carol Davis', grade: '10B', email: 'carol@school.edu', isPresent: false, checkInTime: null, checkOutTime: null },
    { id: '4', name: 'David Wilson', grade: '10B', email: 'david@school.edu', isPresent: false, checkInTime: null, checkOutTime: null },
    { id: '5', name: 'Emma Brown', grade: '11A', email: 'emma@school.edu', isPresent: false, checkInTime: null, checkOutTime: null }
];

let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    displayStudents();
    displayAllStudents();
    displayDashboard();
    displayReports();
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString();
});

// Tab functionality
function showTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`button[onclick="showTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Update statistics
function updateStats() {
    const totalStudents = students.length;
    const presentStudents = students.filter(s => s.isPresent).length;
    const attendanceRate = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('presentStudents').textContent = presentStudents;
    document.getElementById('attendanceRate').textContent = attendanceRate + '%';
}

// Display students for check-in
function displayStudents() {
    const container = document.getElementById('studentsList');
    container.innerHTML = '';

    students.forEach(student => {
        const studentCard = createStudentCard(student, true);
        container.appendChild(studentCard);
    });
}

// Display all students for management
function displayAllStudents() {
    const container = document.getElementById('allStudentsList');
    container.innerHTML = '';

    students.forEach(student => {
        const studentCard = createStudentCard(student, false);
        container.appendChild(studentCard);
    });
}

// Create student card
function createStudentCard(student, isCheckIn) {
    const card = document.createElement('div');
    card.className = 'student-card';
    
    card.innerHTML = `
        <div class="student-info">
            <h3><span class="status-indicator ${student.isPresent ? 'present' : 'absent'}"></span>${student.name}</h3>
            <p>Grade: ${student.grade}</p>
            <p>Email: ${student.email}</p>
            ${student.checkInTime ? `<p style="color: #667eea;">Checked in: ${student.checkInTime}</p>` : ''}
        </div>
        <div>
            <span class="badge ${student.isPresent ? 'badge-success' : 'badge-secondary'}">
                ${student.isPresent ? 'Present' : 'Absent'}
            </span>
            ${isCheckIn ? 
                (student.isPresent ? 
                    `<button class="btn btn-danger" onclick="checkOut('${student.id}')">Check Out</button>` :
                    `<button class="btn btn-success" onclick="checkIn('${student.id}')">Check In</button>`
                ) :
                `<button class="btn btn-danger" onclick="deleteStudent('${student.id}')">Delete</button>`
            }
        </div>
    `;
    
    return card;
}

// Check in student
function checkIn(studentId) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toDateString();

    students = students.map(student => 
        student.id === studentId 
            ? { ...student, isPresent: true, checkInTime: timeString }
            : student
    );

    // Add attendance record
    const student = students.find(s => s.id === studentId);
    if (student) {
        const record = {
            id: `${studentId}-${Date.now()}`,
            studentId,
            studentName: student.name,
            date: dateString,
            checkInTime: timeString,
            status: (now.getHours() === 8 || now.getHours() === 14) ? 'late' : 'present'
        };
        attendanceRecords.push(record);
    }

    saveData();
    updateUI();
    showToast(`${student.name} checked in at ${timeString}`, 'success');
}

// Check out student
function checkOut(studentId) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();

    students = students.map(student => 
        student.id === studentId 
            ? { ...student, isPresent: false, checkOutTime: timeString }
            : student
    );

    // Update attendance record
    attendanceRecords = attendanceRecords.map(record => 
        record.studentId === studentId && !record.checkOutTime
            ? { ...record, checkOutTime: timeString }
            : record
    );

    const student = students.find(s => s.id === studentId);
    saveData();
    updateUI();
    showToast(`${student.name} checked out at ${timeString}`, 'success');
}

// Add new student
function addStudent(name, grade, email) {
    const newStudent = {
        id: Date.now().toString(),
        name,
        grade,
        email,
        isPresent: false,
        checkInTime: null,
        checkOutTime: null
    };

    students.push(newStudent);
    saveData();
    updateUI();
    showToast('Student added successfully', 'success');
}

// Delete student
function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(student => student.id !== studentId);
        saveData();
        updateUI();
        showToast('Student deleted successfully', 'success');
    }
}

// Filter students for check-in
function filterStudents() {
    const searchTerm = document.getElementById('searchStudents').value.toLowerCase();
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm) ||
        student.grade.toLowerCase().includes(searchTerm)
    );

    const container = document.getElementById('studentsList');
    container.innerHTML = '';

    filteredStudents.forEach(student => {
        const studentCard = createStudentCard(student, true);
        container.appendChild(studentCard);
    });
}

// Filter all students
function filterAllStudents() {
    const searchTerm = document.getElementById('searchAllStudents').value.toLowerCase();
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm) ||
        student.grade.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm)
    );

    const container = document.getElementById('allStudentsList');
    container.innerHTML = '';

    filteredStudents.forEach(student => {
        const studentCard = createStudentCard(student, false);
        container.appendChild(studentCard);
    });
}

// Display dashboard
function displayDashboard() {
    const container = document.getElementById('dashboardContent');
    const todayDate = new Date().toDateString();
    const todayRecords = attendanceRecords.filter(record => record.date === todayDate);
    const presentStudents = students.filter(s => s.isPresent);

    container.innerHTML = `
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${todayRecords.filter(r => r.status === 'present').length}</div>
                <div class="stat-label">On Time Today</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${todayRecords.filter(r => r.status === 'late').length}</div>
                <div class="stat-label">Late Arrivals</div>
            </div>
        </div>
        <h3>Currently Present Students</h3>
        <div id="presentStudentsList">
            ${presentStudents.length > 0 ? 
                presentStudents.map(student => `
                    <div class="student-card">
                        <div class="student-info">
                            <h3>${student.name}</h3>
                            <p>Grade: ${student.grade}</p>
                            <p>Checked in: ${student.checkInTime}</p>
                        </div>
                        <span class="badge badge-success">Present</span>
                    </div>
                `).join('') :
                '<p>No students currently present</p>'
            }
        </div>
    `;
}

// Display reports
function displayReports() {
    const container = document.getElementById('reportsContent');
    container.innerHTML = `
        <h3>Recent Check-ins</h3>
        <div id="recentCheckIns">
            ${attendanceRecords.slice(-10).reverse().map(record => `
                <div class="student-card">
                    <div class="student-info">
                        <h3>${record.studentName}</h3>
                        <p>${record.date}</p>
                        <p>Check in: ${record.checkInTime}</p>
                        ${record.checkOutTime ? `<p>Check out: ${record.checkOutTime}</p>` : ''}
                    </div>
                    <span class="badge ${record.status === 'late' ? 'badge-secondary' : 'badge-success'}">
                        ${record.status === 'late' ? 'Late' : 'On Time'}
                    </span>
                </div>
            `).join('')}
        </div>
    `;
}

// Modal functions
function openAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'block';
}

function closeAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'none';
    document.getElementById('addStudentForm').reset();
}

// Add student form submission
document.getElementById('addStudentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('studentName').value;
    const grade = document.getElementById('studentGrade').value;
    const email = document.getElementById('studentEmail').value;

    if (name && grade && email) {
        addStudent(name, grade, email);
        closeAddStudentModal();
    } else {
        showToast('Please fill in all fields', 'error');
    }
});

// Export to CSV
function exportToCSV() {
    const headers = ['Student Name', 'Date', 'Check In Time', 'Check Out Time', 'Status'];
    const csvContent = [
        headers.join(','),
        ...attendanceRecords.map(record => [
            record.studentName,
            record.date,
            record.checkInTime,
            record.checkOutTime || 'Not checked out',
            record.status
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
}

// Update UI
function updateUI() {
    updateStats();
    displayStudents();
    displayAllStudents();
    displayDashboard();
    displayReports();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addStudentModal');
    if (event.target === modal) {
        closeAddStudentModal();
    }
}