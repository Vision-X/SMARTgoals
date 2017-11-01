$(document).ready(function() {
  prependAll(getToDoFromStorage());
});

// $(document).ready(function() {
//     $('#date').keypress(function(key) {
//         if (key.charCode < 45 || key.charCode > 57)
//           return false;
//     })
//   };

// ------------------- EVENT LISTENERS ---------------------
$('.todo-card-section').on('click', '#delete', deleteCard);
$(".todo-card-section").on('click', '.upvote-btn', upImportance);
$(".todo-card-section").on('click', '.downvote-btn', downImportance);
$('.todo-card-section').on('click', '.completed-task-btn', addClassOfCompletedTask);
$('.todo-card-section').on('keyup', '#date', dateEditCheck);
$('.todo-card-section').on('keyup', '#date', editTitle);
$('.todo-card-section').on('keyup', '#goal', editBody);
$('.todo-card-section').on('keyup', '#notes', editNotes);
$("#todo-task, #todo-title").on('keyup', enableSave);
$('#search-bar').on('keyup', searchCards);
$("#save-btn").on('click', disableSave);
$(document).on('click', '.delete-btn', deleteCard);
$(document).on('keyup', enterKeyBlur);
$('.bottom-container').on('click', '#none, #low, #normal, #high, #critical', filter);
$('#clear-filters').on('click', clearAndReplaceWithAll);
$('#show-completed-todo').on('click', showCompleted);


// ------------FUNCTIONS------------

// ----------CONSTRUCTOR FUNCTION------------
function NewToDo(title, body, id, notes) {
  this.title = title;
  this.body = body;
  this.id = id || Date.now();
  this.importance = 'normal';
  this.classy = false;
  this.notes = notes || '';
};

function addClassOfCompletedTask() {
  var currentCard = $(this).parents('.to-do-card');
  var id = $(this).parents('.to-do-card')[0].id;
  currentCard.toggleClass('completed-task');
  toDoArray.forEach(function(card) {
    if (card.id == id) {
      card.classy = !card.classy;
   }
  });
  sendToDosToStorage();
}

function prepareTheCardInfo(card) {
  var initialClass;
  if (card.classy) {
    initialClass = 'to-do-card completed-task';
  }
  prependCard(card, initialClass);
}


// function injectableCode(ToDo) {
//   return `<div class="${ToDo.classy} to-do-card" id="${ToDo.id}">
//             <div class="card-title-flex">
//               <h2 contenteditable=true>${ToDo.title}</h2>
//               <div class="delete-btn" id="delete"></div>
//             </div>
//               <p contenteditable=true>${ToDo.body}</p>
//               <div class="card-quality-flex quality-spacing">
//               <div class="upvote-btn" id="upvote"></div>
//               <div class="downvote-btn" id="downvote"></div>
//               <h3>importance:
//               <span class="ToDo-quality">${ToDo.importance}</span></h3>
//               <button type="button" class="completed-task-btn">
//                 completed task</button>
//               <hr>
//             </div>
//           </div>`;
// }


function injectableCode(ToDo) {
  console.log("injectableCode " , ToDo);
  return `<div class="${ToDo.classy} to-do-card" id="${ToDo.id}">
            <div class="card-title-flex">
              <h3>Date: </h3>
              <div class="delete-btn" id="delete"></div>
            </div>
              <h2 id="date" contenteditable=true>${ToDo.title}</h2>
              <h3>Goal: </h3>
              <h2 id="goal" contenteditable=true>${ToDo.body}</h2>
              <h3>Notes: </h3>
                <p id="notes" contenteditable=true placeholder="Enter notes/reflections here">${ToDo.notes}</p>
              <div class="card-quality-flex quality-spacing">
              <div class="upvote-btn" id="upvote"></div>
              <div class="downvote-btn" id="downvote"></div>
              <h3>importance:
              <span class="ToDo-quality">${ToDo.importance}</span></h3>
              <button type="button" class="completed-task-btn">
                  completed goal</button>
              <hr>
            </div>
          </div>`;
}



function prependCard(ToDo) {
  var injected = injectableCode(ToDo);
  $(".todo-card-section").prepend(injected);
}


function appendLastTenCards(ToDo) {
  var injected = injectableCode(ToDo);
  $(".todo-card-section").prepend(injected);
}


function addCard() {
  var todoTitle = $("#todo-title").val();
  var todoTask = $("#todo-task").val();
  var newToDo = new NewToDo(todoTitle, todoTask);
  prepareTheCardInfo(newToDo);
  toDoArray.push(newToDo);
  sendToDosToStorage();
};


function deleteCard() {
 var currentCardId = $(this).parent().parent()[0].id;
 toDoArray.forEach(function(card, index) {
   if (currentCardId == card.id) {
     toDoArray.splice(index, 1)
   }
 });
 sendToDosToStorage()
 $(this).closest('.to-do-card').remove();
};


