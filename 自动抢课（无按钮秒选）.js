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

(function() {
    'use strict';

    console.log('自动选课触发');

    // ==================== 配置 ====================
    const KEYWORD = '操作系统';          // 课程名关键词（大小写不敏感）
    // ===============================================

    function trySelectCourse() {
        const rows = document.querySelectorAll('#table_t tr.trr2');
        if (rows.length === 0) {
            console.log('课程列表未加载');
            return;
        }

        let findCourse = false;
        for (const row of rows) {
            // 获取课程名
            const kcmTd = row.querySelector('td[id$="_kcm"]');
            if (!kcmTd) continue;
            const courseName = kcmTd.textContent.trim();
            if (courseName.toLowerCase().indexOf(KEYWORD.toLowerCase()) === -1) continue;

            findCourse = true;

            // 勾选课程
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (!checkbox || checkbox.disabled) continue;
            checkbox.checked = true;

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
                console.log(`提交选课失败：${courseName}`);
            }
        }

        if (!findCourse) {
            console.log(`未找到包含 ${KEYWORD} 的课程`);
        }
    }

    trySelectCourse();
})();