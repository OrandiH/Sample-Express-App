
//Firebase
var config = {
    apiKey: "AIzaSyCvC5azMOiMkNT_k6UYldXE6RkS3yzBc_E",
    authDomain: "watersensor-3f6fd.firebaseapp.com",
    databaseURL: "https://watersensor-3f6fd.firebaseio.com",
    projectId: "watersensor-3f6fd",
    storageBucket: "watersensor-3f6fd.appspot.com",
    messagingSenderId: "379135006698"
};
firebase.initializeApp(config);

/**
 * Function that generates chart and dashboard data from firebase
 */
var ref = firebase.database().ref("Test_ReadingsB").limitToLast(5); //Run query on firebase and pick out last 5 values
var newRef = firebase.database().ref("HistoricalData"); //Run query on firebase
var dataFromDb;
var dataFromDB;
var dataForChart;
var sumConsumption = 0;
var totalCost = 0.0;
var usageLevel = ['Low','Medium','High'];
var cost = document.getElementById('cost'); 
var consumption = document.getElementById('consumption'); 
var usage = document.getElementById('usageLevel');
var chartData = [];
ref.on('value', function (snapshot) {
    dataFromDb = snapshot.val();
    console.log(dataFromDb);
    for (var key in dataFromDb) {
        chartData.push({
            date:dataFromDb[key]['data'].date,//Extract minutes from the db
            consumption:dataFromDb[key]['data'].reading
        });
       sumConsumption = sumConsumption + dataFromDb[key]['data'].reading; 
    }
    //Calculate cost
    totalCost = sumConsumption * 15.00;
    //Set data for chart
    dataForChart = chartData;
  
    //Set html content of usage tag
    if(sumConsumption < 20.00){
        usage.innerHTML = usageLevel[0];
    } else if (sumConsumption <= 30.00){
        usage.innerHTML = usageLevel[1];
    }
    else if(sumConsumption >= 50.00){
        usage.innerHTML =  usageLevel[2];
    }
     //Set innerHTML of dashboard tags
     consumption.innerHTML = sumConsumption + ' Litres per hour';
     cost.innerHTML = '$' + totalCost;
     
   
    /**
 * Create the chart
 */
    var chart = AmCharts.makeChart("chartdiv", {
    "type": "serial",
    "theme": "light",
    "zoomOutButton": {
        "backgroundColor": '#000000',
        "backgroundAlpha": 0.15
    },
    "dataProvider": dataForChart,
    "categoryField": "date",
    "categoryAxis": {
        "parseDates": true,
        "minPeriod": "mm"
    },
    "graphs": [{
        "id":"g1",
        "balloonText": "[[category]]:<b>[[value]]L</b>",
        "valueField": "consumption",
        "bullet": "round",
        "bulletBorderColor": "#FFFFFF"
    }],
    "chartCursor": {
        "cursorPosition": "mouse"
    }
})
//At interval shift one when a new value is entered
setInterval(()=>{
    var ref = firebase.database().ref("Test_ReadingsB").limitToLast(1);
    ref.on("child_added",function(snapshot){
        var newData = snapshot.val();
        for (var key in newData) {

            chart.dataProvider.push({
                date: newData[key]['data'].date,//Extract minutes from the db
                consumption: newData[key]['data'].reading
            });

        }
        chart.dataProvider.shift();
    })

    chart.validateData();
},5000);

});

newRef.on('value',function(snapshot){
    dataFromDB = snapshot.val();
    console.log(dataFromDB);
    var historicalchart = AmCharts.makeChart( "historicalDiv", {
      "type": "serial",
      "theme": "light",
      "dataProvider": [ {
        "month": "April",
        "litres": dataFromDB.April
      }, {
        "month": "May",
        "litres": dataFromDB.May
      }],
      "valueAxes": [ {
        "gridColor": "#FFFFFF",
        "gridAlpha": 0.2,
        "dashLength": 0
      } ],
      "gridAboveGraphs": true,
      "startDuration": 1,
      "graphs": [ {
        "balloonText": "[[category]]:<b>[[value]]L</b>",
        "fillAlphas": 0.8,
        "lineAlpha": 0.2,
        "type": "column",
        "valueField": "litres"
      } ],
      "categoryField": "month",
        "categoryAxis": {
        "gridPosition": "start",
        "gridAlpha": 0,
        "tickPosition": "start",
        "tickLength": 20
  },
    })});
