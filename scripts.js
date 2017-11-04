$(document).ready(function() {
  prependAll(getGoalFromStorage());
});



// ------------------- EVENT LISTENERS ---------------------
$('.smartgoal-card-section').on('click', '#delete', deleteCard);
$(".smartgoal-card-section").on('click', '.upvote-btn', upImportance);
$(".smartgoal-card-section").on('click', '.downvote-btn', downImportance);
$('.smartgoal-card-section').on('click', '.completed-task-btn', addClassOfCompletedTask);
$('.smartgoal-card-section').on('keyup', '#date', dateEditCheck);
$('.smartgoal-card-section').on('keyup', '#date', editTitle);
$('.smartgoal-card-section').on('keyup', '#goal', editBody);
$('.smartgoal-card-section').on('keyup', '#notes', editNotes);
$("#smartgoal-task, #smartgoal-title").on('keyup', enableSave);
$('#search-bar').on('keyup', searchCards);
$("#save-btn").on('click', disableSave);
$(document).on('click', '.delete-btn', deleteCard);
$(document).on('keyup', enterKeyBlur);
$('.bottom-container').on('click', '#none, #low, #normal, #high, #critical', filter);
$('#clear-filters').on('click', clearAndReplaceWithAll);
$('#show-completed-smartgoal').on('click', showCompleted);


// ------------FUNCTIONS------------

// ----------CONSTRUCTOR FUNCTION------------
function NewSmartGoal(title, body, id, notes) {
  this.title = title;
  this.body = body;
  this.id = id || Date.now();
  this.importance = 'normal';
  this.classy = false;
  this.notes = notes || '';
};

function addClassOfCompletedTask() {
  var currentCard = $(this).parents('.smart-goal-card');
  var id = $(this).parents('.smart-goal-card')[0].id;
  currentCard.toggleClass('completed-task');
  goalArray.forEach(function(card) {
    if (card.id == id) {
      card.classy = !card.classy;
   }
  });
  sendGoalsToStorage();
}

function prepareTheCardInfo(card) {
  var initialClass;
  if (card.classy) {
    initialClass = 'smart-goal-card completed-task';
  }
  prependCard(card, initialClass);
}


// function injectableCode(Goal) {
//   return `<div class="${Goal.classy} smart-goal-card" id="${Goal.id}">
//             <div class="card-title-flex">
//               <h3>Date: </h3>
//               <div class="delete-btn" id="delete"></div>
//             </div>
//               <h4 id="date" contenteditable=true>${Goal.title}</h4>
//               <h3>Goal: </h3>
//               <h2 id="goal" contenteditable=true>${Goal.body}</h2>
//               <h3>Notes: </h3>
//                 <p id="notes" contenteditable=true placeholder="Enter notes/reflections here">${Goal.notes}</p>
//               <div class="card-quality-flex quality-spacing">
//               <div class="upvote-btn" id="upvote"></div>
//               <div class="downvote-btn" id="downvote"></div>
//               <h3>importance:
//               <span class="Goal-quality">${Goal.importance}</span></h3>
//               <button type="button" class="completed-task-btn">
//                   completed goal</button>
//               <hr>
//             </div>
//           </div>`;
// }

function injectableCode(Goal) {
  return `<div class="${Goal.classy} smart-goal-card" id="${Goal.id}">
            <div class="card-title-flex">
              <h3>Date: </h3>
              <div class="delete-btn" id="delete"></div>
            </div>
              <h4 id="date" contenteditable=true>${Goal.title}</h4>
              <h3>Goal: </h3>
              <h2 id="goal" contenteditable=true>${Goal.body}</h2>
              <h3>Notes: </h3>
                <p id="notes" contenteditable=true placeholder="Enter notes/reflections here">${Goal.notes}</p>
              <div class="card-quality-flex quality-spacing">
                <div class="up-down-container">
                  <div class="upvote-btn" id="upvote"></div>
                  <div class="downvote-btn" id="downvote"></div>
                </div>
              <h3>importance:
              <span class="Goal-quality">${Goal.importance}</span></h3>
              <button type="button" class="completed-task-btn">
                  completed goal</button>
              <hr>
            </div>
          </div>`;
}

function prependCard(Goal) {
  var injected = injectableCode(Goal);
  $(".smartgoal-card-section").prepend(injected);
}


function appendLastTenCards(Goal) {
  var injected = injectableCode(Goal);
  $(".smartgoal-card-section").prepend(injected);
}


function addCard() {
  var smartgoalTitle = $("#smartgoal-title").val();
  var smartgoalTask = $("#smartgoal-task").val();
  var newGoal = new NewSmartGoal(smartgoalTitle, smartgoalTask);
  prepareTheCardInfo(newGoal);
  goalArray.push(newGoal);
  sendGoalsToStorage();
};


function deleteCard() {
 var currentCardId = $(this).parent().parent()[0].id;
 goalArray.forEach(function(card, index) {
   if (currentCardId == card.id) {
     goalArray.splice(index, 1)
   }
 });
 sendGoalsToStorage()
 $(this).closest('.smart-goal-card').remove();
};


