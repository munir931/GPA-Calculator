// GPA Calculation Engine v2026
// Grade Points Scale (4.0 System)
const GRADE_SCALE = [
    { min: 90, gp: 4.0, letter: 'A+' },
    { min: 85, gp: 3.7, letter: 'A' },
    { min: 80, gp: 3.3, letter: 'A-' },
    { min: 75, gp: 3.0, letter: 'B+' },
    { min: 70, gp: 2.7, letter: 'B' },
    { min: 65, gp: 2.3, letter: 'B-' },
    { min: 60, gp: 2.0, letter: 'C+' },
    { min: 55, gp: 1.7, letter: 'C' },
    { min: 50, gp: 1.3, letter: 'D' },
    { min: 0, gp: 0.0, letter: 'F' }
];

// Color coding for performance badges
const BADGE_COLORS = [
    { min: 85, color: '#0f6e56', bg: '#d4f5e9' },  // Excellent
    { min: 70, color: '#185fa5', bg: '#ddeeff' },  // Good
    { min: 55, color: '#8a5700', bg: '#fff3cc' },  // Average
    { min: 0, color: '#a32d2d', bg: '#fde8e8' }    // Needs Improvement
];

// Helper Functions
function getGrade(marks) {
    return GRADE_SCALE.find(g => marks >= g.min) || GRADE_SCALE[GRADE_SCALE.length - 1];
}

function getBadgeColor(marks) {
    return BADGE_COLORS.find(b => marks >= b.min) || BADGE_COLORS[BADGE_COLORS.length - 1];
}

// Calculate Semester GPA (SGPA)
function calculateSGPA(courses) {
    if (!courses.length) return 0;
    const totalPoints = courses.reduce((sum, c) => sum + getGrade(c.marks).gp * c.credits, 0);
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

// Calculate Cumulative GPA (CGPA)
function calculateCGPA(allCourses) {
    if (!allCourses.length) return 0;
    const totalPoints = allCourses.reduce((sum, c) => sum + getGrade(c.marks).gp * c.credits, 0);
    const totalCredits = allCourses.reduce((sum, c) => sum + c.credits, 0);
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

// CGPA to Percentage Converter
function cgpaToPercentage(cgpa) {
    return (cgpa * 25).toFixed(2);
}

// Data Structure
let semesters = [{ name: 'Semester 1', courses: [] }];
let activeSemester = 0;

// Load saved data from localStorage
function loadData() {
    const saved = localStorage.getItem('gpaCalculator2026');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            semesters = data.semesters || semesters;
            activeSemester = data.activeSemester || 0;
            
            // Restore student info
            const student = data.studentInfo || {};
            document.getElementById('s-name').value = student.name || '';
            document.getElementById('s-father').value = student.father || '';
            document.getElementById('s-reg').value = student.reg || '';
            document.getElementById('s-roll').value = student.roll || '';
        } catch(e) {}
    }
    renderAll();
}

// Save data to localStorage
function saveData() {
    const studentInfo = {
        name: document.getElementById('s-name').value,
        father: document.getElementById('s-father').value,
        reg: document.getElementById('s-reg').value,
        roll: document.getElementById('s-roll').value
    };
    
    const data = {
        semesters: semesters,
        activeSemester: activeSemester,
        studentInfo: studentInfo
    };
    localStorage.setItem('gpaCalculator2026', JSON.stringify(data));
}

// Reset all data
function resetAll() {
    if (confirm('⚠️ Are you sure you want to reset ALL data? This cannot be undone.')) {
        semesters = [{ name: 'Semester 1', courses: [] }];
        activeSemester = 0;
        localStorage.removeItem('gpaCalculator2026');
        
        // Clear student info fields
        document.getElementById('s-name').value = '';
        document.getElementById('s-father').value = '';
        document.getElementById('s-reg').value = '';
        document.getElementById('s-roll').value = '';
        
        renderAll();
    }
}

// Render Semester Tabs
function renderTabs() {
    const tabsContainer = document.getElementById('tabs');
    tabsContainer.innerHTML = '';
    
    semesters.forEach((sem, idx) => {
        const tab = document.createElement('button');
        tab.className = 'tab' + (idx === activeSemester ? ' active' : '');
        tab.textContent = sem.name;
        tab.onclick = () => {
            activeSemester = idx;
            renderAll();
            saveData();
        };
        tabsContainer.appendChild(tab);
    });
    
    const addTab = document.createElement('button');
    addTab.className = 'tab-add';
    addTab.textContent = '+ New Semester';
    addTab.onclick = () => {
        semesters.push({ name: `Semester ${semesters.length + 1}`, courses: [] });
        activeSemester = semesters.length - 1;
        renderAll();
        saveData();
    };
    tabsContainer.appendChild(addTab);
}

