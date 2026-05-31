// ==UserScript==
// @name         自动跳转至一级选课页面
// @namespace    http://tampermonkey.net/
// @version      2026-05-31
// @description  try to take over the world!
// @author       You
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=showTree&*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tsinghua.edu.cn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('跳转一级选课页面');

    // 尝试获取右侧框架（名称为 "right"）
    let rightFrame = null;
    try {
        rightFrame = window.parent.frames['right'];
    } catch (e) {
        // 跨域限制则放弃
        return;
    }

    if (!rightFrame) return;

    // 获取当前学期（从本页面的下拉框）
    const semesterSelect = document.querySelector('select[name="menu1"]');
    if (!semesterSelect || !semesterSelect.value) return;

    const semester = semesterSelect.value;

    // 构造一级选课地址
    const targetUrl = 'xkBks.vxkBksXkbBs.do?m=selectKc&p_xnxq=' + semester + '&pathContent=一级选课';

    // 改变右侧框架的地址
    try {
        rightFrame.location.href = targetUrl;
    } catch (e) {
        // 静默失败
    }
})();