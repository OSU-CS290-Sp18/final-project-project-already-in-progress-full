// Remember to defer this script: <script src="canvas.js" charset="utf-8" defer></script>
function closeModal(){}
/**********************
 *  Global Variables  *
 **********************/

const active	= {color: 'rgb(200,200,200)', backgroundColor: 'rgb(30,30,30)'};
const inactive	= {color: 'rgb(0,0,0)', backgroundColor: 'rgb(200,200,200)'};
 
var buttonWallSingle	= document.getElementById('button-canvas-wall-single');
var buttonEraser		= document.getElementById('button-canvas-eraser');
var buttonClear			= document.getElementById('button-canvas-clear');
var buttonSave			= document.getElementById('button-canvas-save');
var mapCanvas			= document.getElementById('map-canvas');
var selectedTool 		= -1;

var homeLink			= document.getElementsByClassName('navlink')[0];
var environmentsLink	= document.getElementsByClassName('navlink')[1];
var modalBackdrop		= document.getElementById('modal-backdrop');
var createModal			= document.getElementById('create-modal');
var captionInput		= document.getElementById("text-input");
var createButton		= document.getElementById("createButton");

var cardContainer		= document.getElementsByClassName("container")[0];

/**********************
 *  Button Functions  *
 **********************/

// Open modal on button click
function unhideModal(e) {
	modalBackdrop.classList.remove("hidden");
	createModal.style.display ="block";
}

// Close modal on button click
function hideModal() {

modalBackdrop.classList.add("hidden");
createModal.style.display ="none";
captionInput.value = "";

}

// tool button color changer
function colorChange(buttonCode) {
	if(buttonCode == -1) {
		buttonWallSingle.style.color = active.color;
		buttonWallSingle.style.backgroundColor = active.backgroundColor;
	} else {
		buttonWallSingle.style.color = inactive.color;
		buttonWallSingle.style.backgroundColor = inactive.backgroundColor;
	}
	if(buttonCode == 1) {
		buttonEraser.style.color = active.color;
		buttonEraser.style.backgroundColor = active.backgroundColor;
	} else {
		buttonEraser.style.color = inactive.color;
		buttonEraser.style.backgroundColor = inactive.backgroundColor;
	}
}


// tool button event listeners
function eventListenerInit() {
	buttonWallSingle.addEventListener('click', function(e) {
			selectedTool = -1;
			colorChange(selectedTool);
	});
	buttonEraser.addEventListener('click', function(e) {
			selectedTool = 1;
			colorChange(selectedTool);
	});
}

// Modal event listeners
createButton.addEventListener('click', unhideModal())


// Navlink event listeners
homeLink.addEventListener('click', function(e) {
	if(e.button == 0) {
	var request = new XMLHttpRequest();
	var url = "/";
	request.open("GET", url);
	request.setRequestHeader('Content-Type', 'text/html');
	request.send();
	}
});

homeLink.addEventListener('click', function(e) {
	if(e.button == 0) {
	var request = new XMLHttpRequest();
	var url = "/environments/";
	request.open("GET", url);
	request.setRequestHeader('Content-Type', 'text/html');
	request.send();
	}
});


/******************
 * Map Submission *
 ******************/
function getEnvironmentFromURL() {
	var path = window.location.pathname;
	var pathParts = path.split('/');
	if (pathParts[1] === "environments") {
		return pathParts[2];
	} else {
		return null;
	}
}

/**********************
 *  Canvas Functions  *
 *    - Drawing		  *
 *    - Interaction	  *
 **********************/

// Pseudo-Constructor for drawn "Shape" objects
function Shape(x, y, w, h, fill) {
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 1;
	this.h = h || 1;
	this.fill = fill || '#000000';
}

// Draw this Shape to a given context
Shape.prototype.draw = function(ctx) {
	ctx.fillStyle = this.fill;
	ctx.fillRect(this.x, this.y, this.w, this.h);
}

// Determine if a point is inside the Shape's bounds
Shape.prototype.contains = function(mx, my) {
	return (this.x <= mx) && (this.x + this.w >= mx) &&
		   (this.y <= my) && (this.y + this.h >= my);
}
	//return (this.x <= mx) && (this.x + this.w >= mx) &&
	//   (this.y <= my) && (this.y + this.h >= my);


