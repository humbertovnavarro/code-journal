/* global data */
/* exported data */
var $image = document.querySelector('.form-image');
var $photoUrl = document.querySelector('#entry-url');
var $form = document.querySelector('form');


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
  data.nextEntryId++;
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
  $image.src = 'images/placeholder-image-square.jpg';
}

$photoUrl.addEventListener('input',handleURLChange);
$form.addEventListener('submit', handleFormSubmit);
