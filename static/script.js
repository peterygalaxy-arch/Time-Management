let focusMinutes = 25;
let timeLeft = focusMinutes * 60;
let timerRunning = false;
let timerInterval;
let focusedSeconds = 0;
let sessionFocusedSeconds = 0;

const greetingText = document.getElementById("greeting-text");
const profileNameText = document.getElementById("profile-name");
const currentDateText = document.getElementById("current-date");
const profileAvatar = document.getElementById("profile-avatar");
let profileName = profileNameText.textContent;

function showGreeting() {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
        greetingText.textContent = "Good morning";
    } else if (currentHour < 18) {
        greetingText.textContent = "Good afternoon";
    } else {
        greetingText.textContent = "Good evening";
    }
}

function showCurrentDate() {
    const today = new Date();
    const dateOptions = {
        month: "long",
        day: "numeric",
        year: "numeric"
    };

    currentDateText.textContent = today.toLocaleDateString("en-NZ", dateOptions);
}

function showProfileName() {
    profileNameText.textContent = profileName;
    profileAvatar.textContent = profileName.charAt(0).toUpperCase();
}

profileAvatar.addEventListener("click", function () {
    const newName = prompt("Enter your name:", profileName);

    if (newName === null || newName.trim() === "") {
        return;
    }

    profileName = newName.trim();
    showProfileName();
});

showGreeting();
showCurrentDate();
showProfileName();

const timerNumber = document.getElementById("timer-number");
const timerMessage = document.getElementById("timer-message");
const startButton = document.getElementById("start-button");
const startText = document.getElementById("start-text");
const playIcon = document.getElementById("play-icon");
const resetButton = document.getElementById("reset-button");
const timerSettings = document.getElementById("timer-settings");
const timerOptions = document.getElementById("timer-options");
const focusMinutesInput = document.getElementById("focus-minutes");
const saveTimeButton = document.getElementById("save-time-button");
const cancelTimeButton = document.getElementById("cancel-time-button");
const focusTimeTotal = document.getElementById("focus-time-total");
const focusTimeSession = document.getElementById("focus-time-session");
const clearFocusButton = document.getElementById("clear-focus-button");

function showFocusSummary() {
    const totalMinutes = Math.floor(focusedSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const minutesAfterHours = totalMinutes % 60;

    if (totalHours > 0) {
        focusTimeTotal.textContent = totalHours + "h " + minutesAfterHours + "m";
    } else {
        focusTimeTotal.textContent = totalMinutes + "m";
    }

    if (sessionFocusedSeconds < 60) {
        focusTimeSession.textContent = sessionFocusedSeconds + " seconds this session";
    } else {
        const sessionMinutes = Math.floor(sessionFocusedSeconds / 60);

        if (sessionMinutes === 1) {
            focusTimeSession.textContent = "1 minute this session";
        } else {
            focusTimeSession.textContent = sessionMinutes + " minutes this session";
        }
    }
}

function showTime() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const secondsText = seconds.toString().padStart(2, "0");

    timerNumber.textContent = minutes + ":" + secondsText;
}

function stopTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    startText.textContent = "Start";
    playIcon.innerHTML = "&#9654;";
}

function countDown() {
    if (timeLeft > 0) {
        timeLeft = timeLeft - 1;
        focusedSeconds = focusedSeconds + 1;
        sessionFocusedSeconds = sessionFocusedSeconds + 1;
        showTime();
        showFocusSummary();
    } else {
        stopTimer();
        timerMessage.textContent = "Focus session complete!";
    }
}

startButton.addEventListener("click", function () {
    if (timerRunning) {
        stopTimer();
        timerMessage.textContent = "Timer paused";
    } else {
        timerInterval = setInterval(countDown, 1000);
        timerRunning = true;
        startText.textContent = "Pause";
        playIcon.textContent = "II";
        timerMessage.textContent = "Keep focusing!";
    }
});

resetButton.addEventListener("click", function () {
    stopTimer();
    timeLeft = focusMinutes * 60;
    sessionFocusedSeconds = 0;
    showTime();
    showFocusSummary();
    timerMessage.textContent = "Start focusing!";
});

clearFocusButton.addEventListener("click", function () {
    const shouldClear = confirm("Clear the recorded focus time?");

    if (shouldClear) {
        focusedSeconds = 0;
        sessionFocusedSeconds = 0;
        showFocusSummary();
    }
});

timerSettings.addEventListener("click", function () {
    if (timerOptions.classList.contains("open")) {
        timerOptions.classList.remove("open");
    } else {
        focusMinutesInput.value = focusMinutes;
        timerOptions.classList.add("open");
    }
});

