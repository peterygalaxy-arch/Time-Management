let focusMinutes = 25;
let timeLeft = focusMinutes * 60;
let timerRunning = false;
let timerInterval;

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
        showTime();
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
    showTime();
    timerMessage.textContent = "Start focusing!";
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
    showTime();
    timerMessage.textContent = "Timer set to " + focusMinutes + " minutes";
    timerOptions.classList.remove("open");
});

cancelTimeButton.addEventListener("click", function () {
    focusMinutesInput.value = focusMinutes;
    timerOptions.classList.remove("open");
});

showTime();

const taskList = document.getElementById("task-list");
const addTaskButton = document.getElementById("add-task-button");
const taskTotal = document.getElementById("task-total");
const taskCompleted = document.getElementById("task-completed");

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
}

function listenToCheckbox(checkbox) {
    checkbox.addEventListener("change", function () {
        updateTaskSummary();
    });
}

const firstCheckboxes = taskList.querySelectorAll("input[type='checkbox']");

firstCheckboxes.forEach(function (checkbox) {
    listenToCheckbox(checkbox);
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
        </div>
    `;

    taskList.appendChild(newTask);

    const newCheckbox = newTask.querySelector("input[type='checkbox']");
    listenToCheckbox(newCheckbox);
    updateTaskSummary();
});

updateTaskSummary();
