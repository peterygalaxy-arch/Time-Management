const savedJsonKeys = ["timeTrackFocusTimer", "timeTrackWebsiteSettings", "timeTrackStreak", "timeTrackTasks", "timeTrackSchedules"];
savedJsonKeys.forEach(function (savedKey) {
    try {
        const savedValue = JSON.parse(localStorage.getItem(savedKey));
        const needsArray = savedKey === "timeTrackTasks" || savedKey === "timeTrackSchedules";
        if (savedValue !== null && (typeof savedValue !== "object" || (needsArray && Array.isArray(savedValue) === false))) {
            localStorage.removeItem(savedKey);
        }
    } catch (error) {
        localStorage.removeItem(savedKey);
    }
});

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
const profileBox = document.getElementById("profile-box");
const profileNameInput = document.getElementById("profile-name-input");
const profileError = document.getElementById("profile-error");
const saveProfileButton = document.getElementById("save-profile-button");
const cancelProfileButton = document.getElementById("cancel-profile-button");
const resetProfileButton = document.getElementById("reset-profile-button");
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

function loadProfileName() {
    const savedName = localStorage.getItem("timeTrackProfileName");

    if (savedName !== null && savedName.trim() !== "") {
        profileName = savedName;
    }
}

function closeProfileBox() {
    profileBox.classList.remove("open");
    profileError.textContent = "";
}

profileAvatar.addEventListener("click", function () {
    if (profileBox.classList.contains("open")) {
        closeProfileBox();
        return;
    }

    profileNameInput.value = profileName;
    profileError.textContent = "";
    profileBox.classList.add("open");
    profileNameInput.focus();
});

saveProfileButton.addEventListener("click", function () {
    const newName = profileNameInput.value.trim();

    if (newName === "") {
        profileError.textContent = "Please enter a name.";
        return;
    }

    profileName = newName;
    localStorage.setItem("timeTrackProfileName", profileName);
    showProfileName();
    closeProfileBox();
});

cancelProfileButton.addEventListener("click", function () {
    profileNameInput.value = profileName;
    closeProfileBox();
});

resetProfileButton.addEventListener("click", function () {
    const shouldReset = confirm("Change the profile name back to Alex?");

    if (shouldReset === false) {
        return;
    }

    profileName = "Alex";
    localStorage.removeItem("timeTrackProfileName");
    showProfileName();
    closeProfileBox();
});

profileNameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        saveProfileButton.click();
    }

    if (event.key === "Escape") {
        cancelProfileButton.click();
    }
});

