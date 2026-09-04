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
const timerPresetButtons = document.querySelectorAll(".timer-preset-button");

function showSelectedPreset() {
    timerPresetButtons.forEach(function (presetButton) {
        const presetMinutes = Number(presetButton.dataset.minutes);

        presetButton.classList.remove("selected-preset");

        if (Number(focusMinutesInput.value) === presetMinutes) {
            presetButton.classList.add("selected-preset");
        }
    });
}

timerPresetButtons.forEach(function (presetButton) {
    presetButton.addEventListener("click", function () {
        focusMinutesInput.value = presetButton.dataset.minutes;
        showSelectedPreset();
    });
});

focusMinutesInput.addEventListener("input", function () {
    showSelectedPreset();
});

function saveFocusTimer() {
    const savedTimer = {
        focusMinutes: focusMinutes,
        timeLeft: timeLeft,
        focusedSeconds: focusedSeconds,
        sessionFocusedSeconds: sessionFocusedSeconds,
        savedDate: new Date().toDateString()
    };

    localStorage.setItem("timeTrackFocusTimer", JSON.stringify(savedTimer));
}

function loadFocusTimer() {
    const savedTimerText = localStorage.getItem("timeTrackFocusTimer");

    if (savedTimerText === null) {
        return;
    }

    const savedTimer = JSON.parse(savedTimerText);

    if (
        Number.isInteger(savedTimer.focusMinutes) &&
        savedTimer.focusMinutes >= 1 &&
        savedTimer.focusMinutes <= 60
    ) {
        focusMinutes = savedTimer.focusMinutes;
    }

    const fullTimerSeconds = focusMinutes * 60;

    if (
        Number.isInteger(savedTimer.timeLeft) &&
        savedTimer.timeLeft >= 0 &&
        savedTimer.timeLeft <= fullTimerSeconds
    ) {
        timeLeft = savedTimer.timeLeft;
    } else {
        timeLeft = fullTimerSeconds;
    }

    if (Number.isInteger(savedTimer.focusedSeconds) && savedTimer.focusedSeconds >= 0) {
        focusedSeconds = savedTimer.focusedSeconds;
    }

    const today = new Date().toDateString();

    if (
        savedTimer.savedDate === today &&
        Number.isInteger(savedTimer.sessionFocusedSeconds) &&
        savedTimer.sessionFocusedSeconds >= 0
    ) {
        sessionFocusedSeconds = savedTimer.sessionFocusedSeconds;
    } else {
        sessionFocusedSeconds = 0;
    }
}

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
        saveFocusTimer();
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
    saveFocusTimer();
});

clearFocusButton.addEventListener("click", function () {
    const shouldClear = confirm("Clear the recorded focus time?");

    if (shouldClear) {
        focusedSeconds = 0;
        sessionFocusedSeconds = 0;
        showFocusSummary();
        saveFocusTimer();
    }
});

