/* global data */
/* exported data */
var $formImage = document.querySelector('.form-image');
var $photoUrl = document.querySelector('#entry-url');
var $form = document.querySelector('form');
var $entryList = document.querySelector('.entry-list');
var $entriesTab = document.querySelector('.entries-tab');
var $newEntryButton = document.querySelector('.new-entry-button');
var $entryForm = document.querySelector('.entry-form');
var $entries = document.querySelector('.entries');
var $deleteTarget = document.querySelector('.delete-target');
function checkURL(url) {
  if (!url.startsWith('https://')) {
    return false;
  }
  return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function handleURLChange(event) {
  if (checkURL($photoUrl.value)) {
    $formImage.src = $photoUrl.value;
  }
  else {
    $formImage.src = 'images/placeholder-image-square.jpg';
  }
}

function handleEntryClick(event) {
  if (!event.target.matches('.icon')) {
    return;
  }
  var myEntryID = parseInt(event.target.getAttribute('data-entry-id'));
  for(var i = 0; i < data.entries.length; i++) {
    if(data.entries[i].entryID === myEntryID){
      data.editing = i;
    }
  }
  $form.title.value = data.entries[data.editing].title;
  $form.notes.value = data.entries[data.editing].notes;
  $form.url.value = data.entries[data.editing].url;
  $formImage.src = data.entries[data.editing].url;
  showView('entry-form');
}

function handleFormSubmit(event) {
  event.preventDefault();
  var entry = {
    title: $form.title.value,
    url: $formImage.src,
    notes: $form.notes.value
  };
  if(data.editing != null) {
    entry.entryID = data.entries[data.editing].entryID;
    data.entries[data.editing] = entry;
    data.editing = null;
  } else {
    entry.entryID = data.nextEntryId;
    data.nextEntryId++;
    data.entries.push(entry);
  }
  $form.title.value = '';
  $form.url.value = '';
  $form.notes.value = '';
  $formImage.src = 'images/placeholder-image-square.jpg';
  updateEntryView();
  showView('entries');
}

function createEntry(entry) {
  var $entry = document.createElement('li');
  $entry.className = 'row';
  var $imageColumn = document.createElement('div');
  $imageColumn.className = 'column-half';
  var $textColumn = document.createElement('div');
  $textColumn.className = 'column-half';
  var $entryImage = document.createElement('img');
  $entryImage.src = entry.url;
  var $entryImageContainer = document.createElement('div');
  $entryImageContainer.className = 'image-container';
  var $heading = document.createElement('h1');
  var $flexDiv = document.createElement('div');
  var $editIcon = document.createElement('img');
  $editIcon.setAttribute('data-entry-id', entry.entryID);
  $editIcon.className = 'icon';
  $editIcon.src = 'https://img.icons8.com/material-outlined/24/000000/edit--v1.png';
  $flexDiv.className = "row space-between";
  $heading.textContent = entry.title;
  var $paragraph = document.createElement('p');
  $paragraph.textContent = entry.notes;
  $entryImageContainer.appendChild($entryImage);
  $imageColumn.appendChild($entryImageContainer);
  $flexDiv.appendChild($heading);
  $flexDiv.appendChild($editIcon);
  $textColumn.appendChild($flexDiv);
  $textColumn.appendChild($paragraph);
  $entry.appendChild($imageColumn);
  $entry.appendChild($textColumn);
  return $entry;
}

function updateEntryView() {
  $entryList.innerHTML = '';
  for (var i = 0; i < data.entries.length; i++) {
    $entryList.appendChild(createEntry(data.entries[i]));
  }
  if (data.entries <= 0) {
    var $error = document.createElement('div');
    var $errorMessage = document.createElement('p');
    $errorMessage.className = "text-center"
    $errorMessage.textContent = 'No entries have been recorded.';
    $error.appendChild($errorMessage);
    $entryList.appendChild($error);
  }
}

function showView(view) {
  switch (view) {
    case 'entries':
      data.view = 'entries';
      $entryForm.className = 'entry-form hidden';
      $entries.className = 'entries';
      return 'entries';
    case 'entry-form':
      data.view = 'entry-form';
      $entryForm.className = 'entry-form';
      $entries.className = 'entries hidden';
      if(data.editing === null) {
        $deleteTarget.className = 'delete-target hidden';
      }
      else {
        $deleteTarget.className = 'delete-target';
      }
      return 'entry-form';
  }
}

function wipe() {
  data = {
    view: 'entry-form',
    entries: [],
    editing: null,
    nextEntryId: 1
  };
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('entries', dataJSON);
}

$photoUrl.addEventListener('input', handleURLChange);
$form.addEventListener('submit', handleFormSubmit);

$entriesTab.addEventListener('click', function (event) {
  //data.editing = null;
  showView('entries');
});

$newEntryButton.addEventListener('click', function () {
  //data.editing = null;
  showView('entry-form');
})

$entries.addEventListener('click', handleEntryClick);

window.addEventListener('DOMContentLoaded', function (event) {
  if (data.entries === undefined) {
    wipe();
  }
  updateEntryView();
  showView(data.view);
});
