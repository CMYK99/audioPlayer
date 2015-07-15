var audioPlayer={
	Player:{},
	audio:new Array(),
	played:new Array(),
	timeout:new Array(),
	tagName:'.newPlayer',
	config:{
		'skin':'default',
	},
	mi:[
		'name',
		'auther'
	],
	init:function(config){
		if(config)  this.loadConfig(config);
		this.loadSkin();
		this.createObj();
	},
	setMusic:function(id,url,play,btn,kg,msg,click){
		this.audio[id].src=url;
		for(var i=0; i<this.mi.length; i++){
			console.log($(click).attr('d-'+this.mi[i]))
			if($(click).attr('d-'+this.mi[i]))
				$(this.audio[id]).attr('data-'+this.mi[i],$(click).attr('d-'+this.mi[i]))
		}
		if(play) this.play(id,btn,kg,msg)
	},
	createObj:function(){
		this.Selecter();
		for(var k=0; k<this.Player.length; k++){
			var info=this.getInfo(this.Player[k]);
			if(!info['src']) continue;
			if(!info['img']) info['img']=this.href('skin/'+this.config['skin']+'/img/default.png');
			var playerOffset=this.offset(this.Player[k]);
			var audio=this.audio[k]=new Audio(info['src']);
			var right=document.createElement('div');
			var img=document.createElement('img');
			var playMsg=document.createElement('span');
			var playBtn=this.played[k]=document.createElement('a');
			var playKg=this.createControls();
			var playList=this.Player[k].getAttribute('list');
			for(var i=0;i<this.mi.length;i++){
				if(this.Player[k].getAttribute('data-'+this.mi[i]))
					audio.setAttribute('data-'+this.mi[i],this.Player[k].getAttribute('data-'+this.mi[i]))
			}
			playBtn.href='javascript:;';
			playBtn.setAttribute('class','playBtn pause');
			playBtn.style.width=playBtn.style.height=playBtn.style.lineHeight=playerOffset['h']-16+'px';
			img.src=info['img'];
			img.setAttribute('class','timg');
			img.style.height=this.Player[k].style.height;
			right.setAttribute('class','playRight');
			right.style.width=playerOffset['w']-playerOffset['h']-1+'px';
			right.appendChild(playKg);
			right.appendChild(playBtn);
			right.appendChild(playMsg);
			audio.preload='meta';
			playMsg.setAttribute('class','playmsg');
			this.Player[k].appendChild(audio);
			this.Player[k].appendChild(right);
			this.Player[k].appendChild(img);
			playBtn.onclick = (function(i,obj,playKg,msg,that){
                return function(){
                    that.play(i,obj,playKg,msg)
                }
            })(k,playBtn,playKg,playMsg,this);
			if(playList){
				$(playList).click(function(that,id,btn,kg,msg){
					return function(){
						var url=this.getAttribute('d-src');
						that.setMusic(id,url,true,btn,kg,msg,this);
					}
				}(this,k,playBtn,playKg,playMsg))
			}
		}
	},
	createControls:function(){//进度条
		var time=document.createElement('div');
		var bg=document.createElement('div');
		var kg=document.createElement('div');
		time.setAttribute('class','playTime');
		bg.setAttribute('class','playBg');
		kg.setAttribute('class','playKg');
		time.innerHTML='00:00/00:00';
		kg.appendChild(bg)
		kg.appendChild(time);
		return kg;
	},
	play:function(id,btn,pkg,msg){
			msg=$(msg)
			pkg=$(pkg);
		var loadCalc=0;
		var obj=this.audio[id];
		var len=this.getAudiolen(id);
		var playBg=pkg.children('.playBg');
		var playTime=pkg.children('.playTime');
		if(obj.paused){
			obj.play();
			$(btn).removeClass('pause stop').addClass('play')
			this.timeout[id]=setInterval(function(that){
				return function(){
					msg.html('');
					if(isNaN(len) && loadCalc<20){
						loadCalc++;
						len=that.getAudiolen(id);
						msg.html('正在缓冲……');
						return true;
					}
					msg.html(obj.getAttribute('data-name'));
					if(isNaN(len) || len<=1){
						msg.html('音频资源已失效!');
						clearInterval(that.timeout[id]);
					}
					var on=obj.currentTime+1;
					var width = (on/len*100);
					playBg.css('width',width+'%');
					playTime.html(that.timeText(on)+'/'+that.timeText(len));
					if(on > len || obj.ended){
						$(btn).removeClass('play').addClass('stop');
						clearInterval(that.timeout[id]);
						return false;
					}
				}
			}(this),100);
		}else{
			obj.pause();
			$(btn).removeClass('play').addClass('pause');
			clearInterval(this.timeout[id]);
		}
	},
	getAudiolen:function(id){
		return Math.ceil(this.audio[id].duration);
	},
	timeText:function(len){
		len=parseInt(len)
		var his=new Array(3600,60,1);
		var TimeStr='';
		for(var i=0;i<his.length;i++){
			if(parseInt(len/his[i])>0||i>0){
				var cahe=(parseInt(len/his[i])<10)?'0'+parseInt(len/his[i]):parseInt(len/his[i]);
				TimeStr+=cahe+':'
			}
			len=len%his[i];
		}
		TimeStr=TimeStr.substr(0,TimeStr.length-1);
		return TimeStr;
	},
	offset:function(obj){
		var offset=new Array();
		offset['h']=obj.offsetHeight;
		offset['w']=obj.offsetWidth;
		return offset;
	},
	Selecter:function(){
		return this.Player=$(this.tagName);
	},
	loadConfig:function(config){
		for(var k in config){
			this.config[k]=config[k];
		}
		return this.config;
	},
	loadSkin:function(){
		var href=this.config.skin || 'default';
		href=this.href('skin/'+href+'/skin.css');
		$('head').append('<link type="text/css" rel="stylesheet" href="'+href+'"/>')
	},
	getInfo:function(obj){
		var info=new Array();
		info['src']=obj.getAttribute('data-src');
		info['img']=obj.getAttribute('data-img');
		info['auth']=obj.getAttribute('data-auth');
		info['title']=obj.getAttribute('data-title');
		return info;
	},
	href:function(newSrc){
		var script=document.scripts;
		var src='';
		for(var i=0;i<script.length;i++){
			if(script[i].src.match(/newPlayer.js$/)){
				src=script[i].src.replace(/newPlayer.js$/,newSrc);
				break;
			}
		}
		return src;
	}
}