timerSettings.addEventListener("click", function () {
    if (timerOptions.classList.contains("open")) {
        timerOptions.classList.remove("open");
    } else {
        focusMinutesInput.value = focusMinutes;
        showSelectedPreset();
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
    saveFocusTimer();
});

cancelTimeButton.addEventListener("click", function () {
    focusMinutesInput.value = focusMinutes;
    showSelectedPreset();
    timerOptions.classList.remove("open");
});

loadFocusTimer();
showTime();
showFocusSummary();

const taskList = document.getElementById("task-list");
const addTaskButton = document.getElementById("add-task-button");
const clearCompletedButton = document.getElementById("clear-completed-button");
const taskTotal = document.getElementById("task-total");
const taskCompleted = document.getElementById("task-completed");
const emptyTaskMessage = document.getElementById("empty-task-message");
const dailyGoalNumber = document.getElementById("daily-goal-number");
const dailyGoalProgress = document.getElementById("daily-goal-progress");
const dailyGoalText = document.getElementById("daily-goal-text");
const setGoalButton = document.getElementById("set-goal-button");
const resetGoalButton = document.getElementById("reset-goal-button");
const viewTasksLink = document.getElementById("view-tasks-link");
const taskFilters = document.getElementById("task-filters");
const allTasksButton = document.getElementById("all-tasks-button");
const todoTasksButton = document.getElementById("todo-tasks-button");
const completedTasksButton = document.getElementById("completed-tasks-button");
const filterTaskMessage = document.getElementById("filter-task-message");
const taskSearchInput = document.getElementById("task-search-input");
const clearSearchButton = document.getElementById("clear-search-button");
const priorityFilter = document.getElementById("priority-filter");
const taskSort = document.getElementById("task-sort");
const taskResultCount = document.getElementById("task-result-count");
const streakNumber = document.getElementById("streak-number");
const streakNote = document.getElementById("streak-note");
let dailyGoal = 4;
let taskFilter = "all";
let streakCount = 0;
let lastStreakDate = "";

function saveDailyGoal() {
    localStorage.setItem("timeTrackDailyGoal", dailyGoal);
}

function loadDailyGoal() {
    const savedGoalText = localStorage.getItem("timeTrackDailyGoal");

    if (savedGoalText === null) {
        return;
    }

    const savedGoal = Number(savedGoalText);

    if (Number.isInteger(savedGoal) && savedGoal >= 1 && savedGoal <= 20) {
        dailyGoal = savedGoal;
    }
}

function showStreak() {
    if (streakCount === 1) {
        streakNumber.textContent = "1 day";
    } else {
        streakNumber.textContent = streakCount + " days";
    }

    if (streakCount === 0) {
        streakNote.textContent = "Complete today's goal!";
    } else {
        streakNote.textContent = "Keep it up!";
    }
}

function saveStreak() {
    const savedStreak = {
        count: streakCount,
        lastDate: lastStreakDate
    };

    localStorage.setItem("timeTrackStreak", JSON.stringify(savedStreak));
}

function loadStreak() {
    const savedStreakText = localStorage.getItem("timeTrackStreak");

    if (savedStreakText === null) {
        showStreak();
        return;
    }

    const savedStreak = JSON.parse(savedStreakText);

    if (Number.isInteger(savedStreak.count) && savedStreak.count >= 0) {
        streakCount = savedStreak.count;
    }

    if (typeof savedStreak.lastDate === "string") {
        lastStreakDate = savedStreak.lastDate;
    }

    if (lastStreakDate !== "") {
        const today = new Date(new Date().toDateString());
        const previousGoalDate = new Date(lastStreakDate);
        const millisecondsInDay = 1000 * 60 * 60 * 24;
        const daysSinceGoal = Math.round((today - previousGoalDate) / millisecondsInDay);

        if (daysSinceGoal > 1 || daysSinceGoal < 0) {
            streakCount = 0;
            lastStreakDate = "";
            saveStreak();
        }
    }

    showStreak();
}

function recordDailyGoal() {
    const today = new Date(new Date().toDateString());
    const todayText = today.toDateString();

    if (lastStreakDate === todayText) {
        return;
    }

    if (lastStreakDate === "") {
        streakCount = 1;
    } else {
        const previousGoalDate = new Date(lastStreakDate);
        const millisecondsInDay = 1000 * 60 * 60 * 24;
        const daysSinceGoal = Math.round((today - previousGoalDate) / millisecondsInDay);

        if (daysSinceGoal === 1) {
            streakCount = streakCount + 1;
        } else {
            streakCount = 1;
        }
    }

    lastStreakDate = todayText;
    saveStreak();
    showStreak();
}

function filterTasks() {
    const taskRows = taskList.querySelectorAll(".task-row");
    const filterButtons = taskFilters.querySelectorAll(".task-filter-button");
    const searchText = taskSearchInput.value.trim().toLowerCase();
    let visibleTaskCount = 0;

    taskRows.forEach(function (taskRow) {
        const checkbox = taskRow.querySelector("input[type='checkbox']");
        const taskName = taskRow.querySelector("label").textContent.toLowerCase();
        const taskPriority = taskRow.querySelector(".priority").textContent.toLowerCase();
        let showTask = true;

        if (taskFilter === "todo" && checkbox.checked) {
            showTask = false;
        }

        if (taskFilter === "completed" && checkbox.checked === false) {
            showTask = false;
        }

        if (searchText !== "" && taskName.includes(searchText) === false) {
            showTask = false;
        }

        if (priorityFilter.value !== "all" && taskPriority !== priorityFilter.value) {
            showTask = false;
        }

        if (showTask) {
            taskRow.style.display = "block";
            visibleTaskCount = visibleTaskCount + 1;
        } else {
            taskRow.style.display = "none";
        }
    });

    filterButtons.forEach(function (filterButton) {
        filterButton.classList.remove("active-filter");
    });

    if (taskFilter === "todo") {
        todoTasksButton.classList.add("active-filter");
    } else if (taskFilter === "completed") {
        completedTasksButton.classList.add("active-filter");
    } else {
        allTasksButton.classList.add("active-filter");
    }

    if (taskRows.length > 0 && visibleTaskCount === 0) {
        filterTaskMessage.style.display = "block";
    } else {
        filterTaskMessage.style.display = "none";
    }

    if (visibleTaskCount === 1) {
        taskResultCount.textContent = "1 task shown";
    } else {
        taskResultCount.textContent = visibleTaskCount + " tasks shown";
    }
}

function sortTasks() {
    const taskRows = Array.from(taskList.querySelectorAll(".task-row"));
    const priorityNumbers = {
        high: 1,
        medium: 2,
        low: 3
    };

    taskRows.sort(function (firstTask, secondTask) {
        if (taskSort.value === "name") {
            const firstName = firstTask.querySelector("label").textContent.toLowerCase();
            const secondName = secondTask.querySelector("label").textContent.toLowerCase();
            return firstName.localeCompare(secondName);
        }

        if (taskSort.value === "priority") {
            const firstPriority = firstTask.querySelector(".priority").textContent.toLowerCase();
            const secondPriority = secondTask.querySelector(".priority").textContent.toLowerCase();
            const priorityDifference = priorityNumbers[firstPriority] - priorityNumbers[secondPriority];

            if (priorityDifference !== 0) {
                return priorityDifference;
            }
        }

        return Number(firstTask.dataset.taskOrder) - Number(secondTask.dataset.taskOrder);
    });

    taskRows.forEach(function (taskRow) {
        taskList.appendChild(taskRow);
    });

    filterTasks();
}

function updateDailyGoal(completedCount) {
    let goalPercentage = Math.round(completedCount / dailyGoal * 100);

    if (goalPercentage > 100) {
        goalPercentage = 100;
    }

    dailyGoalNumber.textContent = goalPercentage + "%";
    dailyGoalProgress.style.width = goalPercentage + "%";

    if (dailyGoal === 4) {
        resetGoalButton.disabled = true;
    } else {
        resetGoalButton.disabled = false;
    }

    if (completedCount >= dailyGoal) {
        dailyGoalText.textContent = "Goal complete!";
        recordDailyGoal();
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

    if (completedCount === 0) {
        clearCompletedButton.textContent = "Clear completed";
        clearCompletedButton.disabled = true;
    } else if (completedCount === 1) {
        clearCompletedButton.textContent = "Clear 1 completed task";
        clearCompletedButton.disabled = false;
    } else {
        clearCompletedButton.textContent = "Clear " + completedCount + " completed tasks";
        clearCompletedButton.disabled = false;
    }

    if (checkboxes.length === 0) {
        emptyTaskMessage.style.display = "block";
    } else {
        emptyTaskMessage.style.display = "none";
    }

    filterTasks();
}

function saveTasks() {
    const taskRows = taskList.querySelectorAll(".task-row");
    const savedTasks = [];

    taskRows.forEach(function (taskRow) {
        const checkbox = taskRow.querySelector("input[type='checkbox']");
        const taskName = taskRow.querySelector("label").textContent;
        const taskTime = taskRow.querySelector(".task-time").textContent;
        const priority = taskRow.querySelector(".priority");
        let priorityName = "low";

        if (priority.classList.contains("high")) {
            priorityName = "high";
        } else if (priority.classList.contains("medium")) {
            priorityName = "medium";
        }

        savedTasks.push({
            name: taskName,
            time: taskTime,
            priority: priorityName,
            completed: checkbox.checked
        });
    });

    localStorage.setItem("timeTrackTasks", JSON.stringify(savedTasks));
}

function loadSavedTasks() {
    const savedTaskText = localStorage.getItem("timeTrackTasks");

    if (savedTaskText === null) {
        return;
    }

    const savedTasks = JSON.parse(savedTaskText);
    taskList.innerHTML = "";

    savedTasks.forEach(function (savedTask, taskNumber) {
        const savedTaskRow = document.createElement("div");
        const priorityText = savedTask.priority.charAt(0).toUpperCase() + savedTask.priority.slice(1);
        let checkedText = "";

        if (savedTask.completed) {
            checkedText = "checked";
            savedTaskRow.className = "task-row completed-task";
        } else {
            savedTaskRow.className = "task-row";
        }

        savedTaskRow.innerHTML = `
            <div class="task-name">
                <input type="checkbox" id="saved-task-${taskNumber}" ${checkedText}>
                <label for="saved-task-${taskNumber}">${savedTask.name}</label>
            </div>
            <div class="task-details">
                <span class="priority ${savedTask.priority}">${priorityText}</span>
                <span class="task-time">${savedTask.time}</span>
                <button class="edit-task-button" type="button">Edit</button>
                <button class="delete-task-button" type="button">Delete</button>
            </div>
        `;

        taskList.appendChild(savedTaskRow);
    });
}

viewTasksLink.addEventListener("click", function (event) {
    event.preventDefault();

    if (taskFilters.classList.contains("open")) {
        taskFilters.classList.remove("open");
        viewTasksLink.textContent = "View all";
        taskFilter = "all";
        taskSearchInput.value = "";
        priorityFilter.value = "all";
        taskSort.value = "original";
        sortTasks();
    } else {
        taskFilters.classList.add("open");
        viewTasksLink.textContent = "Hide filters";
    }
});

allTasksButton.addEventListener("click", function () {
    taskFilter = "all";
    filterTasks();
});

todoTasksButton.addEventListener("click", function () {
    taskFilter = "todo";
    filterTasks();
});

completedTasksButton.addEventListener("click", function () {
    taskFilter = "completed";
    filterTasks();
});

taskSearchInput.addEventListener("input", function () {
    filterTasks();
});

clearSearchButton.addEventListener("click", function () {
    taskSearchInput.value = "";
    filterTasks();
    taskSearchInput.focus();
});

priorityFilter.addEventListener("change", function () {
    filterTasks();
});

taskSort.addEventListener("change", function () {
    sortTasks();
});

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
    saveDailyGoal();
    updateTaskSummary();
});