function upImportance() {
  var id = $(this).parent().parent('.to-do-card')[0].id;
  var importanceArray = ['none', 'low', 'normal', 'high', 'critical'];
  toDoArray.forEach(function(card, i) {
    if (card.id == id) {
      var currentIndex = importanceArray.indexOf(card.importance);
      currentIndex = (currentIndex != 4) ? currentIndex + 1 : currentIndex;
      card.importance = importanceArray[currentIndex];
      $(event.target).siblings().find('span').text(card.importance);
    }
  })
  sendToDosToStorage();
};


function downImportance() {
  var id = $(this).closest('.to-do-card')[0].id;
  var importanceArray = ['none', 'low', 'normal','high','critical'];
  toDoArray.forEach(function(card) {
    if (card.id == id) {
      var currentIndex = importanceArray.indexOf(card.importance);
      currentIndex = (currentIndex !== 0) ? currentIndex - 1 : currentIndex;
      card.importance = importanceArray[currentIndex];
      $(event.target).siblings().find('span').text(card.importance);
    }
  })
  sendToDosToStorage();
};


function enterKeyBlur(e) {
  if (e.which === 13) {
    $(e.target).blur();
  }
}


function editTitle(event) {
  var id = $(this).closest('.to-do-card')[0].id;
  var title = $(this).text();
  var isDate = $(this).text();
  if (isDate) {
    enterKeyBlur(event);
    toDoArray.forEach(function(card) {
      if (card.id == id) {
        card.title = title;
    }
  });
  sendToDosToStorage();
}
};


function editBody(event) {
  var id = $(this).closest('.to-do-card')[0].id;
  var body = $(this).text();
  enterKeyBlur(event);
  toDoArray.forEach(function(card) {
    if (card.id == id) {
      card.body = body;
    }
  });
  sendToDosToStorage();
};

function editNotes(event) {
  var id = $(this).closest('.to-do-card')[0].id;
  var notes = $(this).text();
  enterKeyBlur(event);
  toDoArray.forEach(function(card) {
    if (card.id == id) {
      card.notes = notes;
    }
  });
  sendToDosToStorage();
};

function dateEditCheck(key) {
  // console.log(key);
  $("#date").on("keypress", function(key) {
    if (key.charCode < 45 || key.charCode > 57)
      return false;
})
}


function sendToDosToStorage() {
  localStorage.setItem("toDoArray", JSON.stringify(toDoArray));
  console.log(toDoArray, "todoarray-setter");
};


//clean this up to reflect a non-global array object !!! //

function getToDoFromStorage() {
  toDoArray = JSON.parse(localStorage.getItem("toDoArray")) || [];
    return toDoArray;
};

function filterOutClassy() {
  return toDoArray.filter(function(el) {
    if (!el.classy) {
      return el;
    }
  })
}


function showAllToDos() {
  $('todo-card-section').empty();
  var fullArray = toDoArray;
  prependAll(fullArray);
}


function prependAll(ideaArray) {
  var lengthOfTenArray = filterOutClassy();
  lengthOfTenArray.slice(-10).forEach(function(el){
    appendLastTenCards(el);
  });
}

function showCompleted(ideaArray) {
  $('todo-card-section').empty();
  var completedArray = toDoArray;
  completedArray.forEach(function(el){
    appendLastTenCards(el);
  });
}


function enableSave() {
  if (($('#todo-title').val() !== "") || ($('#todo-task').val() !== '')) {
    $('#save-btn').removeAttr('disabled');
  }
};


function disableSave() {
  evalInputsAlertIfEmpty();
  $('#save-btn').attr('disabled', 'disabled');
};


function evalInputsAlertIfEmpty() {
  var todoTitle = $('#todo-title').val();
  var todoTask = $('#todo-task').val();
  if (!todoTitle) {
    return alert('Please enter a task title.');
  } else if (!todoTask) {
    return alert ('Please enter a task.');
  } else {
    addCard();
    resetInputs();
  }
};


function resetInputs() {
  $('#todo-title').val('');
  $('#todo-task').val('');
};


function searchCards() {
  var search = $(this).val().toUpperCase();
  var results = toDoArray.filter(function(elementCard) {
                return elementCard.title.toString().toUpperCase().includes(search) ||
                elementCard.body.toUpperCase().includes(search)
                });
  $('.todo-card-section').empty();
  for (var i = 0; i < results.length; i++) {
    prepareTheCardInfo(results[i]);
  }
};


function filter(event) {
  event.preventDefault()
  var arrayFromStorage = getToDoFromStorage();
  var importanceRating = $(event.target).text();
  var returnedFilterArray = arrayFromStorage.filter(function(element) {
                            return element.importance === importanceRating;
                            });
  filterInOrOut(returnedFilterArray);
}


function filterInOrOut(returnedFilterArray) {
  $('.todo-card-section').empty();
  returnedFilterArray.forEach(function(todo) {
    prepareTheCardInfo(todo);
  })
}


function clearAndReplaceWithAll(e) {
  e.preventDefault();
  $('.todo-card-section').empty();
  prependAll();

}


function filterTasksWithoutCompletedClass(e) {
  e.preventDefault();
  var storedArray = getToDoFromStorage();
}
