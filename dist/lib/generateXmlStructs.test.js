"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateXmlStruts_1 = __importDefault(require("./generateXmlStruts"));
test('check xml file generated', () => {
    generateXmlStruts_1.default('<target folder>', '<target file>');
});
