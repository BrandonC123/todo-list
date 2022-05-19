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

const elementCreation = (() => {
    const todayCard = document.getElementById("today-card")
    function createTask() {
        const task = document.createElement("div")
        task.classList.add("task")
        const taskTitle = document.createElement("div")
        taskTitle.textContent = "dummy text"
        const calendar = document.createElement("input")
        calendar.type = "date"
        task.appendChild(taskTitle)
        task.appendChild(calendar)
        todayCard.appendChild(task)
    }
    document.querySelector(".action-btn").addEventListener("click", createTask)
})();

const displayElements = () => {};
