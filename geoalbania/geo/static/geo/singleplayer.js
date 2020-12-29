let map;
let panorama;
let marker;
let chosenLocation;
let streetViewLocation;
let distanceLine;
let currentPoint;
let coordinates = [];
let rounds;
let displayRounds = 1;
let time;
let distanceButton;
let distance;
let username;
let totalPoints = 0;
let currentRound;
let p;
let correctMarker;
let listener;
let difference;
let x;
let totalRounds;
let timeEnded;


const ALBANIA = {
    north: 42.66562,
    south: 39.59972,
    west: 19.13709,
    east: 21.06846
  };

const ALBANIA_CENTER = { lat: 41.1533, lng:  20.1683};

const csrftoken = Cookies.get('csrftoken');

const lineSymbol = {
    path: "M 0,-1 0,1",
    strokeOpacity: 1,
    scale: 3,
  };
  
function initMap() {

    async function points(){
        
        //GET INFO ENTERED
        const response = await fetch('',{
            method :'POST',
            headers:{
                "X-CSRFToken" : csrftoken
            },
            body: JSON.stringify({})
        })
        return response.json()
        
    }

    points().then(data => {

        username = data["username"];
        coordinates = data["coordinates"];
        time = data["time"];
        difference = data["difference"];
        currentRound = data["rounds"];
        displayRounds = 1;
        totalPoints = data["totalPoints"];
        totalRounds = data["totalRounds"];

        initRound(currentRound);

    });
}


function initRound(round){
    console.log(round);
    console.log(coordinates);
    
    timeEnded = false;
    
    //SEPERATE LONGITUDE AND LATITUDE
    currentPoint = coordinates[round-1].split(",");

    //RENDER MAP
    map = new google.maps.Map(document.getElementById("map"), {
        center:ALBANIA_CENTER,
        restriction: {
            latLngBounds: ALBANIA,
            strictBounds: false
            },
        zoom:8,
        mapTypeControl: false,
        streetViewControl: false
    });

    //WHEN DECREASING THE ZOOM LEVEL CENTER THE MAP AGAIN BECAUSE OF SHIFTING
    google.maps.event.addListener(map, 'zoom_changed', function() {
        console.log(map.getZoom())
        if(map.getZoom() === 8) map.setOptions({center:ALBANIA_CENTER});
    });

    //CREATE CROSSHAIR ON MAP
    google.maps.event.addListener(map, 'mousemove',
        function(e) {
            if (!isNaN(e.edge) || !isNaN(e.vertex))
            document.getElementById("map").classList.remove('moving');
            else
            document.getElementById("map").className = 'moving';    
        }
    );
    google.maps.event.addListener(map, 'mouseout',
        function() {
            document.getElementById("map").classList.remove("moving");
        }
    );
    
    //WHEN MAP IS CLICKED PLACE A MARKER AND DISPLAY THE GUESS BUTTON,CREATE A LISTENER SO IT CAN BE REMOVED AFTER GUESS
    listener = google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
        document.getElementById("makeGuess").style.display = "block";
        document.getElementById("makeGuess").addEventListener("click",makeGuess);
        
    });

    //SET WIDTH OF PANORAMA,WHEN ROUND ENDS IT IS SET TO 0
    document.getElementById("panorama").style.display = "block";
    document.getElementById('panorama').style.width = "75vw";

    //RENDER PANORAMA
    panorama = new google.maps.StreetViewPanorama(document.getElementById("panorama"),{
        position: {lat: parseFloat(currentPoint[0]), lng: parseFloat(currentPoint[1])},
        pov: { heading: 165, pitch: 0 },
        addressControl : false,
        showRoadLabels: false,
        zoom: 1
    });
    google.maps.event.trigger(panorama, 'resize');
    streetViewLocation = panorama.getPosition();   

    document.getElementById("startPosition").style.display = "block";

    document.getElementById("startPosition").addEventListener("click",() => {
        panorama.setPosition(streetViewLocation);
    });
    cardText();
    
}



