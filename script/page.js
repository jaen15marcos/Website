/*
 *	Write the HTML for the Javascript evaluator.
 */

function writeEvaluate() {
	document.writeln('<A HREF="#" ONCLICK="evaluateSwitch();">Calculate</A>');
	document.writeln('<DIV ID="EVAL">');
	document.writeln('<FORM ID="evalform">');
	document.writeln('<TABLE>');
	document.writeln('<COL><COL CLASS="gap"><COL>');
	document.writeln('<TR><TD><INPUT TYPE="TEXT" ID="EVALINPUT"><TD>&nbsp;<TD><A HREF="#" ONCLICK="evaluate();">Equals</A>');
	document.writeln('<TR><TD><DIV ID="RESULT"></DIV><TD>&nbsp;<TD><A HREF="#" ONCLICK="evaluateClear();">Clear</A>');
	document.writeln('</TABLE>');
	document.writeln('</FORM>');
	document.writeln('</DIV>');
}

/*
 *	The JavaScript evaluator, embedded in each page.
 */

var isHidden = true;

function evaluateSwitch() {
	if (isHidden) {
		XShow(document, 'EVAL');
		document.forms['evalform'].elements[0].focus();
	} else {
		evaluateClear();
		XHide(document, 'EVAL');
	}
	isHidden = !isHidden;
}

function evaluate() {
	var result = '';
	try {
		result = eval(document.forms['evalform'].elements[0].value);
		if (typeof result == 'number') {
			result = result.toFixed(4);
		}
	} catch (exception) {
		result = 'invalid expression';
	}
	XWrite(document, 'RESULT', result);
}

function evaluateClear() {
	var input = document.forms['evalform'].elements[0];
	input.value = '';
	XWrite(document, 'RESULT', '');
	input.focus();
}

