const teacherNames = [
  "John Smith", "Jane Doe", "Alice Johnson", "Robert Brown",
  "Michael Davis", "Emily Wilson", "Chris Taylor", "Sophia Martinez",
  "Liam Thomas", "Olivia White"
];

document.getElementById('generate-timetable').addEventListener('click', () => {
  const numClasses = parseInt(document.getElementById('num-classes').value);
  const numSubjects = parseInt(document.getElementById('num-subjects').value);

  if (!numClasses || !numSubjects || numClasses <= 0 || numSubjects <= 0) {
    alert("Please enter valid numbers for classes and subjects.");
    return;
  }

  generateTimetable(numClasses, numSubjects);
});

function generateTimetable(numClasses, numSubjects) {
  const subjects = [];
  const schedule = [];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const availableTimeSlots = [
    { start: 7, end: 9 },
    { start: 9, end: 11 },
    { start: 11, end: 13 },
    { start: 13, end: 15 },
    { start: 15, end: 17 }
  ];

  // Generate subjects and assign random teachers
  for (let i = 1; i <= numSubjects; i++) {
    const teacher = teacherNames[Math.floor(Math.random() * teacherNames.length)];
    subjects.push({ name: `Subject ${i}`, teacher });
  }

  // Generate schedule for each class
  for (let classNum = 1; classNum <= numClasses; classNum++) {
    const classSchedule = [];

    days.forEach(day => {
      const daySchedule = [];
      const usedTimeSlots = []; // Keep track of used time slots for the day
      const assignedSubjects = [...subjects]; // Clone subjects for random selection

      for (let slot = 0; slot < 2; slot++) { // Each class has two subjects a day
        if (assignedSubjects.length === 0) break;

        let randomSlot;
        do {
          randomSlot = Math.floor(Math.random() * availableTimeSlots.length);
        } while (usedTimeSlots.includes(randomSlot));

        usedTimeSlots.push(randomSlot);

        const subjectIndex = Math.floor(Math.random() * assignedSubjects.length);
        const subject = assignedSubjects.splice(subjectIndex, 1)[0];

        const timeSlot = availableTimeSlots[randomSlot];
        daySchedule.push({
          timeSlot,
          subject
        });
      }

      // Sort the day's subjects by their time slots (from earliest to latest)
      daySchedule.sort((a, b) => a.timeSlot.start - b.timeSlot.start);

      classSchedule.push({ day, daySchedule });
    });
    schedule.push({ classNum, classSchedule });
  }

  renderTimetable(schedule);
}

function renderTimetable(schedule) {
  const timetableDiv = document.getElementById('timetable');
  timetableDiv.innerHTML = "";

  schedule.forEach(classInfo => {
    const classTable = document.createElement('table');
    classTable.innerHTML = `
      <thead>
        <tr>
          <th colspan="3">Class ${classInfo.classNum}</th>
        </tr>
        <tr>
          <th>Day</th>
          <th>Subject 1 (Time)</th>
          <th>Subject 2 (Time)</th>
        </tr>
      </thead>
      <tbody>
        ${classInfo.classSchedule.map(dayInfo => `
          <tr>
            <td>${dayInfo.day}</td>
            <td>${dayInfo.daySchedule[0] ? `
              ${dayInfo.daySchedule[0].subject.name} (${dayInfo.daySchedule[0].subject.teacher}) <br>
              ${dayInfo.daySchedule[0].timeSlot.start}:00 - ${dayInfo.daySchedule[0].timeSlot.end}:00
            ` : 'N/A'}</td>
            <td>${dayInfo.daySchedule[1] ? `
              ${dayInfo.daySchedule[1].subject.name} (${dayInfo.daySchedule[1].subject.teacher}) <br>
              ${dayInfo.daySchedule[1].timeSlot.start}:00 - ${dayInfo.daySchedule[1].timeSlot.end}:00
            ` : 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
    timetableDiv.appendChild(classTable);
  });
}
