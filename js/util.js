let util = (function(){
	// 单位时间内完成一次图片切换：
	// course:总路程 begin:开始位置(px) time:切换一次时间(无单位) direction:右(1)左(-1)  num:图片组数(包含重复图片组)
	function move(ele, course, begin, time, direction, num){
		let cur_pos = Math.abs(parseFloat(getComputedStyle(ele).left));
		let target_pos = course*(num-1);
		let begin_pos = Math.abs(parseFloat(begin));
		// 到头了
		if (cur_pos <= begin_pos && direction < 0){
			ele.style.left = (target_pos + begin_pos)*direction + "px";
		} else if (cur_pos >= target_pos && direction > 0){
			ele.style.left = begin;
		}
		let take = 0;
		let timer = setInterval(function(){
			take += 20;
			ele.style.left = parseFloat(getComputedStyle(ele).left)-20*(course/time)*direction+"px";
			if (take >= time){
				clearInterval(timer);
				return;
			}
		}, 20);
	}

	// 不满两位补零
	function addZero(a){
		return a < 10 ? "0"+a: a;
	}

	// 加载图片
	function loadImg(jqueryEle){
		jqueryEle.each((index,item)=>{
		 	$(item).attr("src", item.getAttribute("true_src"));
		});
	}

	return {move, addZero, loadImg};
})();