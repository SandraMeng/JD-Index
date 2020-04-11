(function(){
	// top: 请求图片
	let top_x = $("#top_right i");
	let top_ = $("#top");
	$.ajax({
		url:"json/top_img.json",
		dataType: "json",
		success:function(data){
			// 加载图片
			$("#top_center").css("background-image", `url(${data.center})`);
			$("#top_left img").attr("src", data.left);
			$("#top_right img").eq(0).attr("src", data.right1);
			$("#top_right img").eq(1).attr("src", data.right2);
			// 图片加载成功，top显示
			let time = Date.now();
			while (Date.now()-time <= 2000){}
			top_.removeClass("hidden");
			// 点击叉号，top部分消失
			top_x.click(function(){
				top_.addClass("hidden");
			});
			// 初次加载，top部分纵向拉长，5秒后变为正常高度
			$(top_center).addClass("long");
			let top_long = setTimeout(function(){
				$(top_center).removeClass("long");
				$(top_right).removeClass("hidden");
				clearTimeout(top_long);
			}, 5000);
		}
	});

	// shortcut: 获取用户IP地址所在省份，使用搜狐的接口
	let cname = returnCitySN.cname;
	let province = cname.slice(0, cname.indexOf("省"));
	$(cur_prov).html(province);
	let provs = $("#shortcut .provs a");
	provs.each(function(index, item){// item是js对象
		if (item.innerHTML === province){
			$(item).addClass("selected");
		}
	});

	// header: .logo鼠标划上效果
	let logo = $("header .logo");
	$.ajax({
		url: "json/header_logo.json",
		dataType: "json",
		success: function(data){
			let jpg = $("header .logo a");
			logo.append(`<a href="##" class="abs gif" style="background-image: url(${data.src}?${Date.now()}); display:none"><span class="hidden" style="color: ${data.span.color}; color: ${data.span.color}">${data.span.text}</span>
					<p class="hidden" style="background-color:${data.p.bgc}; color: ${data.p.color}">${data.p.text}</p></a>`);
			let gif = $("header .logo .gif");
			let start = 0;
			// 阻止冒泡
			logo[0].onmouseenter= function(){
				// 记录动画开始时间
				start = Date.now();
				// 重新请求图片，使用拼接时间戳的方法解决浏览器缓存问题
				gif.css("background-image", `url(${data.src}?${Date.now()})`);
				jpg.fadeOut().next().fadeIn();
				let show = setTimeout(()=>{
					$("header .logo p")[0].classList.remove("hidden");
					$("header .logo span")[0].classList.remove("hidden");
					clearTimeout(show);
				}, data.interval);
			};
			logo[0].onmouseleave = function(){
				// 等待动画播放完成
				while(Date.now()-start < data.interval){

				}
				let timer = setTimeout(function(){
					gif.fadeOut("slow").prev().fadeIn("slow");
					$("header .logo p")[0].classList.add("hidden");
					$("header .logo span")[0].classList.add("hidden");
					clearTimeout(timer);
				},1000);
			};
			
		}
	});
	// header: input词、hot词切换
	let hots = $("header .hot a");
	let hot = hots.eq(0);
	let input1 = $("header input");
	let input2 = $("#top_fixed input");
	$.ajax({
		async:true,
		url:"json/header_word.json",
		dataType:"json",
		success:function(data){
			let index1 = 0,
				index2 = 0;
			let input_ = data.input,
				hot_ = data.hot,
				first = hot_[0],
				hot_len = first.length,
				input_len = input_.length;
			input1.attr("placeholder", input_[input_len-1]);
			input2.attr("placeholder", input_[input_len-1]);
			setInterval(function(){
				input1.attr("placeholder", input_[index1]);
				input2.attr("placeholder", input_[index1++]);
				if (index1 === input_len){
					index1 = 0;
				}
			},6000);
			hot.html(first[hot_len-1]);
			hots.each(function(i, item){
				if (i === 0){
					return;
				}
				$(item).html(hot_[i]);
			});
			setInterval(function(){
				hot.html(first[index2++]);
				if (index2 === hot_len){
					index2 = 0;
				}
			},2500);
		}
	});
	// header: 请求ad
	$.ajax({
		url:"json/header_ad.json",
		dataType:"json",
		success:function(data){
			$("header .ad img").attr("src", data.src);
		}
	});

	// nav: 请求图片
	// 绑定图片
	function bindNav(data){
		let str1 = ``,
			str2 = ``,
			big = data.big_slide,
			small = data.small_slide;
		// 绑定navSeckill背景
		$(navSeckill).css("background-image", `url(${data.bg})`);
		big.map((item,index)=>{
			str1 += `<li><a href="##"><img src=${big[index]}></a></li>`;
			str2 += `<li></li>`;
		});
		$("#navSeckill .slide .img").html(str1);
		$("#navSeckill .slide .dot").html(str2);
		$("#navSeckill .slide .dot li").eq(0).addClass("selected");
		let small_slide_ul = $("#navSeckill .small_slide")[0].getElementsByTagName("ul");
		for (let i = 0; i < small.length;i++){
			let str = ``;
			small[i].map((item,index)=>{
				str += `<li><a href="##" class="rel"><img src=${small[i][index]}>
						<div class="topLayer"></div></a></li>`;
			});
			$(small_slide_ul[i]).html(str);
		}
	}
	$.ajax({
		url: "json/nav_img.json",
		dataType: "json",
		success:function(data){
			// 绑定图片
			bindNav(data);
			// small_slide渐隐渐现效果
			let index = 0;
			let timer1 = setInterval(small_, 7000);
			$("#navSeckill .small_slide .wrapper").mouseover(function(){
				clearInterval(timer1);
			});
			$("#navSeckill .small_slide .wrapper").mouseout(function(){
				timer1 = setInterval(small_, 7000);
			});
			$("#navSeckill .small_slide .center .arrow_left").click(function(){
				index -= 2;
				small_();
			});
			$("#navSeckill .small_slide .center .arrow_right").click(function(){
				small_();
			});

			// big_slide渐隐渐现效果
			let index2 = 0;
			let timer2 = setInterval(big_,3000);
			$("#navSeckill .slide").mouseover(function(){
				clearInterval(timer2);
			});
			$("#navSeckill .slide").mouseout(function(){
				timer2 = setInterval(big_,3000);
			});
			$("#navSeckill .slide .dot li").mouseover(function(){
				index2 = $(this).index()-1;
				big_();
			});
			$("#navSeckill .slide .arrow_left").click(function(){
				index2 -= 2;
				big_();
			});
			$("#navSeckill .slide .arrow_right").click(function(){
				big_();
			});
 
			// big_slide 定时器回调函数
			function big_(){
				index2++;
				if (index2 === data.big_slide.length){
					index2 = 0;
				}
				if (index2 === -1){
					index2 = data.big_slide.length-1;
				}
				$("#navSeckill .slide .img li").eq(index2).fadeIn().siblings().fadeOut();
				$("#navSeckill .slide .dot li").eq(index2).addClass("selected").siblings().removeClass("selected");
			}
			// small_slide 定时器回调函数
			function small_(){
				index++;
				if (index === data.small_slide[0].length){
					index = 0;
				}
				if (index === -1){
					index = data.small_slide[0].length-1;
				}
				let small_slide_ul = $("#navSeckill .small_slide")[0].getElementsByTagName("ul");
				for (let i = 0; i < data.small_slide.length; i++){
					$(small_slide_ul[i].getElementsByTagName("li")[index]).fadeIn("slow").siblings().fadeOut();
				}
			}

		}
	});
	// nav: .right- .news
	$.ajax({
		url:"json/nav_news.json",
		dataType:"json",
		success:function(data){
			data.map((item,index)=>{
				$("nav .right- .news ul span").eq(index).html(item.tag);
				$("nav .right- .news ul i").eq(index).html(item.content);
			});
		}
	});
	// nav:.right- .path
	let nav_path = $("nav .right- .path ul");
	$("nav .right- .path ul a.show_hidden").mouseover(function(){
		$("nav .right- .path .hidden_part .tag a").eq($(this.parentNode).index()).addClass("selected").siblings().removeClass("selected");
		nav_path.addClass("hidden").siblings().removeClass("hidden");
	});
	$("nav .right- .path .hidden_part .tag a").mouseover(function(){
		$(this).addClass("selected").siblings().removeClass("selected");
	});
	$("nav .right- .path .hidden_part .bill .kinds a").mouseover(function(){
		$(this).addClass("selected").siblings().removeClass("selected");
	});
	$("nav .right- .path .hidden_part .icon-chahao").click(function(){
		nav_path[0].classList.remove("hidden");
		$("nav .right- .path .hidden_part").addClass("hidden");
	});

	// seckill: 请求图片
	function bindSeckill(data,slide1_width){
		let str1 = ``,
			str2 = ``,
			str3 = ``,
			slide1 = data.slide1,
			slide2 = data.slide2;
		let num = 0;// 每组图片张数
		// 大屏:默认4张
		if (slide1_width === 800){
			number = 4;
		} else if (slide1_width < 800){// 较小屏：默认3张
			number = 3;
		}
		// 每组图片张数(默认3组，包括重复组)
		for (let i = 0; i < number*2; i++){
			let cur = slide1[i];
			str1 += `<li><a href="##" title=${cur.name}>
					<div class="img opa"><img true_src=${cur.img}>
					</div><div class="word"><strong>${cur.name}</strong>
					<p><span><em>￥</em><b>${cur.now_price}</b></span>
					<del>￥${cur.ori_price}</del></p></div></a></li>`;
		}
		$("#seckill .slide1 ul").html(str1);
		// 和前几张相同
		str1 = ``;
		for (let i = 0; i < number; i++){
			let cur = slide1[i];
			str1 += `<li><a href="##" title=${cur.name}>
					<div class="img opa"><img true_src=${cur.img}>
					</div><div class="word"><strong>${cur.name}</strong>
					<p><span><em>￥</em><b>${cur.now_price}</b></span>
					<del>￥${cur.ori_price}</del></p></div></a></li>`;
		}
		$("#seckill .slide1 ul")[0].innerHTML += str1;

		slide2.map((item, index)=>{
			let cur = slide2[index]; 
			str2 += `<li><a href="##"><div class="img opa">
					<img true_src=${cur.img}></div>
					<div class="word"><span>${cur.des}</span>
					<p>${cur.price}</p><em><i>${cur.path}</i>
					<i class="iconfont icon-dayuhao"></i></em>
					</div></a></li>`;
			str3 += `<li></li>`;
		});
		// 和第一张相同
		str2 += `<li><a href="##"><div class="img opa">
				<img true_src=${slide2[0].img}></div>
				<div class="word"><span>${slide2[0].des}</span>
				<p>${slide2[0].price}</p><em><i>${slide2[0].path}</i>
				<i class="iconfont icon-dayuhao"></i></em>
				</div></a></li>`;
		$("#seckill .slide2 .context").html(str2);
		$("#seckill .slide2 .dot").html(str3);
	}
	$.ajax({
		url: "json/seckill_slide.json",
		dataType: "json",
		success:function(data){
			let slide1_width = parseFloat($("#seckill .slide1").css("width"));
			// 绑定图片
			bindSeckill(data,slide1_width);
			// 单击箭头切换：默认一共有三组图片
			let move_ul = $("#seckill .slide1 ul")[0];
			$("#seckill .slide1 .arrow_right").click(function(){
				util.move(move_ul, slide1_width, "0px", 400, 1, 3);
			});
			$("#seckill .slide1 .arrow_left").click(function(){
				util.move(move_ul, slide1_width, "0px", 400, -1, 3);
			});

			// slide2自动切换
			let index = 0;
			let slide2_width = parseFloat($("#seckill .slide2").css("width"));
			let slide2_li_num = data.slide2.length;
			$("#seckill .slide2 .dot li").eq(index).addClass("selected");
			setInterval(function(){
				index++;
				if (index === slide2_li_num){
					index = 0;
				}
				$("#seckill .slide2 .dot li").eq(index).addClass("selected").siblings().removeClass("selected");
				util.move($("#seckill .slide2 .context")[0], slide2_width, "0px",400, 1, slide2_li_num+1);
			},2000);

		}
	});
	// seckill: 倒计时
	function setTime(){
		let date = new Date();
		let hour = date.getHours();
		let begin_hour = hour % 2 ===0 ? hour: hour - 1;
		let target_sec = (begin_hour+2)*60*60;
		// 时分秒
		let hms = $("#seckill .time em");
		$("#seckill .time strong").html(begin_hour+":00");
		let timer = setInterval(function(){
			let cur = new Date();
			let gap = target_sec - (cur.getHours()*60*60+cur.getMinutes()*60+cur.getSeconds());
			let hour = Math.floor(gap/3600);
			let min = Math.floor((gap-hour*3600)/60);
			let sec = Math.floor(gap-hour*3600-min*60);
			hms.eq(0).html(util.addZero(hour));
			hms.eq(1).html(util.addZero(min));
			hms.eq(2).html(util.addZero(sec));
		},1000);
	}
	setTime();

	// special_offer:
	let special_offer_tags = $("#specialOffer .bargain .nav ul a");
	special_offer_tags.eq(0).addClass("selected");
	$("#specialOffer .bargain .info:gt(0)").addClass("hidden");
	special_offer_tags.mouseover(function(){
		special_offer_tags.removeClass("selected");
		$(this).addClass("selected");
		$("#specialOffer .bargain .info").addClass("hidden")
		$("#specialOffer .bargain .info").eq($(this).index("#specialOffer .bargain .nav ul a"))[0].classList.remove("hidden");
	});

	// discover:请求图片
	function bindDiscover(data){
		let str = ``;
		data.map((item,index)=>{
			if (index%2 === 0){
				str += `<li><a href="##">
					<div class="img opa">
						<img true_src=${item.img}>
					</div>
					<p>${item.word}</p></a></li>`;
			} else {
				str += `<li><a href="##">
					<p>${item.word}</p>
					<div class="img opa">
						<img true_src=${item.img}>
					</div></a></li>`;
			}
		});
		// 重复前5张（重复张数由容器宽度决定）
		for (let i = 0; i < 5; i++){
			let cur = data[i];
			if ((data.length+i)%2 === 0){
				str += `<li><a href="##">
					<div class="img opa">
						<img true_src=${cur.img}>
					</div>
					<p>${cur.word}</p></a></li>`;
			} else {
				str += `<li><a href="##">
					<p>${cur.word}</p>
					<div class="img opa">
						<img true_src=${cur.img}>
					</div></a></li>`;
			}
		}
		$("#discover .info ul").html(str);
	}
	// 跑马灯单次切换
	function autoMove(all_li_width, move_ul, move_thumb, thumb_course){
		let ul_left = Math.abs(parseFloat(move_ul.css("left")));
		let thumb_left = parseFloat(move_thumb.css("left"));
		if (ul_left >= all_li_width || thumb_left >= thumb_course){
			move_ul.css("left", "0px");
			move_thumb.css("left", "0px");
			ul_left = thumb_left = 0;
		}
		move_ul.css("left", -(ul_left+5)+"px");
		move_thumb.css("left", thumb_left+(thumb_course*5/all_li_width)+"px");
	}
	$.ajax({
		url: "json/discover.json",
		dataType:'json',
		success:function(data){
			// 绑定图片
			bindDiscover(data);
			// 添加滚动效果
			let move_ul = $("#discover .info ul");
			let move_thumb = $("#discover .info .scrollbar .thumb");
			let all_li_width = data.length*parseFloat($("#discover .info ul a").eq(0).css("width"));
			let thumb_course = parseFloat($("#discover .info .scrollbar").css("width"))-parseFloat(move_thumb.css("width"));
			let timer = setInterval(function(){
				autoMove(all_li_width, move_ul, move_thumb, thumb_course);
			},100);

			// 鼠标悬停，停止滚动
			$("#discover .info").mouseover(function(){
				clearInterval(timer);
			});
			// 鼠标划出，重新开始滚动
			$("#discover .info").mouseout(function(){
				timer = setInterval(function(){
					autoMove(all_li_width, move_ul, move_thumb, thumb_course);
				},100);
			});
			// 滚动条拖拽效果
			move_thumb.mousedown(function(down_event){
				let offsetX = down_event.offsetX;
				let prev_pos = down_event.pageX;
				let thumb_prev_left = parseFloat(move_thumb.css("left"));
				let ul_prev_left = parseFloat(move_ul.css("left"));
				$(document.body).mousemove(function(move_event){
					move_event.preventDefault();
					let thumb_now_left = parseFloat(move_thumb.css("left"));
					let thumb_move = move_event.pageX - prev_pos;
					// 滑到最左边时，可以向右滑动；滑到最右边时，可以向左滑动
					if (thumb_now_left <= 0 && move_event.offsetX <= offsetX){
						move_thumb.css("left", "0px");
						return;
					} else if (thumb_now_left >= thumb_course && move_event.offsetX >= offsetX) {
						move_thumb.css("left", thumb_course+"px");
						return;
					}
					move_thumb.css("left", thumb_prev_left+thumb_move+"px");
					move_ul.css("left", ul_prev_left-(thumb_move*all_li_width/thumb_course)+"px");
				});
				$(document.body).mouseup(function(){
					$(this).off("mousemove");
					$(this).off("mouseup");
				});
			});
		}
	});

	// new:新品首发
	function bindNew(data){
		let str = ``;
		data.map((item,index)=>{
			str += `<li><a href="##"><div class="img opa">
						<img true_src=${item.img}>
						<p class="abs">NEW</p></div>
						<div class="info">
							<span>${item.des}</span>
							<p>${item.word}</p>
							<em>
								<i>￥</i><b>${item.price}<strong>起</strong></b>
							</em>
						</div></a></li>`;
		});
		// 重复前3张图片
		for (let i = 0; i < 3; i++){
			let cur = data[i];
			str += `<li><a href="##"><div class="img opa">
						<img true_src=${cur.img}>
						<p class="abs">NEW</p></div>
						<div class="info">
							<span>${cur.des}</span>
							<p>${cur.word}</p>
							<em>
								<i>￥</i><b>${cur.price}<strong>起</strong></b>
							</em>
						</div></a></li>`;
		}
		$("#new .new .pro").html(str);
		$("#new .new .pro li").eq(1).addClass("selected");
	}
	$.ajax({
		url:"json/new_new.json",
		dataType:"json",
		success:function(data){
			// 绑定图片
			bindNew(data);
			// 添加轮播效果
			let move_ul = $("#new .new .pro");
			let lis = $("#new .new .pro li");
			let li_num = move_ul[0].children.length;
			let move_begin = $("#new .new .pro").css("left");
			let move_course = parseFloat(lis.eq(0).css("width"))+10;
			let index = 1;
			let timer = setInterval(function(){
				autoChange();
			}, 7000);
			// 单击箭头，切换图片和文字
			$("#new .new .arrow_left").click(function(){
				index--;
				if (index === 0){
					index = li_num-3;
				}
				lis.eq(index).addClass("selected").siblings().removeClass("selected");
				util.move(move_ul[0], move_course, move_begin, 200, -1, li_num-3+1);
			});
			$("#new .new .arrow_right").click(function(){
				autoChange();
			});
			function autoChange(){
				index++;
				if (index === li_num-1){
					index = 2;
				}
				lis.eq(index).addClass("selected").siblings().removeClass("selected");
				util.move(move_ul[0], move_course, move_begin, 200, 1, li_num-3+1);
			}
		}
	});
	let new_ranking_tags = $("#new .ranking_list .nav a");
	new_ranking_tags.eq(0).addClass("selected");
	$("#new .ranking_list .info:gt(0)").addClass("hidden");
	new_ranking_tags.mouseover(function(){
		new_ranking_tags.removeClass("selected");
		$(this).addClass("selected");
		$("#new .ranking_list .info").addClass("hidden");
		$("#new .ranking_list .info").eq($(this).index("#new .ranking_list .nav a")).removeClass("hidden");
	});

	// channel: 请求图片
	function bindChannel(data){
		data.map((item, index)=>{
			let li = document.createElement("li");
			// .two中的中转站
			let str1 = ``;
			item.map((e,i)=>{
				// 小图
				if (typeof e === "object"){
					str1 += `<a href="##"><p><strong>${e.title}</strong>
							<span>${e.des}</span></p>
						<div class="clearfix"><div class="img fl_left"><img true_src=${e.img[0]}>
						</div><div class="img fl_right"><img true_src=${e.img[1]}>
						</div></div></a>`;
					if (i%2 !== 0){
						let div = document.createElement("div");
						$(div).addClass("two");
						$(div).html(str1);
						li.appendChild(div);
						str1 = ``;
					}
				} else {// 大图
					li.innerHTML += `<div class="one"><a href="##">
						<img class="opa" true_src=${e}></a></div>`;
				}
			});
			$("#channel .info ul")[0].appendChild(li);
			
		});
		// 和第一组相同
		$("#channel .info ul").append($("#channel .info li").eq(0)[0].cloneNode(true));
	}
	$.ajax({
		url:"json/channel.json",
		dataType: "json",
		success:function(data){
			// 绑定图片
			bindChannel(data);
			// 点击箭头切换图片
			let channel_width = parseFloat($("#channel").css("width"));
			let move_ul = $("#channel .info ul")[0];
			$("#channel .info .arrow_left").click(function(){
				util.move(move_ul, channel_width, "0px", 200, -1, data.length+1);
			});
			$("#channel .info .arrow_right").click(function(){
				util.move(move_ul, channel_width, "0px", 200, -1, data.length+1);
			});
		}
	});

	
	// 监听页面滚动条
	window.onscroll = function(){
		let scrollTop = document.documentElement.scrollTop;

		// top_fixed: 滚动条滚动660px，top_fixed显示
		scrollTop >= 660 ? $(top_fixed).fadeIn() : $(top_fixed).fadeOut();

		// right_fixed: 滚动条滚动到“每日特价”和“频道广场”处，“特色优选”、“频道广场”文字变色
		if (scrollTop >= 2020){
			$("#right_fixed a[href='#channel']").addClass("selected").siblings().removeClass("selected");
		} else if (scrollTop >= 1000){
			$("#right_fixed a[href='#specialOffer']").addClass("selected").siblings().removeClass("selected");
		} else if (scrollTop >= 730){// right_fixed: 滚动条滚动到“京东秒杀”处，变为fixed定位，“京东秒杀”文字变色
			$(right_fixed).removeClass("abs").addClass("right_fix");
			$("#right_fixed a[href='#seckill']").addClass("selected").siblings().removeClass("selected");
		} else {
			$(right_fixed).removeClass("right_fix").addClass("abs");
		}

		if (scrollTop >= 250){
			util.loadImg($("#seckill img"));
			$("#right_fixed")[0].classList.remove("hidden");
		} 
		if (scrollTop >= 850){
			util.loadImg($("#discover img"));
		}
		if (scrollTop >= 1120){
			util.loadImg($("#new .new img"));
		}
		if (scrollTop >= 1635){
			util.loadImg($("#channel img"));
		}
	};
			
	// right_fixed:点击top，回到页面顶部
	$("#right_fixed a.top").click(function(event){
		event.preventDefault();
		let timer = setInterval(function(){
			if (document.documentElement.scrollTop <= 0){
				clearInterval(timer);
				return;
			}
			document.documentElement.scrollTop -= 50;
		},100);
	});


})();



