/* global data */
/* exported data */
var $image = document.querySelector('.form-image');
var $photoUrl = document.querySelector('.photo-url');
function handleURLChange(event) {
  if(checkURL($photoUrl.value)){
    $image.src = $photoUrl.value;
  }
}
$photoUrl.addEventListener('input',handleURLChange);

function checkURL(url) {
  if(!url.startsWith('https://')){
    return false;
  }
  return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
