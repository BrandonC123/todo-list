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
    let tasks = [];
    function getTaskValues(id) {
        tasks.push(id);
        console.log(document.getElementById("calendar-" + id).value);
        document.getElementById("task-actions-" + id).classList.add("hide")
        // create task with construct, add to array
    }
    return {
        getTaskValues,
        tasks,
    };
})();

const elementCreation = (() => {
    const todayCont = document.getElementById("today-container");

    function createTask() {
        const taskId = elementHandler.tasks.length + 1;
        const task = document.createElement("div");
        task.setAttribute("id", "task-" + taskId);
        task.classList.add("task");

        const taskTitle = document.createElement("input");
        taskTitle.setAttribute("id", "taskTitle-" + taskId);
        taskTitle.type = "text";
        taskTitle.value = "dummy text";

        const calendar = document.createElement("input");
        calendar.setAttribute("id", "calendar-" + taskId);
        calendar.type = "date";
        calendar.value = "2022-05-03"

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
        // elementHandler.getTaskValues(taskId);
        checkBtn.addEventListener("click", function () {
            elementHandler.getTaskValues(taskId);
        });
    }
    function toggleEdit(id) {

    }
    document.querySelector("#today-btn").addEventListener("click", createTask);
    return {
        createTask,
    };
})();
