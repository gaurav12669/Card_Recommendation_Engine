const mongoClient = require('../lib/MongoClient');

const COLLECTION_NAME = 'card_applications';

class AnalyticsModel {
  static async logCardApplication(payload) {
    const collection = await mongoClient.getCollection(COLLECTION_NAME);
    const document = {
      ...payload,
      createdAt: new Date(),
    };
    await collection.insertOne(document);
    return document;
  }
}

module.exports = AnalyticsModel;

