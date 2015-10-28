(function(global) {
	var k = global.PagurianAlias;
	var Call = function(a) {

		this.push = function(a) {
			if (a[0] === 'config') {
				seajs[a[0]](a[1]);
				return;
			}
			if (a[0] === "use") {
				seajs[a[0]](a[1], a[2]);
				return;
			}

			seajs.use(a[0], a[1]);
		};

		if (a && a.length) {
			for (var b = 0; b < a.length; b++) this.push(a[b]);
		}

	};

	global[k].queue = new Call(global[k].queue);

})(this);
