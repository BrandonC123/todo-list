const task = (title, description, dueDate, priority) => {
    function getTitle() {
        return title;
    }
    function getDescription() {
        return description;
    }
    function getDueDate() {
        return dueDate;
    }
    function getPriority() {
        return priority;
    }
    return {
        getTitle,
        getDescription,
        getDueDate,
        getPriority,
    };
};

const elementHandler = (() => {
    let taskList = [];
    let taskCount = 0;
    function createTask(id) {
        const title = document.getElementById("popup-title").value;
        const description = document.getElementById("popup-descr").value;
        const date = document.getElementById("popup-date").value;
        const priority = document.getElementById("popup-priority").value;
        console.log(title);
        console.log(date);
        console.log(description);
        console.log(priority);
        const newTask = task(title, description, date, priority);
        taskList.push(newTask);
        console.log(taskList[0].getDueDate());
        elementCreation.togglePopUp();
        localStorage.setItem("task-list", description);
        // create task with construct, add to array
    }
    try {
        console.log(localStorage.getItem("task-list") + " local storage");
    } catch (e) {
        console.log("empty");
    }
    return {
        createTask,
        taskList,
        taskCount,
    };
})();

const elementCreation = (() => {
    const todayCont = document.getElementById("today-container");

    function createTask() {
        elementHandler.taskCount++;
        const taskId = elementHandler.taskCount;
        const task = document.createElement("div");
        task.setAttribute("id", "task-" + taskId);
        task.classList.add("task");

        const taskTitle = document.createElement("input");
        taskTitle.setAttribute("id", "task-title-" + taskId);
        taskTitle.type = "text";
        taskTitle.placeholder = "Title";

        const calendar = document.createElement("input");
        calendar.setAttribute("id", "calendar-" + taskId);
        calendar.type = "date";
        calendar = "2022-05-03";

        const taskActions = document.createElement("div");
        taskActions.setAttribute("id", "task-actions-" + taskId);
        taskActions.classList.add("task-actions");
        const checkBtn = document.createElement("button");
        checkBtn.setAttribute("id", "check-" + taskId);
        checkBtn.classList.add("check-btn");
        checkBtn.textContent = "✔";
        const xBtn = document.createElement("button");
        xBtn.setAttribute("id", "x-" + taskId);
        xBtn.classList.add("x-btn");
        xBtn.textContent = "X";
        taskActions.appendChild(checkBtn);
        taskActions.appendChild(xBtn);

        task.appendChild(taskTitle);
        task.appendChild(calendar);
        task.appendChild(taskActions);
        todayCont.appendChild(task);
        console.log(taskId);
        checkBtn.addEventListener("click", function () {
            elementHandler.createTask(taskId);
        });
    }
    function toggleEdit(id) {}
    function togglePopUp() {
        document.querySelector(".popup").classList.toggle("hide");
    }
    document.querySelector("#today-btn").addEventListener("click", createTask);
    document.querySelector(".x-btn").addEventListener("click", togglePopUp);
    document
        .querySelector("#create-btn")
        .addEventListener("click", togglePopUp);
    document.getElementById("create-task").onclick = function () {
        elementHandler.createTask();
    };
    return {
        createTask,
        togglePopUp,
    };
})();
