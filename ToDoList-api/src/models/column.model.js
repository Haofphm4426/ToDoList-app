import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { getDB } from '*/config/mongodb';

// Define Column collection
const columnCollectionName = 'columns';
const columnCollectionSchema = Joi.object({
    boardId: Joi.string().required(), // also ObjectId when create new
    title: Joi.string().required().min(1).max(50).trim(),
    cardOrder: Joi.array().items(Joi.string()).default([]),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'boardId'];

const validateSchema = async (data) => {
    return await columnCollectionSchema.validateAsync(data, { abortEarly: false });
};

const findOneById = async (id) => {
    try {
        const result = await getDB()
            .collection(columnCollectionName)
            .findOne({ _id: ObjectId(id) });
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

const createNew = async (data) => {
    try {
        const validatedValue = await validateSchema(data);
        const insertValue = {
            ...validatedValue,
            boardId: ObjectId(validatedValue.boardId),
        };
        const result = await getDB().collection(columnCollectionName).insertOne(insertValue);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * @param {string} columnId
 * @param {string} cardId
 */
const pushCardOrder = async (columnId, cardId) => {
    try {
        const result = await getDB()
            .collection(columnCollectionName)
            .findOneAndUpdate(
                { _id: ObjectId(columnId) },
                { $push: { cardOrder: cardId } },
                { returnDocument: 'after' }
            );

        return result.value;
    } catch (error) {
        throw new Error(error);
    }
};

const update = async (id, data) => {
    try {
        const updateData = { ...data };
        Object.keys(updateData).forEach((fieldName) => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete updateData[fieldName];
            }
        });
        if (data.boardId) updateData.boardId = ObjectId(data.boardId);

        const result = await getDB()
            .collection(columnCollectionName)
            .findOneAndUpdate({ _id: ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' });
        return result.value;
    } catch (error) {
        throw new Error(error);
    }
};

export const ColumnModel = {
    columnCollectionName,
    createNew,
    pushCardOrder,
    update,
    findOneById,
};
