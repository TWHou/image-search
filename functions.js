require('dotenv').config()
var request = require('request')

var mongo = require('mongodb').MongoClient;
var url = process.env.DB_URL;

module.exports = {
    search: function (term, offset){
      return new Promise(function(resolve, reject) {
        var url = 'https://www.googleapis.com/customsearch/v1?q=';
        url += term;
        url += '&cx=';
        url += process.env.CSE_ID;
        url += '&key=';
        url += process.env.CSE_API_KEY;
        url += '&start=';
        url += offset+1;
        url += '&searchType=image&fields=items(image(contextLink%2CthumbnailLink)%2Clink%2Csnippet)';
        request.get(url, function(error, response, body){
          if (error) {
            reject(error);
          }
          if (response.statusCode == 200) {
            var result = JSON.parse(body).items.map(function(item) {
              return {
                url: item.link,
                snippet: item.snippet,
                thumbnail: item.image.thumbnailLink,
                context: item.image.contextLink
              }
            });
            resolve(result);
          }
        });
      });
    },
    save: function(term){
      var log = {
        term: term,
        when: new Date().toString()
      };
      mongo.connect(url, function(err, db) {
        if (err) {
          console.log("Unable to connect to the mongoDB server. Error:", err);
        } else {
          db.collection('image-search').insertOne(log, function(err, r) {
            if (err) {console.log("Unable to insert. Error:", err);}
            db.close();
          });
        }
      });
    },
    latest: function(){
      return new Promise(function(resolve,reject){
        mongo.connect(url, function(err, db) {
          if(err){
            reject(err);
          } else {
            db.collection('image-search').find({},{'_id': 0}).limit(10).toArray(function(err, docs) {
              if (err) {
                reject(err);
              } else {
                resolve(docs.reverse());
              }
              db.close();
            });
          }
        });
      });
    }
};