/******************
 * Drawing Canvas *
 ******************/
function CanvasState(canvas) {
	/*** Setup ***/
	
	this.canvas = canvas;
	
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext('2d');
	
	//Fix mouse coordinates with border or padding
	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		this.stylePaddingLeft	= parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)		|| 0;
		this.stylePaddingTop	= parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)		|| 0;
		this.styleBorderLeft	= parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)	|| 0;
		this.styleBorderTop		= parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)	|| 0;
	}
	
	// Fix mouse coordinates with fixed-position bars present on page
	var html = document.body.parentNode;
	this.htmlTop = html.offsetTop;
	this.htmlLeft = html.offsetLeft;
	
	/*** Track State ***/
	
	this.valid = false; // when false, the canvas will redraw everything
	this.shapes = []; // the collection of things to be drawn
	this.dragging = false; // Keep track of when we are dragging
	
	/*** Event Listeners ***/
	
	// "this" outside events refers to CanvasState.
	// "this" inside events refers to the canvas
	
	var myState = this; // CanvasState point of reference
	
	// Fix for double clicking causing text to highlight
	canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
	
	// mouse interaction
	canvas.addEventListener('mousedown', function(e) {
		if (e.button == 0) {
			var mouse = myState.getMouse(e);
			var shapes = myState.shapes;
			var l = shapes.length;
			var tileSize = this.height / 50;
			var mx = mouse.x;
			var my = mouse.y;
			var gridx = Math.floor(mx / tileSize)*tileSize;
			var gridy = Math.floor(my / tileSize)*tileSize;
			myState.dragging = true;
			
			switch(selectedTool) {
				case 1: // eraser
					for (var i = l-1; i >= 0; i--) {
						if (shapes[i].contains(mx, my)) {
							shapes.splice(i, 1);
							myState.valid = false;
						}
					}
					break;
				default: // draw walls - selectedTool should be -1
					for (var i = l-1; i >= 0; i--) {
						if (shapes[i].contains(mx, my)) {
							shapes.splice(i, 1);
						}
					}
					myState.addShape(new Shape(gridx, gridy, tileSize, tileSize, 'rgb(0,0,0)'));
			}
		}
	}, true);
	
	canvas.addEventListener('mousemove', function(e) {
		var mouse = myState.getMouse(e);
		var shapes = myState.shapes;
		var l = shapes.length;
		var tileSize = this.height / 50;
		var gridx = Math.floor(mouse.x / tileSize)*tileSize;
		var gridy = Math.floor(mouse.y / tileSize)*tileSize;
		if(myState.dragging) {
			switch(selectedTool) {
				case 1: // eraser
					for (var i = l-1; i >= 0; i--) {
						if (shapes[i].contains(gridx, gridy)) {
							shapes.splice(i, 1);
							myState.valid = false;
						}
					}
					break;
				default: // draw walls - selectedTool should be -1
					myState.addShape(new Shape(gridx, gridy, tileSize, tileSize, 'rgb(0,0,0)'));
			}
		}
	}, true);
	
	canvas.addEventListener('mouseup', function(e) {
		if(e.button == 1) {
			myState.dragging = false;
		}
	}, true);
	
	// canvas state buttons
	buttonClear.addEventListener('click', function(e) {
		var shapes = myState.shapes;
		var l = shapes.length;
		for (var i = l-1; i >= 0; i--) {
			shapes.pop();
		}
	});
	
		/*** modalAcceptClick ***/
	buttonSave.addEventListener('click', function(e) {
		var caption = captionInput.value.trim();
		var mapData = [];
		
		var shapes = myState.shapes;
		var l = shapes.length;
		var canvasSize = canvas.height;
		var tileSize = canvasSize / 50;
		if (caption) {
			var mapHasData = 0;
			
			// Initialize
			for (var i = 0; i < 50; i++) {
				for (var j = 0; j < 50; j++) {
					mapData[i*50 + j] = "0";
				}
			}
			// Copy Map
			console.log('mapData', mapData);
			for (var i = 0; i < 50; i++) {
				for (var j = 0; j < 50; j++) {
					for (var k = l-1; k >= 0; k--) {
						if (shapes[k].contains((j*tileSize + 1), (i*tileSize + 1))) {
							mapData[i*50 + j] = "1";
							mapHasData = 1;
						}
					}
				}
			}
			if (!mapHasData) {
				alert("Please draw a map");
			} else { // Submit Map
				var request = new XMLHttpRequest();
				var environment = getEnvironmentFromURL();
				var url = "/environments/" + environment + "/addMap";
				request.open("POST", url);
				
				var requestBody = JSON.stringify({
					caption: caption,
					mapData: mapData
				});
				
				request.addEventListener('load', function (event) {
					if (event.target.status === 200) {
						var mapTemplate = Handlebars.temapltes.map;
						var newMapHTML = mapTemplate({
							caption: caption,
							mapData: mapData
						});
						var mapContainer = document.querySelector('.map-container');
						mapContainer.insertAdjacentHTML('beforeend', newMapHTML);
					} else {
						alert("Error storing map: " + event.target.response);
					}
				});
				
				request.setRequestHeader('Content-Type', 'application/json');
				request.send(requestBody);
				
				closeModal();
			}
		} else {
			alert("Please input a caption");
		}
	});
	
	// Canvas refresh interval
	this.interval = 30;
	setInterval(function() { myState.draw(); }, myState.interval);
}

