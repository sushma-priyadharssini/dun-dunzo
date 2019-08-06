const express = require('express');
const router = express.Router();
const request = require('request');
const db = require('../queries/queries');
const imageParser = require('../imageParser');


router.get('/groceryList', db.getGroceries);

router.get('/productList/:id', db.getProductsById);

router.get('/filterItems', db.filterProducts);

router.post('/postProduct', function (req, res, next) {
  //console.log('entered');
  const subscriptionKey = '66d392325306485681e91a602048a556';
  const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/read/core/asyncBatchAnalyze';
  const imageUrl = 'https://i.imgur.com/6YymwpN.jpg';   //grocery
  //const imageUrl = 'https://i.imgur.com/VBMn37z.jpg';   //grocery
  //const imageUrl = 'https://i.imgur.com/NaKbEQm.jpg';     //food that does not work
  //const imageUrl = 'https://i.imgur.com/UyxhqqV.jpg';     //food

  const params = {
      'language': 'en',
      'detectOrientation': 'true',
  };

  const options = {
      uri: uriBase,
      qs: params,
      body: '{"url": ' + '"' + imageUrl + '"}',
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : subscriptionKey
      }
  };

  let operationLocationUri = null;

  request.post(options, (error, response, body) => {
    //console.log("here1");
    if (error) {
      console.log('Error: ', error);
      return;
    }
    //console.log("here");
    operationLocationUri = response.headers["operation-location"];
    imageParser.parseImage(operationLocationUri, params, subscriptionKey, (parsedData) => {
      console.log(parsedData);
      db.postProduct(parsedData);
    });
  });
});



module.exports = router;
