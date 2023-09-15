"use strict";
import { AwsS3Service } from './services/aws-s3/aws-s3.service';
import { DictionaryService } from './services/dictionary/dictionary.service';
import { DictionaryValueRepoService } from './repos/dictionary-value.repo/dictionary-value.repo.service';
import { DictionaryService } from './services/dictionary/dictionary.service';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CommonModule = void 0;
var common_1 = require("@nestjs/common");
var admin_config_service_1 = require("./services/admin-config/admin-config.service");
var config_1 = require("@nestjs/config");
var typegoose_config_service_1 = require("./services/typegoose-config/typegoose-config.service");
var schema_module_1 = require("./schema/schema.module");
var nestjs_1 = require("@automapper/nestjs");
var classes_1 = require("@automapper/classes");
var CommonModule = /** @class */ (function () {
    function CommonModule() {
    }
    CommonModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule,
                schema_module_1.SchemaModule,
                nestjs_1.AutomapperModule.forRoot({
                    strategyInitializer: (0, classes_1.classes)()
                }),
            ],
            providers: [
                admin_config_service_1.AdminConfigService,
                typegoose_config_service_1.TypegooseConfigService
            ]
        })
    ], CommonModule);
    return CommonModule;
}());
exports.CommonModule = CommonModule;
