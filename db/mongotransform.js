const { MongoClient } = require('mongodb');
/* eslint-disable */
// Replace the uri string with your MongoDB deployment's connection string.
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
async function run() {
  try {
    await client.connect();
    const database = client.db('questionsanswers');
    const answers = database.collection('answers');
    const answers_photos = database.collection('answers_photos');
    // 4660354
    for (var i = 1; i < 4660354; i++) {
      // create a filter for a style to update
      const filter = { style_id: i }
      // this option instructs the method to not create a document if no documents match the filter
      const options = { upsert: false, autoIndex: false };
      let skusObj = {};
      let cursor = await skus.find({ ' styleId': filter.style_id });
      await cursor.forEach((doc) => {
        let val = doc['sku_id'];
        skusObj[val] = {
          'size': doc[' size'],
          'quantity': doc[' quantity']
        }
      });
      // create a column that sets the answer_photos of the style
      const updateDoc = {
        $set: {
          'skus': skusObj
        },
      };
      // query a style and update it with a nested skus property
      const result = await styles.updateOne(filter, updateDoc, options);
      console.log(
        `i is ${i}, ${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
      );
    }
  } catch (error) {
    console.log('error occured in try block', error);
  } finally {
    await client.close();
  }
}
run().catch(`an error occured ${console.dir}`);