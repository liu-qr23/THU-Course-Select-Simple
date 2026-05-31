// ==UserScript==
// @name         抢课
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

    // ==================== 配置 ====================
    const KEYWORD = '操作系统';          // 课程名关键词（大小写不敏感）
    // ===============================================

    function createButtonIfNeeded() {
        if (document.getElementById('auto-select-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'auto-select-btn';
        btn.textContent = `自动抢课：${KEYWORD}`;
        btn.style.cssText = `
            position: fixed;
            top: 20px;
            left: 30px;
            z-index: 99999;
            padding: 10px 20px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: background 0.3s;
        `;
        btn.addEventListener('click', trySelectCourse);
        document.body.appendChild(btn);
    }

    function trySelectCourse() {
        const rows = document.querySelectorAll('#table_t tr.trr2');
        if (rows.length === 0) {
            console.log('课程列表未加载');
            return;
        }

        let findCourse = false;
        for (const row of rows) {
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
            // 检查关键词是否匹配任何信息
            if (allInfo.toLowerCase().indexOf(KEYWORD.toLowerCase()) === -1) continue;

            findCourse = true;

            // 勾选课程
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (!checkbox || checkbox.disabled) continue;
            checkbox.checked = true;
        }

        if (!findCourse) {
            console.log(`未找到包含 ${KEYWORD} 的课程`);
        } else {
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
    }

    createButtonIfNeeded();
})();