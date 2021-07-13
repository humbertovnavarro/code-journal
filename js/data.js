/* exported data */
var data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1
};

if(localStorage.getItem('entries') !== null) {
  data = JSON.parse(localStorage.getItem('entries'));
}

window.addEventListener('beforeunload', function(event){
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('entries',dataJSON);
});

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
