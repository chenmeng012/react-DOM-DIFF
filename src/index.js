import { createElement, render, renderDom } from './element'
import diff from './diff'
import patch from './patch'
let vertualDom1 = createElement('ul', {class: 'list'},[
    createElement('li',{class: 'item'}, ['a']),
    createElement('li',{class: 'item'}, ['b']),
    createElement('li',{class: 'item'}, ['c']),
]);
let vertualDom2 = createElement('ul', {class: 'list-group'},[
    createElement('li',{class: 'item'}, ['1']),
    createElement('li',{class: 'item'}, ['b']),
    createElement('div',{class: 'item'}, ['c']),
]);

//生成dom元素
let el = render(vertualDom1);
//插入到页面中
renderDom(el, window.root);
setTimeout(() => {
    //diff 查找变化的元素  产生补丁包
    let patches = diff(vertualDom1, vertualDom2);
    console.log(patches);
    //给元素打补丁  重新更新视图
    patch(el, patches);
}, 5000);


//将虚拟dom转化为真实dom
// let el = render(vertualDom);
// renderDom(el, window.root);
// console.log(el);
// console.log(vertualDom);


//Dom diff 比较两个虚拟dom的区别  其实就是两个对象
//Dom diff作用 根据两个虚拟对象创建出补丁， 描述改变的内容，将这个补丁用来更新dom
//通过js层面的计算，返回一个patch对象，即补丁对象，在通过特定的操作解析patch对象，完成页面的重新渲染
//1.只比较平级  2.不会跨级渲染  3.通过key尽量复用
//差异计算：先序深度优先遍历
/*
* 1.用js对象模拟dom
* 2.把此虚拟dom转成真是dom并插入到页面中去
* 3.如果有时间发生改变了虚拟的dom比较两颗虚拟dom树的差异，得到差异对象
* 4.把差异对象应用到真实的dom树
* */

