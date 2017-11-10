;(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(global);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(global);
    } else {
        global.CreateHtml = factory(global);
    }
}(typeof window !== 'undefined' ? window : this, function (window) {
    var file = null;
    var proportion = 1;

    // 倒计时
    function Tick(opts) {
        this.opts = opts;
        this.disTime = opts.disTime;
        this.numberDouble = opts.numberDouble;
        this.timer = null;
    }

    var _timerProto = {
        _run: function() {
            if(this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            
            this._runFuc();
            this.timer = setInterval(this._runFuc.bind(this), 100);
        },

        _runFuc: function() {
            if(this.disTime < 0) {
                clearInterval(this.timer);
                this.timer = null;
                this.opts.timeUp && this.opts.timeUp();
                return;
            }

            var time_data = Utils.msTransform(this.disTime, this.numberDouble);

            this.opts.run(time_data);
            this.disTime -= 100;
        },

        _refresh: function(time) {
            this.disTime = time;
            this._run();
        }
    }

    Tick.prototype = _timerProto;

    // config to html
    function CreateHtml(opts, boxWidth) {
        this.boxWidth = boxWidth;
        this.opts = opts;
        this.file = null;
        this.proportion = 1;
    }

    var _proto = {
        init: function() {
            // 创建区域
            this.createFile();

            // 创建模块
            this.createModule();

            return this.file;
        },

        createFile: function() {
            this.file = document.createElement('div');
            this.file.id = 'fox' + this.opts.id;
            this.file.setAttribute('data-name', this.opts.fileName);
            this.proportion = this.boxWidth / this.opts.width;
            Utils.css(this.file, {
                width: this.boxWidth + 'px',
                height: this.opts.height * this.proportion + 'px',
                margin: '0 auto',
                position: 'relative',
                padding: 0,
                margin: 0,
                overflow: 'hidden',
                backgroundColor: this.opts.fileBg.isTransport? 'transparent': this.opts.fileBg.bgColor
            });
        },

        createModule: function() {
            var modules = this.opts.modules;

            for(var i = 0; i < modules.length; i++) {
                switch(modules[i].type) {
                    case 'picture':
                        this.createPicture(modules[i]);
                        break;

                    case 'tick':
                        this.createTick(modules[i]);
                        break;

                    case 'mapArea':
                        this.createMapArea(modules[i]);
                        break;
                }
            }
        },

        createPicture: function(module) {
            var wrap = document.createElement('div');
            var imgHtml = '';
            var _srcLazy = '';
            var _src = '';

            if(module.lazyLoad) {
                _srcLazy = module.imgUrl;
                wrap.setAttribute('data-xhr-layzr', true);
            }else{
                _src = module.imgUrl;
                wrap.setAttribute('data-xhr-layzr', false);
            }

            var img = '<img src="'+ module.imgUrl +'" style="display: block; width: 100%; height: 100%; outline: none;">';
            var _style = 'position: absolute; width: ' + this.sizeTransForm(module.width) + 'px; z-index: '+ module.index +'; height: ' + this.sizeTransForm(module.height) + 'px; left: ' + this.sizeTransForm(module.left) + 'px; top: ' + this.sizeTransForm(module.top) + 'px;';

            wrap.style = _style;
            wrap.id = 'fox-module' + module.id;
            wrap.innerHTML = img;
            this.file.appendChild(wrap);
        },

        createTick: function(module) {
            var wrap = document.createElement('div');
            var _style = 'position: absolute; width: ' + this.sizeTransForm(module.width) + 'px; z-index: '+ module.index +'; height: ' + this.sizeTransForm(module.height) + 'px; left: ' + this.sizeTransForm(module.left) + 'px; top: ' + this.sizeTransForm(module.top) + 'px;';

            wrap.style = _style;
            wrap.id = 'fox-module' + module.id;

            if(module.showMsec) {
                var _tickHtml ='<div style="height: 100%; text-align: center; font-size: 0; width: 100%;">' +
                    '<span class="day" style="'+ this.getNumStyle(module, true) +'">0</span>' +
                    '<span class="day" style="'+ this.getNumStyle(module, false) +'">0</span>' +
                    '<span class="txt" style="'+ this.getTxtStyle(module) +'">天</span>' +
                    '<span class="hours" style="'+ this.getNumStyle(module, true) +'">0</span>' +
                    '<span class="hours" style="'+ this.getNumStyle(module, false) +'">0</span>' +
                    '<span class="txt" style="'+ this.getTxtStyle(module) +'">时</span>' +
                    '<span class="min" style="'+ this.getNumStyle(module, true) +'">0</span>' +
                    '<span class="min" style="'+ this.getNumStyle(module, false) +'">0</span>' +
                    '<span class="txt" style="'+ this.getTxtStyle(module) +'">分</span>' +
                    '<span class="sec" style="'+ this.getNumStyle(module, true) +'">0</span>' +
                    '<span class="sec" style="'+ this.getNumStyle(module, false) +'">0</span>' +
                    '<span class="txt" style="'+ this.getTxtStyle(module) +'">秒</span>' +
                    '<span class="ms" style="'+ this.getNumStyle(module, false) +'">0</span>' +
                '</div>';
            }else{
                var _tickHtml ='<div style="height: 100%; text-align: center; font-size: 0; width: 100%;">' +
                    '<span class="day" style="'+ this.getNumStyle(module, true) +'">0</span>' +
                    '<span class="day" style="'+ this.getNumStyle(module, false) +'">0</span>' +
                    '<span class="txt" style="'+ this.getTxtStyle(module) +'">天</span>' +
                    '<span class="hours" style="'+ this.getNumStyle(module, true) +'">0</span>' +
                    '<span class="hours" style="'+ this.getNumStyle(module, false) +'">0</span>' +
                    '<span class="txt" style="'+ this.getTxtStyle(module) +'">时</span>' +
                    '<span class="min" style="'+ this.getNumStyle(module, true) +'">0</span>' +
                    '<span class="min" style="'+ this.getNumStyle(module, false) +'">0</span>' +
                    '<span class="txt" style="'+ this.getTxtStyle(module) +'">分</span>' +
                    '<span class="sec" style="'+ this.getNumStyle(module, true) +'">0</span>' +
                    '<span class="sec" style="'+ this.getNumStyle(module, false) +'">0</span>' +
                    '<span class="day" class="txt" style="'+ this.getTxtStyle(module) +'">秒</span>' +
                '</div>';
            }

            wrap.innerHTML = _tickHtml;

            var day = Utils.GetByClass(wrap, 'day');
            var hour = Utils.GetByClass(wrap, 'hours');
            var min = Utils.GetByClass(wrap, 'min');
            var sec = Utils.GetByClass(wrap, 'sec');
            var ms = Utils.GetByClass(wrap, 'ms');
            var time = new Date().getTime();

            var tick = new Tick({
                disTime: module.endTime - time,
                numberDouble: true,
                run: (time) => {
                    day[0].innerHTML = time.day[0];
                    day[1].innerHTML = time.day[1];

                    hour[0].innerHTML = time.hour[0];
                    hour[1].innerHTML = time.hour[1];

                    min[0].innerHTML = time.min[0];
                    min[1].innerHTML = time.min[1];

                    sec[0].innerHTML = time.sec[0];
                    sec[1].innerHTML = time.sec[1];

                    if(module.showMsec) {
                        ms[0].innerHTML = time.ms[0];
                    }
                }
            });

            tick._run();
            this.file.appendChild(wrap);
        },

        createMapArea: function(module) {
            var wrap = document.createElement('a');
            var _style = 'position: absolute; width: ' + this.sizeTransForm(module.width) + 'px; z-index: '+ module.index +'; height: ' + this.sizeTransForm(module.height) + 'px; left: ' + this.sizeTransForm(module.left) + 'px; top: ' + this.sizeTransForm(module.top) + 'px;';

            wrap.style = _style;
            wrap.id = 'fox-module' + module.id;
            wrap.href = module.href? module.href: 'javascript:;';
            if(module.newTab) {
                wrap.target = '_blank';
            }
            this.file.appendChild(wrap);
        },

        getNumStyle: function(module, hasMargin) {
            var margin = hasMargin?this.sizeTransForm(module.marginRight/module.naturalWidth*module.width): 0;

            var style = 'display: inline-block;'+
                    'vertical-align: middle;'+
                    'text-align: center;'+ 
                    'height: 100%;' + 
                    'width: ' + this.sizeTransForm(module.naturalNumWidth/module.naturalWidth*module.width) +'px;' +
                    'line-height: ' + this.sizeTransForm(module.height) +'px;' + 
                    'font-size: ' + this.sizeTransForm(module.naturalNumFontSize/module.naturalWidth*module.width) +'px;' +
                    'border-radius: ' + this.sizeTransForm(module.naturalNumBorderRadius/module.naturalWidth*module.width) +'px;' +
                    'color: ' + module.numColor + ';'+ 
                    'background-color: '+module.numbg+';' +
                    'margin-right: '+ margin +'px;';

            return style;
        },

        getTxtStyle: function(module) {
            var style = 'display: inline-block;'+
                    'vertical-align: middle;'+
                    'text-align: center;'+ 
                    'height: 100%;' + 
                    'width: ' + this.sizeTransForm(module.naturalNumWidth/module.naturalWidth*module.width) +'px;' +
                    'line-height: ' + this.sizeTransForm(module.height) +'px;'+
                    'font-size: ' + this.sizeTransForm(module.naturalTxtFontSize/module.naturalWidth*module.width) +'px;' +
                    'color: ' + module.txtColor+';';

            return style;
        },

        sizeTransForm: function(size) {
            return size * this.proportion;
        }
    }

    CreateHtml.prototype = _proto;

    var Utils = {
        css: function(obj, name) {
            for(var i in name){
                if(i=='opacity')
                {
                    obj.style.filter='alpha(opacity:'+name[i]+')';
                    obj.style.opacity=name[i]/100;
                }
                else
                {
                    obj.style[i]=name[i];
                }
            }
        },

        msTransform: function(dis_time, numberDouble) {
            var dayms = dis_time / (3600000 * 24);

            if(dayms < 1) {
                var day = 0;
            }else{
                var day  = parseInt(dis_time / (3600000 * 24));
            }
            
            dis_time = parseInt(dis_time % (3600000 * 24));

            var hour = parseInt(dis_time / 3600000);
            dis_time = parseInt(dis_time % 3600000);

            var min  = parseInt(dis_time / 60000);
            dis_time = parseInt(dis_time % 60000);

            var sec  = parseInt(dis_time / 1000);
            dis_time = parseInt(dis_time % 1000 / 100);

            if(numberDouble) {
                hour     = Utils.toDuble(hour);
                min      = Utils.toDuble(min);
                sec      = Utils.toDuble(sec);
                day      = Utils.toDuble(day);
            }else{
                hour     = hour;
                min      = min;
                sec      = sec;
                day      = day;
            }

            return {
                day: day,
                hour: hour,
                min: min,
                sec: sec,
                ms: dis_time + ''
            }
        },

        toDuble: function(num){
            if(num<10){

                return '0'+num;

            }else{

                return num + '';

            };

        },

        GetByClass: function(obj,sName){
            if(obj.getElementsByClassName){
                return obj.getElementsByClassName(sName);
            }else{
                var arr = [ ];
                var re = new RegExp('(^|\\s)'+sName+'(\\s|$)');
                var aEle = obj.getElementsByTagName('*');

                for(var i=0; i<aEle.length; i++){
                    if(re.test(aEle[i].className)){
                        arr.push(aEle[i]);
                    };
                };
                
                return arr;
            };
        }
    };

    return CreateHtml;
}));
