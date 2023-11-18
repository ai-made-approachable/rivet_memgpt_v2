"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevenshteinScorer = void 0;
const js_levenshtein_1 = __importDefault(require("js-levenshtein"));
/**
 * A simple scorer that uses the Levenshtein distance to compare two strings.
 */
const LevenshteinScorer = (args) => {
    if (args.expected === undefined) {
        throw new Error("LevenshteinScorer requires an expected value");
    }
    const [output, expected] = [`${args.output}`, `${args.expected}`];
    const maxLen = Math.max(output.length, expected.length);
    let score = 1;
    if (maxLen > 0) {
        score = 1 - (0, js_levenshtein_1.default)(output, expected) / maxLen;
    }
    return {
        name: "levenshtein",
        score,
    };
};
exports.LevenshteinScorer = LevenshteinScorer;
