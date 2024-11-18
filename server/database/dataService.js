const dbName = 'EthrHub'
const { getClient } = require('./db');
const { retryApiCall } = require('../utils/apiutils.js');

async function getCollection(collectionName){
    try {
        const db = await retryApiCall(getClient());
        const collection = db.collection(collectionName);
        const documents = await retryApiCall(collection.find({}).toArray())
        return documents
    } catch (err) {
        console.error(`Error retrieving ${collectionName}`, err);
    }
}

async function createDocument(collectionName, entry){
    try {
        const db = await getClient();
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(entry)
        console.log(result)
        console.log(`New ${collectionName} entry added`)
        return result
    } catch (err) {
        console.error(`Error adding new ${collectionName} entry`, err);
    }

}

async function findOneDocumentByIndex(collectionName, params){
    try {
        const db = await getClient();
        const collection = db.collection(collectionName);
        const document = await collection.findOne(params)
        if(document){
            console.log('document found: '+ JSON.stringify(document, null, 2));
        } else{
            console.log('document not found')
            console.log(collectionName)
            console.log(params)
            return false
        }
        return document
    } catch (err) {
        console.error("Error retrieving document", err);
    }
}

async function findDocumentsByIndex(collectionName, params){
    try {
        const db = await getClient();
        const collection = db.collection(collectionName);
        const documents = await collection.find(params).toArray()
        if(documents){
            console.log('document(s) found: '+ JSON.stringify(documents, null, 2));
        } else{
            console.log('document(s) not found')
            return false
        }
        return documents
    } catch (err) {
        console.error("Error retrieving documents", err);
    }
}

async function updateDocumentById(collectionName, documentId, updateData) {
    try {
        const db = await getClient();
        const collection = db.collection(collectionName);
        const result = await collection.findOneAndUpdate(
            { _id: documentId },
            { $set: updateData },
            { returnOriginal: false }
        );
        
        console.log("Updated document:", result);
    } catch (err) {
        console.error("Error updating document:", err);
    }
}

async function deleteDocumentById(collectionName, documentId) {
    try {
        const db = await getClient();
        const collection = db.collection(collectionName);
        
        const result = await collection.deleteOne({ _id: documentId });

        if (result.deletedCount === 1) {
            console.log("Successfully deleted the document.");
        } else {
            console.log("No document found with the specified ID.");
        }
    } catch (err) {
        console.error("Error deleting document:", err);
    }
}

async function addToDocumentArray(collectionName, documentId, array, value) {
    try {
        const db = await getClient();
        const collection = db.collection(collectionName);
        
        const result = await collection.updateOne(
            { _id: documentId },
            { $push: { [array]: value } }
        );

        if (result.modifiedCount === 1) {
            console.log(`Successfully pushed ${value} to ${array}.`);
        } else {
            console.log("No document found with the specified ID.");
        }
    } catch (err) {
        console.error("Error pushing to array:", err);
    }
}

async function removeFromDocumentArray(collectionName, documentId, array, value) {
    try {
        const db = await getClient();
        const collection = db.collection(collectionName);
        
        const result = await collection.updateOne(
            { _id: documentId },
            { $pull: { [array]: value } }
        );

        if (result.modifiedCount === 1) {
            console.log(`Successfully pulled ${value} from ${array}.`);
        } else {
            console.log("No document found with the specified ID or value not present in array.");
        }
    } catch (err) {
        console.error("Error pulling from array:", err);
    }
}




module.exports = { 
    findDocumentsByIndex,
    findOneDocumentByIndex,
    getCollection,
    createDocument,
    updateDocumentById,
    deleteDocumentById,
    addToDocumentArray,
    removeFromDocumentArray
}