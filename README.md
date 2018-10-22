## Installation

```sh
npm install configdata-to-html
```

## API

```js
var dom = new CreateHtml(jsonString, width, deviceType);

$('#id').append(dom.init());

参数说明:
width: 解析宽度
jsonString: 后台返回的json字符串
deviceType: 设备类型(m, pc, rn, wx, minapp)
    m: M端
    pc: PC端
    rn: RN端
    wx: 微信端
    minapp: 内嵌M页
```

##Example

```
<script src="//static.360buyimg.com/shangou/huaban/create-html/index.js"></script>

<div id="flexible">
    <script type="text/javascript">
        try{
            var client_width = document.documentElement.clientWidth;
            var dom = new CreateHtml(jsonString, client_width, 'm');

            document.querySelector('#flexible').append(dom.init());
        }catch(err) {
            console.log(err);
        }
    </script>
</div>
```
