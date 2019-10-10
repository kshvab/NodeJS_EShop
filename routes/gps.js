const express = require('express');
const router = express.Router();
const models = require('../models');
const user = models.user;
const moment = require('moment');
let fs = require('fs');
const xml2js = require('xml2js');

function fFillTheAgentsArr(parsedArr) {
  let agentsArr = [];
  parsedArr.forEach(function(item) {
    if (agentsArr.indexOf(item.Agent[0]) == -1) agentsArr.push(item.Agent[0]);
  });
  return agentsArr;
}

const fParseGpsDay = gpsDate => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(`./ftpshared/import_gps/Gpslogs-${gpsDate}.xml`))
      reject('Нет данных за этот день!');

    //Отримумо текст за датою
    let data = fs.readFileSync(
      `./ftpshared/import_gps/Gpslogs-${gpsDate}.xml`,
      {
        encoding: 'UTF-8'
      }
    );

    let parseString = xml2js.parseString;
    parseString(data, function(err, result) {
      if (err) reject('XML файл за этот день поврежден!');
      else {
        let parsedArr =
          result['КоммерческаяИнформация']['Gpslogs'][0]['Gpslog'];
        resolve(parsedArr);
      }
    });
  });
};

function fMapScriptPreparation(parsedArr, gpsAgent, startTime, endTime) {
  let agentTravelPointsArr = parsedArr.filter(x => x.Agent == gpsAgent);

  agentTravelPointsArr = agentTravelPointsArr.filter(
    x => +x.Date[0].slice(-8, -6) >= +startTime.slice(0, 2)
  );
  agentTravelPointsArr = agentTravelPointsArr.filter(
    x => +x.Date[0].slice(-8, -6) < +endTime.slice(0, 2)
  );

  let travelPointsCoordinates = [];

  let latMax = +agentTravelPointsArr[0].latitude[0];
  let latMin = +agentTravelPointsArr[0].latitude[0];
  let lngMax = +agentTravelPointsArr[0].longitude[0];
  let lngMin = +agentTravelPointsArr[0].longitude[0];

  let markersStr = '';
  let stepPoints = 200;
  let distanceStepPoints = 250;
  let distancePointsArr = [];

  agentTravelPointsArr.forEach(function(item, index) {
    travelPointsCoordinates.push({
      lat: +item.latitude[0],
      lng: +item.longitude[0]
    });
    if (+item.latitude[0] > latMax) latMax = +item.latitude[0];
    if (+item.latitude[0] < latMin) latMin = +item.latitude[0];
    if (+item.longitude[0] > lngMax) lngMax = +item.longitude[0];
    if (+item.longitude[0] < lngMin) lngMin = +item.longitude[0];

    if (!(index % stepPoints)) {
      markersStr += `
      var marker${index} = new google.maps.Marker({
        position: {lat: ${+item.latitude[0]}, lng: ${+item.longitude[0]}},
        map: map,
        title: '${item.Date[0]}'
      });
      `;
    }
    if (!(index % distanceStepPoints)) {
      distancePointsArr.push({
        lat: +item.latitude[0],
        lng: +item.longitude[0]
      });
    }
  });

  distancePointsArr.push({
    lat: +agentTravelPointsArr[agentTravelPointsArr.length - 1].latitude[0],
    lng: +agentTravelPointsArr[agentTravelPointsArr.length - 1].longitude[0]
  });

  let distanceParts = [];
  for (let i = 0; i < distancePointsArr.length - 1; i++) {
    distanceParts.push({
      origin: distancePointsArr[i],
      destination: distancePointsArr[i + 1]
    });
  }

  let latAverage = (latMax + latMin) / 2;
  let lngAverage = (lngMax + lngMin) / 2;

  let center = {
    lat: latAverage,
    lng: lngAverage
  };

  let latLong = latMax - latMin;
  let lngLong = lngMax - lngMin;
  let gipotenuza = Math.sqrt(latLong * latLong + lngLong * lngLong);

  let zoom = 11;
  if (gipotenuza <= 0.001) zoom = 18;
  if (gipotenuza > 0.001) zoom = 17;
  if (gipotenuza > 0.01) zoom = 16;
  if (gipotenuza > 0.03) zoom = 15;
  if (gipotenuza > 0.05) zoom = 14;
  if (gipotenuza > 0.07) zoom = 13;
  if (gipotenuza > 0.095) zoom = 12;
  if (gipotenuza > 0.12) zoom = 11;
  if (gipotenuza > 0.15) zoom = 10;
  if (gipotenuza > 0.18) zoom = 9;
  if (gipotenuza > 0.25) zoom = 8;
  if (gipotenuza > 1) zoom = 7;

  let origin = distancePointsArr[0];
  let destination = distancePointsArr[distancePointsArr.length - 1];

  //console.log(destination);

  let mapScript = `
  <script id='${Date()}'>
  
  function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: ${zoom},
      center: ${JSON.stringify(center)},
      mapTypeId: 'terrain'
    });
  
    
    ${markersStr}
  
    var travelPointsCoordinates = ${JSON.stringify(travelPointsCoordinates)}
    var flightPath = new google.maps.Polyline({
      path: travelPointsCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
  
  
    flightPath.setMap(map);




    let distanceParts = ${JSON.stringify(distanceParts)};

    var origin1 = ${JSON.stringify(origin)};
    var destination1 = ${JSON.stringify(destination)};


    var service = new google.maps.DistanceMatrixService;

    let kilometers = 0;

    for (let i=0; i<distanceParts.length; i++ ) {

      service.getDistanceMatrix({
        origins: [distanceParts[i].origin],
        destinations: [distanceParts[i].destination],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, function(response, status) {
        if (status !== 'OK') {
          alert('Error was: ' + status);
        } else {
          //console.log(response)
          kilometers+=response.rows[0].elements[0].distance.value
          document.getElementById('distanceinfo').innerText=parseInt(kilometers/1000) + ' km';
        }
      });


    }

    service.getDistanceMatrix({
      origins: [origin1],
      destinations: [destination1],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, function(response, status) {
      if (status !== 'OK') {
        alert('Error was: ' + status);
      } else {
        //console.log(response)
        var originList = response.originAddresses;
        var destinationList = response.destinationAddresses;
        //document.getElementById('distanceinfo').innerText=response.rows[0].elements[0].distance.text;
        
        document.getElementById('firstpoint').innerText=response.originAddresses[0];
        document.getElementById('lastpoint').innerText=response.destinationAddresses[0];
      }
    });

    






    
  }
  </script>
  `;
  //console.log(mapScript);
  return mapScript;
}