saveTimeButton.addEventListener("click", function () {
    const newMinutes = Number(focusMinutesInput.value);

    if (newMinutes < 1 || newMinutes > 60) {
        alert("Please enter a number from 1 to 60.");
        return;
    }

    stopTimer();
    focusMinutes = newMinutes;
    timeLeft = focusMinutes * 60;
    sessionFocusedSeconds = 0;
    showTime();
    showFocusSummary();
    timerMessage.textContent = "Timer set to " + focusMinutes + " minutes";
    timerOptions.classList.remove("open");
});

cancelTimeButton.addEventListener("click", function () {
    focusMinutesInput.value = focusMinutes;
    timerOptions.classList.remove("open");
});

showTime();
showFocusSummary();

const taskList = document.getElementById("task-list");
const addTaskButton = document.getElementById("add-task-button");
const taskTotal = document.getElementById("task-total");
const taskCompleted = document.getElementById("task-completed");
const emptyTaskMessage = document.getElementById("empty-task-message");
const dailyGoalNumber = document.getElementById("daily-goal-number");
const dailyGoalProgress = document.getElementById("daily-goal-progress");
const dailyGoalText = document.getElementById("daily-goal-text");
const setGoalButton = document.getElementById("set-goal-button");
let dailyGoal = 4;

function updateDailyGoal(completedCount) {
    let goalPercentage = Math.round(completedCount / dailyGoal * 100);

    if (goalPercentage > 100) {
        goalPercentage = 100;
    }

    dailyGoalNumber.textContent = goalPercentage + "%";
    dailyGoalProgress.style.width = goalPercentage + "%";

    if (completedCount >= dailyGoal) {
        dailyGoalText.textContent = "Goal complete!";
    } else {
        dailyGoalText.textContent = completedCount + " of " + dailyGoal + " tasks";
    }
}

function updateTaskSummary() {
    const checkboxes = taskList.querySelectorAll("input[type='checkbox']");
    let completedCount = 0;

    checkboxes.forEach(function (checkbox) {
        const taskRow = checkbox.closest(".task-row");

        if (checkbox.checked) {
            completedCount = completedCount + 1;
            taskRow.classList.add("completed-task");
        } else {
            taskRow.classList.remove("completed-task");
        }
    });

    taskTotal.textContent = checkboxes.length;
    taskCompleted.textContent = completedCount + " completed";
    updateDailyGoal(completedCount);

    if (checkboxes.length === 0) {
        emptyTaskMessage.style.display = "block";
    } else {
        emptyTaskMessage.style.display = "none";
    }
}

setGoalButton.addEventListener("click", function () {
    const newGoalText = prompt("How many tasks is your goal?", dailyGoal);

    if (newGoalText === null) {
        return;
    }

    const newGoal = Number(newGoalText);

    if (newGoal < 1 || newGoal > 20 || Number.isInteger(newGoal) === false) {
        alert("Please enter a whole number from 1 to 20.");
        return;
    }

    dailyGoal = newGoal;
    updateTaskSummary();
});

function listenToCheckbox(checkbox) {
    checkbox.addEventListener("change", function () {
        updateTaskSummary();
    });
}

function listenToEditButton(editButton) {
    editButton.addEventListener("click", function () {
        const taskRow = editButton.closest(".task-row");
        const taskLabel = taskRow.querySelector("label");
        const taskTime = taskRow.querySelector(".task-time");
        const taskPriority = taskRow.querySelector(".priority");
        const newName = prompt("Edit task name:", taskLabel.textContent);

        if (newName === null || newName.trim() === "") {
            return;
        }

        let newTime = prompt("Edit task time:", taskTime.textContent);

        if (newTime === null || newTime.trim() === "") {
            newTime = "No time";
        }

        let newPriority = prompt("Edit High, Medium, or Low:", taskPriority.textContent);

        if (newPriority === null) {
            return;
        }

        newPriority = newPriority.trim().toLowerCase();

        if (newPriority !== "high" && newPriority !== "medium" && newPriority !== "low") {
            alert("Please enter High, Medium, or Low.");
            return;
        }

        taskLabel.textContent = newName.trim();
        taskTime.textContent = newTime.trim();
        taskPriority.classList.remove("high", "medium", "low");
        taskPriority.classList.add(newPriority);
        taskPriority.textContent = newPriority.charAt(0).toUpperCase() + newPriority.slice(1);
    });
}

function listenToDeleteButton(deleteButton) {
    deleteButton.addEventListener("click", function () {
        const taskRow = deleteButton.closest(".task-row");
        const taskLabel = taskRow.querySelector("label");
        const shouldDelete = confirm("Delete " + taskLabel.textContent + "?");

        if (shouldDelete) {
            taskRow.remove();
            updateTaskSummary();
        }
    });
}

