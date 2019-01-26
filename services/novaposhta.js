var request = require('request');
var fs = require('fs');

function updateDeliveryServiceCitiesList() {
  var citiesOptions = {
    method: 'POST',
    url: 'http://testapi.novaposhta.ua/v2.0/json/Address/getCities',
    body:
      '{\n"modelName": "Address",\n"calledMethod": "getCities",\n"apiKey": "3f4d62ae70b694179cb58a679cf736c2"\n}\n'
  };
  request(citiesOptions, function(error, response, body) {
    if (error) {
      return console.error('Request failed:', error);
    }
    let citiesArrObj = JSON.parse(body).data;
    let citiesArrJson = JSON.stringify(citiesArrObj);

    fs.writeFile(
      './public/datafiles/deliveryservice/citiesArr.json',
      citiesArrJson,
      function(err) {
        if (err) console.log('ERROR Saving!');
        else
          console.log(
            'UPDATED FILE: ./public/datafiles/deliveryservice/citiesArr.json'
          );
      }
    );
  });
}

/*
function updateDeliveryServiceDepartmentsList() {

  var departmentsOptions = {
    method: 'POST',
    url: 'http://testapi.novaposhta.ua/v2.0/json/AddressGeneral/getWarehouses',
    body:
      '{\n    "modelName": "AddressGeneral",\n    "calledMethod": "getWarehouses",\n    "methodProperties": {\n         "Language": "ru",\n    },\n    "apiKey": "3f4d62ae70b694179cb58a679cf736c2"\n}'
  };
  
  request(departmentsOptions, function(error, response, body) {
    if (error) return console.error('Request failed:', error);
    
    console.log(body);

    let departmentsArrObj = JSON.parse(body).data;
    let departmentsArrJson = JSON.stringify(departmentsArrObj);

    fs.writeFile(
      './public/datafiles/deliveryservice/departmentsArr.json',
      departmentsArrJson,
      function(err) {
        if (err) console.log('ERROR Saving!');
        else
          console.log(
            'UPDATED FILE: ./public/datafiles/deliveryservice/departmentsArr.json'
          );
      }
    );
  });

}
*/

module.exports = {
  updateDeliveryServiceCitiesList
};
