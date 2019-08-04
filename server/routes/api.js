const express = require('express');
const router = express.Router();
const request = require('request');
const db = require('../queries/queries');


router.get('/groceryList', db.getGroceries);

router.get('/productList/:id', db.getProductsById);

router.get('/filterItems', db.filterProducts);

//router.post('/postProduct', db.postProduct);
router.post('/posts', function (req, res, next) {
  // Posts.create(req.body).then(function (post) {
  //   res.send([post]);
  // }).catch(next);
  console.log('entered');
  const subscriptionKey = '66d392325306485681e91a602048a556';

  const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/read/core/asyncBatchAnalyze';

  const imageUrl = 'https://i.imgur.com/qpOv1sX.jpg';   //grocery
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
    console.log("here1");
    if (error) {
      console.log('Error: ', error);
      return;
    }
    console.log("here");
    operationLocationUri = response.headers["operation-location"];
    fireCallForTextAndParse(operationLocationUri);
  });


  function fireCallForTextAndParse(operationLocationUri) {
      const asyncOptions = {
          uri: operationLocationUri,
          qs: params,
          headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key' : subscriptionKey
          }
      };

      let jsonResponse = null;
      request.get(asyncOptions, (error, response, body) => {
          if (error) {
            console.log('Error: ', error);
            return;
          }
          //jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
          jsonResponse = JSON.parse(body);

          parseText(jsonResponse);

        });
  }

let result = {};

  function parseText(jsonResponse) {
      const textLines = [];
      //console.log(jsonResponse);
      if(jsonResponse.status != "Running") {
          jsonResponse.recognitionResults[0].lines.forEach((line) => {
              textLines.push(line.text);
          });
          //console.log(textLines);
          parseStoreData(textLines);
          parseItemData(textLines);
      }
      else {
          console.log("Fetching text from image...");
          console.log("Retrying...");
          fireCallForTextAndParse(operationLocationUri);
      }
  }


  function parseStoreData(textLines) {
      result.shopName = textLines[0];
      result.shopAddress = textLines[2];
  }


  function parseItemData(textLines) {
      let itemNameIndex = -1;
      let totalIndex = -1;
      let priceIndex = -1;

      for(let i = 0; i < nearbySpellings.itemName.length; i++) {
          itemNameIndex = textLines.findIndex((ele) => ele == nearbySpellings.itemName[i]);
          if(itemNameIndex != -1)
              break;
      }

      //console.log(itemNameIndex);

      for(let i = 0; i < nearbySpellings.price.length; i++) {
          priceIndex = textLines.findIndex((ele) => ele == nearbySpellings.price[i]);
          if(priceIndex != -1)
              break;
      }

      console.log(priceIndex);

      for(let i = 0; i < nearbySpellings.total.length; i++) {
          totalIndex = textLines.findIndex((ele) => ele == nearbySpellings.total[i], itemNameIndex);
          if(totalIndex != -1)
              break;
      }

      //console.log(totalIndex);

      let offset = totalIndex - itemNameIndex;
      let priceOffset = priceIndex - itemNameIndex;

      let item = {};
      let itemDataSet = [];
      //let offset = 0;
      for(let i = totalIndex + 1; (i < textLines.length) && (!nearbySpellings.stopWords.includes(textLines[i])); i++) {
          if(isValidItemName(textLines[i])) {
              itemDataSet.push(item);
              item = {};
              item.name = textLines[i];
              if(((i + priceOffset) < textLines.length) && (!isValidItemName(textLines[i + priceOffset]))) {
                  item.price = textLines[i + priceOffset];
              }
          }
          else {
              if(!item.price)
                  item.price = textLines[i];
          }
      }

      itemDataSet.push(item);
      itemDataSet.splice(0,1);
      //console.log(itemDataSet);
      result.items = itemDataSet;
      db.postProduct(result);
  }


  function isValidItemName(itemName) {
      if(!itemName)
          return false;
      let count = 0;
      for(let i = 0; i < itemName.length; i++) {
          if(isLetter(itemName[i])) {
              count++;
              if(count >= 3) {
                  return true;
              }
          }
      }
  }

  function isLetter(str) {
      return str.length === 1 && str.match(/[a-z]/i);
    }

  const nearbySpellings = {
      itemName: ['Item Name', 'Iten Name', 'item name', 'Item', 'item', 'Iten'],
      price: ['Price', 'price', 'Cost', 'Price Amount'],
      total: ['Total', 'total', 'TOTAL', 'Amount', 'Price Amount'],
      stopWords: ['Grand Total', 'Thanks', 'Total', 'total', 'SubTotal']
  };
});



module.exports = router;
