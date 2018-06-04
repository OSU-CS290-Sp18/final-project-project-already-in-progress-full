// Remember to defer this script: <script src="canvas.js" charset="utf-8" defer></script>

/**********************
 *  Global Variables  *
 **********************/

const active	= {color: 'rgb(200,200,200)', backgroundColor: 'rgb(30,30,30)'};
const inactive	= {color: 'rgb(0,0,0)', backgroundColor: 'rgb(200,200,200)'};
 
var buttonWallSingle	= document.getElementById('button-canvas-wall-single');
var buttonWallRect		= document.getElementById('button-canvas-wall-rectangle');
var buttonEraser		= document.getElementById('button-canvas-eraser');
var buttonMonster		= document.getElementById('button-canvas-monster');
var buttonBoss			= document.getElementById('button-canvas-boss');
var buttonItem			= document.getElementById('button-canvas-item');
var buttonClear			= document.getElementById('button-canvas-clear');
var buttonSave			= document.getElementById('button-canvas-save');
var mapCanvas			= document.getElementById('map-canvas');
var selectedTool = -1;

/**********************
 *  Button Functions  *
 **********************/
 
// tool button color changer
function colorChange(buttonCode) {
	if(buttonCode == -1) {
		buttonWallSingle.style.color = active.color;
		buttonWallSingle.style.backgroundColor = active.backgroundColor;
	} else {
		buttonWallSingle.style.color = inactive.color;
		buttonWallSingle.style.backgroundColor = inactive.backgroundColor;
	}
	if(buttonCode == 0) {
		buttonWallRect.style.color = active.color;
		buttonWallRect.style.backgroundColor = active.backgroundColor;
	} else {
		buttonWallRect.style.color = inactive.color;
		buttonWallRect.style.backgroundColor = inactive.backgroundColor;
	}
	if(buttonCode == 1) {
		buttonEraser.style.color = active.color;
		buttonEraser.style.backgroundColor = active.backgroundColor;
	} else {
		buttonEraser.style.color = inactive.color;
		buttonEraser.style.backgroundColor = inactive.backgroundColor;
	}
	if(buttonCode == 2) {
		buttonMonster.style.color = active.color;
		buttonMonster.style.backgroundColor = active.backgroundColor;
	} else {
		buttonMonster.style.color = inactive.color;
		buttonMonster.style.backgroundColor = inactive.backgroundColor;
	}
	if(buttonCode == 3) {
		buttonBoss.style.color = active.color;
		buttonBoss.style.backgroundColor = active.backgroundColor;
	} else {
		buttonBoss.style.color = inactive.color;
		buttonBoss.style.backgroundColor = inactive.backgroundColor;
	}
	if(buttonCode == 4) {
		buttonItem.style.color = active.color;
		buttonItem.style.backgroundColor = active.backgroundColor;
	} else {
		buttonItem.style.color = inactive.color;
		buttonItem.style.backgroundColor = inactive.backgroundColor;
	}
}


// tool button event listeners
function eventListenerInit() {
	buttonWallSingle.addEventListener('click', function(e) {
			selectedTool = -1;
			colorChange(selectedTool);
	});
	buttonWallRect.addEventListener('click', function(e) {
			selectedTool = 0;
			colorChange(selectedTool);
	});
	buttonEraser.addEventListener('click', function(e) {
			selectedTool = 1;
			colorChange(selectedTool);
	});
	buttonMonster.addEventListener('click', function(e) {
			selectedTool = 2;
			colorChange(selectedTool);
	});
	buttonBoss.addEventListener('click', function(e) {
			selectedTool = 3;
			colorChange(selectedTool);
	});
	buttonItem.addEventListener('click', function(e) {
			selectedTool = 4;
			colorChange(selectedTool);
	});
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
Shape.prototype.contains = function(gridx, gridy) {
	return (this.x == gridx) && (this.y == gridy);
}
	//return (this.x <= mx) && (this.x + this.w >= mx) &&
	//   (this.y <= my) && (this.y + this.h >= my);


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
	// the current selected object:
	this.dragX = 0; // <- mousedown and mousemove events
	this.dragY = 0; // <
	
	/*** Event Listeners ***/
	
	// "this" outside events refers to CanvasState.
	// "this" inside events refers to the canvas
	
	var myState = this; // CanvasState point of reference
	
	// Fix for double clicking causing text to highlight
	canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
	
	// mouse interaction
	canvas.addEventListener('mousedown', function(e) {
		var mouse = myState.getMouse(e);
		var shapes = myState.shapes;
		var l = shapes.length;
		var tileSize = this.height / 50;
		var gridx = Math.floor(mouse.x / tileSize)*tileSize;
		var gridy = Math.floor(mouse.y / tileSize)*tileSize;
		myState.dragging = true;
		
		switch(selectedTool) {
			case 0: // draw wall rectangle
				myState.dragX = mx;
				myState.dragY = my;
				// draw temporary box
				break;
			case 1: // eraser
				for (var i = l-1; i >= 0; i--) {
					if (shapes[i].contains(gridx, gridy)) {
						shapes.splice(i, 1);
						myState.valid = false;
					}
				}
			case 2: // draw monsters
				
				break;
			case 3: // draw bosses
				
				break;
			case 4: // draw items 
				
				break;
			default: // draw walls - selectedTool should be -1
				for (var i = l-1; i >= 0; i--) {
					if (shapes[i].contains(gridx, gridy)) {
						shapes.pop(shapes[i]);
					}
				}
				myState.addShape(new Shape(gridx, gridy, tileSize, tileSize, 'rgb(0,0,0)'));
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
				case 0: // draw wall rectangle
					// Draw temporary box, remove old temporary box
					break;
				case 1: // eraser
					for (var i = l-1; i >= 0; i--) {
						if (shapes[i].contains(gridx, gridy)) {
							shapes.splice(i, 1);
							myState.valid = false;
						}
					}
				case 2: // draw monsters
					
					break;
				case 3: // draw bosses
					
					break;
				case 4: // draw items 
					
					break;
				default: // draw walls - selectedTool should be -1
					myState.addShape(new Shape(gridx, gridy, tileSize, tileSize, 'rgb(0,0,0)'));
			}
		}
	}, true);
	
	canvas.addEventListener('mouseup', function(e) {
		myState.dragging = false;
	}, true);
	
	// canvas state buttons
	buttonClear.addEventListener('click', function(e) {
		var shapes = this.shapes;
		var l = shapes.length;
		for (var i = l-1; i >= 0; i--) {
			shapes.pop();
		}
	});
	buttonSave.addEventListener('click', function(e) {
		var dataURL = canvas.toDataURL('image/png');
		// !!post here!!
	});
	
	// Canvas refresh interval
	this.interval = 30;
	setInterval(function() { myState.draw(); }, myState.interval);
}

CanvasState.prototype.addShape = function(shape) {
	this.shapes.push(shape);
	this.valid = false;
}

CanvasState.prototype.clear = function() {
	this.ctx.clearRect(0,0, this.width, this.height);
}

CanvasState.prototype.draw = function() {
	// if state is invalid, redraw and validate
	if(!this.valid) {
		var ctx = this.ctx;
		var shapes = this.shapes;
		var l = shapes.length;
		this.clear();
		
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

CanvasState.prototype.clear = function(e) {
	
}

/**********************
 *   Initialization   *
 **********************/
 
 var s = new CanvasState(mapCanvas);
 eventListenerInit();
 colorChange(selectedTool);