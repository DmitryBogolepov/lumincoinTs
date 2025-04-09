var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { AuthUtils } from "../../utils/auth-utils";
import { HttpUtils } from "../../utils/http-utils";
import * as bootstrap from "../../../dist/js/bootstrap.min";
var Income = /** @class */ (function () {
    function Income(openNewRoute) {
        this.currentDeleteTarget = null;
        this.currentDeleteId = null;
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/sign-in');
            return;
        }
        this.initDeleteButtons();
        this.initEditButtons();
        this.getAllIncomes();
    }
    Income.prototype.initDeleteButtons = function () {
        var _this = this;
        document.addEventListener("click", function (event) {
            var target = event.target;
            var deleteButton = target.closest(".delete-btn");
            if (deleteButton) {
                event.preventDefault();
                _this.currentDeleteTarget = deleteButton.closest(".action-card");
                _this.currentDeleteId = _this.currentDeleteTarget.dataset.id;
                var deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
                deleteModal.show();
            }
        });
        document.getElementById("confirmDelete").addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
            var response, modalElement, modalInstance, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.currentDeleteTarget && this.currentDeleteId)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, HttpUtils.request("/categories/income/".concat(this.currentDeleteId), "DELETE", true, null)];
                    case 2:
                        response = _a.sent();
                        if (!response.error) {
                            this.currentDeleteTarget.remove();
                            modalElement = document.getElementById("deleteModal");
                            modalInstance = bootstrap.Modal.getInstance(modalElement);
                            modalInstance.hide();
                        }
                        else {
                            console.error("Ошибка удаления:", response);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Ошибка запроса:", error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    Income.prototype.initEditButtons = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                document.addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
                    var editButton, card, id;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                editButton = event.target.closest(".redact-btn");
                                if (!editButton) return [3 /*break*/, 2];
                                event.preventDefault();
                                card = editButton.closest(".action-card");
                                id = card.dataset.id;
                                if (!id) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.openNewRoute("/incomeChange?id=".concat(id))];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    Income.prototype.getAllIncomes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, HttpUtils.request("/categories/income", "GET", true, null)];
                    case 1:
                        result = _a.sent();
                        if (!result.error && Array.isArray(result.response)) {
                            this.renderCards(result.response);
                        }
                        else {
                            console.error("Ошибка при загрузке данных:", result);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Ошибка запроса:", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Income.prototype.renderCards = function (items) {
        var container = document.getElementById("cards-container");
        container.innerHTML = "";
        items.forEach(function (item) {
            var card = document.createElement("div");
            card.classList.add("action-card", "d-flex", "justify-content-center");
            card.dataset.id = item.id.toString();
            var title = document.createElement("div");
            title.classList.add("card-title");
            title.textContent = item.title;
            var btnContainer = document.createElement("div");
            btnContainer.classList.add("card-btns", "d-flex", "align-items-center");
            var editBtn = document.createElement("a");
            editBtn.href = "javascript:void(0);";
            editBtn.classList.add("change-btn", "btn", "btn-primary", "redact-btn");
            editBtn.textContent = "Редактировать";
            var deleteBtn = document.createElement("a");
            deleteBtn.href = "#";
            deleteBtn.classList.add("delete-btn", "btn", "btn-danger");
            deleteBtn.textContent = "Удалить";
            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(deleteBtn);
            card.appendChild(title);
            card.appendChild(btnContainer);
            container.appendChild(card);
        });
        var addCard = document.createElement("a");
        addCard.href = "/incomeAdd";
        addCard.classList.add("action-card", "d-flex", "justify-content-center", "align-items-center");
        addCard.id = "add-card";
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "15");
        svg.setAttribute("height", "15");
        svg.setAttribute("viewBox", "0 0 15 15");
        svg.setAttribute("fill", "none");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z");
        path.setAttribute("fill", "#CED4DA");
        svg.appendChild(path);
        addCard.appendChild(svg);
        container.appendChild(addCard);
    };
    return Income;
}());
export { Income };
