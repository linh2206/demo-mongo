const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const dbName = 'test';
const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology:true });

client.connect(function(err) {
    //assert.equal(null, err);
    console.log('Connected successfully to server');
    const db = client.db(dbName);

    getDocuments(db, function(docs) {
    
        console.log('Closing connection.');
        client.close();
        
        // Write to file
        try {
            fs.writeFileSync('data-node.json', JSON.stringify(docs));
            console.log('Done writing to file.');
        }
        catch(err) {
            console.log('Error writing to file', err)
        }
    });
})

const getDocuments = function(db, callback) {
    const query = { };  // this is your query criteria
    db.collection("data-node")
      .find(query)
      .toArray(function(err, result) { 
          if (err) throw err; 
          callback(result); 
    }); 
}
// client.connect(function(err) {

//     const db = client.db(dbName);
//     const data = fs.readFileSync('data.json');
//     const docs = JSON.parse(data.toString());
    
//     db.collection('data-node')
//         .insertMany(docs, function(err, result) {
//             if (err) throw err;
//             console.log('Inserted docs:', result.insertedCount);
//             client.close();
//     });
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})