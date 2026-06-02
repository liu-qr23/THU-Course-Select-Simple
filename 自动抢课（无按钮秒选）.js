// ==UserScript==
// @name         抢课（无按钮秒选）
// @namespace    http://tampermonkey.net/
// @version      2026-05-31
// @description  try to take over the world!
// @author       You
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=bxSearch&*
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=rxSearch&*
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=xxSearch&*
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=tySearch&*
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tsinghua.edu.cn
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log('自动选课触发');

    // ==================== 配置 ====================
    const TARGET_COURSES = [
        // 课程号 与 课序号（可多选）
        { courseID: '12345678', courseNumber: 0 }, 
        // { courseID: '87654321', courseNumber: 1 },
    ];
    // ===============================================

    function getRowInfo(row) {
        // 获取课程所有信息（包括课程名、教师、选课信息等）
        let allInfo = '';
        const tds = row.querySelectorAll('td');
        for (const td of tds) {
            // 获取 td 中的所有 div 和 span 的文本内容及 title 属性（处理省略号情况）
            const elements = td.querySelectorAll('div, span');
            for (const elem of elements) {
                allInfo += elem.textContent.trim() + ' ';
                // 处理文字省略时的完整内容
                if (elem.hasAttribute('title')) {
                    allInfo += elem.getAttribute('title').trim() + ' ';
                }
            }
        }
        return allInfo;
    }

    function getCourseNumberFromInfo(allInfo, courseID) {
        const parts = allInfo.split(/\s+/).filter(Boolean);
        const courseIndex = parts.indexOf(courseID);
        if (courseIndex === -1 || courseIndex + 1 >= parts.length) {
            return null;
        }

        const nextToken = parts[courseIndex + 1];
        const courseNumber = parseInt(nextToken, 10);
        return Number.isNaN(courseNumber) ? null : courseNumber;
    }

    function trySelectCourse(target) {
        const rows = document.querySelectorAll('#table_t tr.trr2');
        if (rows.length === 0) {
            console.log('课程列表未加载');
            return false;
        }

        for (const row of rows) {
            const allInfo = getRowInfo(row);
            const courseNumber = getCourseNumberFromInfo(allInfo, target.courseID);
            if (courseNumber !== target.courseNumber) continue;

            // 勾选课程
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (!checkbox || checkbox.disabled) return false;
            checkbox.checked = true;
            return true;
        }

        console.log(`未找到 ${target.courseID} ${target.courseNumber} 的课程`);
        return false;
    }

    function submitSelections() {
        // 提交选课
        let submitSuccess = false;
        if (typeof commitXxAdd === 'function') {
            try {
                commitXxAdd();
                submitSuccess = true;
            } catch (e) {
                submitSuccess = false;
            }
        } else {
            const submitBtn = document.querySelector('input[value="提交"]');
            if (submitBtn) {
                submitBtn.click();
                submitSuccess = true;
            }
        }

        if (!submitSuccess) {
            console.log('提交选课失败');
        }
        return submitSuccess;
    }

    let selectedCount = 0;
    for (const target of TARGET_COURSES) {
        if (trySelectCourse(target)) {
            selectedCount++;
        }
    }

    if (selectedCount > 0) {
        submitSelections();
    }
})();