function makeGuess(){
    console.log("GUESSED")
    document.getElementById("startPosition").style.display = "none";

    clearInterval(x);
    
    //REMOVE PANORAMA
    document.getElementById('panorama').style.width = "0vw";
    panorama.setVisible(false);
    google.maps.event.trigger(panorama, 'resize');

    //REMOVE THE GUESS BUTTON
    document.getElementById("makeGuess").style.display = "none";

    //CHANGE THE PLAYING CONTAINER'S HEIGHT SO THAT INFORMATION CAN BE DISPLAYED BELOW 
    document.getElementById("playing-container").style.height = "65vh";
    document.getElementById("playing-container").style.top = "38%";
    document.getElementById("playing-container").style.borderTopLeftRadius = "20px";

    //CHANGE MAP AND DISABLE OTHER BUTTONS
    document.getElementById('map').style.height = "65vh";
    map.setOptions({disableDefaultUI:true});

    //REMOVE LISTENER TO PREVENT ANOTHER GUESS
    google.maps.event.removeListener(listener);

    //DISPLAY A MARKER AT THE CORRECT COORDINATE
    correctMarker = new google.maps.Marker({
        position: streetViewLocation, 
        map: map,
        icon : {url:flag_url}
    });

    if(!timeEnded){
        //CALCULATE DISTANCE
        distance = haversineDistance(chosenLocation,streetViewLocation);
        
        //DRAW THE LINE BETWEEN THE TWO POINTS
        distanceLine = new google.maps.Polyline({
            path: [chosenLocation, streetViewLocation],
            strokeOpacity: 0,
            icons: [
                {
                    icon: lineSymbol,
                    offset: "0",
                    repeat: "17px",
                },
            ],
            map: map
        });

        //ZOOM IN ON ANSWER BY CHANGING THE BOUNDS AND CENTERING 
        let markerBounds = new google.maps.LatLngBounds();
        markerBounds.extend(chosenLocation);
        markerBounds.extend(streetViewLocation);
        map.fitBounds(markerBounds);
        map.setCenter(markerBounds.getCenter());

        
        
    }else{
        distance = 2000;
    }

    //MAKE A CALL TO SERVER TO SIGNAL THE ROUND HAS ENDED,SEND DISTANCE TO CALCULATE POINTS
    fetch('roundEnd/',{
        method :'POST',
        headers:{
            'X-CSRFToken' : csrftoken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            distance : distance,
            difference : 60000
        })
    })
    .then(response => response.json())
    .then(data => {

        //GET THE ROUND AND THE CURRENT POINTS
        currentRound = data["round"];
        p = data["points"];
        difference = data["difference"];
        totalPoints = data["totalPoints"];
        //points += p;
        console.log(data);

        document.getElementById("makeGuess").removeEventListener("click",makeGuess);

        //DISPLAY DISTANCE TEXT
        if(!timeEnded)
        document.getElementById("txt1").textContent = "Your guess was " + distance.toFixed(2) + " km from the correct location." 
        else
        document.getElementById("txt1").textContent = "You didn't guess on time." 
        document.getElementById("txt1").style.display = "block";

        //DISPLAY POINTS TEXT
        document.getElementById("txt2").textContent = "You earned " + p  + " points."  
        document.getElementById("txt2").style.display = "block";
        
        document.getElementById("nextRound").style.display = "block";
        //GO TO NEXT ROUND BUTTON
        if(data["gameEnded"])
        document.getElementById("endGameButton").style.display = "block";
        else
        document.getElementById("nextRoundButton").style.display = "block";

        //DISPLAY A METER TO SHOW POINTS
        document.getElementById("meter").style.display = "block";
        document.getElementById("progress").style.width = (p / 50) + "%";
        
        //WHEN NEXT ROUND IS CLICKED RESET VIEW
        document.getElementById("nextRoundButton").addEventListener("click",reset)

        document.getElementById("endGameButton").addEventListener("click",goToResults)
    });
}

function goToResults(){
    window.location.href = '/results/'
}


function reset(){
    console.log("next round")
    
    //REMOVE ALL ELEMENTS PLACED BEFORE
    document.getElementById("txt1").style.display = "none";
    document.getElementById("txt2").style.display = "none";
    document.getElementById("nextRound").style.display = "none";
    document.getElementById("nextRoundButton").style.display = "none";
    document.getElementById("meter").style.display = "none";
    document.getElementById("panorama").style.display = "none";

    //RESET THE PLAYING CONTAINER TO THE ORIGINAL SIZE
    document.getElementById("playing-container").style.borderTopLeftRadius = "0px";
    document.getElementById("playing-container").style.height = "84vh";
    document.getElementById("playing-container").style.top = "50%";
    document.getElementById('map').style.height = "84vh";
    google.maps.event.trigger(panorama, 'resize');

    //CHANGE CENTER FROM THE BOUNDS CENTER
    map.setCenter(ALBANIA_CENTER);

    //PLACE MARKER WORKS WHEN MARKER IS NULL
    marker = null;

    document.getElementById("nextRoundButton").removeEventListener("click",reset)

    //CALL THE INITROUND WITH 1 LOWER
    initRound(currentRound);
}


function haversineDistance(mk1, mk2) {
    var R = 6371.0710; 
    var rlat1 = mk1.lat() * (Math.PI/180);
    var rlat2 = mk2.lat() * (Math.PI/180);
    var difflat = rlat2-rlat1;
    var difflon = (mk2.lng()-mk1.lng()) * (Math.PI/180);
    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    console.log(d);
    return d;
}

