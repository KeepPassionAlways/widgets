/**
 * 作者: 郭天琦
 * 创建时间: 2017/06/05
 * 版本: [1.0, 2017/06/05 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: tab切换组件
 */

(function(exports, doc) {
	"use strict";

	/**
	 * @description 使用
	 * @constructor
	 * @param {JSON} options 一些配置
	 * dom - 最外层dom元素 必填
	 * triggerEvent - 触发事件 默认tap
	 * activeCls - 高亮样式
	 * activeIndex - 默认高亮项，默认第一项为0
	 * onClickCallback - 回掉函数，this指向当前点击元素
	 */
	function TabView(options) {
		var self = this;

		if(!options) {
			throw new Error('请传入配置项');
		}

		var dom = options.dom;

		if(!(dom.nodeType === 1)) {
			dom = doc.querySelector(dom);
		}

		self.dom = dom;
		self.triggerEvent = options.triggerEvent || 'tap';
		self.activeCls = options.activeCls || '';
		self.activeIndex = parseInt(options.activeIndex) || 0;

		// 有样式处理样式
		if(self.activeCls) {
			self.addActive(self.activeCls, self.activeIndex);
		}

		self.initListeners(dom, self.triggerEvent, options.onClickCallback);
	}

	/**
	 * @description 处理默认高亮项
	 * @param {String} activeCls - 高亮样式
	 * @param {Number} activeIndex - 高亮下标
	 */
	TabView.prototype.addActive = function(activeCls, activeIndex) {
		var dom = this.dom,
			elHeadEleArray = dom.querySelectorAll('[data-target]');

		elHeadEleArray[activeIndex].classList.add(activeCls);
	};

	/**
	 * @description 事件监听
	 * @param {HTMLElement} dom 元素
	 * @param {Event} 事件 默认tap
	 */
	TabView.prototype.initListeners = function(dom, target, onClickCallback) {
		var dom = this.dom,
			that = this,
			elHead = dom.querySelector('[data-role=head]'),
			elBody = dom.querySelector('[data-role=body]'),
			activeCls = that.activeCls;

		elHead.addEventListener(target, function(e) {
			var elTarget = e.target,
				headId = elTarget.dataset.target;

			var elBodyEle = elBody.querySelector('[data-id="'+ headId +'"]'),
				elBodyEleSilings = that.siblings(elBodyEle);

			if(activeCls) {
				var elTargetEleSilbings = that.siblings(elTarget);  // title的siblings元素

				elTarget.classList.add(activeCls);

				elTargetEleSilbings.forEach(function(item) {
					item.classList.remove(activeCls);
				});
			}

			elBodyEleSilings.forEach(function(item) {
				item.style.display = "none";
			});

			elBodyEle.style.display = "block";

			onClickCallback.call(e.target);
		});
	};

	/**
	 * @description 默认实现一个siblings, 也可以暴露出来单独使用
	 * @param {HTMLElement} dom元素
	 * return {Array} 返回其余相邻的元素
	 */
	TabView.prototype.siblings = function(dom) {
		var data = [],
			p = dom.previousElementSibling;

		while(p) {
			data.push(p);

			p = p.previousElementSibling;
		}

		p = dom.nextElementSibling;

		while(p) {
			data.push(p);

			p = p.nextElementSibling;
		}

		return data;
	};

	window.TabView = TabView;
}({}, document));