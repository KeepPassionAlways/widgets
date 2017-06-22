/**
 * 作者: 郭天琦
 * 创建时间: 2017/06/19
 * 版本: [1.0, 2017/06/19 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: 地区选择
 */

(function(exports, doc) {
	"use strict";

	/**
	 * @description 使用
	 * @constructor
	 * @param {options} 一些配置参数
	 * container {HTMLElement} 父级元素、容器元素 必填
	 * showBtn {HTMLElement} 显示地区选择 or ejs ejs的时候为onClickNBRightEJS
	 * proviceActiveCls {String} 省份高亮样式 默认为cur
	 * cityActiveCls {String} 城市高亮样式 默认为cur
	 * isClose {Boolean} true or false true为关闭，false为不关闭 默认为true
	 * isMask {Boolean} true or false 是否启用遮罩 true为启用遮罩
 	 * onClick {Function} 回掉函数 必填
	 */
	function AddrSelect(options) {
		var self = this;
		// 检测环境
		var optionsArray = [{
			key: window.Mustache,
			value: '请引入mustache.min.js'
		}, {
			key: window.cityData3,
			value: '请引入city.data-3.js'
		}, {
			key: options,
			value: '请传入配置项!'
		}, {
			key: options.container,
			value: '请传入父级元素'
		}];

		self.environment(optionsArray);
		var parent = self.isDom(options.container);

		self.parentDom = parent;
		
		self.hasBtn(options.showBtn, 'showBtn');
		
		if(!self.showBtn) {
			parent.style.display = 'block';
		}
		
		if(!options.onClick && !(typeof options.onClick == 'function')) {
			throw new Error('请传入回调函数onClick');
		}
		
		self.onClick = options.onClick;

		var defaultValue = {
			top: 0,
			province: [],
			city: [],
			provinceValue: '',
			cityValue: '',
			areaCode: '',
			litemplate: '<li class="em-list-item" data-areacode="{{value}}" data-index="{{index}}">{{{text}}}</li>',
			proviceActiveCls: 'cur',
			cityActiveCls: 'cur',
			isClose: true,
			provinceIndex: 0,
			cityIndex: 0,
			isMask: true
		};
		
		self.extend(options, defaultValue);
		// 设置顶部高度
		parent.style.top = parseInt(self.top) + 'px';
		
		if(self.isMask) {
			self.makeMask();
		}

		self.domArray = {
			provinceList: parent.querySelector('[data-type=province]'),
			cityList: parent.querySelector('[data-type=city]')
		};

		// 解析城市地区
		self.analysisCityData(cityData3);
		self.showCity();
		self.initListeners();
	}

	/**
	 * @description 是否是dom元素
	 * @param {String or HTMLElement} domValue
	 * @return {HTMLElement}
	 */
	AddrSelect.prototype.isDom = function(domValue) {

		if(domValue.nodeType == 1) {
			return domValue;
		} else {

			if(typeof domValue != 'string') {
				throw new Error('请传入正确的元素节点');
			}

			return doc.querySelector(domValue);
		}

	};

	/**
	 * @description 检测是否引入了必要的库与options
	 * @param {Array Object} options 要检测的项
	 */
	AddrSelect.prototype.environment = function(options) {

		for(var i = 0, len = options.length; i < len; i++) {

			if(!options[i].key) {
				throw new Error(options[i].value);
			}

		}

	};

	/**
	 * @description 解析城市地区
	 * @param {JSON} cityData 城市地区json
	 */
	AddrSelect.prototype.analysisCityData = function(cityData) {
		var self = this,
			province = self.province,
			domArray = self.domArray;

		cityData.forEach(function(item, index) {

			province.push({
				text: item.text,
				value: item.value,
				index: index
			});

		});

		self.ergodic(province, domArray.provinceList);
	};

	/**
	 * @description 遍历渲染html结构
	 * @param {Array} array 数组
	 * @param {HTMLElement} dom 要插入的元素
	 * @param {Number} cityIndex 下标 默认显示
	 */
	AddrSelect.prototype.ergodic = function(array, dom, cityIndex) {
		var htmlItem = '',
			cityListChild = this.domArray.cityList.children,
			templList = this.litemplate;

		array.forEach(function(item) {
			htmlItem += Mustache.render(templList, item);
		});

		dom.innerHTML = htmlItem;

		// 选中默认城市
		if(cityIndex != undefined) {
			cityListChild[cityIndex].classList.add('cur');
		}
	};

	/**
	 * @description 事件监听
	 */
	AddrSelect.prototype.initListeners = function() {
		var that = this,
			showBtn = that.showBtn,
			maskEle = that.maskEle,
			parentDom = that.parentDom,
			isClose = that.isClose,
			provinceList = that.domArray.provinceList,
			provinceActiveCls = that.proviceActiveCls,
			cityList = that.domArray.cityList,
			cityActiveCls = that.cityActiveCls;

		that.provinceName = provinceList.children[0].innerHTML;
		that.cityName = cityList.children[0].innerHTML;
		that.areaCode = cityList.children[0].dataset.areacode;
		
		// 显示选择区域
		var showAddrSelect = function() {
			parentDom.style.display = 'block';
			maskEle.style.display = 'block';

			that.showCity(that.provinceIndex, that.cityIndex);
		}

		if(showBtn == 'ejs') {
			window.onClickNBRightEJS = showAddrSelect;
		} else if(showBtn) {
			that.addEvent(showBtn, '', showAddrSelect);
		}

		// 点击省份列表
		that.addEvent(provinceList, 'li', function() {
			var _self = this,
				index = _self.dataset.index,
				children = cityData3[index].children[0].children,
				curSiblings = that.siblings(_self);

			that.provinceIndex = index;
			that.provinceName = _self.innerHTML;

			_self.classList.add(provinceActiveCls);

			curSiblings.forEach(function(item, index) {
				item.classList.remove(provinceActiveCls);
			});

			// 添加城市
			that.ergodic(children, cityList);
		});

		// 点击城市列表
		that.addEvent(cityList, 'li', function() {
			var _self = this,
				curSiblings = that.siblings(_self);

			_self.classList.add(cityActiveCls);
			cityList.classList.remove('cur');

			curSiblings.forEach(function(item) {
				item.classList.remove(cityActiveCls);
			});

			// TODO 这边处理的可能不是很好，等回过头来优化一下
			Array.prototype.slice.call(cityList.children).forEach(function(item, index) {
				if(item.classList.contains(cityActiveCls)) {
					that.cityIndex = index;
				}
			});

			// 关闭组件
			if(isClose == true) {
				parentDom.style.display = 'none';
			}

			// 包含结果 TODO
			var result = {
				areaCode: _self.dataset.areacode,
				cityName: _self.innerHTML,
				provinceName: that.provinceName
			};
			
			maskEle.style.display = 'none';
			
			that.onClick.call(_self, result);
		});
		
		// 遮罩点击
		that.addEvent(maskEle, '', function() {
			this.style.display = 'none';
			parentDom.style.display = 'none';
		});
	};

	/**
	 * @description 重写下addEventListener
	 * @param {HTMLElement} parentEle要绑定的元素
	 * @param {HTMLElement} childEle 指向的元素
	 * @param {Function} callback回掉函数
	 */
	AddrSelect.prototype.addEvent = function(parentEle, childEle, callback) {
		childEle = childEle.toUpperCase();
		parentEle.addEventListener('tap', function(evt) {
			var target = evt.target

			while(childEle && (target.tagName != childEle)) {
				target = target.parentNode;
			}

			callback.call(target);
		});

	};

	/**
	 * @description 获取同级节点
	 * @param {HTMLElement} 当前元素
	 */
	AddrSelect.prototype.siblings = function(dom) {
		var data = [],
			parent = dom.parentNode.children;

		for(var i = 0, len = parent.length; i < len; i++) {
			if(dom != parent[i]) {
				data.push(parent[i]);
			}
		}

		return data;
	};

	/**
	 * @description 合二为一 extend
	 * @param {HTMLElement} 当前元素
	 */
	AddrSelect.prototype.extend = function(options, defaultValue) {
		var self = this;

		for(var item in defaultValue) {
			
			if(options[item] == undefined) {
				self[item] = defaultValue[item];
			} else {
				self[item] = options[item];
			}

		}
	};

	/**
	 * @description 默认显示城市
	 * @param {Array} array 要遍历的数组
	 * @param {Function} callback 回调函数
	 */
	AddrSelect.prototype.showCity = function(provinceIndex, cityIndex) {
		provinceIndex = provinceIndex || 0;
		cityIndex = cityIndex || 0;

		var self = this,
			children = cityData3[provinceIndex].children[0].children,
			domArray = self.domArray,
			provinceList = domArray.provinceList,
			cityList = domArray.cityList;

		provinceList.children[provinceIndex].classList.add('cur');

		this.ergodic(children, cityList, cityIndex);
	};

	/**
	 * @description 是否有按钮
	 * @param {HTMLElement} dom元素
	 * @param {String} key 键
	 */
	AddrSelect.prototype.hasBtn = function(dom, key) {
		var self = this;
		
		if(dom && dom != 'ejs') {
			self[key] = self.isDom(dom);
		} else if(dom == 'ejs') {
			self[key] = 'ejs';
		}
	};
	
	/**
	 * @description 创建遮罩
	 */
	AddrSelect.prototype.makeMask = function() {
		var elMask = doc.createElement('div');
		
		elMask.id = 'em-mask';
		elMask.style.cssText = 'display: none; position: fixed; left: 0; right: 0; bottom: 0; background-color: #666; z-index: 10;';
		elMask.style.top = this.top;
		
		doc.body.appendChild(elMask);
		
		this.maskEle = doc.getElementById('em-mask');
	};
	
	exports.init = function(parentDom) {
		return new AddrSelect(parentDom);
	};
	
	/**
	 * 兼容require
	 */
	if(typeof module != 'undefined' && module.exports) {
		module.exports = exports;
	} else if(typeof define == 'function' && (define.amd || define.cmd)) {
		define(function() {
			return exports;
		});
	}

	window.AddrSelect = exports;

}({}, document));