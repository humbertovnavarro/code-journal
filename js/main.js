/* global data */
/* exported data */
var $formImage = document.querySelector('.form-image');
var $photoUrl = document.querySelector('#entry-url');
var $form = document.querySelector('form');
var $entryList = document.querySelector('.entry-list');

window.addEventListener('DOMContentLoaded', function(event){
  for(var i = 0; i < data.entries.length; i++) {
    $entryList.appendChild(createEntry(data.entries[i]));
  }
});

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
    url: $form.url.value,
    notes: $form.notes.value,
    entryID: data.nextEntryId
  };
  data.entries.push(entry);
  $form.title.value = '';
  $form.url.value = '';
  $form.notes.value = '';
  $formImage.src = 'images/placeholder-image-square.jpg';
  data.nextEntryId++;
}

function createEntry(entry) {
  var $entry = document.createElement('li');
  $entry.className = "row";
  var $imageColumn = document.createElement('div');
  $imageColumn.className = 'column-half';
  var $textColumn = document.createElement('div');
  $textColumn.className = "column-half";
  var $entryImage = document.createElement('img');
  $entryImage.src = entry.url;
  var $entryImageContainer = document.createElement('div');
  $entryImageContainer.className = "image-container";
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

$photoUrl.addEventListener('input',handleURLChange);
$form.addEventListener('submit', handleFormSubmit);