const firstCheckboxes = taskList.querySelectorAll("input[type='checkbox']");
const firstEditButtons = taskList.querySelectorAll(".edit-task-button");
const firstDeleteButtons = taskList.querySelectorAll(".delete-task-button");

firstCheckboxes.forEach(function (checkbox) {
    listenToCheckbox(checkbox);
});

firstEditButtons.forEach(function (editButton) {
    listenToEditButton(editButton);
});

firstDeleteButtons.forEach(function (deleteButton) {
    listenToDeleteButton(deleteButton);
});

addTaskButton.addEventListener("click", function () {
    const taskName = prompt("Enter a task name:");

    if (taskName === null || taskName.trim() === "") {
        return;
    }

    let taskTime = prompt("Enter a time:", "7:00 PM");

    if (taskTime === null || taskTime.trim() === "") {
        taskTime = "No time";
    }

    let taskPriority = prompt("Enter High, Medium, or Low:", "Low");

    if (taskPriority === null) {
        taskPriority = "Low";
    }

    taskPriority = taskPriority.trim().toLowerCase();

    if (taskPriority !== "high" && taskPriority !== "medium" && taskPriority !== "low") {
        taskPriority = "low";
    }

    const newTaskNumber = taskList.querySelectorAll(".task-row").length + 1;
    const newTask = document.createElement("div");
    const priorityText = taskPriority.charAt(0).toUpperCase() + taskPriority.slice(1);

    newTask.className = "task-row";
    newTask.innerHTML = `
        <div class="task-name">
            <input type="checkbox" id="task-${newTaskNumber}">
            <label for="task-${newTaskNumber}">${taskName.trim()}</label>
        </div>
        <div class="task-details">
            <span class="priority ${taskPriority}">${priorityText}</span>
            <span class="task-time">${taskTime.trim()}</span>
            <button class="edit-task-button" type="button">Edit</button>
            <button class="delete-task-button" type="button">Delete</button>
        </div>
    `;

    taskList.appendChild(newTask);

    const newCheckbox = newTask.querySelector("input[type='checkbox']");
    const newEditButton = newTask.querySelector(".edit-task-button");
    const newDeleteButton = newTask.querySelector(".delete-task-button");
    listenToCheckbox(newCheckbox);
    listenToEditButton(newEditButton);
    listenToDeleteButton(newDeleteButton);
    updateTaskSummary();
});

updateTaskSummary();

const menuLinks = document.querySelectorAll(".menu-link");
const dashboardLink = document.getElementById("dashboard-link");
const tasksLink = document.getElementById("tasks-link");
const calendarMenuLink = document.getElementById("calendar-menu-link");
const focusLink = document.getElementById("focus-link");
const settingsLink = document.getElementById("settings-link");
const dashboard = document.getElementById("dashboard");
const tasksPanel = document.getElementById("tasks-panel");
const schedulePanel = document.getElementById("schedule-panel");
const timerPanel = document.getElementById("timer-panel");

function selectMenuLink(selectedLink) {
    menuLinks.forEach(function (menuLink) {
        menuLink.classList.remove("active");
    });

    selectedLink.classList.add("active");
}

dashboardLink.addEventListener("click", function (event) {
    event.preventDefault();
    selectMenuLink(dashboardLink);
    dashboard.scrollIntoView();
});

tasksLink.addEventListener("click", function (event) {
    event.preventDefault();
    selectMenuLink(tasksLink);
    tasksPanel.scrollIntoView();
});

calendarMenuLink.addEventListener("click", function (event) {
    event.preventDefault();
    selectMenuLink(calendarMenuLink);
    schedulePanel.scrollIntoView();
});

focusLink.addEventListener("click", function (event) {
    event.preventDefault();
    selectMenuLink(focusLink);
    timerPanel.scrollIntoView();
});

settingsLink.addEventListener("click", function (event) {
    event.preventDefault();
    selectMenuLink(settingsLink);
    timerPanel.scrollIntoView();

    if (!timerOptions.classList.contains("open")) {
        focusMinutesInput.value = focusMinutes;
        timerOptions.classList.add("open");
    }
});

const scheduleList = document.getElementById("schedule-list");
const addScheduleButton = document.getElementById("add-schedule-button");
const emptyScheduleMessage = document.getElementById("empty-schedule-message");

function updateScheduleMessage() {
    const scheduleRows = scheduleList.querySelectorAll(".schedule-row");

    if (scheduleRows.length === 0) {
        emptyScheduleMessage.style.display = "block";
    } else {
        emptyScheduleMessage.style.display = "none";
    }
}