function placeMarker(location) {
    if(marker == null){
        marker = new google.maps.Marker({
            position: location, 
            map: map,
            animation: google.maps.Animation.DROP,
        }); 
    } 
    else{
        marker.setPosition(location); 
    }
    chosenLocation = location;
}

function cardText(){
    let all = document.getElementsByClassName("cards")
    for (let i = 0; i < all.length; i++) {
        if(username.length <= 10)
            all[i].style.fontSize = "1.5vw";
        else
            all[i].style.fontSize = "1vw";
      }
      
    document.getElementById("username").textContent = username + "\n" + "Points:" + totalPoints;
    document.getElementById("round").textContent = "Round" + "\n" + currentRound + "/" + totalRounds;

    if(time == 0)
        document.getElementById("time").textContent = "Time" + "\n" + "No time limit";
    else
        timer();
    
}
window.addEventListener('beforeunload', function (e) {
    e.stopPropagation();
    console.log("DIFFERENCE" + difference);
    fetch('dif/',{
        method :'POST',
        headers:{
            'X-CSRFToken' : csrftoken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            difference : difference
        })
    })
  });
/*   function timeEnded(){

    google.maps.event.removeListener(listener);

    document.getElementById('panorama').style.width = "0vw";
    panorama.setVisible(false);
    google.maps.event.trigger(panorama, 'resize');

    //REMOVE THE GUESS BUTTON
    document.getElementById("makeGuess").style.display = "none";

    //CHANGE THE PLAYING CONTAINER'S HEIGHT SO THAT INFORMATION CAN BE DISPLAYED BELOW 
    document.getElementById("playing-container").style.height = "65vh";
    document.getElementById("playing-container").style.top = "38%";
    document.getElementById("playing-container").style.borderTopLeftRadius = "20px";

    //CHANGE MAP AND DISABLE OTHER BUTTONS
    document.getElementById('map').style.height = "65vh";
    map.setOptions({disableDefaultUI:true});

  }
 */

function timer(){

    difference = parseInt(difference);

    let countDownDate = new Date(new Date().getTime() + time * difference);
    let now,minutes,seconds,d;

    x = setInterval(function() {

        now = new Date().getTime();
        difference = countDownDate - now;

        minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((difference % (1000 * 60)) / 1000);

        d = new Date(0,0,0,0,minutes,seconds);

        if (difference < 0) {
            clearInterval(x);
            timeEnded = true;
            makeGuess();
        }else{
            document.getElementById("time").textContent = "Time" + "\n" + d.toLocaleTimeString([], {minute: '2-digit', second:'2-digit'});
        }
  
    }, 1000);
}



/* window.beforeunload = () => {
    console.log("DIFFERENCE" + difference);
    fetch('dif/',{
        method :'POST',
        headers:{
            'X-CSRFToken' : csrftoken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            difference : difference
        })
    })
} */
/* window.addEventListener('popstate', function() { 
    fetch('dif/',{
        method :'POST',
        headers:{
            'X-CSRFToken' : csrftoken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            difference : difference
        })
    })
}, false); */





/* document.getElementById("startgame").addEventListener("click", () => {
    let e = document.getElementById("rounds");
    rounds = e.options[e.selectedIndex].value;

    e = document.getElementById("time");
    time = e.options[e.selectedIndex].value;
    console.log(rounds)

     fetch('/gameinfo/',{
        method :'POST',
        headers:{
            'X-CSRFToken' : csrftoken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rounds : rounds,
            time : time
        })
    }).then(() => window.location.href = '/singleplayer/')
})
 */

 
    
        //var points = 4954.645 -0.03076199 * distance * 1000 + 1.272214 * Math.pow(10,-10) * Math.pow(distance*1000,2);
        //y = −527082.2 + (5003.114 − −527082.2)/(1 + (x/16715890)1.001797)
        //var points = (-366918.3 + (4987.88 - -366918.3))/Math.pow(1 + Math.pow(distance * 1000/2444243,0.6147428),0.07825342)
        //var points = (-527082.2 + (5003.114 +527082.2))/Math.pow(1 + distance/16715890,1.001797)

        /* var points = 4999.525 - 0.050 * distance * 1000
        points = points.toFixed();
        if(points > 5000) points = 5000
        else if(points < 0) points = 0
        else if(distance * 1000 < 30) points = 5000 */

        

/* var roomName = "singleplayer"
const chatSocket = new WebSocket('ws://'+ window.location.host + '/ws/' + roomName + '/');
chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log(data);
};
chatSocket.onopen = () => chatSocket.send(JSON.stringify({
    'message': "workingmessage"
})); */


    /* let hide = document.createElement("div");
    hide.id = "hide";
    document.querySelector("body").appendChild(hide); */