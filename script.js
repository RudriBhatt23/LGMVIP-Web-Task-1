document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.querySelector('#push').addEventListener('click', addTask);
    document.querySelector('#all').addEventListener('click', () => filterTasks('all'));
    document.querySelector('#completed').addEventListener('click', () => filterTasks('completed'));
    document.querySelector('#incomplete').addEventListener('click', () => filterTasks('incomplete'));
    document.querySelector('#sortBy').addEventListener('click', () => sortTasksByPriority());
});

function addTask() {
    const taskInput = document.querySelector('#taskinput').value;
    const dueDate = document.querySelector('#duedate').value;
    const priority = document.querySelector('#priority').value;

    if (taskInput.length == 0) {
        alert("Please Enter a Task");
    } else {
        const tasks = getTasksFromLocalStorage();
        const newTask = {
            task: taskInput,
            dueDate: dueDate,
            priority: priority,
            completed: false
        };
        tasks.push(newTask);
        saveTasksToLocalStorage(tasks);
        addTaskToDOM(newTask);
        document.querySelector("#taskinput").value = "";
        document.querySelector("#duedate").value = "";
        document.querySelector("#priority").value = "low";
    }
}

function addTaskToDOM(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task ${task.completed ? 'completed' : ''}`;
    taskDiv.innerHTML = `
        <span id="taskname">${task.task}</span>
        <span>${task.dueDate}</span>
        <span id="priority">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
        <div>
            <button class="edit">Edit</button>
            <button class="delete"><i class="far fa-trash-alt"></i></button>
        </div>
    `;
    document.querySelector('#tasks').appendChild(taskDiv);

    taskDiv.querySelector('.delete').addEventListener('click', () => {
        taskDiv.remove();
        removeTaskFromLocalStorage(task.task);
    });

    taskDiv.querySelector('.edit').addEventListener('click', () => {
        const newTaskName = prompt("Edit Task", task.task);
        if (newTaskName) {
            taskDiv.querySelector('#taskname').innerText = newTaskName;
            editTaskInLocalStorage(task.task, newTaskName);
        }
    });

    taskDiv.addEventListener('click', () => {
        taskDiv.classList.toggle('completed');
        toggleCompleteInLocalStorage(task.task);
    });
}

function filterTasks(filter) {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        switch(filter) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'completed':
                task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                break;
            case 'incomplete':
                task.style.display = !task.classList.contains('completed') ? 'flex' : 'none';
                break;
        }
    });
}

function sortTasksByPriority() {
    const tasksContainer = document.querySelector('#tasks');
    const tasks = Array.from(tasksContainer.querySelectorAll('.task'));

    tasks.sort((taskA, taskB) => {
        const priorityA = taskA.querySelector('#priority').innerText.toLowerCase();
        const priorityB = taskB.querySelector('#priority').innerText.toLowerCase();
        if (priorityA === priorityB) {
            return 0;
        } else if (priorityA === 'high' && priorityB !== 'high') {
            return -1;
        } else if (priorityA !== 'high' && priorityB === 'high') {
            return 1;
        } else if (priorityA === 'medium' && priorityB === 'low') {
            return -1;
        } else {
            return 1;
        }
    });

    tasks.forEach(task => tasksContainer.appendChild(task));
}

function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => addTaskToDOM(task));
}

function removeTaskFromLocalStorage(taskName) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.task !== taskName);
    saveTasksToLocalStorage(tasks);
}

function editTaskInLocalStorage(oldTaskName, newTaskName) {
    const tasks = getTasksFromLocalStorage();
    const task = tasks.find(task => task.task === oldTaskName);
    task.task = newTaskName;
    saveTasksToLocalStorage(tasks);
}

function toggleCompleteInLocalStorage(taskName) {
    const tasks = getTasksFromLocalStorage();
    const task = tasks.find(task => task.task === taskName);
    task.completed = !task.completed;
    saveTasksToLocalStorage(tasks);
}
