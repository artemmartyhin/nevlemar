import * as mongoose from 'mongoose';
export declare const DogSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name?: string;
    age?: number;
    breed?: string;
    gender?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name?: string;
    age?: number;
    breed?: string;
    gender?: string;
}>> & mongoose.FlatRecord<{
    name?: string;
    age?: number;
    breed?: string;
    gender?: string;
}> & {
    _id: mongoose.Types.ObjectId;
}>;
