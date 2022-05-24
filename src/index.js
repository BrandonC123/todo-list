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
        elementCreation.togglePopUp("create");
        localStorage.setItem("task-list", JSON.stringify(taskList));
        document.getElementById("popup-form").reset();
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
            taskId: taskCount,
        };
        console.log(updatedTask);
        const index = getTaskById(id).index;
        taskList[index] = updatedTask;
        elementCreation.togglePopUp("edit");
        console.log(taskList);
        localStorage.setItem("task-list", JSON.stringify(taskList));
        elementCreation.clearContainers();
        elementCreation.displayAllTasks();
        // document.getElementById("edit-popup-form").reset();
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
        elementCreation.clearContainers();
        localStorage.setItem("task-list", JSON.stringify(taskList));
        console.log(taskList);
    }
    return {
        createTask,
        taskList,
        taskCount,
        today,
        getTaskById,
        editTask,
        deleteTask,
    };
})();

const elementCreation = (() => {
    let activeId;
    function togglePopUp(action) {
        if (action === "create") {
            document.querySelector(".popup").classList.toggle("hide");
        }
        if (action === "edit") {
            document.querySelector(".edit-popup").classList.toggle("hide");
        }
        if (action === "close") {
            document.querySelector(".popup").classList.add("hide");
            document.querySelector(".edit-popup").classList.add("hide");
        }
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

        const deleteBtn = document.createElement("a");
        // delete.setAttribute("id", "delete-" + taskId);
        deleteBtn.classList.add("danger-text");
        deleteBtn.classList.add("delete-" + taskId);
        deleteBtn.textContent = "Delete";
        deleteBtn.href = "#";

        task.appendChild(taskTitle);
        task.appendChild(calendar);
        task.appendChild(prioritySquare);
        task.appendChild(edit);
        task.appendChild(deleteBtn);
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
        const deleteBtns = document.querySelectorAll(".delete-" + taskId);
        deleteBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                elementHandler.deleteTask(
                    elementHandler.getTaskById(taskId).index
                );
            });
        });
    }
    function fillEditPopup(id) {
        const task = elementHandler.getTaskById(id).taskObj;
        console.log(elementHandler.getTaskById(id));
        activeId = task.taskId;
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
    function clearContainers() {
        const todoContainers = document.querySelectorAll(".all-todos");
        todoContainers.forEach((todoContainer) => {
            todoContainer.innerHTML = "";
        });
        document.getElementById("today-container").innerHTML = "";
        elementCreation.displayAllTasks();
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
        elementHandler.createTask();
    };
    document.getElementById("edit-task").onclick = function () {
        elementHandler.editTask(activeId);
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
        displayAllTasks,
        clearContainers,
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
