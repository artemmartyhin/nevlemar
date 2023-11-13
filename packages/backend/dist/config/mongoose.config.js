"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseConfig = void 0;
const mongooseConfig = () => {
    return {
        uri: `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '27017'}/nevlemar`,
    };
};
exports.mongooseConfig = mongooseConfig;
//# sourceMappingURL=mongoose.config.js.map