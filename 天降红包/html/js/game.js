/*
    time:游戏时间（秒）
    speed:金币飘落到底部基础时间（毫秒）（加减1000毫秒随机）
    frequency:金币生成频率（毫秒）
    max:金币是否掉落超过1，1=是，0=否
    call:结束回调函数，返回string类型分数，格式(x.xx)
 */
var TelFare=function(options){
    var defaults ={
        time:10000,
        speed:3000,
        frequency:300,
        max:1,
        call:function(){}
    }
    for (var property in options) {
        defaults[property] = options[property];
    }
    options=defaults;
    var aArr=[
        {className:"gold1",score:1},
        {className:"gold2",score:5},
        {className:"gold3",score:10},
        {className:"gold4",score:-5}
    ];
    var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    var down= device ? 'touchstart' : 'mousedown';
    var move = device? 'touchmove': 'mousemove';
    var up = device? 'touchend': 'mouseup';
    var _this=$(".game");
    var _width=_this.width();
    var _height=_this.height();
    var _god=_this.find(".god");
    var _ten=_this.find(".ten");
    var _one=_this.find(".one");
    var _price=_this.find(".price");
    var _godTop=parseInt(_god.offset().top);
    var _godLeft=parseInt(_god.offset().left);
    var _godWidth=parseInt(_god.width());
    var _godHeight=parseInt(_god.height());
    var _goldTop=_godTop+parseInt(_godHeight*0.5);
    var isGame=false;
    var currentTime=0;
    var score=0;
    var scoreStr='';
    var indexArr=[];
    var index=0;

    this.init=init=function(){
        score=0;
        currentTime=options.time;
        isGame=true;
        indexArr=createIndexArr();
        index=0;
        godMove();
        countdown();
        createGold();
    }
    this.end=gameEnd=function(){
        isGame=false;
        _god.stop();
        _this.find("a").stop();
        obj={};
        obj.score=scoreStr;
        options.call(obj);
    }
    init();
    function createGold(){
        if(isGame){
            var speed=getRandom(options.speed-1000,options.speed+1000);
            var l=parseInt(_god.offset().left)+parseInt(_godWidth*0.2);
            var angle=getRandom(0,360);
            var scale=getRandom(8,10)*0.1;
            var al=l+_godWidth*(getRandom(0,30)-10)*0.1;
            var _i=indexArr[index];
            index++;
            var obj=aArr[_i];
            var _a=$('<a href="javascript:void(0)"></a>').appendTo(_this);
            _a.addClass(obj.className);
            _a.css({"left":l,"top":_goldTop,"-webkit-transform":"rotate("+angle+"deg)"+" scale("+scale+")","transform":"rotate("+angle+"deg)"+ "scale("+scale+")"});
            _a.animate({"left":al,"top":_height},speed,function(){
                _a.remove();
            })
            _a.on(down,function(){
                if(isGame){
                    score+=obj.score;
                    score=score<0?0:score;
                    scoreStr='';
                    scoreStr+=parseInt(score/100)+".";
                    scoreStr+=parseInt(score/10)%10;
                    scoreStr+=score%10;
                    _price.html(scoreStr);
                    _a.remove();
                }
            });
            setTimeout(createGold,options.frequency)
        }
    }
    function godMove(){
        if(isGame){
            var speed=getRandom(600,1000);
            var min=0;
            var max=_width/4;
            if(_godLeft<_width/4){
                min=_width/3;
                max=_width/1.8;
            }
            _godLeft=getRandom(min,max);
            _god.animate({"left":_godLeft},speed,function(){
                godMove();
            })
        }
    }
    function countdown(){
        if(isGame){
            var ten=parseInt(currentTime/10);
            var one=currentTime%10;
            _ten.html(ten);
            _one.html(one);
            if(currentTime>0){
                setTimeout(function(){
                    currentTime--;
                    countdown();
                },1000);
            }else{
                gameEnd();
            }
        }
    }
    function createIndexArr(){
        var arr=[];
        var len=options.time*(1000/options.frequency+0.5);
        window.console.log(len);
        var max=options.max*100;
        if(max<100){
            for(var i=0;i<len;i++){
                if(i<2){
                    arr.push(2);
                }else if(i<10){
                    arr.push(1);
                }else if(i<20){
                    arr.push(0);
                }else{
                    arr.push(3)
                }

            }
        }else{
            for(var i=0;i<len;i++){
                if(i<10){
                    arr.push(2);
                }else if(i<20){
                    arr.push(1);
                }else if(i<25){
                    arr.push(0);
                }else{
                    var ss=getRandom(0,5);
                    arr.push(ss>3?3:ss);
                }
            }
        }
        arr=arrUpset(arr);
        return arr;
    }
    //数组乱序
    function arrUpset(arr){
        return arr.sort(function(){return Math.random()>0.5?-1:1;})
    }
    function getRandom(min,max){
        var _max=max || min;
        var _min=max?min:0;
        return parseInt(Math.random()*(_max-_min+1)+_min);
    }
}