// Render Courses List
function renderCourses() {
    const courses = semesters[activeSemester].courses;
    const container = document.getElementById('clist');
    
    if (!courses.length) {
        container.innerHTML = '<div class="empty">📖 No courses yet. Add your first course above.</div>';
        return;
    }
    
    container.innerHTML = '';
    courses.forEach((course, idx) => {
        const grade = getGrade(course.marks);
        const badgeColor = getBadgeColor(course.marks);
        const courseDiv = document.createElement('div');
        courseDiv.className = 'ci';
        courseDiv.innerHTML = `
            <div>
                <div class="ci-name">${escapeHtml(course.name)}</div>
                <div class="ci-meta">📊 ${course.marks} marks | 📚 ${course.credits} credits</div>
                <span class="badge" style="background: ${badgeColor.bg}; color: ${badgeColor.color}">
                    ${grade.letter} (${grade.gp.toFixed(1)} GPA)
                </span>
            </div>
            <button class="btn-del" data-index="${idx}">✖</button>
        `;
        container.appendChild(courseDiv);
    });
    
    // Add delete handlers
    document.querySelectorAll('.btn-del').forEach(btn => {
        btn.onclick = () => {
            semesters[activeSemester].courses.splice(parseInt(btn.dataset.index), 1);
            renderAll();
            saveData();
        };
    });
}

// Render Results & GPA Display
function renderResults() {
    const allCourses = semesters.flatMap(s => s.courses);
    const currentSGPA = calculateSGPA(semesters[activeSemester].courses);
    const cumulativeCGPA = calculateCGPA(allCourses);
    const totalCredits = allCourses.reduce((sum, c) => sum + c.credits, 0);
    
    // Update displays
    document.getElementById('sem-gpa').textContent = currentSGPA.toFixed(2);
    document.getElementById('cum-gpa').textContent = cumulativeCGPA.toFixed(2);
    document.getElementById('tot-cr').textContent = totalCredits;
    document.getElementById('st-c').textContent = allCourses.length;
    document.getElementById('st-s').textContent = semesters.length;
    document.getElementById('st-cr').textContent = totalCredits;
    
    // Update CGPA to Percentage Converter
    document.getElementById('cgpa-input').value = cumulativeCGPA.toFixed(2);
    document.getElementById('percentage-output').value = cgpaToPercentage(cumulativeCGPA) + '%';
    
    // Update active scale highlight
    ['sc-ex', 'sc-gd', 'sc-av', 'sc-bl'].forEach(id => 
        document.getElementById(id).classList.remove('active')
    );
    
    if (cumulativeCGPA >= 3.7) document.getElementById('sc-ex').classList.add('active');
    else if (cumulativeCGPA >= 3.0) document.getElementById('sc-gd').classList.add('active');
    else if (cumulativeCGPA >= 2.0) document.getElementById('sc-av').classList.add('active');
    else document.getElementById('sc-bl').classList.add('active');
}

// Live CGPA to Percentage Converter
function setupConverter() {
    const cgpaInput = document.getElementById('cgpa-input');
    const percentageOutput = document.getElementById('percentage-output');
    
    cgpaInput.addEventListener('input', () => {
        let cgpa = parseFloat(cgpaInput.value) || 0;
        cgpa = Math.min(4.0, Math.max(0, cgpa));
        percentageOutput.value = cgpaToPercentage(cgpa) + '%';
    });
}

// Add Course
function addCourse() {
    const name = document.getElementById('i-name').value.trim();
    const marks = parseFloat(document.getElementById('i-marks').value);
    const credits = parseInt(document.getElementById('i-cr').value) || 3;
    
    if (!name) {
        alert('Please enter a course name');
        return;
    }
    
    if (isNaN(marks) || marks < 0 || marks > 100) {
        alert('Please enter valid marks between 0 and 100');
        return;
    }
    
    if (isNaN(credits) || credits < 1 || credits > 10) {
        alert('Please enter valid credits between 1 and 10');
        return;
    }
    
    semesters[activeSemester].courses.push({ name, marks, credits });
    
    // Clear inputs
    document.getElementById('i-name').value = '';
    document.getElementById('i-marks').value = '';
    document.getElementById('i-cr').value = '3';
    
    renderAll();
    saveData();
}

