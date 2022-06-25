"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionFilter = void 0;
const Utils_1 = __importDefault(require("../requiments/Utils"));
const Behavior_1 = require("./Behavior");
class ActionFilter extends Behavior_1.Behavior {
    constructor() {
        super(...arguments);
        /**
         * @var array list of action IDs that this filter should not apply to.
         * @see only
         */
        this.except = [];
    }
    init() {
    }
    beforeFilter(route, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isActive(route)) {
                return;
            }
            yield this.beforeAction(route, req, res);
        });
    }
    isActive(action) {
        let id = action.id;
        let onlyMatch = false;
        let exceptMatch = false;
        if (Utils_1.default.isEmpty(this.only)) {
            onlyMatch = true;
        }
        else {
            onlyMatch = false;
            for (const onlyKey of this.only) {
                if (Utils_1.default.matchWildcard(action.id, onlyKey)) {
                    onlyMatch = true;
                    break;
                }
            }
        }
        for (const exceptKey in this.except) {
            let pattern = this.except[exceptKey];
            let match = id.match(pattern);
            if (match && match.length > 0) {
                exceptMatch = true;
            }
        }
        return !exceptMatch && onlyMatch;
    }
    /**
     * This method is invoked right before an action is to be executed (after all possible filters.)
     * You may override this method to do last-minute preparation for the action.
     * @param Action $action the action to be executed.
     * @return bool whether the action should continue to be executed.
     */
    beforeAction(route, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
}
exports.ActionFilter = ActionFilter;
//# sourceMappingURL=ActionFilter.js.map