let completeList = [];
let pendingList = [];
const addButton= document.getElementById('add');
const inputTask= document.getElementById('addTask');
let pendingTasks= document.getElementById('pending-col');
let completedTasks= document.getElementById('done-col');
let searchInput = document.getElementById('searchTask');
const dropdownItems = document.querySelectorAll('.dropdown-menu a');
const dropdownButton = document.querySelector('.dropdown-toggle');
addButton.addEventListener('click',function (){
    let task = inputTask.value;
    if(task === ''){
        return;
    }
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            let selectedPriority = this.textContent;
            dropdownButton.textContent = selectedPriority;
        });
    });

    pendingList.push(task);
    inputTask.value='';
    renderTasks();
});

function completed(index){
    let task = pendingList[index];
    completeList.push(task);
    pendingList.splice(index,1);
    renderTasks();
}

function renderTasks(){
    pendingTasks.innerHTML='';
    pendingList.forEach((task, index) => {
           let li = document.createElement("li");
           li.classList.add('card-body');
           li.textContent= task;
           let completebutton = document.createElement("button");
           completebutton.classList.add('completed-btn');
           const image = document.createElement('img');
           image.src = '../resources/check.png';
           image.alt = 'Completed';
           completebutton.appendChild(image);
           completebutton.addEventListener('click', function () {completed(index)});
           let div = document.createElement("div");
           li.appendChild(completebutton);
           pendingTasks.appendChild(li);
       });
    completedTasks.innerHTML='';
    completeList.forEach((task) => {
        let li = document.createElement("li");
        li.textContent= task;
        li.classList.add('card-body');
        li.style.fontStyle = 'italic';
        completedTasks.appendChild(li);
    });
}

searchInput.addEventListener('keyup', function () {
    let searchValue = searchInput.value;
    let filteredTasks = pendingList.filter((task) => {
        return task.toLowerCase().includes(searchValue.toLowerCase());
    });
    pendingTasks.innerHTML='';
    filteredTasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.textContent= task;
        let completebutton = document.createElement("button");
        completebutton.classList.add('completed-btn');
        const image = document.createElement('img');
        image.src = '../resources/check.png';
        image.alt = 'Completed';
        completebutton.appendChild(image);
        completebutton.addEventListener('click', function () {completed(index)});
        let div = document.createElement("div");
        li.appendChild(completebutton);
        pendingTasks.appendChild(li);
    });

});





