require('dotenv').config()
var request = require('request')


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

    }
};
