/* global data */
/* exported data */
var entries = [];
var nextEntryId = 0;
var $image = document.querySelector('.form-image');
var $photoUrl = document.querySelector('.photo-url');
var $form = document.querySelector('form');
if(localStorage.getItem('entries') !== null) {
 entries = JSON.parse(localStorage.getItem('entries'));
 var biggest = entries[0].entryId;
 for(var i = 0; i < entries.length; i++) {
  if(entries[i].entryId > biggest) {
    biggest = entries[i].entryId;
  }
 }
 nextEntryId = biggest;
}

function checkURL(url) {
  if(!url.startsWith('https://')){
    return false;
  }
  return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function handleURLChange(event) {
  if(checkURL($photoUrl.value)){
    $image.src = $photoUrl.value;
  }
}
function handleFormSubmit(event) {
  nextEntryId++;
  event.preventDefault();
  var entry = {
    title: $form.title.value,
    url: $form.url.value,
    notes: $form.notes.value,
    entryId: nextEntryId
  };
  entries.push(entry);
  $form.title.value = '';
  $form.url.value = '';
  $form.notes.value = '';
  $image.src = 'images/placeholder-image-square.jpg';
  var entriesString = JSON.stringify(entries);
  localStorage.setItem('entries',entriesString);
}
$photoUrl.addEventListener('input',handleURLChange);
$form.addEventListener('submit', handleFormSubmit);
