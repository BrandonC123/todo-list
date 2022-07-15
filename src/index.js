import { initializeApp } from "firebase/app";

const { differenceInCalendarDays } = require("date-fns");

const projectHandler = (() => {
    let projectList = [];
    let activeProjectIndex = -1;
    try {
        projectList = JSON.parse(localStorage.getItem("project-list") || "[]");
    } catch (e) {}
    let projectCount =
        projectList.length != 0
            ? JSON.parse(projectList[projectList.length - 1].projectId)
            : 0;
    function createProject() {
        const title =
            document.getElementById("project-popup-title").value === ""
                ? "Untitled Project"
                : document.getElementById("project-popup-title").value;
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
    function editProject(projectIndex) {
        if (document.getElementById("project-title").value === "") {
            projectList[projectIndex].title = "Untitled Project";
        } else {
            projectList[projectIndex].title =
                document.getElementById("project-title").value;
        }

        projectList[projectIndex].description = document.getElementById(
            "project-description"
        ).value;
        displayHandler.clearContainers();
        localStorage.setItem("project-list", JSON.stringify(projectList));
    }
    function deleteProject(index) {
        projectList.splice(index, 1);
        displayHandler.clearContainers();
        localStorage.setItem("project-list", JSON.stringify(projectList));
    }
    function editProjectTodo(projectIndex, todoIndex) {
        const title = document.getElementById("edit-popup-title").value;
        const description = document.getElementById("edit-popup-descr").value;
        const date = document.getElementById("edit-popup-date").value;
        const priority = document.getElementById("edit-popup-priority").value;
        const updatedtodo = {
            title: title,
            description: description,
            date: date,
            priority: priority,
            finished: projectList[projectIndex].todos[todoIndex].finished,
            todoId: projectList[projectIndex].todos[todoIndex].todoId,
        };
        projectList[projectIndex].todos[todoIndex] = updatedtodo;
        displayHandler.togglePopUp("edit");
        localStorage.setItem("project-list", JSON.stringify(projectList));
        displayHandler.clearContainers();
        displayHandler.fillTodoTable(
            "project-todo-table",
            projectList[projectIndex].todos,
            projectIndex
        );
        projectHandler.activeProjectIndex = -1;
    }
    function deleteProjectTodo(projectIndex, todoIndex) {
        projectList[projectIndex].todos.splice(todoIndex, 1);
        displayHandler.clearContainers();
        localStorage.setItem("project-list", JSON.stringify(projectList));
        displayHandler.fillTodoTable(
            "project-todo-table",
            projectList[projectIndex].todos,
            projectIndex
        );
    }
    return {
        createProject,
        projectList,
        addtodoToProject,
        editProject,
        deleteProject,
        activeProjectIndex,
        editProjectTodo,
        deleteProjectTodo,
    };
})();

const todoHandler = (() => {
    let todoList = [];
    let todayList = [];
    let todoCount = 0;
    try {
        todoList = JSON.parse(localStorage.getItem("todo-list") || "[]");
        todoCount = localStorage.getItem("todo-count");
        // localStorage.removeItem("todo-count");
    } catch (e) {}

    let today = new Date()
        .toLocaleString("sv", { timeZoneName: "short" })
        .slice(0, 10);
    function createTodo() {
        const title =
            document.getElementById("popup-title").value === ""
                ? "Untitled ToDo"
                : document.getElementById("popup-title").value;
        const description = document.getElementById("popup-descr").value;
        const date = document.getElementById("popup-date").value;
        const priority = document.getElementById("popup-priority").value;
        const projectIndex = document.getElementById("project-options").value;
        todoCount++;
        localStorage.setItem("todo-count", todoCount);
        const newTodo = {
            title: title,
            description: description,
            date: date,
            priority: priority,
            finished: false,
            todoId: todoCount,
        };
        if (projectIndex === "") {
            return newTodo;
        } else {
            projectHandler.addtodoToProject(projectIndex, newTodo);
            displayHandler.fillTodoTable(
                "project-todo-table",
                projectHandler.projectList[projectIndex].todos,
                projectIndex
            );
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
        const index = getTodoById(id).index;
        todoList[index] = updatedtodo;
        displayHandler.togglePopUp("edit");
        localStorage.setItem("todo-list", JSON.stringify(todoList));
        displayHandler.clearContainers();
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
        todayList,
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
    let activeTodoIndex;
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

        const divider1 = document.createElement("div");
        divider1.classList.add("divider1");
        divider1.append(todoTitle, calendar);
        const divider2 = document.createElement("div");
        divider2.classList.add("divider2");
        divider2.append(edit, deleteBtn);
        todo.append(checkBox, divider1, prioritySquare, divider2);

        if (inputTodo.date.toString() === todoHandler.today.toString()) {
            document
                .querySelector("#today-container")
                .appendChild(todo.cloneNode(true));
            todoHandler.todayList.push(inputTodo);
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
                fillEditPopup(inputTodo);
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
                console.log(checkBoxes);
                todoHandler.todoList[index].finished = check.checked;
                checkBoxes.forEach((check) => {
                    check.checked = todoHandler.todoList[index].finished;
                });
                localStorage.setItem(
                    "todo-list",
                    JSON.stringify(todoHandler.todoList)
                );
                fillTodoTable("today-todo-table", todoHandler.todayList);
            });
        });
    }
    function fillEditPopup(todo) {
        activeId = todo.todoId;
        document.querySelector(".edit-popup").classList.toggle("hide");
        document.getElementById("edit-popup-title").value = todo.title;
        document.getElementById("edit-popup-date").value = todo.date;
        document.getElementById("edit-popup-descr").value = todo.description;
        document.getElementById("edit-popup-priority").value = todo.priority;
    }
    function displayAllTodos() {
        todoHandler.todoList.forEach((element) => {
            displayTodo(element, ".all-todos");
        });
        fillTodoTable("todo-table", todoHandler.todoList);
        fillTodoTable("today-todo-table", todoHandler.todayList);
    }
    function fillTodoTable(tableId, list, projectIndex) {
        const table = document.getElementById(tableId);
        table.innerHTML = "";
        for (let i = 0; i < list.length; i++) {
            let row = table.insertRow();
            let status = row.insertCell(0);
            const checkBox = document.createElement("input");
            checkBox.classList.add("todo-checkbox-" + list[i].todoId);
            checkBox.type = "checkbox";
            checkBox.checked = list[i].finished;
            status.appendChild(checkBox);

            let title = row.insertCell(1);
            title.innerHTML = list[i].title;
            let description = row.insertCell(2);
            description.innerHTML = list[i].description;
            let date = row.insertCell(3);
            date.innerHTML = list[i].date;
            let priority = row.insertCell(4);
            priority.innerHTML = list[i].priority;
            let actions = row.insertCell(5);

            const edit = document.createElement("a");
            edit.classList.add(tableId);
            edit.classList.add("edit-" + list[i].todoId);
            edit.classList.add("accent-text");
            edit.textContent = "Edit";
            edit.href = "#";

            const deleteBtn = document.createElement("a");
            deleteBtn.classList.add(tableId);
            deleteBtn.classList.add("danger-text");
            deleteBtn.classList.add("delete-");
            deleteBtn.textContent = "Delete";
            deleteBtn.href = "#";

            if (checkBox.checked) {
                row.classList.add("finished");
            }
            const checkBoxes = document.querySelectorAll(
                ".todo-checkbox-" + list[i].todoId
            );
            checkBox.addEventListener("change", function () {
                if (tableId === "todo-table") {
                    list[i].finished = checkBox.checked;
                    checkBoxes.forEach((check) => {
                        check.checked = list[i].finished;
                    });
                    fillTodoTable("today-todo-table", todoHandler.todayList);
                    localStorage.setItem("todo-list", JSON.stringify(list));
                }
                if (tableId === "project-todo-table") {
                    projectHandler.projectList[projectIndex].todos[i].finished =
                        checkBox.checked;
                    localStorage.setItem(
                        "project-list",
                        JSON.stringify(projectHandler.projectList)
                    );
                }
                if (tableId === "today-todo-table") {
                    const todo = todoHandler.getTodoById(list[i].todoId);
                    todoHandler.todoList[todo.index].finished =
                        checkBox.checked;
                    checkBoxes.forEach((check) => {
                        check.checked = list[i].finished;
                    });
                    localStorage.setItem(
                        "todo-list",
                        JSON.stringify(todoHandler.todoList)
                    );
                }
                row.classList.toggle("finished");
            });
            edit.addEventListener("click", function () {
                fillEditPopup(list[i]);
                if (edit.classList.contains("project-todo-table")) {
                    projectHandler.activeProjectIndex = projectIndex;
                    activeTodoIndex = i;
                    document.getElementById("edit-todo").classList.add(tableId);
                }
            });
            deleteBtn.addEventListener("click", function () {
                if (tableId === "todo-table") {
                    todoHandler.deleteTodo(i);
                }
                if (tableId === "project-todo-table") {
                    projectHandler.deleteProjectTodo(projectIndex, i);
                }
                if (tableId === "today-todo-table") {
                    const todo = todoHandler.getTodoById(list[i].todoId);
                    todoHandler.deleteTodo(todo.index);
                    localStorage.setItem(
                        "todo-list",
                        JSON.stringify(todoHandler.todoList)
                    );
                }
            });
            actions.appendChild(edit);
            actions.appendChild(deleteBtn);
        }
    }
    function clearContainers() {
        todoHandler.todayList = [];
        const todoContainers = document.querySelectorAll(".all-todos");
        todoContainers.forEach((todoContainer) => {
            todoContainer.innerHTML = "";
        });
        const projectContainers = document.querySelectorAll(".all-projects");
        projectContainers.forEach((projectContainer) => {
            projectContainer.innerHTML = "";
        });
        document.getElementById("today-container").innerHTML = "";
        document.querySelector(".upcoming").innerHTML = "";
        document.querySelector(".project-tab").innerHTML = "";
        displayAllTodos();
        displayAllProjects();
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
        const opt = document.createElement("option");
        opt.textContent = "--Project--";
        opt.value = "";
        dropdown.appendChild(opt);

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
        const a = document.createElement("a");
        a.classList.add("project-link-" + index);
        a.href = "#";
        a.textContent = inputProject.title;

        const deleteBtn = document.createElement("a");
        deleteBtn.classList.add("danger-text");
        deleteBtn.classList.add("delete-project-" + index);
        deleteBtn.textContent = "Delete";
        deleteBtn.href = "#";

        projectDiv.appendChild(a);
        const projectContainers = document.querySelectorAll(".all-projects");
        projectContainers.forEach((projectContainer) => {
            if (!projectContainer.classList.contains("project-tab")) {
                projectDiv.classList.add("project-row");
                projectDiv.appendChild(deleteBtn);
                a.classList.add("accent-text");
            }
            projectContainer.appendChild(projectDiv.cloneNode(true));
        });
        const projectLinks = document.querySelectorAll(
            ".project-link-" + index
        );
        projectLinks.forEach((link) => {
            link.addEventListener("click", function () {
                displayProjectTodos(index);
                projectHandler.activeProjectIndex = index;
            });
        });
        const deleteBtns = document.querySelectorAll(
            ".delete-project-" + index
        );
        deleteBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                projectHandler.deleteProject(index);
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

        const projectTodos = projectHandler.projectList[index].todos;
        fillTodoTable("project-todo-table", projectTodos, index);
    }

    const tabs = document.querySelectorAll(".tab");
    const pages = document.querySelectorAll(".page");
    tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            for (let i = 0; i < tabs.length; i++) {
                if (tab === tabs[i]) {
                    pages[i].classList.remove("hide");
                    if (pages[i].classList.contains("todo-page")) {
                        fillTodoTable("todo-table", todoHandler.todoList);
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
            if (window.innerWidth <= 800) {
                document
                    .querySelector(".sidebar")
                    .classList.toggle("show-sidebar");
            }
        });
    });
    document
        .querySelector(".side-toggle")
        .addEventListener("click", function () {
            document.querySelector(".sidebar").classList.toggle("show-sidebar");
        });
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
                fillTodoTable("todo-table", todoHandler.todoList);
                fillTodoTable("today-todo-table", todoHandler.todayList);
            }
            displayHandler.togglePopUp("close");
            document.getElementById("popup-form").reset();
        });
    document.getElementById("edit-todo").addEventListener("click", function () {
        if (
            !document
                .getElementById("edit-todo")
                .classList.contains("project-todo-table")
        ) {
            todoHandler.editTodo(activeId);
        } else {
            projectHandler.editProjectTodo(
                projectHandler.activeProjectIndex,
                activeTodoIndex
            );
            document
                .getElementById("edit-todo")
                .classList.remove("project-todo-table");
        }
    });
    document
        .getElementById("new-project")
        .addEventListener("click", function () {
            togglePopUp("create-project");
        });
    document
        .getElementById("create-project")
        .addEventListener("click", function () {
            projectHandler.createProject();
            togglePopUp("close");
        });
    document
        .getElementById("project-title")
        .addEventListener("input", function () {
            projectHandler.editProject(projectHandler.activeProjectIndex);
        });
    document
        .getElementById("project-description")
        .addEventListener("input", function () {
            projectHandler.editProject(projectHandler.activeProjectIndex);
        });

    displayAllTodos();
    displayAllProjects();
    return {
        togglePopUp,
        displayTodo,
        displayAllTodos,
        clearContainers,
        displayProject,
        displayAllProjects,
        fillTodoTable,
    };
})();

const firebaseConfig = {
    apiKey: "AIzaSyAtMkDXNFrwaXN7AK26tetFtDkDA85-u0k",
    authDomain: "todo-list-app-beb08.firebaseapp.com",
    projectId: "todo-list-app-beb08",
    storageBucket: "todo-list-app-beb08.appspot.com",
    messagingSenderId: "770230459038",
    appId: "1:770230459038:web:e8d60337da95ddcc3b398f",
    measurementId: "G-68Y5DNKXPM",
};

const app = initializeApp(firebaseConfig);
