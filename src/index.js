import { id } from "date-fns/locale";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
    doc,
    setDoc,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    query,
    onSnapshot,
} from "firebase/firestore";
import {} from "firebase/firestore";
import {} from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyAxQ8hAUlNRWOi836iNrHQsmMUv18gSP14",
    authDomain: "todo-list-f9f8d.firebaseapp.com",
    projectId: "todo-list-f9f8d",
    storageBucket: "todo-list-f9f8d.appspot.com",
    messagingSenderId: "412734533537",
    appId: "1:412734533537:web:b7bbfa60152eac743d65e0",
    measurementId: "G-CKR6JVLF99",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const { differenceInCalendarDays } = require("date-fns");

const projectHandler = (() => {
    let projectList = [];
    let activeProjectIndex = -1;
    try {
        getDocs(collection(db, "projects")).then((list) => {
            list.docs.map((doc) => {
                projectList.push({ id: doc.id, ...doc.data() });
            });
            displayHandler.displayAllProjects();
        });
    } catch {}
    async function createProject() {
        const title =
            document.getElementById("project-popup-title").value === ""
                ? "Untitled Project"
                : document.getElementById("project-popup-title").value;
        const description = document.getElementById(
            "project-popup-descr"
        ).value;
        const date = document.getElementById("project-popup-date").value;
        const project = {
            title: title,
            description: description,
            dueDate: date,
            todos: [],
        };
        try {
            const projectRef = await addDoc(
                collection(db, "projects"),
                project
            );
            displayHandler.displayProject(project, projectList.length - 1);
            return { id: projectRef.id, ...project };
        } catch {
            console.error(error);
        }
    }
    async function addtodoToProject(index, todo) {
        console.log(index);
        projectList[index].todos.push(todo);
        const id = projectList[index].id;
        const projectRef = doc(db, "projects", id);
        await updateDoc(projectRef, {
            todos: projectList[index].todos,
        });
    }
    async function editProject(projectIndex) {
        const title = document.getElementById("project-title").value;
        const description = document.getElementById(
            "project-description"
        ).value;
        if (title === "") {
            projectList[projectIndex].title = "Untitled Project";
        } else {
            projectList[projectIndex].title = title;
        }
        projectList[projectIndex].description = description;
        const projectRef = doc(db, "projects", projectList[projectIndex].id);
        await updateDoc(projectRef, {
            title: projectList[projectIndex].title,
            description: projectList[projectIndex].description,
        });
        displayHandler.clearContainers();
    }
    async function deleteProject(index) {
        await deleteDoc(doc(db, "projects", projectList[index].id));
        projectList.splice(index, 1);
        displayHandler.clearContainers();
    }
    function editProjectTodo(projectIndex, todoIndex) {
        const id = projectList[projectIndex].id;
        const title = document.getElementById("edit-popup-title").value;
        const description = document.getElementById("edit-popup-descr").value;
        const date = document.getElementById("edit-popup-date").value;
        const priority = document.getElementById("edit-popup-priority").value;
        const updatedtodo = {
            title: title,
            description: description,
            date: date,
            priority: priority,
        };
        projectList[projectIndex].todos[todoIndex] = updatedtodo;
        displayHandler.togglePopUp("edit");
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
        getDocs(collection(db, "todos")).then((list) => {
            list.docs.map((doc) => {
                todoList.push({ id: doc.id, ...doc.data() });
            });
            displayHandler.displayAllTodos();
        });
        const q = query(collection(db, "todos"));
        onSnapshot(q, (snapshop) => {
            snapshop.docChanges().forEach((change) => {
                if (change.type === "modified") {
                    const index = todoList
                        .map(function (todo) {
                            return todo.id;
                        })
                        .indexOf(change.doc.id);
                    todoList[index] = change.doc.data();
                }
                if (change.type === "removed") {
                    const index = todoList
                        .map(function (todo) {
                            return todo.id;
                        })
                        .indexOf(change.doc.id);
                    todoList = todoList.splice(index, 1);
                }
            });
        });
    } catch {}

    let today = new Date()
        .toLocaleString("sv", { timeZoneName: "short" })
        .slice(0, 10);
    async function createTodo() {
        const title =
            document.getElementById("popup-title").value === ""
                ? "Untitled ToDo"
                : document.getElementById("popup-title").value;
        const description = document.getElementById("popup-descr").value;
        const date = document.getElementById("popup-date").value;
        const priority = document.getElementById("popup-priority").value;
        const projectIndex = document.getElementById("project-options").value;
        localStorage.setItem("todo-count", todoCount);
        const newTodo = {
            title: title,
            description: description,
            date: date,
            priority: priority,
            finished: false,
        };
        if (projectIndex === "") {
            try {
                const todoRef = await addDoc(collection(db, "todos"), newTodo);
                return { id: todoRef.id, ...newTodo };
            } catch (error) {
                console.error(error);
            }
        } else {
            projectHandler.addtodoToProject(projectIndex, newTodo);
            displayHandler.fillTodoTable(
                "project-todo-table",
                projectHandler.projectList[projectIndex].todos,
                projectIndex
            );
            return newTodo;
        }
    }
    async function editTodo(id) {
        const title = document.getElementById("edit-popup-title").value;
        const description = document.getElementById("edit-popup-descr").value;
        const date = document.getElementById("edit-popup-date").value;
        const priority = document.getElementById("edit-popup-priority").value;
        const todoRef = doc(db, "todos", id);
        await updateDoc(todoRef, {
            title: title,
            description: description,
            date: date,
            priority: priority,
            id: id,
        });
        displayHandler.togglePopUp("edit");
        displayHandler.clearContainers();
    }
    async function deleteTodo(id) {
        // todoList.splice(index, 1);
        await deleteDoc(doc(db, "todos", id));
        displayHandler.clearContainers();
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
        editTodo,
        deleteTodo,
        getUpcoming,
        // getTodoList,
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
        const todoId = inputTodo.id;
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
                todoHandler.deleteTodo(todoId);
            });
        });
        const checkBoxes = document.querySelectorAll(
            ".todo-checkbox-" + todoId
        );
        checkBoxes.forEach((check) => {
            check.addEventListener("change", async function () {
                const status = check.checked;
                const todoRef = doc(db, "todos", inputTodo.id);
                await updateDoc(todoRef, {
                    finished: status,
                });
                checkBoxes.forEach((otherCheckBoxes) => {
                    otherCheckBoxes.checked = status;
                });
                fillTodoTable("today-todo-table", todoHandler.todayList);
            });
        });
    }
    function fillEditPopup(todo) {
        activeId = todo.id;
        document.querySelector(".edit-popup").classList.toggle("hide");
        document.getElementById("edit-popup-title").value = todo.title;
        document.getElementById("edit-popup-date").value = todo.date;
        document.getElementById("edit-popup-descr").value = todo.description;
        document.getElementById("edit-popup-priority").value = todo.priority;
    }
    function displayAllTodos() {
        console.log(todoHandler.todoList);
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
            checkBox.classList.add("todo-checkbox-" + list[i].id);
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
            edit.classList.add("edit-" + list[i].id);
            edit.classList.add("accent-text");
            edit.textContent = "Edit";
            edit.href = "#";

            const deleteBtn = document.createElement("a");
            deleteBtn.classList.add(tableId);
            deleteBtn.classList.add("danger-text");
            deleteBtn.classList.add("delete-" + list[i].id);
            deleteBtn.textContent = "Delete";
            deleteBtn.href = "#";

            if (checkBox.checked) {
                row.classList.add("finished");
            }
            const checkBoxes = document.querySelectorAll(
                ".todo-checkbox-" + list[i].id
            );
            checkBox.addEventListener("change", async function () {
                if (tableId === "todo-table") {
                    list[i].finished = checkBox.checked;
                    checkBoxes.forEach((check) => {
                        check.checked = list[i].finished;
                    });
                    fillTodoTable("today-todo-table", todoHandler.todayList);
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
                    const index = todoHandler.todoList
                        .map(function (todo) {
                            return todo.id;
                        })
                        .indexOf(list[i].id);
                    console.log(todoHandler.todoList);
                    todoHandler.todoList[index].finished = checkBox.checked;
                    const todoRef = doc(db, "todos", list[i].id);
                    await updateDoc(todoRef, {
                        finished: checkBox.checked,
                    });
                    checkBoxes.forEach((check) => {
                        check.checked = list[i].finished;
                    });
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
                if (tableId === "project-todo-table") {
                    projectHandler.deleteProjectTodo(projectIndex, list[i].id);
                } else {
                    todoHandler.deleteTodo(list[i].id);
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

        if (screen.width <= 850) {
            document.querySelector(".sidebar").classList.remove("show-sidebar");
        }

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
                if (screen.width <= 850) {
                    document
                        .querySelector(".sidebar")
                        .classList.remove("show-sidebar");
                }
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
        .addEventListener("click", async function () {
            let newTodo = await todoHandler.createTodo();
            console.log(newTodo);

            if (newTodo != null) {
                displayHandler.displayTodo(newTodo, ".all-todos", true);
                todoHandler.todoList.push(newTodo);
                console.log(todoHandler.todayList);
                fillTodoTable("todo-table", todoHandler.todoList);
                fillTodoTable("today-todo-table", todoHandler.todayList);
            }
            displayHandler.togglePopUp("close");
            if (screen.width <= 850) {
                document
                    .querySelector(".sidebar")
                    .classList.remove("show-sidebar");
            }
            document.getElementById("popup-form").reset();
        });
    document.getElementById("edit-todo").addEventListener("click", function () {
        if (
            !document
                .getElementById("edit-todo")
                .classList.contains("project-todo-table")
        ) {
            console.log(activeId);
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
        .addEventListener("click", async function () {
            const project = await projectHandler.createProject();
            projectHandler.projectList.push(project);
            fillProjectDropdown();
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