resetGoalButton.addEventListener("click", function () {
    const shouldReset = confirm("Reset the daily goal to 4 tasks?");

    if (shouldReset === false) {
        return;
    }

    dailyGoal = 4;
    saveDailyGoal();
    updateTaskSummary();
});

clearCompletedButton.addEventListener("click", function () {
    const taskRows = taskList.querySelectorAll(".task-row");
    let completedCount = 0;

    taskRows.forEach(function (taskRow) {
        const checkbox = taskRow.querySelector("input[type='checkbox']");

        if (checkbox.checked) {
            completedCount = completedCount + 1;
        }
    });

    const shouldClear = confirm("Remove " + completedCount + " completed task(s)?");

    if (shouldClear === false) {
        return;
    }

    taskRows.forEach(function (taskRow) {
        const checkbox = taskRow.querySelector("input[type='checkbox']");

        if (checkbox.checked) {
            taskRow.remove();
        }
    });

    updateTaskSummary();
    saveTasks();
});

function listenToCheckbox(checkbox) {
    checkbox.addEventListener("change", function () {
        updateTaskSummary();
        saveTasks();
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
        sortTasks();
        saveTasks();
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
            saveTasks();
        }
    });
}

loadSavedTasks();

const firstCheckboxes = taskList.querySelectorAll("input[type='checkbox']");
const firstEditButtons = taskList.querySelectorAll(".edit-task-button");
const firstDeleteButtons = taskList.querySelectorAll(".delete-task-button");
let nextTaskOrder = firstCheckboxes.length;

