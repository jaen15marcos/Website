/*
	Common user interface behaviours, such as the navigation element.
*/

function suppressEvent(x) {
	x.preventDefault();
}

function setNav() {
	document.getElementById('nav-form').addEventListener('submit', suppressEvent, false);
}

function onNavClick() {
	var e = document.getElementById('nav-input');
	if (e.style.visibility == 'hidden') {
		e.style.visibility = 'visible';
		e.focus();
	} else {
		e.value = '';
		e.style.visibility = 'hidden';
		document.getElementById('nav-div').innerHTML = '';
	}
}

function onNavInput() {
	var x = '';
	try {
		x = eval(document.getElementById('nav-input').value);
		if (typeof x == 'number') {
			x = x.toFixed(3);
		}
	} catch (exception) {
		x = 'invalid expression';
	}
	document.getElementById('nav-div').innerHTML = x;
}
