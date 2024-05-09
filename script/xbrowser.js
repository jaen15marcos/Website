/*
 *	Cross browser functions for dynamic content.
 */

function XBackground(doc, element, colour) {
	if (doc.getElementById) {
		doc.getElementById(element).style.backgroundColor = colour;
		return;
	}
	if (doc.all) {
		doc.all[element].style.backgroundColor = colour;
		return;
	}
	if (doc.layers) {
		doc.layers[element].bgColor = colour;
		return;
	}
}

function XHide(doc, element) {
	if (doc.getElementById) {
		doc.getElementById(element).style.visibility = 'hidden';
		return;
	}
	if (doc.all) {
		doc.all[element].style.visibility = 'hidden';
		return;
	}
	if (doc.layers) {
		doc.layers[element].visibility = 'hidden';
		return;
	}
}

function XMoveTo(doc, element, left, top) {
	if (doc.getElementById) {
		var x = doc.getElementById(element).style;
		x.left	= left;
		x.top	= top;
		return;
	}
	if (doc.all) {
		var x = doc.all[element].style;
		x.left	= left;
		x.top	= top;
		return;
	}
	if (doc.layers) {
		var x = doc.layers[element];
		x.left	= left;
		x.top	= top;
		return;
	}
}

function XShow(doc, element) {
	if (doc.getElementById) {
		doc.getElementById(element).style.visibility = 'visible';
		return;
	}
	if (doc.all) {
        	doc.all[element].style.visibility = 'visible';
		return;
	}
	if (doc.layers) {
		doc.layers[element].visibility = 'visible';
		return;
	}
}

function XWrite(doc, element, content) {
	if (doc.getElementById) {
		doc.getElementById(element).innerHTML = content;;
		return;
	}
	if (doc.all) {
		doc.all[element].innerHTML = content;
		return;
	}
	if (doc.layers) {
		var x = doc.layers[element].document;
		x.open();
		x.write(content);
		x.close();
		return;
	}
}