function listenToScheduleEditButton(editButton) {
    editButton.addEventListener("click", function () {
        const scheduleRow = editButton.closest(".schedule-row");
        const scheduleName = scheduleRow.querySelector(".schedule-name");
        const scheduleTime = scheduleRow.querySelector(".schedule-time");
        const scheduleHours = scheduleRow.querySelector(".schedule-hours");
        const oldHours = scheduleHours.textContent.split(" - ");
        const newName = prompt("Edit schedule name:", scheduleName.textContent);

        if (newName === null || newName.trim() === "") {
            return;
        }

        const newStartTime = prompt("Edit start time:", scheduleTime.textContent);

        if (newStartTime === null || newStartTime.trim() === "") {
            return;
        }

        let oldEndTime = "8:00 PM";

        if (oldHours.length > 1) {
            oldEndTime = oldHours[1];
        }

        const newEndTime = prompt("Edit end time:", oldEndTime);

        if (newEndTime === null || newEndTime.trim() === "") {
            return;
        }

        scheduleName.textContent = newName.trim();
        scheduleTime.textContent = newStartTime.trim();
        scheduleHours.textContent = newStartTime.trim() + " - " + newEndTime.trim();
    });
}

function listenToScheduleDeleteButton(deleteButton) {
    deleteButton.addEventListener("click", function () {
        const scheduleRow = deleteButton.closest(".schedule-row");
        const scheduleName = scheduleRow.querySelector(".schedule-name");
        const shouldDelete = confirm("Delete " + scheduleName.textContent + "?");

        if (shouldDelete) {
            scheduleRow.remove();
            updateScheduleMessage();
        }
    });
}

const firstScheduleDeleteButtons = scheduleList.querySelectorAll(
    ".delete-schedule-button"
);
const firstScheduleEditButtons = scheduleList.querySelectorAll(
    ".edit-schedule-button"
);

firstScheduleEditButtons.forEach(function (editButton) {
    listenToScheduleEditButton(editButton);
});

firstScheduleDeleteButtons.forEach(function (deleteButton) {
    listenToScheduleDeleteButton(deleteButton);
});

updateScheduleMessage();

addScheduleButton.addEventListener("click", function () {
    const scheduleName = prompt("Enter a schedule name:");

    if (scheduleName === null || scheduleName.trim() === "") {
        return;
    }

    const startTime = prompt("Enter a start time:", "7:00 PM");

    if (startTime === null || startTime.trim() === "") {
        return;
    }

    const endTime = prompt("Enter an end time:", "8:00 PM");

    if (endTime === null || endTime.trim() === "") {
        return;
    }

    let scheduleColour = prompt(
        "Enter Purple, Green, Orange, Pink, or Blue:",
        "Purple"
    );

    if (scheduleColour === null) {
        scheduleColour = "Purple";
    }

    scheduleColour = scheduleColour.trim().toLowerCase();

    if (
        scheduleColour !== "purple" &&
        scheduleColour !== "green" &&
        scheduleColour !== "orange" &&
        scheduleColour !== "pink" &&
        scheduleColour !== "blue"
    ) {
        scheduleColour = "purple";
    }

    let lineColourClass = "";
    let dotColourClass = "";
    let nameColourClass = "";

    if (scheduleColour !== "purple") {
        lineColourClass = scheduleColour + "-line";
        dotColourClass = scheduleColour + "-dot";
        nameColourClass = scheduleColour + "-name";
    }

    const newSchedule = document.createElement("div");
    newSchedule.className = "schedule-row";
    newSchedule.innerHTML = `
        <p class="schedule-time">${startTime.trim()}</p>
        <div class="schedule-line ${lineColourClass}">
            <span class="schedule-dot ${dotColourClass}"></span>
        </div>
        <div class="schedule-card ${scheduleColour}-schedule">
            <p class="schedule-name ${nameColourClass}">${scheduleName.trim()}</p>
            <p class="schedule-hours">${startTime.trim()} - ${endTime.trim()}</p>
            <button class="edit-schedule-button" type="button">Edit</button>
            <button class="delete-schedule-button" type="button">Delete</button>
        </div>
    `;

    scheduleList.appendChild(newSchedule);

    const newEditButton = newSchedule.querySelector(".edit-schedule-button");
    const newDeleteButton = newSchedule.querySelector(".delete-schedule-button");
    listenToScheduleEditButton(newEditButton);
    listenToScheduleDeleteButton(newDeleteButton);
    updateScheduleMessage();
});