CanvasState.prototype.addShape = function(shape) {
	this.shapes.push(shape);
	this.valid = false;
}

CanvasState.prototype.draw = function() {
	// if state is invalid, redraw and validate
	if(!this.valid) {
		var ctx = this.ctx;
		var shapes = this.shapes;
		var l = shapes.length;
		
		// draw all shapes
		for(var i = 0; i < l; i++) {
			var shape = shapes[i];
			// if the shape is not on the canvas, we need not draw it
			if (shape.x > this.width || shape.y > this.height ||
				shape.x + shape.w < 0 || shape.y + shape.h < 0)
					continue;
			shapes[i].draw(ctx);
		}
		
		this.valid = true;
	}
}

CanvasState.prototype.getMouse = function(e) {
	var element = this.canvas, offsetX= 0, offsetY = 0, mx, my;
	
	// Compute the total offsetLeft
	if(element.offsetParent !== undefined) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	}
	
	// Add padding and border style widths to offsetLeft
	// Also add the <html> offsets for position:fixed bars
	offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
	offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
	
	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;
	
	// Return a simple JS object with defined x and y
	return{x: mx, y: my};
}

/******************
 * Display Canvas *
 ******************/
function displayCanvasState(canvas, displayValues) {
	
	this.canvas = canvas;
	
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext('2d');
	
	this.shapes = []; // the collection of things to be drawn
	
	var ctx = this.ctx
	var shapes = this.shapes;
	
	//Fix draw coordinates with border or padding
	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		this.stylePaddingLeft	= parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)		|| 0;
		this.stylePaddingTop	= parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)		|| 0;
		this.styleBorderLeft	= parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)	|| 0;
		this.styleBorderTop		= parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)	|| 0;
	}
	
	// Draw the image
	for(var i = 0; i < 50; i++) {
		for(var j = 0; j < 50; j++) {
			if(displayValues[i*50 + j]) {
				this.addShape(new Shape((tileSize*j), (tileSize*i), tileSize, tileSize, 'rgb(0,0,0)'));
			}
		}
	}
	
	// Refresh the Canvas
	var l = shapes.length;
	

	for(var i = 0; i < l; i++) {
		var shape = shapes[i];
		// if the shape is not on the canvas, we need not draw it
		if (shape.x > this.width || shape.y > this.height ||
			shape.x + shape.w < 0 || shape.y + shape.h < 0)
				continue;
		shapes[i].draw(ctx);
	}
}


displayCanvasState.prototype.addShape = function(shape) {
	this.shapes.push(shape);
	this.valid = false;
}

function initDisplayCanvasState() {
	
}

/**********************
 *   Initialization   *
 **********************/
 
 if (mapCanvas != undefined) {
	var s = new CanvasState(mapCanvas);
	var l = container.childElementCount;
	for(var i = 0; i < l; i++) {
		var canv = container.
		var data = container.lastChild
		container.lastChild.pop();
		var t = new displayCanvasState()
	}
 }
 eventListenerInit();
 colorChange(selectedTool);