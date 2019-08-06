
const request = require('request');
let result = {};

const parseImage = function (operationLocationUri, params, subscriptionKey) {
  return fireCallForTextAndParse(operationLocationUri, params, subscriptionKey, (parsedData) => {
    return parsedData;
  });
}

function fireCallForTextAndParse(operationLocationUri, params, subscriptionKey) {
  let jsonResponse = null;
  const asyncOptions = {
      uri: operationLocationUri,
      qs: params,
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : subscriptionKey
      }
  };
  return request.get(asyncOptions, (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return;
      }
      jsonResponse = JSON.parse(body);
      return parseText(jsonResponse, operationLocationUri);
    });
}

function parseText(jsonResponse, operationLocationUri) {
    const textLines = [];
    if(jsonResponse.status != "Running") {
        jsonResponse.recognitionResults[0].lines.forEach((line) => {
            textLines.push(line.text);
        });
        parseStoreData(textLines);
        parseItemData(textLines);
        console.log(result);
        return result;
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

    for(let i = 0; i < nearbySpellings.price.length; i++) {
        priceIndex = textLines.findIndex((ele) => ele == nearbySpellings.price[i]);
        if(priceIndex != -1)
            break;
    }

    for(let i = 0; i < nearbySpellings.total.length; i++) {
        totalIndex = textLines.findIndex((ele) => ele == nearbySpellings.total[i], itemNameIndex);
        if(totalIndex != -1)
            break;
    }

    let offset = totalIndex - itemNameIndex;
    let priceOffset = priceIndex - itemNameIndex;
    let item = {};
    let itemDataSet = [];

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
    result.items = itemDataSet;
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


module.exports = { parseImage }