function upImportance() {
  // var id = $(this).parent().parent('.smart-goal-card')[0].id;
    var id = $(this).closest('.smart-goal-card')[0].id;
  var importanceArray = ['none', 'low', 'normal', 'high', 'critical'];
  goalArray.forEach(function(card, i) {
    if (card.id == id) {
      var currentIndex = importanceArray.indexOf(card.importance);
      currentIndex = (currentIndex != 4) ? currentIndex + 1 : currentIndex;
      card.importance = importanceArray[currentIndex];
      $(event.target).parent().siblings().find('span').text(card.importance);
    }
  })
  sendGoalsToStorage();
};


function downImportance() {
  var id = $(this).closest('.smart-goal-card')[0].id;
  var importanceArray = ['none', 'low', 'normal','high','critical'];
  goalArray.forEach(function(card) {
    if (card.id == id) {
      var currentIndex = importanceArray.indexOf(card.importance);
      currentIndex = (currentIndex !== 0) ? currentIndex - 1 : currentIndex;
      card.importance = importanceArray[currentIndex];
      $(event.target).parent().siblings().find('span').text(card.importance);
    }
  })
  sendGoalsToStorage();
};


function enterKeyBlur(e) {
  if (e.which === 13) {
    $(e.target).blur();
  }
}


function editTitle(event) {
  var id = $(this).closest('.smart-goal-card')[0].id;
  var title = $(this).text();
  var isDate = $(this).text();
  if (isDate) {
    enterKeyBlur(event);
    goalArray.forEach(function(card) {
      if (card.id == id) {
        card.title = title;
    }
  });
  sendGoalsToStorage();
}
};


function editBody(event) {
  var id = $(this).closest('.smart-goal-card')[0].id;
  var body = $(this).text();
  enterKeyBlur(event);
  goalArray.forEach(function(card) {
    if (card.id == id) {
      card.body = body;
    }
  });
  sendGoalsToStorage();
};

function editNotes(event) {
  var id = $(this).closest('.smart-goal-card')[0].id;
  var notes = $(this).text();
  enterKeyBlur(event);
  goalArray.forEach(function(card) {
    if (card.id == id) {
      card.notes = notes;
    }
  });
  sendGoalsToStorage();
};

function dateEditCheck(key) {
  $("#date").on("keypress", function(key) {
    if (key.charCode < 45 || key.charCode > 57)
      return false;
})
}


function sendGoalsToStorage() {
  localStorage.setItem("goalArray", JSON.stringify(goalArray));
};


//clean this up to reflect a non-global array object !!! //

function getGoalFromStorage() {
  goalArray = JSON.parse(localStorage.getItem("goalArray")) || [];
    return goalArray;
};


function filterOutClassy() {
  return goalArray.filter(function(el) {
    if (!el.classy) {
      return el;
    }
  })
}


function showAllGoals() {
  $('smartgoal-card-section').empty();
  var fullArray = goalArray;
  prependAll(fullArray);
}


function prependAll(ideaArray) {
  var lengthOfTenArray = filterOutClassy();
  lengthOfTenArray.slice(-10).forEach(function(el){
    appendLastTenCards(el);
  });
}

function showCompleted(ideaArray) {
  $('smartgoal-card-section').empty();
  var completedArray = goalArray;
  completedArray.forEach(function(el){
    appendLastTenCards(el);
  });
}


function enableSave() {
  if (($('#smartgoal-title').val() !== "") || ($('#smartgoal-task').val() !== '')) {
    $('#save-btn').removeAttr('disabled');
  }
};


function disableSave() {
  evalInputsAlertIfEmpty();
  $('#save-btn').attr('disabled', 'disabled');
};


function evalInputsAlertIfEmpty() {
  var smartgoalTitle = $('#smartgoal-title').val();
  var smartgoalTask = $('#smartgoal-task').val();
  if (!smartgoalTitle) {
    return alert('Please enter a task title.');
  } else if (!smartgoalTask) {
    return alert ('Please enter a task.');
  } else {
    addCard();
    resetInputs();
  }
};


function resetInputs() {
  $('#smartgoal-title').val('');
  $('#smartgoal-task').val('');
};


function searchCards() {
  var search = $(this).val().toUpperCase();
  var results = goalArray.filter(function(elementCard) {
                return elementCard.title.toString().toUpperCase().includes(search) ||
                elementCard.body.toUpperCase().includes(search)
                });
  $('.smartgoal-card-section').empty();
  for (var i = 0; i < results.length; i++) {
    prepareTheCardInfo(results[i]);
  }
};


function filter(event) {
  event.preventDefault()
  var arrayFromStorage = getGoalFromStorage();
  var importanceRating = $(event.target).text();
  var returnedFilterArray = arrayFromStorage.filter(function(element) {
                            return element.importance === importanceRating;
                            });
  filterInOrOut(returnedFilterArray);
}


function filterInOrOut(returnedFilterArray) {
  $('.smartgoal-card-section').empty();
  returnedFilterArray.forEach(function(smartgoal) {
    prepareTheCardInfo(smartgoal);
  })
}


function clearAndReplaceWithAll(e) {
  e.preventDefault();
  $('.smartgoal-card-section').empty();
  prependAll();

}


function filterTasksWithoutCompletedClass(e) {
  e.preventDefault();
  var storedArray = getGoalFromStorage();
}
