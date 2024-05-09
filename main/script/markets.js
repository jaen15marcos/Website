/*
	Global variables.
*/

//var MARKETS_JSON = 'file:///Users/gordon/gbkr.com/public_html/main/data/markets.json';
var MARKETS_JSON = '/main/data/markets.json';
var MARKETS = null;



/*
	Get a JSON resource.
*/
function getJSON(url, callback) {
	var req = new XMLHttpRequest();
	req.overrideMimeType('application/json');
	req.open('GET', url, true);
	var status = url.indexOf('file:///') == 0 ? 0 : 200;
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == status) {
			callback(req.responseText);
		}
	};
	req.send();
}



/*
	Make <option> tags for each market in MARKETS.
*/
function makeSelectMarketOptions() {
	var html = '';
	var mic = localStorage.getItem('mic');
	var step = (mic == null) ? 0 : 1;
	for (var x in MARKETS) {
		html += '<option value="' + x + '"';
		switch (step) {
			case 0:
				html += ' selected';
				step = 2;
				break;
			case 1:
				if (mic == x) {
					html += ' selected';
					step = 2;
				}
				break;
			default:
		}
		html += '>' + MARKETS[x].name + '</option>';
	}
	return html;
} 



/*
	Make a tick band object for the given price from the tick bands in the market JSON file.
*/
function banded(price, ticks) {
	for (var i = 0; i < ticks.length; i++) {
		if (ticks[i].until == 0 || price < ticks[i].until) {
			return new TickBand(ticks[i]);
			break;
		}
	}
	return null;
}

/*
	A tick band. The data is the tick band object from the JSON file and is kept hidden.
*/
function TickBand(data) {
	this.data = data;
}

TickBand.prototype.tick = function() {
	return this.data.tick;
}

TickBand.prototype.fixed = function(x) {
	return x.toFixed(this.data.decimals);
}

TickBand.prototype.rounded = function(x) {
	return Math.round(x / this.data.tick) * this.data.tick;
}



