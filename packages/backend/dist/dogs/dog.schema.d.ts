import * as mongoose from 'mongoose';
export declare const DogSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name?: string;
    age?: number;
    breed?: string;
    gender?: string;
    image?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name?: string;
    age?: number;
    breed?: string;
    gender?: string;
    image?: string;
}>> & mongoose.FlatRecord<{
    name?: string;
    age?: number;
    breed?: string;
    gender?: string;
    image?: string;
}> & {
    _id: mongoose.Types.ObjectId;
}>;
