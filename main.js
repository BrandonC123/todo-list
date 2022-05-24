/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("const elementHandler = (() => {\r\n    let taskList = [];\r\n    try {\r\n        console.log(JSON.parse(localStorage.getItem(\"task-list\") || \"[]\"));\r\n        taskList = JSON.parse(localStorage.getItem(\"task-list\") || \"[]\");\r\n        // localStorage.removeItem(\"task-list\");\r\n    } catch (e) {\r\n        console.log(\"empty\");\r\n    }\r\n    let taskCount =\r\n        taskList.length != 0\r\n            ? JSON.parse(taskList[taskList.length - 1].taskId)\r\n            : 0;\r\n    let today = new Date()\r\n        .toLocaleString(\"sv\", { timeZoneName: \"short\" })\r\n        .slice(0, 10);\r\n    function createTask() {\r\n        const title = document.getElementById(\"popup-title\").value;\r\n        const description = document.getElementById(\"popup-descr\").value;\r\n        const date = document.getElementById(\"popup-date\").value;\r\n        const priority = document.getElementById(\"popup-priority\").value;\r\n        taskCount++;\r\n        const newTask = {\r\n            title: title,\r\n            description: description,\r\n            date: date,\r\n            priority: priority,\r\n            taskId: taskCount,\r\n        };\r\n        console.log(newTask);\r\n        elementCreation.displayTask(newTask, \".all-todos\", true);\r\n        taskList.push(newTask);\r\n        elementCreation.togglePopUp(\"create\");\r\n        localStorage.setItem(\"task-list\", JSON.stringify(taskList));\r\n        document.getElementById(\"popup-form\").reset();\r\n    }\r\n    function editTask(id) {\r\n        const title = document.getElementById(\"edit-popup-title\").value;\r\n        const description = document.getElementById(\"edit-popup-descr\").value;\r\n        const date = document.getElementById(\"edit-popup-date\").value;\r\n        const priority = document.getElementById(\"edit-popup-priority\").value;\r\n        const updatedTask = {\r\n            title: title,\r\n            description: description,\r\n            date: date,\r\n            priority: priority,\r\n            taskId: taskCount,\r\n        };\r\n        console.log(updatedTask);\r\n        const index = getTaskById(id).index;\r\n        taskList[index] = updatedTask;\r\n        elementCreation.togglePopUp(\"edit\");\r\n        console.log(taskList);\r\n        localStorage.setItem(\"task-list\", JSON.stringify(taskList));\r\n        elementCreation.clearContainers();\r\n        elementCreation.displayAllTasks();\r\n        // document.getElementById(\"edit-popup-form\").reset();\r\n    }\r\n    function getTaskById(id) {\r\n        for (let i = 0; i < taskList.length; i++) {\r\n            if (taskList[i].taskId == id) {\r\n                const task = {\r\n                    taskObj: taskList[i],\r\n                    index: i,\r\n                };\r\n                return task;\r\n            }\r\n        }\r\n    }\r\n    function deleteTask(index) {\r\n        taskList.splice(index, 1);\r\n        elementCreation.clearContainers();\r\n        localStorage.setItem(\"task-list\", JSON.stringify(taskList));\r\n        console.log(taskList);\r\n    }\r\n    return {\r\n        createTask,\r\n        taskList,\r\n        taskCount,\r\n        today,\r\n        getTaskById,\r\n        editTask,\r\n        deleteTask,\r\n    };\r\n})();\r\n\r\nconst elementCreation = (() => {\r\n    let activeId;\r\n    function togglePopUp(action) {\r\n        if (action === \"create\") {\r\n            document.querySelector(\".popup\").classList.toggle(\"hide\");\r\n        }\r\n        if (action === \"edit\") {\r\n            document.querySelector(\".edit-popup\").classList.toggle(\"hide\");\r\n        }\r\n        if (action === \"close\") {\r\n            document.querySelector(\".popup\").classList.add(\"hide\");\r\n            document.querySelector(\".edit-popup\").classList.add(\"hide\");\r\n        }\r\n    }\r\n    function displayTask(inputTask, container, newTask) {\r\n        let taskId = inputTask.taskId;\r\n        const task = document.createElement(\"div\");\r\n        // task.setAttribute(\"id\", \"task-\" + taskId);\r\n        task.classList.add(\"task\");\r\n\r\n        const taskTitle = document.createElement(\"input\");\r\n        // taskTitle.setAttribute(\"id\", \"task-title-\" + taskId);\r\n        taskTitle.type = \"text\";\r\n        taskTitle.placeholder = \"Title\";\r\n        taskTitle.value = inputTask.title;\r\n\r\n        const calendar = document.createElement(\"input\");\r\n        // calendar.setAttribute(\"id\", \"calendar-\" + taskId);\r\n        calendar.type = \"date\";\r\n        calendar.value = inputTask.date;\r\n\r\n        const prioritySquare = document.createElement(\"div\");\r\n        prioritySquare.classList.add(\"priority-square\");\r\n        prioritySquare.style.backgroundColor = getPriorityColor(\r\n            inputTask.priority.toString()\r\n        );\r\n\r\n        const edit = document.createElement(\"a\");\r\n        // edit.setAttribute(\"id\", \"edit-\" + taskId);\r\n        edit.classList.add(\"accent-text\");\r\n        edit.classList.add(\"edit-\" + taskId);\r\n        edit.textContent = \"Edit\";\r\n        edit.href = \"#\";\r\n\r\n        const deleteBtn = document.createElement(\"a\");\r\n        // delete.setAttribute(\"id\", \"delete-\" + taskId);\r\n        deleteBtn.classList.add(\"danger-text\");\r\n        deleteBtn.classList.add(\"delete-\" + taskId);\r\n        deleteBtn.textContent = \"Delete\";\r\n        deleteBtn.href = \"#\";\r\n\r\n        task.appendChild(taskTitle);\r\n        task.appendChild(calendar);\r\n        task.appendChild(prioritySquare);\r\n        task.appendChild(edit);\r\n        task.appendChild(deleteBtn);\r\n        // console.log(document.querySelector(\"edit-\" + taskId));\r\n        if (container === \".all-todos\" || newTask) {\r\n            const todoContainers = document.querySelectorAll(\".all-todos\");\r\n            todoContainers.forEach((todoContainer) => {\r\n                todoContainer.appendChild(task.cloneNode(true));\r\n            });\r\n        }\r\n        if (inputTask.date.toString() === elementHandler.today.toString()) {\r\n            document\r\n                .querySelector(\"#today-container\")\r\n                .appendChild(task.cloneNode(true));\r\n        }\r\n        const editBtns = document.querySelectorAll(\".edit-\" + taskId);\r\n        editBtns.forEach((btn) => {\r\n            btn.addEventListener(\"click\", function () {\r\n                fillEditPopup(taskId);\r\n            });\r\n        });\r\n        const deleteBtns = document.querySelectorAll(\".delete-\" + taskId);\r\n        deleteBtns.forEach((btn) => {\r\n            btn.addEventListener(\"click\", function () {\r\n                elementHandler.deleteTask(\r\n                    elementHandler.getTaskById(taskId).index\r\n                );\r\n            });\r\n        });\r\n    }\r\n    function fillEditPopup(id) {\r\n        const task = elementHandler.getTaskById(id).taskObj;\r\n        console.log(elementHandler.getTaskById(id));\r\n        activeId = task.taskId;\r\n        document.querySelector(\".edit-popup\").classList.toggle(\"hide\");\r\n        document.getElementById(\"edit-popup-title\").value = task.title;\r\n        document.getElementById(\"edit-popup-date\").value = task.date;\r\n        document.getElementById(\"edit-popup-descr\").value = task.description;\r\n        document.getElementById(\"edit-popup-priority\").value = task.priority;\r\n    }\r\n    function displayAllTasks() {\r\n        elementHandler.taskList.forEach((element) => {\r\n            elementHandler.taskCount++;\r\n            displayTask(element, \".all-todos\");\r\n        });\r\n    }\r\n    function clearContainers() {\r\n        const todoContainers = document.querySelectorAll(\".all-todos\");\r\n        todoContainers.forEach((todoContainer) => {\r\n            todoContainer.innerHTML = \"\";\r\n        });\r\n        document.getElementById(\"today-container\").innerHTML = \"\";\r\n        elementCreation.displayAllTasks();\r\n    }\r\n    function getPriorityColor(priority) {\r\n        if (priority === \"high\") {\r\n            return \"#C40233\";\r\n        }\r\n        if (priority === \"med\") {\r\n            return \"#FED000\";\r\n        } else {\r\n            return \"#48A14D\";\r\n        }\r\n    }\r\n    const closeBtns = document.querySelectorAll(\".x-btn\");\r\n    closeBtns.forEach((btn) => {\r\n        btn.addEventListener(\"click\", function () {\r\n            togglePopUp(\"close\");\r\n        });\r\n    });\r\n    document\r\n        .querySelector(\"#create-btn\")\r\n        .addEventListener(\"click\", function () {\r\n            togglePopUp(\"create\");\r\n        });\r\n    document.getElementById(\"create-task\").onclick = function () {\r\n        elementHandler.createTask();\r\n    };\r\n    document.getElementById(\"edit-task\").onclick = function () {\r\n        elementHandler.editTask(activeId);\r\n    };\r\n\r\n    document.getElementById(\"todo-page-btn\").onclick = function () {\r\n        document.querySelector(\".home-page\").classList.add(\"hide\");\r\n        document.querySelector(\".todo-page\").classList.remove(\"hide\");\r\n    };\r\n    document.getElementById(\"home-page-btn\").onclick = function () {\r\n        document.querySelector(\".todo-page\").classList.add(\"hide\");\r\n        document.querySelector(\".home-page\").classList.remove(\"hide\");\r\n    };\r\n    displayAllTasks();\r\n    return {\r\n        togglePopUp,\r\n        displayTask,\r\n        displayAllTasks,\r\n        clearContainers,\r\n    };\r\n})();\r\n\r\n/*\r\nfunction createTask() {\r\n        elementHandler.taskCount++;\r\n        const taskId = elementHandler.taskCount;\r\n        const task = document.createElement(\"div\");\r\n        task.setAttribute(\"id\", \"task-\" + taskId);\r\n        task.classList.add(\"task\");\r\n\r\n        const taskTitle = document.createElement(\"input\");\r\n        taskTitle.setAttribute(\"id\", \"task-title-\" + taskId);\r\n        taskTitle.type = \"text\";\r\n        taskTitle.placeholder = \"Title\";\r\n\r\n        const calendar = document.createElement(\"input\");\r\n        calendar.setAttribute(\"id\", \"calendar-\" + taskId);\r\n        calendar.type = \"date\";\r\n        calendar = \"2022-05-03\";\r\n\r\n        const taskActions = document.createElement(\"div\");\r\n        taskActions.setAttribute(\"id\", \"task-actions-\" + taskId);\r\n        taskActions.classList.add(\"task-actions\");\r\n        const checkBtn = document.createElement(\"button\");\r\n        checkBtn.setAttribute(\"id\", \"check-\" + taskId);\r\n        checkBtn.classList.add(\"check-btn\");\r\n        checkBtn.textContent = \"✔\";\r\n        const xBtn = document.createElement(\"button\");\r\n        xBtn.setAttribute(\"id\", \"x-\" + taskId);\r\n        xBtn.classList.add(\"x-btn\");\r\n        xBtn.textContent = \"X\";\r\n        taskActions.appendChild(checkBtn);\r\n        taskActions.appendChild(xBtn);\r\n\r\n        task.appendChild(taskTitle);\r\n        task.appendChild(calendar);\r\n        task.appendChild(taskActions);\r\n        todayCont.appendChild(task);\r\n        console.log(taskId);\r\n        checkBtn.addEventListener(\"click\", function () {\r\n            elementHandler.createTask(taskId);\r\n        });\r\n    }\r\n*/\r\n\n\n//# sourceURL=webpack://todo-list/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;