// Export to Excel
function exportToExcel() {
    const studentName = document.getElementById('s-name').value.trim();
    const fatherName = document.getElementById('s-father').value.trim();
    const regNo = document.getElementById('s-reg').value.trim();
    const rollNo = document.getElementById('s-roll').value.trim();
    
    const errorDiv = document.getElementById('err-info');
    
    if (!studentName || !fatherName || !regNo || !rollNo) {
        errorDiv.style.display = 'block';
        document.getElementById('s-name').focus();
        return;
    }
    errorDiv.style.display = 'none';
    
    const allCourses = semesters.flatMap(s => s.courses);
    const cgpa = calculateCGPA(allCourses);
    const totalCredits = allCourses.reduce((sum, c) => sum + c.credits, 0);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Summary Sheet
    const summaryData = [
        ['🎓 GPA ACADEMIC REPORT 2026'],
        [''],
        ['Student Information'],
        ['Full Name', studentName],
        ["Father's Name", fatherName],
        ['Registration Number', regNo],
        ['Roll Number', rollNo],
        [''],
        ['Academic Summary'],
        ['Cumulative CGPA', cgpa.toFixed(2)],
        ['CGPA to Percentage', cgpaToPercentage(cgpa) + '%'],
        ['Total Credit Hours', totalCredits],
        ['Total Courses Completed', allCourses.length],
        ['Total Semesters', semesters.length],
        [''],
        ['Academic Standing', cgpa >= 3.7 ? '🏆 Excellent' : cgpa >= 3.0 ? '✅ Good' : cgpa >= 2.0 ? '📘 Average' : '⚠️ Need Improvement']
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 25 }, { wch: 35 }];
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
    
    // Detailed Courses Sheet
    const courseRows = [['Semester', 'Course Name', 'Marks (%)', 'Credits', 'Grade', 'Grade Points', 'Weighted GPA']];
    
    semesters.forEach(sem => {
        sem.courses.forEach(c => {
            const grade = getGrade(c.marks);
            courseRows.push([sem.name, c.name, c.marks, c.credits, grade.letter, grade.gp, (grade.gp * c.credits).toFixed(2)]);
        });
        if (sem.courses.length) {
            const sgpa = calculateSGPA(sem.courses);
            const semCredits = sem.courses.reduce((sum, c) => sum + c.credits, 0);
            courseRows.push([`${sem.name} — SGPA`, '', '', semCredits, '', sgpa.toFixed(2), '']);
            courseRows.push([]);
        }
    });
    
    courseRows.push(['📊 CUMULATIVE CGPA', '', '', totalCredits, '', cgpa.toFixed(2), '']);
    
    const coursesSheet = XLSX.utils.aoa_to_sheet(courseRows);
    coursesSheet['!cols'] = [{ wch: 18 }, { wch: 28 }, { wch: 12 }, { wch: 10 }, { wch: 8 }, { wch: 14 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, coursesSheet, 'All Courses');
    
    // Individual Semester Sheets
    semesters.forEach(sem => {
        const semRows = [
            ['Student', studentName, 'Reg No.', regNo],
            ["Father's Name", fatherName, 'Roll No.', rollNo],
            [''],
            [`📚 ${sem.name.toUpperCase()} - Detailed Report`],
            [''],
            ['#', 'Course Name', 'Marks (%)', 'Credits', 'Grade', 'Grade Points', 'Weighted GPA']
        ];
        
        sem.courses.forEach((c, i) => {
            const grade = getGrade(c.marks);
            semRows.push([i + 1, c.name, c.marks, c.credits, grade.letter, grade.gp, (grade.gp * c.credits).toFixed(2)]);
        });
        
        const sgpa = calculateSGPA(sem.courses);
        const semCredits = sem.courses.reduce((sum, c) => sum + c.credits, 0);
        semRows.push(['', 'Semester SGPA', '', semCredits, '', sgpa.toFixed(2), '']);
        
        const semSheet = XLSX.utils.aoa_to_sheet(semRows);
        semSheet['!cols'] = [{ wch: 5 }, { wch: 28 }, { wch: 12 }, { wch: 10 }, { wch: 8 }, { wch: 14 }, { wch: 14 }];
        const sheetName = sem.name.replace(/[:\\/?*\[\]]/g, '').substring(0, 31);
        XLSX.utils.book_append_sheet(wb, semSheet, sheetName);
    });
    
    // Download file
    const filename = `GPA_Report_${rollNo}_${studentName.replace(/\s+/g, '_')}_2026.xlsx`;
    XLSX.writeFile(wb, filename);
}

// Helper: Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Render Everything
function renderAll() {
    renderTabs();
    renderCourses();
    renderResults();
    saveData();
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('btn-add').onclick = addCourse;
    document.getElementById('btn-dl').onclick = exportToExcel;
    document.getElementById('btn-reset').onclick = resetAll;
    
    // Enter key support
    const enterFields = ['i-name', 'i-marks', 'i-cr'];
    enterFields.forEach(id => {
        document.getElementById(id).addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addCourse();
        });
    });
    
    // Auto-save student info on change
    const studentFields = ['s-name', 's-father', 's-reg', 's-roll'];
    studentFields.forEach(id => {
        document.getElementById(id).addEventListener('input', () => saveData());
    });
    
    setupConverter();
}

// Initialize Application
function init() {
    setupEventListeners();
    loadData();
}

// Start the app
init();