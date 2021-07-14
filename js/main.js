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

function checkURL(url) {
  if(!url.startsWith('https://')){
    return false;
  }
  return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function handleURLChange(event) {
  if(checkURL($photoUrl.value)){
    $formImage.src = $photoUrl.value;
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  var entry = {
    title: $form.title.value,
    url: $formImage.src,
    notes: $form.notes.value,
    entryID: data.nextEntryId
  };
  data.entries.push(entry);
  $form.title.value = '';
  $form.url.value = '';
  $form.notes.value = '';
  $formImage.src = 'images/placeholder-image-square.jpg';
  data.nextEntryId++;
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
  $heading.textContent = entry.title;
  var $paragraph = document.createElement('p'); 
  $paragraph.textContent = entry.notes;
  $entryImageContainer.appendChild($entryImage); 
  $imageColumn.appendChild($entryImageContainer);
  $textColumn.appendChild($heading);
  $textColumn.appendChild($paragraph);
  $entry.appendChild($imageColumn);
  $entry.appendChild($textColumn);
  return $entry;
}

function updateEntryView() {
  $entryList.innerHTML = '';
  for(var i = 0; i < data.entries.length; i++) {
    $entryList.appendChild(createEntry(data.entries[i]));
  }
  if(data.entries <= 0) {
    var $error = document.createElement('div');
    var $errorMessage = document.createElement('p');
    $errorMessage.className = "text-center"
    $errorMessage.textContent = 'No entries have been recorded.';
    $error.appendChild($errorMessage);
    $entryList.appendChild($error);
  }
}

function showView(view) {
  switch(view) {
    case 'entries':
      updateEntryView();
      data.view = 'entries';
      $entryForm.className = 'entry-form hidden';
      $entries.className = 'entries';
      return 'entries';
    break;
    case 'entry-form':
      data.view = 'entry-form';
      $entryForm.className = 'entry-form';
      $entries.className = 'entries hidden';
      return 'entry-form';
    break;
  }
}

function wipe() {
  data = {
    view: 'entry-form',
    entries: [],
    editing: null,
    nextEntryId: 1
  };
  dataJSON = JSON.stringify(data);
  localStorage.setItem('entries',dataJSON);
}

$photoUrl.addEventListener('input',handleURLChange);
$form.addEventListener('submit', handleFormSubmit);

$entriesTab.addEventListener('click',function(event) {
  showView('entries');
});

$newEntryButton.addEventListener('click', function() {
  showView('entry-form');
})

window.addEventListener('DOMContentLoaded', function(event){
  if(data.entries === undefined){
    wipe();
  }
  showView(data.view);
});
