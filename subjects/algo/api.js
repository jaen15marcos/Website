/*
 *	The system object, primarily to remove the dependency on other objects knowing exactly where
 *	the simulation applet is.
 */

function System(applet) {
	this.applet = applet;
}

/*
 *	The logging object.
 */

function Log() {}

Log.prototype.clear = function() {
	XWrite(document, 'infoDiv', '');
}

Log.prototype.info = function(text) {
	XWrite(document, 'infoDiv', '<EM>' + text + '</EM>');
}

/*
 *	A prior state object, for user defined properties within an execution script.
 */

function State() {}

/*
 *	A discretionary order.
 */

function DiscretionaryOrder(ref) {
	this.reference	= ref;
	this.direction	= system.applet.getDiscretionaryDirection(this.reference);
	this.limit	= system.applet.getDiscretionaryLimit(this.reference);
}

DiscretionaryOrder.prototype.open = function() {
	return system.applet.getDiscretionaryOpen(this.reference);
}

/*
 *	A symbol.
 */

function Symbol() {
	this.ticksize	= system.applet.getTickSize();
	this.orderbook	= new OrderBook();
}

/*
 *	A limit order book.
 */

function OrderBook() {}

OrderBook.prototype.askLevels = function() {
	var n = system.applet.getAskDepth();
	var x = new Array();
	for (var i = 0; i < n; i++) {
		x.push(new Level(system.applet.getPriceAt(i), system.applet.getQuantityAt(i), system.applet.getOrdersAt(i)));
	}
	return x;
}

OrderBook.prototype.asks = function() {
	var n = system.applet.getAsks();
	var x = new Array();
	for (var i = 0; i < n; i++) {
		system.applet.getLimitOrder(i);
		x.push(makeLimitOrder(-1));
	}
	return x;
}

OrderBook.prototype.bestAsk = function() {
	system.applet.getBestAsk();
	return makeLimitOrder(-1);
}

OrderBook.prototype.bestBid = function() {
	system.applet.getBestBid();
	return makeLimitOrder(+1);
}

OrderBook.prototype.bidLevels = function() {
	var n = system.applet.getBidDepth();
	var x = new Array();
	for (var i = 0; i < n; i++) {
		x.push(new Level(system.applet.getPriceAt(i), system.applet.getQuantityAt(i), system.applet.getOrdersAt(i)));
	}
	return x;
}

OrderBook.prototype.bids = function() {
	var n = system.applet.getBids();
	var x = new Array();
	for (var i = 0; i < n; i++) {
		system.applet.getLimitOrder(i);
		x.push(makeLimitOrder(+1));
	}
	return x;
}

OrderBook.prototype.ownAsks = function() {
	var n = system.applet.getOwnAsksCount(order.reference);
	var x = new Array();
	for (var i = 0; i < n; i++) {
		system.applet.getLimitOrder(i);
		x.push(makeLimitOrder(-1));
	}
	return x;
}

OrderBook.prototype.ownBids = function() {
	var n = system.applet.getOwnBidsCount(order.reference);
	var x = new Array();
	for (var i = 0; i < n; i++) {
		system.applet.getLimitOrder(i);
		x.push(makeLimitOrder(+1));
	}
	return x;
}

OrderBook.prototype.volume = function() {
	return system.applet.getVolume();
}

OrderBook.prototype.vwap = function() {
	return system.applet.getVWAP();
}

/*
 *	An order book level.
 */

function Level(price, quantity, orders) {
	this.price	= price;
	this.quantity	= quantity;
	this.orders	= orders;
}

/*
 *	A limit order.
 */

function LimitOrder() {
	this.id		= 0;
	this.direction	= 0;
	this.quantity	= 0;
	this.price	= 0;
	this.reference	= '';
}

LimitOrder.prototype.add = function() {
	system.applet.addLimitOrder(this.direction, this.quantity, this.price, order.reference);
}

LimitOrder.prototype.amend = function() {
	system.applet.cancelLimitOrder(this.direction, this.id);
	this.add();
}

LimitOrder.prototype.cancel = function() {
	system.applet.cancelLimitOrder(this.direction, this.id);
}

/*
 *	Convenience function to make a limit order from the applet.
 */

function makeLimitOrder(direction) {
	var o		= new LimitOrder();
	o.id		= system.applet.getLimitOrderID();
	o.direction	= direction;
	o.price		= system.applet.getLimitOrderPrice();
	o.quantity	= system.applet.getLimitOrderQuantity();
	o.reference	= system.applet.getLimitOrderReference();
	return o;
}	

/*
 *	A market order.
 */

function MarketOrder() {
	this.direction	= 0;
	this.quantity	= 0;
	this.reference	= '';
}

MarketOrder.prototype.add = function() {
	system.applet.addMarketOrder(this.direction, this.quantity, order.reference);
}
