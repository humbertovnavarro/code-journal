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
var $filterBar = document.querySelector('.filter-bar');
function checkURL(url) {
  if (!url.startsWith('https://')) {
    return false;
  }
  return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function handleURLChange(event) {
  if (checkURL($photoUrl.value)) {
    $formImage.src = $photoUrl.value;
  } else {
    $formImage.src = 'images/placeholder-image-square.jpg';
  }
}

function handleEntryClick(event) {
  if (!event.target.matches('.icon')) {
    return;
  }
  var myEntryID = parseInt(event.target.getAttribute('data-entry-id'));
  for (var i = 0; i < data.entries.length; i++) {
    if (data.entries[i].entryID === myEntryID) {
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
  if (data.editing != null) {
    entry.entryID = data.entries[data.editing].entryID;
    entry.time = data.entries[data.editing].time;
    data.entries[data.editing] = entry;
    data.editing = null;
  } else {
    entry.time = Date.now();
    entry.entryID = data.nextEntryId;
    data.nextEntryId++;
    data.entries.push(entry);
  }
  resetForm();
  updateEntryView();
  showView('entries');
}

// Reset the filter bar / form
function handleFilterSubmit(event) {
  event.preventDefault();
  $filterBar.query.value = '';
  $filterBar.date.value = '';
  updateEntryView();
}
function handleFilterClick(event) {
  if (event.target.getAttribute('name') === 'before') {
    search();
  }
}

function resetForm() {
  $form.title.value = '';
  $form.url.value = '';
  $form.notes.value = '';
  $formImage.src = 'images/placeholder-image-square.jpg';
}

function showModal(event) {
  var $modal = document.createElement('div');
  $modal.className = 'modal';
  var $modalContainer = document.createElement('div');
  $modalContainer.className = 'modal-container';
  var $sure = document.createElement('p');
  $sure.textContent = 'Are you sure you want to delete this entry?';
  $sure.className = 'text-center padding-3rem';
  var $delete = document.createElement('button');
  $delete.className = 'delete-button';
  $delete.textContent = 'CONFIRM';
  var $cancel = document.createElement('button');
  $cancel.className = 'cancel-button';
  $cancel.textContent = 'CANCEL';
  var $rowOne = document.createElement('div');
  $rowOne.className = 'row justify-center align-center margin-2rem';
  var $rowTwo = document.createElement('div');
  $rowTwo.className = 'row row-reverse align-center space-between margin-2rem';
  $modal.appendChild($modalContainer);
  $rowOne.appendChild($sure);
  $rowTwo.appendChild($cancel);
  $rowTwo.appendChild($delete);
  $modalContainer.appendChild($rowOne);
  $modalContainer.appendChild($rowTwo);
  document.body.appendChild($modal);
  $rowTwo.appendChild($delete);
  $rowTwo.appendChild($cancel);
  $modal.addEventListener('click', function (event) {
    if (event.target.className === 'delete-button') {
      data.entries.splice(data.editing, 1);
      showView('entries');
      updateEntryView();
      document.body.removeChild($modal);
    }
    if (event.target.className === 'cancel-button') {
      document.body.removeChild($modal);
    }
  });
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
  $flexDiv.className = 'row space-between';
  $heading.textContent = entry.title;
  var $timeStamp = document.createElement('p');
  $timeStamp.className = 'timestamp';
  var myDate = new Date(entry.time);
  $timeStamp.textContent = myDate.toLocaleDateString() + ' ' + myDate.toLocaleTimeString();
  var $paragraph = document.createElement('p');
  $paragraph.textContent = entry.notes;
  $entryImageContainer.appendChild($entryImage);
  $imageColumn.appendChild($entryImageContainer);
  $flexDiv.appendChild($heading);
  $flexDiv.appendChild($editIcon);
  $textColumn.appendChild($flexDiv);
  $textColumn.appendChild($paragraph);
  $imageColumn.appendChild($timeStamp);
  $entry.appendChild($imageColumn);
  $entry.appendChild($textColumn);
  return $entry;
}

function search() {
  var query = $filterBar.query.value;
  var date = null;
  if ($filterBar.date.value !== '') {
    date = new Date(Date.parse($filterBar.date.value));
  }
  var before = null;
  before = $filterBar.before.value;
  switch (before) {
    case 'after':
      before = false;
      break;
    case 'before':
      before = true;
      break;
  }
  updateEntryView(query, date, before);
}

function updateEntryView(query = '', date = null, before) {
  $entryList.innerHTML = '';
  var entries = data.entries;
  if (query !== '') {
    entries = getSearchResults(query);
  }
  if (date && before !== null && before !== undefined) {
    entries = getBeforeOrAfter(date, entries, before);
  }
  for (var i = 0; i < entries.length; i++) {
    $entryList.appendChild(createEntry(entries[i]));
  }
  if (entries.length <= 0) {
    var $error = document.createElement('div');
    var $errorMessage = document.createElement('p');
    $errorMessage.className = 'text-center';
    if (query !== '') {
      $errorMessage.textContent = 'No results!';
    } else {
      $errorMessage.textContent = 'No entries have been recorded.';
    }
    $error.appendChild($errorMessage);
    $entryList.appendChild($error);
  }
}

function getBeforeOrAfter(date, entries, before) {
  var result = [];
  var timestamp = date.getTime();
  for (var i = 0; i < entries.length; i++) {
    if (!before && entries[i].time > timestamp) {
      result.push(entries[i]);
    }
    if (before && entries[i].time < timestamp) {
      result.push(entries[i]);
    }
  }
  return result;
}

function getSearchResults(searchQuery) {
  var result = [];
  for (var i = 0; i < data.entries.length; i++) {
    if (data.entries[i].notes.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1) {
      result.push(data.entries[i]);
    } else if (data.entries[i].title.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1) {
      result.push(data.entries[i]);
    }
  }
  return result;
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
      if (data.editing === null) {
        $deleteTarget.className = 'delete-target hidden';
      } else {
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
$filterBar.date.addEventListener('input', function (event) {
  search();
});
$filterBar.query.addEventListener('input', function (event) {
  search();
});
$filterBar.addEventListener('submit', handleFilterSubmit);
$filterBar.addEventListener('click', handleFilterClick);
$photoUrl.addEventListener('input', handleURLChange);
$form.addEventListener('submit', handleFormSubmit);
$entriesTab.addEventListener('click', function (event) {
  showView('entries');
});
$newEntryButton.addEventListener('click', function () {
  data.editing = null;
  resetForm();
  showView('entry-form');
});
$deleteTarget.addEventListener('click', showModal);
$entries.addEventListener('click', handleEntryClick);
window.addEventListener('DOMContentLoaded', function (event) {
  if (data.entries === null) {
    wipe();
  }
  if (data.editing !== null) {
    data.editing = null;
  }
  updateEntryView();
  showView(data.view);
});
