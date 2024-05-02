// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || []

console.log(taskList);


// Todo: create a function to generate a unique task id
function generateTaskId() {
    const timestamp = new Date().getTime(); // Get current timestamp
    const randomNum = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
    const uniqueId = timestamp + '-' + randomNum; // Combine timestamp and random number

    return uniqueId;
}
const taskId = generateTaskId();
console.log(taskId);


// Todo: create a function to create a task card
function createTaskCard(task) {
    //create task card element
    const taskcard = $('<div>').addClass('task-card').attr('data-id', task.id);
    //document.createElement('card');
    //taskcard.classList.add('task-card');
    // taskcard.setAttribute("data-id", task.id)
    //create element for title/due date/description
    const titleElement = $('<h3>').text(task.title);
    //due date
    const dueDateEl = $('<h4>').text(task.dueDate);
    //description
    const descriptionEl = $('<p>').text(task.description);
    //delete button
    const deleteBttn = $('<button>').text('Delete').addClass('delete-button');
    //add event listner to delete bttn to remove task card
    deleteBttn.on("click", handleDeleteTask);

    if (task.status !== 'done') {
        const today = dayjs();
        if (today.isSame(task.dueDate, 'day')) {
            taskcard.addClass('bg-warning text-white')
        }
        else if (today.isAfter(task.dueDate)) {
            console.log(taskcard);
            taskcard.addClass('bg-danger text-white')

        }
    }

    //append elements to task card
    taskcard.append(titleElement, dueDateEl, descriptionEl, deleteBttn);

    return taskcard;
}

// Todo: create a function to render the task list and make cards draggable, puts data on screen
function renderTaskList() {
    $("#todo-cards").empty();
    $("#in-progress-cards").empty();
    $("#done-cards").empty();
    for (let task of taskList) {
        if (task.status === "to-do") {
            $("#todo-cards").append(createTaskCard(task))
        } else if (task.status === "in-progress") {
            $("#in-progress-cards").append(createTaskCard(task))
        } else { $("#done-cards").append(createTaskCard(task)) }
    }
    $(".task-card").draggable({
        opacity: 0.7, zIndex: 100
    })
}



// Todo: create a function to handle adding a new task

    function handleAddTask(event) {
        event.preventDefault();

        const task = {
            id: generateTaskId(),
            title: $("#taskTitle").val(),
            description: $("#taskDescription").val(),
            dueDate: $("#taskDueDate").val(),
            status: "to-do"
        };

        taskList.push(task);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();

        $("#taskTitle, #taskDescription, #taskDueDate").val("");
    }

    // Todo: create a function to handle deleting a task
    function handleDeleteTask(event) {
        const taskid = $(event.target).parent().data('id');
        console.log(taskid);

        taskList = taskList.filter(task => task.id !== taskid);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    }

    // Todo: create a function to handle dropping a task into a new status lane
    function handleDrop(event, ui) {
        //used to access draggable El and get value of id attr stored in data-id attr
        const taskid = $(ui.draggable[0]).data('id');
        //used to get the ID of the target El where items are dropped
        const status = $(event.target).attr('id');
        //used to find and update task with macthing IS in the taskList array
        $.each(taskList, function (index, task) {
            if (task.id === Number(taskid)) {
                task.status = status;
            }
        });
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    }

    // Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
    $(document).ready(function () {
        $("#taskDueDate").datepicker();
        $("#taskForm").on("submit", handleAddTask);

        $(".lane").droppable({
            accept: ".task-card",
            drop: handleDrop
        });
        renderTaskList();
    });