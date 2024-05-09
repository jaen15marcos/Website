function onEventA() {
	/*
	 *	Keep the iceberg size and other information in the state.
	 */
	if (!state.size) {
		state.size	= 5000;
		state.share	= 0.3;
		state.volume	= 0;
	}
	/*
	 *	Snapshot the market volume.
	 */
	var vol = symbol.orderbook.volume();
	/*
	 *	What quantity is available to work?
	 */
	var available = 0;
	if (state.volume > 0) {
		available = Math.min(state.size, Math.round(state.share * (vol - state.volume)));
		available = Math.min(order.open(), available);
	} else {
		available = Math.min(state.size, order.open());
	}
	/*
	 *	Remember the volume for next time.
	 */
	state.volume = vol;
	/*
	 *	What is the price to work at?
	 */
	var bestbid	= symbol.orderbook.bestBid();
	var bestask	= symbol.orderbook.bestAsk();
	var bestprice	= bestask.price - (2 * symbol.ticksize);
	if (bestprice < bestbid.price) {
		bestprice = bestbid.price;
	}
	if (bestprice > order.limit) {
		bestprice = order.limit;
	}
	/*
	 *	Aggress if there is significantly more bid quantity but at a smaller size
	 *	to lessen the impact on the average price.
	 */
	var biddepth = symbol.orderbook.bidLevels();
	var askdepth = symbol.orderbook.askLevels();
	if (biddepth.length > 0 && askdepth.length > 0 && biddepth[0].quantity > 2 * askdepth[0].quantity) {
		if (askdepth[0].price <= order.limit) {
			var marketorder = new MarketOrder();
			marketorder.direction	= order.direction;
			marketorder.quantity	= Math.min(order.open(), askdepth[0].quantity);
			marketorder.add();
			log.info('Algorithm takes ' + marketorder.quantity);
		}
	} else {
		/*
		 *	What is on the limit order book?
		 */
		var ownbids = symbol.orderbook.ownBids();
		if (ownbids.length == 0) {
			/*
			 *	Submit a new limit order.
			 */
			log.info('Algorithm makes new bid for ' + available + ' at ' + bestprice);
			var limitorder = new LimitOrder();
			limitorder.direction	= order.direction;
			limitorder.quantity	= available;
			limitorder.price	= bestprice;
			limitorder.add();
		} else {
			/*
			 *	Amend the existing limit order.
			 */
			var narrative = '';
			var limitorder = ownbids[0];
			if (limitorder.price != bestprice) {
				limitorder.price = bestprice;
				narrative = ' amends bid price to ' + bestprice;
			}
			if (limitorder.quantity < available) {
				var qty = available - limitorder.quantity;
				limitorder.quantity += qty;
				narrative += ' increases bid quantity by ' + qty;
			}
			if (narrative.length > 0) {
				log.info('Algorithm' + narrative);
				limitorder.amend();
			}
		}
	}
}

function onEventB() {
	/*
	 *	Keep the iceberg size and other information in the state.
	 */
	if (!state.size) {
		state.size = 5000;
	}
	/*
	 *	What quantity is available to work?
	 */
	var available = Math.min(state.size, order.open());
	/*
	 *	What is the price to work at?
	 */
	var bestprice = symbol.orderbook.bestBid().price;
	if (bestprice == 0) {
		bestprice = symbol.orderbook.bestAsk().price - (2 * symbol.ticksize);
	}
	if (bestprice > order.limit) {
		bestprice = order.limit;
	}
	/*
	 *	What is on the limit order book?
	 */
	var ownbids = symbol.orderbook.ownBids();
	if (ownbids.length == 0) {
		/*
		 *	Submit a new limit order.
		 */
		var limitorder = new LimitOrder();
		limitorder.direction	= order.direction;
		limitorder.quantity	= available;
		limitorder.price	= bestprice;
		limitorder.add();
	} else {
		/*
		 *	Amend the existing limit order.
		 */
		var limitorder	= ownbids[0];
		var isAmended	= false;
		if (limitorder.price != bestprice) {
			limitorder.price = bestprice;
			isAmended = true;
		}
		if (limitorder.quantity < available) {
			limitorder.quantity += available - limitorder.quantity;
			isAmended = true;
		}
		if (isAmended) {
			limitorder.amend();
		}
	}
}