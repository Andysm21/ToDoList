let completeList = [];
let pendingList = [];
const addButton = document.getElementById('add');
const refreshButton = document.getElementById('Refresh');
const inputTask = document.getElementById('addTask');
let pendingTasks = document.getElementById('pending-col');
let completedTasks = document.getElementById('done-col');
let searchInput = document.getElementById('searchTask');
let searchPriority = document.getElementById('prioritySearch');
let deleteButton = document.getElementById('deleteAll');

async function fetchFromDB() {
    pendingList = [];
    const querySnapshot = await firebase.firestore().collection('tasks').get();
    querySnapshot.forEach((doc) => {
        pendingList.push(doc.data());
    });
    console.log(pendingList);
}

async function completed(index) {
    let task = pendingList[index];
    task.isDone = true;
    await firebase.firestore().collection('tasks').doc(task.task).update({
        isDone: true
    });
    completeList.push(task.task);
    pendingList.splice(index, 1);
    await renderTasks();
}

async function renderTasks() {
    pendingTasks.innerHTML = '';
    completedTasks.innerHTML = '';
    await fetchFromDB();

    pendingList.forEach((task, index) => {
        if (!task.isDone) {
            let li = document.createElement("li");
            li.classList.add('card-body');
            li.textContent = task.task;
            let completeButton = document.createElement("button");
            completeButton.classList.add('completed-btn');
            const image = document.createElement('img');
            image.src = '../resources/check.png';
            image.alt = 'Completed';
            completeButton.appendChild(image);
            completeButton.addEventListener('click', () => completed(index));
            li.appendChild(completeButton);
            pendingTasks.appendChild(li);
        } else {
            let li = document.createElement("li");
            li.textContent = task.task;
            li.classList.add('card-body');
            li.style.fontStyle = 'italic';
            completedTasks.appendChild(li);
        }
    });
}

function addToDB(task, priority) {
    firebase.firestore().collection('tasks').doc(task).set({
        task: task,
        priority: priority,
        isDone: false
    }).then(() => {
        console.log("Task added to database.");
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
}

function renderFilteredTasks(filteredTasks) {
    filteredTasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.textContent = task.task;
        let completeButton = document.createElement("button");
        completeButton.classList.add('completed-btn');
        const image = document.createElement('img');
        image.src = '../resources/check.png';
        image.alt = 'Completed';
        completeButton.appendChild(image);
        completeButton.addEventListener('click', () => completed(index));
        li.appendChild(completeButton);
        pendingTasks.appendChild(li);
    });
}

addButton.addEventListener('click', async () => {
    let task = inputTask.value;
    if (task === '') {
        return;
    }
    let selectElement = document.querySelector('#priorityAdd');
    let priority = selectElement.options[selectElement.selectedIndex].value;
    addToDB(task, priority);
    inputTask.value = '';
    await renderTasks();
});

refreshButton.addEventListener('click', renderTasks);

searchInput.addEventListener('keyup', () => {
    let searchValue = searchInput.value;
    let selectElement = document.querySelector('#prioritySearch');
    let priority = selectElement.options[selectElement.selectedIndex].value;

    let filteredTasks = pendingList.filter((task) => {
        if (!task.isDone) {
            return task.task.toLowerCase().includes(searchValue.toLowerCase()) && (priority === 'All' || task.priority === priority);
        }
    });

    pendingTasks.innerHTML = '';
    renderFilteredTasks(filteredTasks);
});

searchPriority.addEventListener('change', () => {
    let selectElement = document.querySelector('#prioritySearch');
    let priority = selectElement.options[selectElement.selectedIndex].value;
    let searchValue = searchInput.value;

    let filteredTasks = pendingList.filter((task) => {
        if (!task.isDone) {
            return task.task.toLowerCase().includes(searchValue.toLowerCase()) && (priority === 'All' || task.priority === priority);
        }
    });

    pendingTasks.innerHTML = '';
    renderFilteredTasks(filteredTasks);
});

deleteButton.addEventListener('click', async () => {
    const tasksCollection = firebase.firestore().collection('tasks');
    const querySnapshot = await tasksCollection.get();

    for (const doc of querySnapshot) {
        const taskData = doc.data();
        if (taskData.isDone) {
            await tasksCollection.doc(doc.id).delete();
            console.log("Deleted task with ID:", doc.id);
        }
    }

    pendingList = [];
    await renderTasks();
});
