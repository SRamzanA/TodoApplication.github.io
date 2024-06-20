const form = document.querySelector("#form")
const taskInput = document.querySelector("#taskInput")
const tasksList = document.querySelector("#tasksList")
const emptyTask = document.querySelector("#emptyTask")

let tasks = []

// Выводим задачи из local storage
if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"))
    tasks.forEach(function (task) {
        const cssClass = task.done ? "task-content task-done" : "task-content"

        // Формируем разметку для новой задачи
        const taskHTML = `
                    <div id="${task.id}" class="task">
                        <div id="taskContent" class="${cssClass}">${task.text}</div>
                        <button type="button" data-action="done" class="done">&#10004;</button>
                        <button type="button" data-action="delete" class="delete">&#10060;</button>
                    </div>`

        tasksList.insertAdjacentHTML("beforeend", taskHTML)
    })
}

checkEmptyList()

form.addEventListener("submit", addTask)
tasksList.addEventListener("click", deleteTask)
tasksList.addEventListener("click", doneTask)

function addTask(event) {
    // Отменяем отправку формы
    event.preventDefault()

    // Достаем текст из поля ввода
    const taskText = taskInput.value

    // Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    }

    // Добавляем задачу в массив с задачами
    tasks.push(newTask)

    // Формируем css класс
    const cssClass = newTask.done ? "task-content task-done" : "task-content"

    // Формируем разметку для новой задачи
    const taskHTML = `
                <div id="${newTask.id}" class="task">
                    <div id="taskContent" class="${cssClass}">${newTask.text}</div>
                    <button type="button" data-action="done" class="done">&#10004;</button>
                    <button type="button" data-action="delete" class="delete">&#10060;</button>
                </div>`

    tasksList.insertAdjacentHTML("beforeend", taskHTML)

    // Отчищаем поле ввода и возвращаем на него фокус
    taskInput.value = ""
    taskInput.focus()

    if(tasksList.children.length > 1) {
        emptyTask.classList.add("none")
    }

    checkEmptyList()
    saveToLocalStorage()
}

function deleteTask(event) {
    // Если клик НЕ по кнопке "Удалить задачу" - выход из функции
    if(event.target.dataset.action !== "delete") return

    const parentObject = event.target.closest(".task")

    // Получаем ID задачи
    const id = parentObject.id

    // Находим индекс задачи в массиве
    const index = tasks.findIndex((task) => task.id == id)

    // Удаляем задачу из массива с задачами
    tasks.splice(index, 1)

    parentObject.remove()

    if(tasksList.children.length === 1) {
        emptyTask.classList.remove("none")
    }

    checkEmptyList()
    saveToLocalStorage()
}

function doneTask(event) {
    if(event.target.dataset.action !== "done") return

    const parentObject = event.target.closest(".task")

    // Определяем ID задачи
    const id = parentObject.id

    const task = tasks.find((task) => task.id == id)
    task.done = !task.done

    const taskText = parentObject.querySelector("#taskContent")
    taskText.classList.toggle("task-done")

    saveToLocalStorage()
}

function checkEmptyList() {
    // Если у #taskList длинна = 0 и длинна tasks[] = 0 
    if (tasksList.children.length === 0 && tasks.length === 0) {
        emptyListHTML = `
                <div id="emptyTask" class="empty-task">
                    <img src="image/leaf.png" alt="leaf.png" class="img-leaf">
                    <div class="text-task-empty">Список дел пуст</div>
                </div>`
        tasksList.insertAdjacentHTML("afterbegin", emptyListHTML)
    }
    
    if (tasks.length > 0) {
        const emptyListEl = document.querySelector("#emptyTask")
        emptyListEl ? emptyListEl.remove() : null
    }
}

function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}