showGreeting();
showCurrentDate();
loadProfileName();
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
        Number.isInteger(savedTimer.focusMinutes) &&
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

    if (newMinutes < 1 || newMinutes > 60 || Number.isInteger(newMinutes) === false) {
        timerMessage.textContent = "Use whole minutes, 1-60.";
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
const settingsPanel = document.getElementById("settings-panel");
const showCompletedSetting = document.getElementById("show-completed-setting");
const confirmDeleteSetting = document.getElementById("confirm-delete-setting");
const saveSettingsButton = document.getElementById("save-settings-button");
const resetWebsiteButton = document.getElementById("reset-website-button");
const settingsMessage = document.getElementById("settings-message");
const taskForm = document.getElementById("task-form");
const newTaskNameInput = document.getElementById("new-task-name");
const newTaskTimeInput = document.getElementById("new-task-time");
const newTaskPriorityInput = document.getElementById("new-task-priority");
const taskFormError = document.getElementById("task-form-error");
const saveTaskButton = document.getElementById("save-task-button");
const cancelTaskButton = document.getElementById("cancel-task-button");
let dailyGoal = 4;
let taskFilter = "all";
let streakCount = 0;
let lastStreakDate = "";
let showCompletedTasks = true;
let confirmBeforeDelete = true;
let editingTaskRow = null;

function loadWebsiteSettings() {
    const savedSettingsText = localStorage.getItem("timeTrackWebsiteSettings");

    if (savedSettingsText === null) {
        return;
    }

    const savedSettings = JSON.parse(savedSettingsText);

    if (typeof savedSettings.showCompletedTasks === "boolean") {
        showCompletedTasks = savedSettings.showCompletedTasks;
    }

    if (typeof savedSettings.confirmBeforeDelete === "boolean") {
        confirmBeforeDelete = savedSettings.confirmBeforeDelete;
    }

    showCompletedSetting.checked = showCompletedTasks;
    confirmDeleteSetting.checked = confirmBeforeDelete;
}

function saveWebsiteSettings() {
    const websiteSettings = {
        showCompletedTasks: showCompletedTasks,
        confirmBeforeDelete: confirmBeforeDelete
    };

    localStorage.setItem("timeTrackWebsiteSettings", JSON.stringify(websiteSettings));
}

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

        if (showCompletedTasks === false && checkbox.checked) {
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
        let savedPriority = savedTask.priority;

        if (savedPriority !== "high" && savedPriority !== "medium" && savedPriority !== "low") {
            savedPriority = "low";
        }

        const priorityText = savedPriority.charAt(0).toUpperCase() + savedPriority.slice(1);

        if (savedTask.completed) {
            savedTaskRow.className = "task-row completed-task";
        } else {
            savedTaskRow.className = "task-row";
        }

        savedTaskRow.innerHTML = `
            <div class="task-name">
                <input type="checkbox" id="saved-task-${taskNumber}">
                <label for="saved-task-${taskNumber}"></label>
            </div>
            <div class="task-details">
                <span class="priority"></span>
                <span class="task-time"></span>
                <button class="edit-task-button" type="button">Edit</button>
                <button class="delete-task-button" type="button">Delete</button>
            </div>
        `;

        savedTaskRow.querySelector("input[type='checkbox']").checked = savedTask.completed === true;
        savedTaskRow.querySelector("label").textContent = savedTask.name;
        savedTaskRow.querySelector(".priority").classList.add(savedPriority);
        savedTaskRow.querySelector(".priority").textContent = priorityText;
        savedTaskRow.querySelector(".task-time").textContent = savedTask.time;

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

saveSettingsButton.addEventListener("click", function () {
    showCompletedTasks = showCompletedSetting.checked;
    confirmBeforeDelete = confirmDeleteSetting.checked;
    saveWebsiteSettings();
    filterTasks();
    settingsMessage.textContent = "Settings saved.";

    setTimeout(function () {
        settingsMessage.textContent = "";
    }, 2000);
});

resetWebsiteButton.addEventListener("click", function () {
    const shouldReset = confirm("Reset all website data?");

    if (shouldReset) {
        localStorage.clear();
        window.location.reload();
    }
});

function listenToCheckbox(checkbox) {
    checkbox.addEventListener("change", function () {
        updateTaskSummary();
        saveTasks();
    });
}

function listenToEditButton(editButton) {
    editButton.addEventListener("click", function () {
        editingTaskRow = editButton.closest(".task-row");
        newTaskNameInput.value = editingTaskRow.querySelector("label").textContent;
        newTaskTimeInput.value = displayTimeForInput(
            editingTaskRow.querySelector(".task-time").textContent
        );
        newTaskPriorityInput.value = editingTaskRow.querySelector(".priority").textContent.toLowerCase();
        saveTaskButton.textContent = "Save changes";
        taskFormError.textContent = "";
        taskForm.classList.add("open");
        newTaskNameInput.focus();
    });
}

function listenToDeleteButton(deleteButton) {
    deleteButton.addEventListener("click", function () {
        const taskRow = deleteButton.closest(".task-row");
        const taskLabel = taskRow.querySelector("label");
        let shouldDelete = true;

        if (confirmBeforeDelete) {
            shouldDelete = confirm("Delete " + taskLabel.textContent + "?");
        }

        if (shouldDelete) {
            taskRow.remove();
            updateTaskSummary();
            saveTasks();
        }
    });
}

loadWebsiteSettings();
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

function closeTaskForm() {
    taskForm.classList.remove("open");
    newTaskNameInput.value = "";
    newTaskTimeInput.value = "";
    newTaskPriorityInput.value = "low";
    taskFormError.textContent = "";
    saveTaskButton.textContent = "Add task";
    editingTaskRow = null;
}

function formatTaskTime(timeValue) {
    const timeParts = timeValue.split(":");
    let hour = Number(timeParts[0]);
    const minutes = timeParts[1];
    let period = "AM";

    if (hour >= 12) {
        period = "PM";
    }

    if (hour === 0) {
        hour = 12;
    } else if (hour > 12) {
        hour = hour - 12;
    }

    return hour + ":" + minutes + " " + period;
}

function timeTextToMinutes(timeText) {
    const timeParts = timeText.trim().split(/[: ]/);
    let hour = Number(timeParts[0]);
    const minutes = Number(timeParts[1]);
    const period = timeParts[2];

    if (period === "PM" && hour !== 12) {
        hour = hour + 12;
    } else if (period === "AM" && hour === 12) {
        hour = 0;
    }

    return hour * 60 + minutes;
}

function displayTimeForInput(timeText) {
    const totalMinutes = timeTextToMinutes(timeText);
    const hour = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
    const minutes = (totalMinutes % 60).toString().padStart(2, "0");
    return hour + ":" + minutes;
}

addTaskButton.addEventListener("click", function () {
    editingTaskRow = null;
    saveTaskButton.textContent = "Add task";
    taskForm.classList.add("open");
    taskFormError.textContent = "";
    newTaskNameInput.focus();
});

cancelTaskButton.addEventListener("click", function () {
    closeTaskForm();
});

saveTaskButton.addEventListener("click", function () {
    const taskName = newTaskNameInput.value.trim();
    const taskTime = newTaskTimeInput.value;
    const taskPriority = newTaskPriorityInput.value;

    if (taskName === "" || taskName.length > 50) {
        taskFormError.textContent = "Enter a task name from 1 to 50 characters.";
        newTaskNameInput.focus();
        return;
    }

    if (taskTime === "") {
        taskFormError.textContent = "Please choose a time.";
        newTaskTimeInput.focus();
        return;
    }

    if (editingTaskRow !== null) {
        const taskPriorityText = taskPriority.charAt(0).toUpperCase() + taskPriority.slice(1);
        editingTaskRow.querySelector("label").textContent = taskName;
        editingTaskRow.querySelector(".task-time").textContent = formatTaskTime(taskTime);
        editingTaskRow.querySelector(".priority").className = "priority " + taskPriority;
        editingTaskRow.querySelector(".priority").textContent = taskPriorityText;
        sortTasks();
        saveTasks();
        closeTaskForm();
        return;
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
            <label for="task-${newTaskNumber}"></label>
        </div>
        <div class="task-details">
            <span class="priority ${taskPriority}">${priorityText}</span>
            <span class="task-time"></span>
            <button class="edit-task-button" type="button">Edit</button>
            <button class="delete-task-button" type="button">Delete</button>
        </div>
    `;

    newTask.querySelector("label").textContent = taskName;
    newTask.querySelector(".task-time").textContent = formatTaskTime(taskTime);

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
    closeTaskForm();
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
    openCalendarView();
});

focusLink.addEventListener("click", function (event) {
    event.preventDefault();
    selectMenuLink(focusLink);
    timerPanel.scrollIntoView();
});

settingsLink.addEventListener("click", function (event) {
    event.preventDefault();
    selectMenuLink(settingsLink);
    settingsPanel.scrollIntoView();
});

const scheduleList = document.getElementById("schedule-list");
const addScheduleButton = document.getElementById("add-schedule-button");
const emptyScheduleMessage = document.getElementById("empty-schedule-message");
const scheduleForm = document.getElementById("schedule-form");
const newScheduleNameInput = document.getElementById("new-schedule-name");
const newScheduleStartInput = document.getElementById("new-schedule-start");
const newScheduleEndInput = document.getElementById("new-schedule-end");
const newScheduleColourInput = document.getElementById("new-schedule-colour");
const scheduleFormError = document.getElementById("schedule-form-error");
const saveScheduleButton = document.getElementById("save-schedule-button");
const cancelScheduleButton = document.getElementById("cancel-schedule-button");
const calendarLink = document.getElementById("calendar-link");
const calendarDate = document.getElementById("calendar-date");
const calendarCount = document.getElementById("calendar-count");
const calendarItems = document.getElementById("calendar-items");
let editingScheduleRow = null;

function updateCalendarView() {
    const scheduleRows = scheduleList.querySelectorAll(".schedule-row");
    const today = new Date();
    const dateOptions = {
        weekday: "long",
        month: "long",
        day: "numeric"
    };

    calendarDate.textContent = today.toLocaleDateString("en-NZ", dateOptions);
    calendarItems.innerHTML = "";

    if (scheduleRows.length === 1) {
        calendarCount.textContent = "1 plan today";
    } else {
        calendarCount.textContent = scheduleRows.length + " plans today";
    }

    if (scheduleRows.length === 0) {
        const emptyCalendar = document.createElement("p");
        emptyCalendar.className = "calendar-empty";
        emptyCalendar.textContent = "Nothing is planned for today.";
        calendarItems.appendChild(emptyCalendar);
        return;
    }

    scheduleRows.forEach(function (scheduleRow) {
        const calendarItem = document.createElement("div");
        const itemTime = document.createElement("p");
        const itemName = document.createElement("p");

        calendarItem.className = "calendar-item";
        itemTime.className = "calendar-item-time";
        itemName.className = "calendar-item-name";
        itemTime.textContent = scheduleRow.querySelector(".schedule-hours").textContent;
        itemName.textContent = scheduleRow.querySelector(".schedule-name").textContent;

        calendarItem.appendChild(itemTime);
        calendarItem.appendChild(itemName);
        calendarItems.appendChild(calendarItem);
    });
}

function openCalendarView() {
    updateCalendarView();
    schedulePanel.classList.add("calendar-mode");
    calendarLink.textContent = "Back to Schedule";
}

function closeCalendarView() {
    schedulePanel.classList.remove("calendar-mode");
    calendarLink.textContent = "View Calendar";
}

calendarLink.addEventListener("click", function (event) {
    event.preventDefault();

    if (schedulePanel.classList.contains("calendar-mode")) {
        closeCalendarView();
    } else {
        openCalendarView();
    }
});

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
        let savedColour = savedSchedule.colour;
        let lineColourClass = "";
        let dotColourClass = "";
        let nameColourClass = "";

        if (
            savedColour !== "purple" &&
            savedColour !== "green" &&
            savedColour !== "orange" &&
            savedColour !== "pink" &&
            savedColour !== "blue"
        ) {
            savedColour = "purple";
        }

        if (savedColour !== "purple") {
            lineColourClass = savedColour + "-line";
            dotColourClass = savedColour + "-dot";
            nameColourClass = savedColour + "-name";
        }

        const savedScheduleRow = document.createElement("div");
        savedScheduleRow.className = "schedule-row";
        savedScheduleRow.innerHTML = `
            <p class="schedule-time"></p>
            <div class="schedule-line ${lineColourClass}">
                <span class="schedule-dot ${dotColourClass}"></span>
            </div>
            <div class="schedule-card ${savedColour}-schedule">
                <p class="schedule-name ${nameColourClass}"></p>
                <p class="schedule-hours"></p>
                <button class="edit-schedule-button" type="button">Edit</button>
                <button class="delete-schedule-button" type="button">Delete</button>
            </div>
        `;

        savedScheduleRow.querySelector(".schedule-time").textContent = savedSchedule.startTime;
        savedScheduleRow.querySelector(".schedule-name").textContent = savedSchedule.name;
        savedScheduleRow.querySelector(".schedule-hours").textContent = savedSchedule.hours;

        scheduleList.appendChild(savedScheduleRow);
    });
}

function listenToScheduleEditButton(editButton) {
    editButton.addEventListener("click", function () {
        editingScheduleRow = editButton.closest(".schedule-row");
        const oldHours = editingScheduleRow.querySelector(".schedule-hours").textContent.split(" - ");
        const scheduleCard = editingScheduleRow.querySelector(".schedule-card");
        const scheduleColour = scheduleCard.classList[1].replace("-schedule", "");

        newScheduleNameInput.value = editingScheduleRow.querySelector(".schedule-name").textContent;
        newScheduleStartInput.value = displayTimeForInput(oldHours[0]);
        newScheduleEndInput.value = displayTimeForInput(oldHours[1]);
        newScheduleColourInput.value = scheduleColour;
        saveScheduleButton.textContent = "Save changes";
        scheduleForm.classList.add("open");
        newScheduleNameInput.focus();
    });
}

function listenToScheduleDeleteButton(deleteButton) {
    deleteButton.addEventListener("click", function () {
        const scheduleRow = deleteButton.closest(".schedule-row");
        const scheduleName = scheduleRow.querySelector(".schedule-name");
        let shouldDelete = true;

        if (confirmBeforeDelete) {
            shouldDelete = confirm("Delete " + scheduleName.textContent + "?");
        }

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
    scheduleForm.classList.add("open");
    scheduleFormError.textContent = "";
    newScheduleNameInput.focus();
});

function closeScheduleForm() {
    scheduleForm.classList.remove("open");
    newScheduleNameInput.value = "";
    newScheduleStartInput.value = "";
    newScheduleEndInput.value = "";
    newScheduleColourInput.value = "purple";
    scheduleFormError.textContent = "";
    saveScheduleButton.textContent = "Add schedule";
    editingScheduleRow = null;
}

cancelScheduleButton.addEventListener("click", function () {
    closeScheduleForm();
});

saveScheduleButton.addEventListener("click", function () {
    const scheduleName = newScheduleNameInput.value.trim();
    const startTime = newScheduleStartInput.value;
    const endTime = newScheduleEndInput.value;
    const scheduleColour = newScheduleColourInput.value;

    if (scheduleName === "" || scheduleName.length > 50) {
        scheduleFormError.textContent = "Enter a schedule name from 1 to 50 characters.";
        newScheduleNameInput.focus();
        return;
    }

    if (startTime === "" || endTime === "") {
        scheduleFormError.textContent = "Please choose a start and end time.";
        return;
    }

    if (endTime <= startTime) {
        scheduleFormError.textContent = "End time must be later than start time.";
        newScheduleEndInput.focus();
        return;
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
        <p class="schedule-time"></p>
        <div class="schedule-line ${lineColourClass}">
            <span class="schedule-dot ${dotColourClass}"></span>
        </div>
        <div class="schedule-card ${scheduleColour}-schedule">
            <p class="schedule-name ${nameColourClass}"></p>
            <p class="schedule-hours"></p>
            <button class="edit-schedule-button" type="button">Edit</button>
            <button class="delete-schedule-button" type="button">Delete</button>
        </div>
    `;

    const shownStartTime = formatTaskTime(startTime);
    const shownEndTime = formatTaskTime(endTime);
    newSchedule.querySelector(".schedule-time").textContent = shownStartTime;
    newSchedule.querySelector(".schedule-name").textContent = scheduleName;
    newSchedule.querySelector(".schedule-hours").textContent = shownStartTime + " - " + shownEndTime;

    if (editingScheduleRow === null) {
        scheduleList.appendChild(newSchedule);
    } else {
        editingScheduleRow.replaceWith(newSchedule);
    }

    const newEditButton = newSchedule.querySelector(".edit-schedule-button");
    const newDeleteButton = newSchedule.querySelector(".delete-schedule-button");
    listenToScheduleEditButton(newEditButton);
    listenToScheduleDeleteButton(newDeleteButton);
    updateScheduleMessage();
    saveSchedules();
    closeScheduleForm();
});