router.get('/', function(req, res) {
  let _id;
  let login;
  let group;
  let agentsArr = [];

  let gpsDate = moment(Date.now()).format('YYYY-MM-DD');
  let gpsAgent = '0';
  let startTime = '00:00';
  let endTime = '23:00';

  if (req.query.gpsDate) gpsDate = req.query.gpsDate;

  if (req.query.gpsAgent && req.query.gpsAgent != null)
    gpsAgent = req.query.gpsAgent;

  if (req.query.startTime) startTime = req.query.startTime;
  if (req.query.endTime) endTime = req.query.endTime;

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.group;

    user.findOne({ login }).then(userFromDB => {
      if (
        userFromDB.group == 'Administrator' ||
        userFromDB.group == 'Manager'
      ) {
        fParseGpsDay(gpsDate)
          .then(parsedArr => {
            agentsArr = fFillTheAgentsArr(parsedArr);
            let error = null;
            let mapScript = null;
            if (agentsArr.length && gpsAgent == '0') gpsAgent = agentsArr[0];
            if (gpsAgent == '0') {
              mapScript = null;
              error = 'Выберите агента для отображения!';
            } else if (+startTime.slice(0, 2) >= +endTime.slice(0, 2)) {
              mapScript = null;
              error = 'Укажите правильно время!';
            } else {
              mapScript = fMapScriptPreparation(
                parsedArr,
                gpsAgent,
                startTime,
                endTime
              );
            }
            res.header(
              'Cache-Control',
              'private, no-cache, no-store, must-revalidate, max-age=0'
            );
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.render('administrator/adm_gps', {
              transData: {
                pageTitle: 'GPS',
                user: { _id, login, group },
                mapScript,
                gpsDate,
                gpsAgent,
                agentsArr,
                startTime,
                endTime,
                error
              }
            });
          })
          .catch(error => {
            res.render('administrator/adm_gps', {
              transData: {
                pageTitle: 'GPS',
                user: { _id, login, group },
                mapScript: null,
                gpsDate,
                gpsAgent: 0,
                agentsArr: [],
                error
              }
            });
          });
      } else {
        //Незнайдений у базі, або не адмін
        res.render('error', {
          transData: {
            user: { _id, login, group }
          },
          message: 'У Вас нет прав для доступа к этому разделу',
          error: {}
        });
      }
    });
  } else {
    //нема сесії
    _id = 0;
    login = 0;
    group = 0;
    res.render('loginForm', {
      transData: {
        user: { _id, login, group }
      }
    });
  }
});

module.exports = router;
