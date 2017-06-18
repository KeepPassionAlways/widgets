/**
 * 作者: 郭天琦
 * 创建时间: 2017/06/12
 * 版本: [1.0, 2017/06/12 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: 地区选择
 */

(function(exports, doc) {
	"use strict";
	
	var province = [],  // 省份
		city = [],  // 城市、区
		provinceValue = '', // 身份值
		cityValue = '',  // 城市值
		areaCode = '',  // 值
		M = Mustache;
		
	var elProvinceList = doc.getElementById('province-list'),
		elCityList = doc.getElementById('city-list'),
		templList = doc.getElementById('templ-list').innerHTML,
		elContainer = doc.getElementById('container');
	
	/**
	 * @description 解析出城市与地区
	 * @param {JSON} 地区
	 */
	function processAddr(cityData) {
		
		cityData.forEach(function(item, index) {
			province.push({
				text: item.text,
				value: item.value,
				index: index
			});
		});
		
		elProvinceList.innerHTML = M.render(templList, {"items": province});
	}
	
	/**
	 * @description 事件监听
	 */
	function initListeners() {
		// 遮罩
		var elMask = doc.querySelector('.pop-mask');
		
		doc.querySelector('.btn').addEventListener('tap', function() {
			elContainer.style.display = 'block';
			
			elMask.style.display = 'block';
		});
		
		elProvinceList.addEventListener('tap', function(e) {
			var self = e.target;
			var index = self.dataset.index,
				children = cityData3[index].children[0].children;
						
			self.classList.add('cur');
			
			elCityList.innerHTML = M.render(templList, {"items": children});
			elCityList.classList.add('cur');
			
			// 默认值
			provinceValue = self.innerHTML;
			areaCode = self.dataset.areacode;
			cityValue = elCityList.firstElementChild.innerHTML;
			
			siblings(self).forEach(function(item) {
				item.classList.remove('cur');
			});
		});
		
		elCityList.addEventListener('tap', function(e) {
			var self = e.target;
			
			this.classList.remove('cur');
			self.classList.add('cur');
			
			cityValue = self.innerHTML;
			areaCode = self.dataset.areacode;
			
			siblings(self).forEach(function(item) {
				item.classList.remove('cur');
			});
			
			elContainer.style.display = 'none';
			
			doc.querySelector('.pop-mask').style.display = 'none';
			
			result();
		});
		
		elMask.addEventListener('tap', function() {
			elContainer.style.display = 'none';
			elMask.style.display = 'none';
		});
	}
	
	/**
	 * @description 创建遮罩
	 */
	function doMask() {
		var mask = doc.createElement('div');
		mask.className = 'pop-mask';
		
		mask.style.cssText = 'display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: #666; z-index: 1; opacity: 0.6;';
		doc.body.appendChild(mask);
	}
	
	/**
	 * @description 结果
	 */
	function result() {
		doc.getElementById('result').innerHTML = '选择结果：' + provinceValue + ' ' + cityValue + ' ' + areaCode;
	}
	
	/**
	 * @description siblings
	 */
	function siblings(dom) {
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
	}
	
	doMask();
	initListeners();
	processAddr(cityData3);
	
}({}, document));
