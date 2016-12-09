# arc-progress
一个支持IE8的环形进度条jQuery插件。

# 特性
- 支持IE8，低版本浏览器采用vml实现
- 高版本浏览器，可选择svg或是canvas

# 使用
- 确保引入jQuery
- 引入arc-progress
```html
<script type=text/javascript src="arc-progress.js"></script>
```
- 使用插件
```html
<div class="progress" id="progress"></div>
```
```js
$('#progress').arcProgress({
    percent: 54, //0-100得分
    radius:50, //半径px
    strokeWidth:3, //线的粗细
    stroke:'green', //线的颜色
    mode:'svg' //可选择svg或canvas
});
```
# 注意事项
- 如果要兼容IE8的同学，请注意浏览器的渲染方式，这个要去掉
```html
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
```
- 去掉之后会影响一些盒子模型，比如heith可能就不包含padding了，所以在写样式的时候特别注意