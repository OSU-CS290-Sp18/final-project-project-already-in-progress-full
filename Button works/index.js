function createMap(){

document.getElementById("modal-backdrop").classList.remove("hidden");

document.getElementById("create-modal").style.display ="block";

}

function CloseModal(){

document.getElementById("modal-backdrop").classList.add("hidden");

document.getElementById("create-modal").style.display ="none";

document.getElementById("text-input").value = "";

document.getElementById("attribution-input").value = "";

}
