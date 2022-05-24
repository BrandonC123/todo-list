const elementHandler = (() => {
    let taskList = [];
    try {
        console.log(JSON.parse(localStorage.getItem("task-list") || "[]"));
        taskList = JSON.parse(localStorage.getItem("task-list") || "[]");
        // localStorage.removeItem("task-list");
    } catch (e) {
        console.log("empty");
    }
    let taskCount =
        taskList.length != 0
            ? JSON.parse(taskList[taskList.length - 1].taskId)
            : 0;
    let today = new Date()
        .toLocaleString("sv", { timeZoneName: "short" })
        .slice(0, 10);
    function createTask() {
        const title = document.getElementById("popup-title").value;
        const description = document.getElementById("popup-descr").value;
        const date = document.getElementById("popup-date").value;
        const priority = document.getElementById("popup-priority").value;
        taskCount++;
        const newTask = {
            title: title,
            description: description,
            date: date,
            priority: priority,
            taskId: taskCount,
        };
        console.log(newTask);
        elementCreation.displayTask(newTask, ".all-todos", true);
        taskList.push(newTask);
        elementCreation.togglePopUp();
        localStorage.setItem("task-list", JSON.stringify(taskList));
        document.getElementById("popup-form").reset();
    }
    function getTaskById(id) {
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].taskId == id) {
                const task = {
                    taskObj: taskList[i],
                    index: i,
                };
                return task;
            }
        }
    }
    return {
        createTask,
        taskList,
        taskCount,
        today,
        getTaskById,
    };
})();

const elementCreation = (() => {
    const todayCont = document.getElementById("today-container");
    function toggleEdit(id) {}
    function togglePopUp() {
        document.querySelector(".popup").classList.toggle("hide");
        document.querySelector(".edit-popup").classList.toggle("hide");
    }
    function displayTask(inputTask, container, newTask) {
        let taskId = inputTask.taskId;
        const task = document.createElement("div");
        // task.setAttribute("id", "task-" + taskId);
        task.classList.add("task");

        const taskTitle = document.createElement("input");
        // taskTitle.setAttribute("id", "task-title-" + taskId);
        taskTitle.type = "text";
        taskTitle.placeholder = "Title";
        taskTitle.value = inputTask.title;

        const calendar = document.createElement("input");
        // calendar.setAttribute("id", "calendar-" + taskId);
        calendar.type = "date";
        calendar.value = inputTask.date;

        const prioritySquare = document.createElement("div");
        prioritySquare.classList.add("priority-square");
        prioritySquare.style.backgroundColor = getPriorityColor(
            inputTask.priority.toString()
        );

        const edit = document.createElement("a");
        // edit.setAttribute("id", "edit-" + taskId);
        edit.classList.add("accent-text");
        edit.classList.add("edit-" + taskId);
        edit.textContent = "Edit";
        edit.href = "#";

        task.appendChild(taskTitle);
        task.appendChild(calendar);
        task.appendChild(prioritySquare);
        task.appendChild(edit);
        // console.log(document.querySelector("edit-" + taskId));
        if (container === ".all-todos" || newTask) {
            const todoContainers = document.querySelectorAll(".all-todos");
            todoContainers.forEach((todoContainer) => {
                todoContainer.appendChild(task.cloneNode(true));
            });
        }
        if (inputTask.date.toString() === elementHandler.today.toString()) {
            document
                .querySelector("#today-container")
                .appendChild(task.cloneNode(true));
        }
        const editBtns = document.querySelectorAll(".edit-" + taskId);
        editBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                fillEditPopup(taskId);
            });
        });
    }
    function fillEditPopup(id) {
        const task = elementHandler.getTaskById(id).taskObj;
        console.log(elementHandler.getTaskById(id));
        document.querySelector(".edit-popup").classList.toggle("hide");
        document.getElementById("edit-popup-title").value = task.title;
        document.getElementById("edit-popup-date").value = task.date;
        document.getElementById("edit-popup-descr").value = task.description;
        document.getElementById("edit-popup-priority").value = task.priority;
    }
    function displayAllTasks() {
        elementHandler.taskList.forEach((element) => {
            elementHandler.taskCount++;
            displayTask(element, ".all-todos");
        });
    }
    function getPriorityColor(priority) {
        if (priority === "high") {
            return "#C40233";
        }
        if (priority === "med") {
            return "#FED000";
        } else {
            return "#48A14D";
        }
    }
    document.querySelector(".x-btn").addEventListener("click", togglePopUp);
    document
        .querySelector("#create-btn")
        .addEventListener("click", togglePopUp);
    document.getElementById("create-task").onclick = function () {
        elementHandler.createTask();
    };

    document.getElementById("todo-page-btn").onclick = function () {
        document.querySelector(".home-page").classList.add("hide");
        document.querySelector(".todo-page").classList.remove("hide");
    };
    document.getElementById("home-page-btn").onclick = function () {
        document.querySelector(".todo-page").classList.add("hide");
        document.querySelector(".home-page").classList.remove("hide");
    };
    displayAllTasks();
    return {
        togglePopUp,
        displayTask,
    };
})();

/*
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
*/
