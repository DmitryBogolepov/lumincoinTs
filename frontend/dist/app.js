/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _router_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./router.js */ \"./src/router.js\");\n\r\n\r\nclass App {\r\n    constructor() {\r\n\r\n        new _router_js__WEBPACK_IMPORTED_MODULE_0__.Router();\r\n    }\r\n}\r\n\r\n(new App());\n\n//# sourceURL=webpack://frontend/./src/app.js?");

/***/ }),

/***/ "./src/components/auth/logout.js":
/*!***************************************!*\
  !*** ./src/components/auth/logout.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Logout: () => (/* binding */ Logout)\n/* harmony export */ });\nclass Logout {\r\n    constructor() {\r\n\r\n    }\r\n}\n\n//# sourceURL=webpack://frontend/./src/components/auth/logout.js?");

/***/ }),

/***/ "./src/components/auth/sign-in.js":
/*!****************************************!*\
  !*** ./src/components/auth/sign-in.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SignIn: () => (/* binding */ SignIn)\n/* harmony export */ });\nclass SignIn {\r\n    constructor() {\r\n\r\n    }\r\n}\n\n//# sourceURL=webpack://frontend/./src/components/auth/sign-in.js?");

/***/ }),

/***/ "./src/components/auth/sign-up.js":
/*!****************************************!*\
  !*** ./src/components/auth/sign-up.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SignUp: () => (/* binding */ SignUp)\n/* harmony export */ });\nclass SignUp {\r\n    constructor() {\r\n\r\n    }\r\n}\n\n//# sourceURL=webpack://frontend/./src/components/auth/sign-up.js?");

/***/ }),

/***/ "./src/router.js":
/*!***********************!*\
  !*** ./src/router.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Router: () => (/* binding */ Router)\n/* harmony export */ });\n/* harmony import */ var _components_auth_sign_in_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/auth/sign-in.js */ \"./src/components/auth/sign-in.js\");\n/* harmony import */ var _components_auth_sign_up_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/auth/sign-up.js */ \"./src/components/auth/sign-up.js\");\n/* harmony import */ var _components_auth_logout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/auth/logout */ \"./src/components/auth/logout.js\");\n\r\n\r\n\r\n\r\n\r\nclass Router {\r\n    constructor() {\r\n        this.titlePageElement = document.getElementById('title');\r\n        this.contentPageElement = document.getElementById('content');\r\n        this.initEvents();\r\n        this.routes = [\r\n            {\r\n                route: '/sing-in',\r\n                title: \"Вход\",\r\n                filePathTemplate: '/templates/pages/auth/sign-in.html',\r\n                useLayout: false,\r\n                load: () => {\r\n                    new _components_auth_sign_in_js__WEBPACK_IMPORTED_MODULE_0__.SignIn(this.openNewRoute.bind(this));\r\n                },\r\n            },\r\n            {\r\n                route: '/sing-up',\r\n                title: \"Регистрация\",\r\n                filePathTemplate: '/templates/pages/auth/sign-un.html',\r\n                useLayout: false,\r\n                load: () => {\r\n                    new _components_auth_sign_up_js__WEBPACK_IMPORTED_MODULE_1__.SignUp(this.openNewRoute.bind(this));\r\n                },\r\n\r\n            }\r\n        ]\r\n    }\r\n    initEvents() {\r\n        window.addEventListener(\"DOMContentLoaded\", this.activateRoute.bind(this));\r\n        window.addEventListener(\"popstate\", this.activateRoute.bind(this));\r\n        document.addEventListener(\"click\", this.clickHandler.bind(this));\r\n    }\r\n\r\n    async openNewRoute(url) {\r\n        const currentRoute = window.location.pathname;\r\n        history.pushState({}, '', url);\r\n        await this.activateRoute(null, currentRoute);\r\n    }\r\n\r\n    async clickHandler(e) {\r\n        let element = null;\r\n        if (e.target.nodeName === 'A') {\r\n            element = e.target;\r\n\r\n        } else if (e.target.parentNode.nodeName === 'A') {\r\n            element = e.target.parentNode;\r\n        }\r\n\r\n        if (element) {\r\n            e.preventDefault();\r\n            const currentRoute = window.location.pathname;\r\n            const url = element.href.replace(window.location.origin, '');\r\n\r\n            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith(\"javascript:void(0)\")) {\r\n                return;\r\n            }\r\n            await this.openNewRoute(url);\r\n        }\r\n    }\r\n\r\n    async activateRoute(e, oldRoute=null) {\r\n        if( oldRoute ) {\r\n            const currentRoute = this.routes.find(item => item.route === oldRoute);\r\n            if (currentRoute.styles && currentRoute.styles.length > 0) {\r\n                currentRoute.styles.forEach(style => {\r\n                    document.querySelector(`link[href='/css/${style}']`).remove();\r\n                });\r\n            }\r\n            if (currentRoute.scripts && currentRoute.scripts.length > 0) {\r\n                currentRoute.scripts.forEach(script => {\r\n                    document.querySelector(`script[src='/js/${script}']`).remove();\r\n                });\r\n            }\r\n            if (currentRoute.unload && typeof currentRoute.unload === \"function\") {\r\n                currentRoute.unload();\r\n            }\r\n\r\n        }\r\n\r\n        const urlRoute = window.location.pathname;\r\n        const newRoute = this.routes.find(item => item.route === urlRoute);\r\n        if (newRoute) {\r\n            if(newRoute.styles && newRoute.styles.length > 0) {\r\n                newRoute.styles.forEach(style => {\r\n                    FileUtils.loadPageStyle('/css/' + style, this.adminLteStyleElement);\r\n                });\r\n            }\r\n\r\n            if(newRoute.scripts && newRoute.scripts.length > 0) {\r\n                for (const script of newRoute.scripts) {\r\n                    await FileUtils.loadPageScript('/js/'+ script);\r\n                }\r\n            }\r\n\r\n            if (newRoute.title) {\r\n                this.titlePageElement.innerText = newRoute.title + \" | Freelance Studio\";\r\n            }\r\n\r\n            if (newRoute.filePathTemplate) {\r\n                let contentBlock = this.contentPageElement;\r\n                if (newRoute.useLayout) {\r\n                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());\r\n                    contentBlock = document.getElementById('content-layout');\r\n                    document.body.classList.add('sidebar-mini');\r\n                    document.body.classList.add('layout-fixed');\r\n                } else {\r\n                    document.body.classList.remove('sidebar-mini');\r\n                    document.body.classList.remove('layout-fixed');\r\n                }\r\n                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());\r\n            }\r\n\r\n\r\n            if (newRoute.load && typeof newRoute.load === \"function\") {\r\n                newRoute.load();\r\n            }\r\n        } else {\r\n            history.pushState({}, '', \"/404\");\r\n            await this.activateRoute();\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack://frontend/./src/router.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.js");
/******/ 	
/******/ })()
;