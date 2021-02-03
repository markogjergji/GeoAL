document.addEventListener('DOMContentLoaded',(e) => {

    const csrftoken = Cookies.get('csrftoken');

    let username;
    let rounds;
    let t;
    let time = [0,1,3,5,10]

    const inBrowser = typeof window !== 'undefined'
    const UA = inBrowser && window.navigator.userAgent.toLowerCase()
    const isMobile = /\b(Android)\b/i.test(UA)


    document.getElementById("enterUsername").addEventListener("focus", (e) => {
        if(isMobile && window.matchMedia("(max-width: 500px)").matches){
            var viewport = document.querySelector("meta[name=viewport]");
            document.querySelector("html").style.height = "55vh";
            
            viewport.setAttribute("content", viewport.content + ", height=" + window.innerHeight);
        }
    })
    document.getElementById("enterUsername").addEventListener("focusout", (e) => {
        if(isMobile && window.matchMedia("(max-width: 500px)").matches){
            document.querySelector("html").style.height = "100vh";
            var viewport = document.querySelector("meta[name=viewport]");
            viewport.setAttribute("content", viewport.content + ", height=" + window.innerHeight);
        }
    })
    window.addEventListener("orientationchange", function(event) {
        document.querySelector("html").style.height = "100vh";
        if((document.activeElement === document.getElementById("enterUsername")) && (event.target.screen.orientation.angle === 0)){
            var viewport = document.querySelector("meta[name=viewport]");
            document.querySelector("html").style.height = "55vh";
            viewport.setAttribute("content", viewport.content + ", height=" + window.innerHeight);
        }
    }, false);


    document.getElementById("enterUsername").addEventListener("input", (e) => {
        if(e.target.value !== ''){
            if (/\S/.test(e.target.value))
            { 
                document.querySelector("#arrow").style.zIndex = "5";
            }
        }else{
            document.querySelector("#arrow").style.zIndex = "-5";
        }
    })

    document.getElementById("enterUsername").addEventListener("keydown", (e) => {
        
        if(e.key === 'Enter'){
            document.getElementById("arrow").style.top = "-10vh";
            username = document.getElementById("enterUsername").value;
            document.getElementById("geoalSign").childNodes[0].style.bottom = "130vh";
            document.getElementById("geoalSign").childNodes[0].style.transition = "bottom 0.5s cubic-bezier(1,0,0,1)";
            document.getElementById("enterSign").style.bottom = "130vh";
            document.getElementById("enterSign").style.transition = "bottom 0.5s cubic-bezier(1,0,0,1)";
            for(let i = 1; i < document.getElementById("enterSign").childNodes.length;i+=2){
                document.getElementById("enterSign").childNodes[i].style.bottom = "130vh";
                document.getElementById("enterSign").childNodes[i].style.transition = "bottom 0.5s cubic-bezier(1,0,0,1)";
            }
            document.getElementById("singleplayer").style.display = "block";
            document.getElementById("multiplayer").style.display = "block";
        }
    })

    document.getElementById("arrow").addEventListener("click", (e) => {
        document.getElementById("arrow").style.top = "-10vh";
        username = document.getElementById("enterUsername").value;
        document.getElementById("geoalSign").childNodes[0].style.bottom = "130vh";
        document.getElementById("geoalSign").childNodes[0].style.transition = "bottom 0.5s cubic-bezier(1,0,0,1)";
        document.getElementById("enterSign").style.bottom = "130vh";
        document.getElementById("enterSign").style.transition = "bottom 0.5s cubic-bezier(1,0,0,1)";
        for(let i = 1; i < document.getElementById("enterSign").childNodes.length;i+=2){
            document.getElementById("enterSign").childNodes[i].style.bottom = "130vh";
            document.getElementById("enterSign").childNodes[i].style.transition = "bottom 0.5s cubic-bezier(1,0,0,1)";
        }
        document.getElementById("singleplayer").style.display = "block";
        document.getElementById("multiplayer").style.display = "block";
    })


    document.getElementById("singleplayer").addEventListener("click", (e) => {
        mode = "singleplayer";
        document.getElementById("singleText").style.top = "33%";
        document.getElementById("multiText").style.top = "32%";
        removeSM();
        document.getElementById("roundSign").style.display = "block";
        rounds = document.getElementById("roundRange").value;
        document.getElementById("timeSign").style.display = "block";
        t = time[document.getElementById("timeRange").value];
        document.getElementById("startGame").style.display = "block";
    })
    
    function removeSM(){

        document.getElementById("singleplayer").style.bottom = "130vh";
        document.getElementById("singleplayer").style.transition = "bottom 0.5s cubic-bezier(1,0,0,1)";
        document.getElementById("multiplayer").style.bottom = "130vh";
        document.getElementById("multiplayer").style.transition = "bottom 0.5s cubic-bezier(1,0,0,1)";

        for(let i = 1; i < document.getElementById("singleplayer").childNodes.length;i+=2){
            document.getElementById("singleplayer").childNodes[i].style.bottom = "130vh";
            document.getElementById("singleplayer").childNodes[i].style.transition = "bottom 0.5s cubic-bezier(1,0,0,1)";
            document.getElementById("multiplayer").childNodes[i].style.bottom = "130vh";
            document.getElementById("multiplayer").childNodes[i].style.transition = "bottom 0.5s cubic-bezier(1,0,0,1)";
        }
        
    }
    document.getElementById("roundRange").addEventListener("input", (e) => {
        rounds = e.target.value;
            document.getElementById("roundSign").childNodes[3].textContent = "Rounds : " + e.target.value;
    })

    document.getElementById("timeRange").addEventListener("input", (e) => {
        t = time[e.target.value];
        if(e.target.value == 0)
        document.getElementById("timeSign").childNodes[3].textContent = "No time limit";
        else
        document.getElementById("timeSign").childNodes[3].textContent = "Time : " + time[e.target.value] + ":00";
    })

     document.getElementById("startGameButton").addEventListener("click", (e) => {
         fetch('',{
            method :'POST',
            headers:{
                'X-CSRFToken' : csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username : username,
                rounds : rounds,
                time : t,
                difference : 60000
            })
        }).then(() => window.location.href = '/singleplayer/')
    })
});
