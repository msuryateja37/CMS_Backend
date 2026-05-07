"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OhsModule = void 0;
const common_1 = require("@nestjs/common");
const ohs_controller_1 = require("./ohs.controller");
const ohs_service_1 = require("./ohs.service");
let OhsModule = class OhsModule {
};
exports.OhsModule = OhsModule;
exports.OhsModule = OhsModule = __decorate([
    (0, common_1.Module)({
        controllers: [ohs_controller_1.OhsController],
        providers: [ohs_service_1.OhsService],
    })
], OhsModule);
//# sourceMappingURL=ohs.module.js.map