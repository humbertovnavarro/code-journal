/* global data */
/* exported data */
var entries = [];
var nextEntryId = 0;
var entryID
var $image = document.querySelector('.form-image');
var $photoUrl = document.querySelector('.photo-url');
var $form = document.querySelector('form');

function handleURLChange(event) {
  if(checkURL($photoUrl.value)){
    $image.src = $photoUrl.value;
  }
}
function handleFormSubmit(event) {
  event.preventDefault();
  var entry = {
    title: $form.title.value,
    url: $form.url.value,
    notes: $form.notes.value,
    entryID: nextEntryId
  };
  entries.push(entry);
  $form.title.value = '';
  $form.url.value = '';
  $form.notes.value = '';
  $image.src = 'images/placeholder-image-square.jpg'
  entryID++;
}
$photoUrl.addEventListener('input',handleURLChange);
$form.addEventListener('submit', handleFormSubmit);

function checkURL(url) {
  if(!url.startsWith('https://')){
    return false;
  }
  return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
