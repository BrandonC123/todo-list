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

eval("const task = (title, description, dueDate, priority) => {\r\n    function getTitle() {\r\n        return title;\r\n    }\r\n    function getDescription() {\r\n        return description;\r\n    }\r\n    function getDueDate() {\r\n        return dueDate;\r\n    }\r\n    function getPriority() {\r\n        return priority;\r\n    }\r\n    return {\r\n        getTitle,\r\n        getDescription,\r\n        getDueDate,\r\n        getPriority,\r\n    };\r\n};\r\n\r\nconst elementHandler = (() => {\r\n    let taskList = [];\r\n    let taskCount = 0;\r\n    function createTask(id) {\r\n        const title = document.getElementById(\"popup-title\").value;\r\n        const description = document.getElementById(\"popup-descr\").value;\r\n        const date = document.getElementById(\"popup-date\").value;\r\n        const priority = document.getElementById(\"popup-priority\").value;\r\n        console.log(title);\r\n        console.log(date);\r\n        console.log(description);\r\n        console.log(priority);\r\n        const newTask = task(title, description, date, priority);\r\n        taskList.push(newTask);\r\n        console.log(taskList[0].getDueDate());\r\n        elementCreation.togglePopUp();\r\n        localStorage.setItem(\"task-list\", description);\r\n        // create task with construct, add to array\r\n    }\r\n    try {\r\n        console.log(localStorage.getItem(\"task-list\") + \" local storage\");\r\n    } catch (e) {\r\n        console.log(\"empty\");\r\n    }\r\n    return {\r\n        createTask,\r\n        taskList,\r\n        taskCount,\r\n    };\r\n})();\r\n\r\nconst elementCreation = (() => {\r\n    const todayCont = document.getElementById(\"today-container\");\r\n\r\n    function createTask() {\r\n        elementHandler.taskCount++;\r\n        const taskId = elementHandler.taskCount;\r\n        const task = document.createElement(\"div\");\r\n        task.setAttribute(\"id\", \"task-\" + taskId);\r\n        task.classList.add(\"task\");\r\n\r\n        const taskTitle = document.createElement(\"input\");\r\n        taskTitle.setAttribute(\"id\", \"task-title-\" + taskId);\r\n        taskTitle.type = \"text\";\r\n        taskTitle.placeholder = \"Title\";\r\n\r\n        const calendar = document.createElement(\"input\");\r\n        calendar.setAttribute(\"id\", \"calendar-\" + taskId);\r\n        calendar.type = \"date\";\r\n        calendar = \"2022-05-03\";\r\n\r\n        const taskActions = document.createElement(\"div\");\r\n        taskActions.setAttribute(\"id\", \"task-actions-\" + taskId);\r\n        taskActions.classList.add(\"task-actions\");\r\n        const checkBtn = document.createElement(\"button\");\r\n        checkBtn.setAttribute(\"id\", \"check-\" + taskId);\r\n        checkBtn.classList.add(\"check-btn\");\r\n        checkBtn.textContent = \"✔\";\r\n        const xBtn = document.createElement(\"button\");\r\n        xBtn.setAttribute(\"id\", \"x-\" + taskId);\r\n        xBtn.classList.add(\"x-btn\");\r\n        xBtn.textContent = \"X\";\r\n        taskActions.appendChild(checkBtn);\r\n        taskActions.appendChild(xBtn);\r\n\r\n        task.appendChild(taskTitle);\r\n        task.appendChild(calendar);\r\n        task.appendChild(taskActions);\r\n        todayCont.appendChild(task);\r\n        console.log(taskId);\r\n        checkBtn.addEventListener(\"click\", function () {\r\n            elementHandler.createTask(taskId);\r\n        });\r\n    }\r\n    function toggleEdit(id) {}\r\n    function togglePopUp() {\r\n        document.querySelector(\".popup\").classList.toggle(\"hide\");\r\n    }\r\n    document.querySelector(\"#today-btn\").addEventListener(\"click\", createTask);\r\n    document.querySelector(\".x-btn\").addEventListener(\"click\", togglePopUp);\r\n    document\r\n        .querySelector(\"#create-btn\")\r\n        .addEventListener(\"click\", togglePopUp);\r\n    document.getElementById(\"create-task\").onclick = function () {\r\n        elementHandler.createTask();\r\n    };\r\n    return {\r\n        createTask,\r\n        togglePopUp,\r\n    };\r\n})();\r\n\n\n//# sourceURL=webpack://todo-list/./src/index.js?");

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