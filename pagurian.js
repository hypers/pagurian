/**
 * @fileOverview Pagurian
 * @version 0.1
 *
 */
(function(global, name) {

	global.PagurianAlias = name;

	var schema = ("https:" == document.location.protocol) ? "https://" : "http://";
	var domain = window.location.hostname || "/";
	/**
	 * Pagurian 对象
	 * @type {Object}
	 */
	var pagurian = {
		version: "1.1.150414",
		util: {},
		ui: {},
		path: {
			api: schema + domain + "/",
			app: schema + domain + "/" + (this.debug ? "src" : "dist") + "/"
		},
		call: function() {
			return (this.queue = this.queue || []).push(arguments);
		}
	}

	

	/**
	 * Seajs config
	 */
	pagurian.call("config", {
		base: pagurian.path.app,
		alias: {
			"jquery": "lib/vendor/jquery.1.9.1.min",
		},
		map: [
			[/^(.*\/dist\/modules\/.*\.(?:js))(?:.*)$/i, '$1?v=' + pagurian.version]
		],
		preload: ["jquery"], //预加载
		charset: 'utf-8',
		timeout: 20000,
		debug: false
	});


	/**
	 * 载入Seajs文件
	 * @param  {String} o seajs
	 * @param  {Docement Object} s Script
	 * @param  {Docement Object} f Script
	 */
	(function callSeajs(o, s, f) {

		if (global[o]) return;
		s = document.createElement("script");
		s.src = pagurian.path.app + "lib/vendor/sea.js";
		s.charset = "utf-8";
		s.async = true;
		s.id = o + "node";
		f = document.getElementsByTagName("script")[0];
		f.parentNode.insertBefore(s, f);

	})("seajs");


	global[name] = global['pagurian'] = pagurian;


})(this, "$p");