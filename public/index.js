//this function opens modal when clicked.
function createMap(){

document.getElementById("modal-backdrop").classList.remove("hidden");

document.getElementById("create-modal").style.display ="block";

}
//this function closes modal when clicked
function CloseModal(){

document.getElementById("modal-backdrop").classList.add("hidden");

document.getElementById("create-modal").style.display ="none";

document.getElementById("text-input").value = "";

document.getElementById("attribution-input").value = "";

}


//this fuction will create a map when create button is pressed.
function createMaping(){
  
  var author = document.getElementById("attribution-input").value;

var conent = document.createElement('article');

  if(map=='' || name==''){
      alert('you did not add a map name or create a map!');
      
  }else{
    
    conent.setAttribute('class','map');

       document.getElementById("container-div").append(conent);

       var innerelem = document.createElement('div');

       innerelem.setAttribute('class','icon');

       conent.append(innerelem);

       conent = innerelem;
    
    var innerelem = document.createElement('div');

       var content_elem = innerelem;

       innerelem.setAttribute('class',content');

       articeElem.append(innerelem);

       conent = innerelem;

       var innerelem = document.createElement('p');

       innerelem.setAttribute('class','map');

       innerelem.textContent = map;

       conent.append(innerelem);

       conent = innerelem;

       var innerelem = document.createElement('p');

       innerelem.setAttribute('class','attribution');

       content_elem.append(innerelem);

       conent = innerelem;

       var innerelem = document.createElement('a');

       innerelem.setAttribute('href','#');

       innerelem.textContent = author;

       conent.append(innerelem);

       conent = innerelem;

  CloseModal();
}
