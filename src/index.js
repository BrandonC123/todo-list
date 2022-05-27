const { differenceInCalendarDays } = require("date-fns");

const projectHandler = (() => {
    let projectList = [];
    try {
        console.log(JSON.parse(localStorage.getItem("project-list") || "[]"));
        projectList = JSON.parse(localStorage.getItem("project-list") || "[]");
        // localStorage.removeItem("project-list");
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
        let tasks = [];
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
        displayHandler.displayProject(project, projectList.length - 1);
        return project;
    }
    function addTaskToProject(index, task) {
        projectList[index].tasks.push(task);
        localStorage.setItem("project-list", JSON.stringify(projectList));
    }
    return {
        createProject,
        projectList,
        addTaskToProject,
    };
})();

const taskHandler = (() => {
    let taskList = [];
    let taskCount = 0;
    try {
        console.log(JSON.parse(localStorage.getItem("task-list") || "[]"));
        taskList = JSON.parse(localStorage.getItem("task-list") || "[]");
        taskCount = localStorage.getItem("task-count");
        // localStorage.removeItem("task-count");
    } catch (e) {
        console.log("empty");
    }

    let today = new Date()
        .toLocaleString("sv", { timeZoneName: "short" })
        .slice(0, 10);
    function createTask() {
        const title = document.getElementById("popup-title").value;
        const description = document.getElementById("popup-descr").value;
        const date = document.getElementById("popup-date").value;
        const priority = document.getElementById("popup-priority").value;
        const projectIndex = document.getElementById("project-options").value;
        taskCount++;
        localStorage.setItem("task-count", taskCount);
        console.log(taskCount);
        const newTask = {
            title: title,
            description: description,
            date: date,
            priority: priority,
            taskId: taskCount,
        };
        console.log(newTask);
        if (projectIndex === "") {
            console.log("regular task");
            return newTask;
        } else {
            projectHandler.addTaskToProject(projectIndex, newTask);
        }
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
        task.classList.add("task");

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";

        const taskTitle = document.createElement("input");
        taskTitle.type = "text";
        taskTitle.placeholder = "Title";
        taskTitle.value = inputTask.title;

        const calendar = document.createElement("input");
        calendar.type = "date";
        calendar.value = inputTask.date;

        const prioritySquare = document.createElement("div");
        prioritySquare.classList.add("priority-square");
        prioritySquare.style.backgroundColor = getPriorityColor(
            inputTask.priority.toString()
        );

        const edit = document.createElement("a");
        edit.classList.add("accent-text");
        edit.classList.add("edit-" + taskId);
        edit.textContent = "Edit";
        edit.href = "#";

        const deleteBtn = document.createElement("a");
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
            displayTask(element, ".all-todos");
        });
        console.log(taskHandler.taskCount);
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
    function fillProjectDropdown() {
        const dropdown = document.getElementById("project-options");
        let projectList = projectHandler.projectList;
        for (let i = 0; i < projectList.length; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.text = projectList[i].title;
            dropdown.appendChild(option);
        }
    }
    function displayProject(inputProject, index) {
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project-row");
        const a = document.createElement("a");
        a.classList.add("project-link-" + index);
        a.href = "#";
        a.textContent = inputProject.title;

        // const deleteBtn = document.createElement("a");
        // deleteBtn.classList.add("danger-text");
        // deleteBtn.classList.add("delete-project-" + index);
        // deleteBtn.textContent = "Delete";
        // deleteBtn.href = "#";

        projectDiv.appendChild(a);
        // projectDiv.appendChild(deleteBtn)
        const projectContainers = document.querySelectorAll(".all-projects");
        projectContainers.forEach((projectContainer) => {
            projectContainer.appendChild(projectDiv.cloneNode(true));
        });
        const projectLinks = document.querySelectorAll(
            ".project-link-" + index
        );
        projectLinks.forEach((link) => {
            link.addEventListener("click", function () {
                displayProjectTasks(index);
            });
        });
    }
    function displayAllProjects() {
        const projects = projectHandler.projectList;
        for (let i = 0; i < projects.length; i++) {
            displayProject(projects[i], i);
        }
    }
    function displayProjectTasks(index) {
        const projecTaskContainer = document.querySelector(".project-tasks");
        const projectTasks = projectHandler.projectList[index].tasks;
        for (let i = 0; i < projectTasks.length; i++) {
            console.log(projectTasks[i]);
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
            fillProjectDropdown();
        });
    document
        .getElementById("create-task")
        .addEventListener("click", function () {
            let newTask = taskHandler.createTask();
            if (newTask != null) {
                displayHandler.displayTask(newTask, ".all-todos", true);
                taskHandler.taskList.push(newTask);
                localStorage.setItem(
                    "task-list",
                    JSON.stringify(taskHandler.taskList)
                );
            }
            displayHandler.togglePopUp("close");
            document.getElementById("popup-form").reset();
        });
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
            togglePopUp("close");
        });

    const tabs = document.querySelectorAll(".tab");
    const pages = document.querySelectorAll(".page");
    tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            for (let i = 0; i < tabs.length; i++) {
                if (tab === tabs[i]) {
                    pages[i].classList.remove("hide");
                } else {
                    pages[i].classList.add("hide");
                }
            }
        });
    });
    displayAllTasks();
    displayAllProjects();
    return {
        togglePopUp,
        displayTask,
        displayAllTasks,
        clearContainers,
        displayProject,
    };
})();