const firstTaskRows = taskList.querySelectorAll(".task-row");

firstTaskRows.forEach(function (taskRow, taskNumber) {
    taskRow.dataset.taskOrder = taskNumber;
});

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
    newTask.dataset.taskOrder = nextTaskOrder;
    nextTaskOrder = nextTaskOrder + 1;
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
    sortTasks();
    saveTasks();
});

loadDailyGoal();
loadStreak();
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

function saveSchedules() {
    const scheduleRows = scheduleList.querySelectorAll(".schedule-row");
    const savedSchedules = [];

    scheduleRows.forEach(function (scheduleRow) {
        const scheduleCard = scheduleRow.querySelector(".schedule-card");
        let scheduleColour = "purple";

        if (scheduleCard.classList.contains("green-schedule")) {
            scheduleColour = "green";
        } else if (scheduleCard.classList.contains("orange-schedule")) {
            scheduleColour = "orange";
        } else if (scheduleCard.classList.contains("pink-schedule")) {
            scheduleColour = "pink";
        } else if (scheduleCard.classList.contains("blue-schedule")) {
            scheduleColour = "blue";
        }

        savedSchedules.push({
            name: scheduleRow.querySelector(".schedule-name").textContent,
            startTime: scheduleRow.querySelector(".schedule-time").textContent,
            hours: scheduleRow.querySelector(".schedule-hours").textContent,
            colour: scheduleColour
        });
    });

    localStorage.setItem("timeTrackSchedules", JSON.stringify(savedSchedules));
}

