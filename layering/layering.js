/*
This layering-lib are is released under the MIT license:

Copyright (c) 2012 Marco Träger marco.traeger@googlemail.com.
It uses jquery http://jquery.com 
and prefixfree http://leaverou.github.com/prefixfree/

Permission is hereby granted, free of charge, to any 
person obtaininga copy of this software and associated 
documentation files (the "Software"), to deal in the 
Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, 
sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be 
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
OTHER DEALINGS IN THE SOFTWARE.
*/

sort = function() {
	return this.pushStack([].sort.apply(this, arguments), []);
};

function Layer(element, depth) {
	this.element = element;
	this.depth = depth;

	this.x = function(newx) {
		/* layerdepth-depending scaling */
		_x = newx / (1 / depth);

		$(element).css("left", (-_x) + "px");
		$(element).css("right", (_x) + "px");
	}
}

function LayeringModel(element) {
	layers = new Array();
	element.children().each(function(index) {
		layers.push(new Layer($(this), $(this).attr('depth')));
	});
	/* sort layer via depth, high depth first (back to front) */
	layers = layers.sort(function(a, b) {
		return a.depth - b.depth;
	});
	/* apply css styles */
	for (i = 0; i < layers.length; i++) {
		var layer = layers[i];
		
		_e = $(layer.element);
		/* dynamic */
		_e.css("z-index", i);
		
		/* 
		 * warper to adjust relative positioning and setting 
		 * the procentual width to 100%.
		 */
		_e.wrapInner("<div class='container'/>");
		_warped = _e.children().first();
		_warped.css("left" , "-" + Math.round(layer.depth*100/2) + "%");
		_warped.css("right", "-" + Math.round(layer.depth*100/2) + "%");
		_warped.css("width", Math.round(100+layer.depth*100) + "%");
		
		layer.x(0);
	}

	this.layer = function(index) {
		return layers[index];
	}

	this.size = function() {
		return layers.length;
	}
	
	this.x = function(newx) {
		for(i = 0; i < layers.length; i++) {
			layers[i].x(newx);
		}
	}
}

var model;

$(window).load(function() {
	// run code
	model = new LayeringModel($('#layering'));
});

$(window).mousemove(function(event) {
	if(model == null)
		return;
	
	wHalf = window.innerWidth / 2;
	model.x(event.clientX - wHalf);
});