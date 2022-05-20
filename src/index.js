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
    let taskCount = 0;
    function getTaskValues(id) {
        console.log(document.getElementById("task-" + id));
        console.log(document.getElementById("task-title-" + id).value);
        document.getElementById("task-actions-" + id).classList.add("hide");
        // create task with construct, add to array
    }
    return {
        getTaskValues,
        tasks,
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
        calendar.value = "2022-05-03";

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
            elementHandler.getTaskValues(taskId);
        });
    }
    function toggleEdit(id) {}
    document.querySelector("#today-btn").addEventListener("click", createTask);
    return {
        createTask,
    };
})();
