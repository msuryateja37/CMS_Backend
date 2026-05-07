"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdcaModule = void 0;
const common_1 = require("@nestjs/common");
const pdca_controller_1 = require("./pdca.controller");
const pdca_service_1 = require("./pdca.service");
let PdcaModule = class PdcaModule {
};
exports.PdcaModule = PdcaModule;
exports.PdcaModule = PdcaModule = __decorate([
    (0, common_1.Module)({
        controllers: [pdca_controller_1.PdcaController],
        providers: [pdca_service_1.PdcaService],
    })
], PdcaModule);
//# sourceMappingURL=pdca.module.js.map