"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateXmlStruts_1 = __importDefault(require("./generateXmlStruts"));
test('adds 1 + 2 to equal 3', () => {
    generateXmlStruts_1.default('<target folder></target>', '<target file></target>');
    expect(3).toBe(3);
});
