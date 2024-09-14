// ==UserScript==
// @name         fetch episodes from tvdb
// @name:zh-CN   抓取 tvdb 条目
// @namespace    https://trim21.me/
// @version      0.2.27
// @source       https://github.com/trim21/bgm-tv-userscripts
// @supportURL   https://github.com/trim21/bgm-tv-userscripts/issues
// @license      MIT
// @match        https://bgm.tv/new_subject/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @grant        GM_info
// @run-at       document-end
// @author       Trim21 <i@trim21.me>
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/

;// CONCATENATED MODULE: external "$"
const external_$_namespaceObject = $;
var external_$_default = /*#__PURE__*/__webpack_require__.n(external_$_namespaceObject);
;// CONCATENATED MODULE: ./scripts/fetch-tvdb-series/src/index.ts

function main() {
  const params = new URLSearchParams(document.location.search);
  const name = params.get('t.name') ?? '';
  const infobox = params.get('t.infobox') ?? '';
  const summary = params.get('t.summary') ?? '';
  console.log({
    name,
    infobox,
    summary
  });
  external_$_default()('input[name="subject_title"]').val(name);
  external_$_default()('#subject_infobox').val(infobox);
  external_$_default()('#subject_summary').val(summary);
}
main();
/******/ })()
;