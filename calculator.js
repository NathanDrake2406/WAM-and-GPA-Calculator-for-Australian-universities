let subjects = [];
let totalDegreeCredits = 144; // Default value
let defaultSubjectCredits = 6; // Default credit point for subjects

document.getElementById('degree-credits').addEventListener('change', function() {
    const selectedOption = this.value;
    if (selectedOption === 'custom') {
        document.getElementById('custom-credits').disabled = false;
    } else {
        document.getElementById('custom-credits').disabled = true;
        totalDegreeCredits = parseInt(selectedOption);
    }
    updateRemainingCredits();
});

document.getElementById('custom-credits').addEventListener('input', function() {
    totalDegreeCredits = parseInt(this.value) || 0;
    updateRemainingCredits();
});

document.getElementById('add-subject').addEventListener('click', addSubject);

document.getElementById('subject-credits').addEventListener('input', function() {
    const inputCredits = parseFloat(this.value);
    if (!isNaN(inputCredits)) {
        defaultSubjectCredits = inputCredits;
    }
});

document.getElementById('subject-grade').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addSubject();
    }
});

document.getElementById('subject-credits').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addSubject();
    }
});

document.getElementById('subject-list').addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-subject')) {
        const index = parseInt(event.target.getAttribute('data-index'));
        removeSubject(index);
    }
});

function getGradeText(grade) {
    if (grade >= 85) {
        return "High Distinction (HD)";
    } else if (grade >= 75 && grade < 85) {
        return "Distinction (D)";
    } else if (grade >= 65 && grade < 75) {
        return "Credit (C)";
    } else if (grade >= 50 && grade < 65) {
        return "Pass (P)";
    } else {
        return "Fail (N)";
    }
}

function updateSubjectList() {
    const subjectList = document.getElementById('subject-list');
    subjectList.innerHTML = '';

    subjects.forEach((subject, index) => {
        const listItem = document.createElement('li');
        const gradeText = subject.credits > 0 ? subject.grade : getGradeText(subject.grade);
        listItem.innerHTML = `
            <span>${subject.name} - <span class="grade">Grade: ${gradeText}</span>, Credits: ${subject.credits}</span>
            <button class="remove-subject" data-index="${index}">X</button>
        `;
        subjectList.appendChild(listItem);
    });
}

function clearInputFields() {
    document.getElementById('subject-name').value = '';
    document.getElementById('subject-grade').value = '';
    document.getElementById('subject-credits').value = defaultSubjectCredits;
}

function calculateGPA() {
    let totalGradePoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
        const gradePoint = getGradePoint(subject.grade);
        const credits = subject.credits;

        totalGradePoints += gradePoint * credits;
        totalCredits += credits;
    });

    const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    document.getElementById('gpa-result').textContent = gpa.toFixed(2);
}


function getGradePoint(grade) {
    if (grade >= 85) {
        return 7;
    } else if (grade >= 75 && grade < 85) {
        return 6;
    } else if (grade >= 65 && grade < 75) {
        return 5;
    } else if (grade >= 50 && grade < 65) {
        return 4;
    } else {
        return 0;
    }
}

function calculateFourPointGPA() {
    let totalGradePoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
        const gradePoint = getFourPointGradePoint(subject.grade);
        const credits = subject.credits;

        totalGradePoints += gradePoint * credits;
        totalCredits += credits;
    });

    const fourPointGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    document.getElementById('four-point-gpa-result').textContent = fourPointGPA.toFixed(2);
}

function getFourPointGradePoint(grade) {
    if (grade >= 85) {
        return 4;
    } else if (grade >= 75 && grade < 85) {
        return 3.5;
    } else if (grade >= 65 && grade < 75) {
        return 2.5;
    } else if (grade >= 50 && grade < 65) {
        return 1.5;
    } else {
        return 0.5;
    }
}

function calculateWAM() {
    let totalWeightedMarks = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
        const weightedMark = subject.grade * subject.credits;
        const credits = subject.credits;

        totalWeightedMarks += weightedMark;
        totalCredits += credits;
    });

    const wam = totalCredits > 0 ? totalWeightedMarks / totalCredits : 0;
    document.getElementById('wam-result').textContent = wam.toFixed(2);
}

function updateRemainingCredits() {
    const totalCreditsCompleted = subjects.reduce((total, subject) => total + subject.credits, 0);
    const remainingCredits = totalDegreeCredits - totalCreditsCompleted;
    document.getElementById('remaining-credits').textContent = remainingCredits;
}

function focusSubjectGrade() {
    document.getElementById('subject-grade').focus();
}

function addSubject() {
    const subjectName = document.getElementById('subject-name').value || `Subject ${subjects.length + 1}`;
    const subjectGrade = parseFloat(document.getElementById('subject-grade').value);
    const subjectCredits = parseFloat(document.getElementById('subject-credits').value) || defaultSubjectCredits;

    if (isNaN(subjectGrade) || subjectGrade < 0 || subjectGrade > 100) {
        showAlert('Please enter a valid subject grade between 0 and 100.');
        return;
    }

    if (subjectCredits % 2 !== 0 || subjectCredits > 12) {
        showAlert('Credit points must be less than 12 and is divisible by 2 (e.g., 6 or 8).');
        return;
    }

    const remainingCredits = totalDegreeCredits - subjects.reduce((total, subject) => total + subject.credits, 0);

    if (remainingCredits > 0) {
        const subject = { name: subjectName, grade: subjectGrade, credits: Math.min(subjectCredits, remainingCredits) };
        subjects.push(subject);
        updateSubjectList();
        clearInputFields();
        calculateGPA();
        calculateFourPointGPA();
        calculateWAM();
        updateRemainingCredits();
        focusSubjectGrade();
    } else {
        showAlert('Credit points limit reached. Cannot add more subjects.');
    }
}

function removeSubject(index) {
    subjects.splice(index, 1);
    updateSubjectList();
    calculateGPA();
    calculateFourPointGPA();
    calculateWAM();
    updateRemainingCredits();
}

function showAlert(message) {
    const alertModal = document.getElementById('alert-modal');
    const alertMessage = document.getElementById('alert-message');
    const alertClose = document.getElementById('alert-close');

    alertMessage.textContent = message;
    alertModal.style.display = 'block';

    alertClose.onclick = function() {
        alertModal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === alertModal) {
            alertModal.style.display = 'none';
        }
    };
}