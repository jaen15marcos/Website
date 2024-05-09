var arrivalRate			= 80;
var serviceRate			= 100;
var servers				= 1;
var serviceVariation	= 1;

function traffic() {
	return arrivalRate / serviceRate;
}

function utilised() {
	return Math.min (traffic() / servers, 1);
}

function serviceTime() {
	return 1 / serviceRate;
}

function odds(x) {
	return x / (1 - x);
}

function erlangC(s, u) {
	var x = u * erlangB(s - 1, s * u);
	return x / ((1 - u) + x);
}

function erlangB(s, u) {
	if (s == 0) {
		return 1;
	} else {
		var x = u * erlangB(s - 1, u);
		return x / (s + x);
	}
}
	
function queueLength(model) {
	var u = utilised();
	switch (model) {
		case 'M':
		default:
			return odds(u) * (servers > 1 ? erlangC(servers, u) : u);
		case 'G':
			return odds(u) * u * (1 + (serviceVariation * serviceVariation)) / 2;
	}
}

function responseTime(length) {
	return serviceTime() + length / arrivalRate;
}


