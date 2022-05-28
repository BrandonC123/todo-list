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
        let todos = [];
        projectCount++;
        const project = {
            title: title,
            description: description,
            dueDate: date,
            todos: todos,
            projectId: projectCount,
        };
        projectList.push(project);
        localStorage.setItem("project-list", JSON.stringify(projectList));
        displayHandler.displayProject(project, projectList.length - 1);
        return project;
    }
    function addtodoToProject(index, todo) {
        projectList[index].todos.push(todo);
        localStorage.setItem("project-list", JSON.stringify(projectList));
    }
    return {
        createProject,
        projectList,
        addtodoToProject,
    };
})();

const todoHandler = (() => {
    let todoList = [];
    let todoCount = 0;
    try {
        console.log(JSON.parse(localStorage.getItem("todo-list") || "[]"));
        todoList = JSON.parse(localStorage.getItem("todo-list") || "[]");
        todoCount = localStorage.getItem("todo-count");
        // localStorage.removeItem("todo-count");
    } catch (e) {
        console.log("empty");
    }

    let today = new Date()
        .toLocaleString("sv", { timeZoneName: "short" })
        .slice(0, 10);
    function createTodo() {
        const title = document.getElementById("popup-title").value;
        const description = document.getElementById("popup-descr").value;
        const date = document.getElementById("popup-date").value;
        const priority = document.getElementById("popup-priority").value;
        const projectIndex = document.getElementById("project-options").value;
        todoCount++;
        localStorage.setItem("todo-count", todoCount);
        console.log(todoCount);
        const newTodo = {
            title: title,
            description: description,
            date: date,
            priority: priority,
            finished: false,
            todoId: todoCount,
        };
        console.log(newTodo);
        if (projectIndex === "") {
            console.log("regular todo");
            return newTodo;
        } else {
            projectHandler.addtodoToProject(projectIndex, newTodo);
        }
    }
    function editTodo(id) {
        const title = document.getElementById("edit-popup-title").value;
        const description = document.getElementById("edit-popup-descr").value;
        const date = document.getElementById("edit-popup-date").value;
        const priority = document.getElementById("edit-popup-priority").value;
        const updatedtodo = {
            title: title,
            description: description,
            date: date,
            priority: priority,
            finished: getTodoById(id).todoObj.finished,
            todoId: getTodoById(id).todoObj.todoId,
        };
        console.log(updatedtodo);
        const index = getTodoById(id).index;
        todoList[index] = updatedtodo;
        displayHandler.togglePopUp("edit");
        console.log(todoList);
        localStorage.setItem("todo-list", JSON.stringify(todoList));
        displayHandler.clearContainers();
        displayHandler.displayAlltodos();
    }
    function getTodoById(id) {
        for (let i = 0; i < todoList.length; i++) {
            if (todoList[i].todoId == id) {
                const todo = {
                    todoObj: todoList[i],
                    index: i,
                };
                return todo;
            }
        }
    }
    function deleteTodo(index) {
        todoList.splice(index, 1);
        displayHandler.clearContainers();
        localStorage.setItem("todo-list", JSON.stringify(todoList));
        displayHandler.displayAlltodos();
        console.log(todoList);
    }
    function getUpcoming(inputDate) {
        let today = new Date();
        let testDate = new Date(inputDate);
        let result = differenceInCalendarDays(testDate, today);
        return result <= 7 && result >= 0 ? true : false;
    }
    return {
        createTodo,
        todoList,
        todoCount,
        today,
        getTodoById,
        editTodo,
        deleteTodo,
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
    function displayTodo(inputTodo, container, newTodo) {
        const todoId = inputTodo.todoId;
        console.log(todoHandler.todoList);
        const index = todoHandler.getTodoById(todoId).index;
        const todo = document.createElement("div");
        todo.classList.add("todo");

        const checkBox = document.createElement("input");
        checkBox.classList.add("todo-checkbox-" + todoId);
        checkBox.type = "checkbox";
        checkBox.checked = inputTodo.finished ? true : false;

        const todoTitle = document.createElement("input");
        todoTitle.type = "text";
        todoTitle.placeholder = "Title";
        todoTitle.value = inputTodo.title;

        const calendar = document.createElement("input");
        calendar.type = "date";
        calendar.value = inputTodo.date;

        const prioritySquare = document.createElement("div");
        prioritySquare.classList.add("priority-square");
        prioritySquare.style.backgroundColor = getPriorityColor(
            inputTodo.priority.toString()
        );

        const edit = document.createElement("a");
        edit.classList.add("accent-text");
        edit.classList.add("edit-" + todoId);
        edit.textContent = "Edit";
        edit.href = "#";

        const deleteBtn = document.createElement("a");
        deleteBtn.classList.add("danger-text");
        deleteBtn.classList.add("delete-" + todoId);
        deleteBtn.textContent = "Delete";
        deleteBtn.href = "#";

        todo.appendChild(checkBox);
        todo.appendChild(todoTitle);
        todo.appendChild(calendar);
        todo.appendChild(prioritySquare);
        todo.appendChild(edit);
        todo.appendChild(deleteBtn);
        if (inputTodo.date.toString() === todoHandler.today.toString()) {
            document
                .querySelector("#today-container")
                .appendChild(todo.cloneNode(true));
        }
        if (todoHandler.getUpcoming(inputTodo.date)) {
            document
                .querySelector(".upcoming")
                .appendChild(todo.cloneNode(true));
        }
        if (container === ".all-todos" || newTodo) {
            const todoContainers = document.querySelectorAll(".all-todos");
            todoContainers.forEach((todoContainer) => {
                todoContainer.appendChild(todo.cloneNode(true));
            });
        }
        const editBtns = document.querySelectorAll(".edit-" + todoId);
        editBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                fillEditPopup(todoId);
            });
        });
        const deleteBtns = document.querySelectorAll(".delete-" + todoId);
        deleteBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                todoHandler.deleteTodo(index);
            });
        });
        const checkBoxes = document.querySelectorAll(
            ".todo-checkbox-" + todoId
        );
        checkBoxes.forEach((check) => {
            check.addEventListener("change", function () {
                todoHandler.todoList[index].finished = document.querySelector(
                    ".todo-checkbox-" + todoId
                ).checked;
                localStorage.setItem(
                    "todo-list",
                    JSON.stringify(todoHandler.todoList)
                );
                console.log(todoHandler.todoList[index]);
            });
        });
    }
    function fillEditPopup(id) {
        const todo = todoHandler.getTodoById(id).todoObj;
        console.log(todoHandler.getTodoById(id));
        activeId = todo.todoId;
        document.querySelector(".edit-popup").classList.toggle("hide");
        document.getElementById("edit-popup-title").value = todo.title;
        document.getElementById("edit-popup-date").value = todo.date;
        document.getElementById("edit-popup-descr").value = todo.description;
        document.getElementById("edit-popup-priority").value = todo.priority;
    }
    function displayAlltodos() {
        todoHandler.todoList.forEach((element) => {
            displayTodo(element, ".all-todos");
        });
        console.log(todoHandler.todoCount);
    }
    function fillTodoTable() {
        const table = document.getElementById("todo-table");
        table.innerHTML = "";
        todoHandler.todoList.forEach((todo) => {
            let row = table.insertRow();
            let title = row.insertCell(0);
            title.innerHTML = todo.title;
            let description = row.insertCell(1);
            description.innerHTML = todo.description;
            let date = row.insertCell(2);
            date.innerHTML = todo.date;
            let priority = row.insertCell(3);
            priority.innerHTML = todo.priority;
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
    function fillProjectDropdown() {
        const dropdown = document.getElementById("project-options");
        dropdown.innerHTML = "";
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
                displayProjectTodos(index);
            });
        });
    }
    function displayAllProjects() {
        const projects = projectHandler.projectList;
        for (let i = 0; i < projects.length; i++) {
            displayProject(projects[i], i);
        }
    }
    function displayProjectTodos(index) {
        const pages = document.querySelectorAll(".page");
        const projectList = projectHandler.projectList;

        pages.forEach((page) => {
            if (page.classList.contains("project-page")) {
                page.classList.remove("hide");
            } else {
                page.classList.add("hide");
            }
        });

        document.getElementById("all-projects-section").classList.add("hide");
        document.querySelector(".individual-project").classList.remove("hide");
        const projectTitle = document.getElementById("project-title");
        projectTitle.value = projectList[index].title;
        const projectDescription = document.getElementById(
            "project-description"
        );
        projectDescription.value = projectList[index].description;

        const projectTodoContainer = document.querySelector(".project-todos");
        const projectTodos = projectHandler.projectList[index].todos;
        // for (let i = 0; i < projectTodos.length; i++) {
        //     console.log(projectTodos[i]);
        // }
        const table = document.getElementById("project-todo-table");
        table.innerHTML = "";
        projectTodos.forEach((todo) => {
            let row = table.insertRow();
            let title = row.insertCell(0);
            title.innerHTML = todo.title;
            let description = row.insertCell(1);
            description.innerHTML = todo.description;
            let date = row.insertCell(2);
            date.innerHTML = todo.date;
            let priority = row.insertCell(3);
            priority.innerHTML = todo.priority;
        });
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
        .getElementById("create-todo")
        .addEventListener("click", function () {
            let newTodo = todoHandler.createTodo();
            if (newTodo != null) {
                todoHandler.todoList.push(newTodo);
                displayHandler.displayTodo(newTodo, ".all-todos", true);
                localStorage.setItem(
                    "todo-list",
                    JSON.stringify(todoHandler.todoList)
                );
            }
            displayHandler.togglePopUp("close");
            document.getElementById("popup-form").reset();
        });
    document.getElementById("edit-todo").onclick = function () {
        todoHandler.editTodo(activeId);
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
                    if (pages[i].classList.contains("todo-page")) {
                        fillTodoTable();
                    }
                    if (pages[i].classList.contains("project-page")) {
                        document
                            .getElementById("all-projects-section")
                            .classList.remove("hide");
                        document
                            .querySelector(".individual-project")
                            .classList.add("hide");
                    }
                } else {
                    pages[i].classList.add("hide");
                }
            }
        });
    });
    displayAlltodos();
    displayAllProjects();
    return {
        togglePopUp,
        displayTodo,
        displayAlltodos,
        clearContainers,
        displayProject,
    };
})();
