const { differenceInCalendarDays } = require("date-fns");

const projectHandler = (() => {
    let projectList = [];
    try {
        console.log(JSON.parse(localStorage.getItem("project-list") || "[]"));
        projectList = JSON.parse(localStorage.getItem("project-list") || "[]");
        // localStorage.removeItem("task-list");
    } catch (e) {
        console.log("empty");
    }
    let projectCount =
        projectList.length != 0
            ? JSON.parse(projectList[projectList.length - 1].projectId)
            : 0;
    function createProject() {
        const title = document.getElementById("project-popup-title").value;
        const description = document.getElementById(
            "project-popup-descr"
        ).value;
        const date = document.getElementById("project-popup-date").value;
        let tasks = [
            {
                title: "task title",
                description: "des",
                date: "2022-05-28",
                priority: "high",
                taskId: 2,
            },
        ];
        projectCount++;
        const project = {
            title: title,
            description: description,
            dueDate: date,
            tasks: tasks,
            projectId: projectCount,
        };
        projectList.push(project);
        localStorage.setItem("project-list", JSON.stringify(projectList));
        return project;
    }
    return {
        createProject,
    }
})();

const taskHandler = (() => {
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
        return newTask;
    }
    function editTask(id) {
        const title = document.getElementById("edit-popup-title").value;
        const description = document.getElementById("edit-popup-descr").value;
        const date = document.getElementById("edit-popup-date").value;
        const priority = document.getElementById("edit-popup-priority").value;
        const updatedTask = {
            title: title,
            description: description,
            date: date,
            priority: priority,
            taskId: getTaskById(id).taskObj.taskId,
        };
        console.log(updatedTask);
        const index = getTaskById(id).index;
        taskList[index] = updatedTask;
        displayHandler.togglePopUp("edit");
        console.log(taskList);
        localStorage.setItem("task-list", JSON.stringify(taskList));
        displayHandler.clearContainers();
        displayHandler.displayAllTasks();
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
    function deleteTask(index) {
        taskList.splice(index, 1);
        displayHandler.clearContainers();
        localStorage.setItem("task-list", JSON.stringify(taskList));
        displayHandler.displayAllTasks();
        console.log(taskList);
    }
    function getUpcoming(inputDate) {
        let today = new Date();
        let testDate = new Date(inputDate);
        let result = differenceInCalendarDays(testDate, today);
        return result <= 7 && result >= 0 ? true : false;
    }
    return {
        createTask,
        taskList,
        taskCount,
        today,
        getTaskById,
        editTask,
        deleteTask,
        getUpcoming,
    };
})();

const displayHandler = (() => {
    let activeId;
    function togglePopUp(action) {
        if (action === "create") {
            document.querySelector(".popup").classList.toggle("hide");
        }
        if (action === "edit") {
            document.querySelector(".edit-popup").classList.toggle("hide");
        }
        if (action === "create-project") {
            document.querySelector(".project-popup").classList.toggle("hide");
        }
        if (action === "close") {
            document.querySelector(".popup").classList.add("hide");
            document.querySelector(".edit-popup").classList.add("hide");
            document.querySelector(".project-popup").classList.add("hide");
        }
    }
    function displayTask(inputTask, container, newTask) {
        let taskId = inputTask.taskId;
        const task = document.createElement("div");
        // task.setAttribute("id", "task-" + taskId);
        task.classList.add("task");

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";

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

        const deleteBtn = document.createElement("a");
        // delete.setAttribute("id", "delete-" + taskId);
        deleteBtn.classList.add("danger-text");
        deleteBtn.classList.add("delete-" + taskId);
        deleteBtn.textContent = "Delete";
        deleteBtn.href = "#";

        task.appendChild(checkBox);
        task.appendChild(taskTitle);
        task.appendChild(calendar);
        task.appendChild(prioritySquare);
        task.appendChild(edit);
        task.appendChild(deleteBtn);
        // console.log(document.querySelector("edit-" + taskId));
        if (inputTask.date.toString() === taskHandler.today.toString()) {
            document
                .querySelector("#today-container")
                .appendChild(task.cloneNode(true));
        }
        if (taskHandler.getUpcoming(inputTask.date)) {
            document
                .querySelector(".upcoming")
                .appendChild(task.cloneNode(true));
        }
        if (container === ".all-todos" || newTask) {
            const todoContainers = document.querySelectorAll(".all-todos");
            todoContainers.forEach((todoContainer) => {
                todoContainer.appendChild(task.cloneNode(true));
            });
        }
        const editBtns = document.querySelectorAll(".edit-" + taskId);
        editBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                fillEditPopup(taskId);
            });
        });
        const deleteBtns = document.querySelectorAll(".delete-" + taskId);
        deleteBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                taskHandler.deleteTask(taskHandler.getTaskById(taskId).index);
            });
        });
    }
    function fillEditPopup(id) {
        const task = taskHandler.getTaskById(id).taskObj;
        console.log(taskHandler.getTaskById(id));
        activeId = task.taskId;
        document.querySelector(".edit-popup").classList.toggle("hide");
        document.getElementById("edit-popup-title").value = task.title;
        document.getElementById("edit-popup-date").value = task.date;
        document.getElementById("edit-popup-descr").value = task.description;
        document.getElementById("edit-popup-priority").value = task.priority;
    }
    function displayAllTasks() {
        taskHandler.taskList.forEach((element) => {
            taskHandler.taskCount++;
            displayTask(element, ".all-todos");
        });
    }
    function clearContainers() {
        const todoContainers = document.querySelectorAll(".all-todos");
        todoContainers.forEach((todoContainer) => {
            todoContainer.innerHTML = "";
        });
        document.getElementById("today-container").innerHTML = "";
        document.querySelector(".upcoming").innerHTML = "";
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
    const closeBtns = document.querySelectorAll(".x-btn");
    closeBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            togglePopUp("close");
        });
    });
    document
        .querySelector("#create-btn")
        .addEventListener("click", function () {
            togglePopUp("create");
        });
    document.getElementById("create-task").onclick = function () {
        taskHandler.createTask();
        displayHandler.displayTask(newTask, ".all-todos", true);
        taskList.push(newTask);
        displayHandler.togglePopUp("create");
        localStorage.setItem("task-list", JSON.stringify(taskList));
        document.getElementById("popup-form").reset();
    };
    document.getElementById("edit-task").onclick = function () {
        taskHandler.editTask(activeId);
    };
    document
        .getElementById("new-project")
        .addEventListener("click", function () {
            togglePopUp("create-project");
        });
    document
        .getElementById("create-project")
        .addEventListener("click", function () {
            const projectTitle = document.createElement("li");
            projectTitle.textContent = projectHandler.createProject().title;
            document.querySelector(".project-tab").appendChild(projectTitle);
        });
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
        displayAllTasks,
        clearContainers,
    };
})();