function loadSavedSchedules() {
    const savedScheduleText = localStorage.getItem("timeTrackSchedules");

    if (savedScheduleText === null) {
        return;
    }

    const savedSchedules = JSON.parse(savedScheduleText);
    scheduleList.innerHTML = "";

    savedSchedules.forEach(function (savedSchedule) {
        let lineColourClass = "";
        let dotColourClass = "";
        let nameColourClass = "";

        if (savedSchedule.colour !== "purple") {
            lineColourClass = savedSchedule.colour + "-line";
            dotColourClass = savedSchedule.colour + "-dot";
            nameColourClass = savedSchedule.colour + "-name";
        }

        const savedScheduleRow = document.createElement("div");
        savedScheduleRow.className = "schedule-row";
        savedScheduleRow.innerHTML = `
            <p class="schedule-time">${savedSchedule.startTime}</p>
            <div class="schedule-line ${lineColourClass}">
                <span class="schedule-dot ${dotColourClass}"></span>
            </div>
            <div class="schedule-card ${savedSchedule.colour}-schedule">
                <p class="schedule-name ${nameColourClass}">${savedSchedule.name}</p>
                <p class="schedule-hours">${savedSchedule.hours}</p>
                <button class="edit-schedule-button" type="button">Edit</button>
                <button class="delete-schedule-button" type="button">Delete</button>
            </div>
        `;

        scheduleList.appendChild(savedScheduleRow);
    });
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
        saveSchedules();
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
            saveSchedules();
        }
    });
}

loadSavedSchedules();

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
    saveSchedules();
});
