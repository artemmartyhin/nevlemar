"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DogSchema = void 0;
const mongoose = require("mongoose");
exports.DogSchema = new mongoose.Schema({
    name: String,
    age: Number,
    breed: String,
    gender: String,
});
//# sourceMappingURL=dog.schema.js.map