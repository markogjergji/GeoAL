document.addEventListener('DOMContentLoaded',(e) => {

    const csrftoken = Cookies.get('csrftoken');
    console.log("1");

    let username;
    let mode;
    let rounds;
    let t;
    let time = [0,1,3,5,10]

    /* if(window.innerWidth < 872){
        window.scroll(0,56);
        document.getElementById("imgCon").style.bottom = "-56px";
    } */
     if(window.innerWidth < 1000){
        //document.getElementById("pole").style.height = "80vh";
        /* document.documentElement.style.height = "80%";
        document.documentElement.style.bottom = "0"; */
        document.querySelector("html").style.position = "sticky";
        document.querySelector("html").style.top = "56px";
        document.querySelector("html").style.overflow = "visible";
    } 
    /*
    window.addEventListener('resize', () => {
        if(window.innerWidth < 872){
            window.scroll(0,56);
            document.getElementById("pole").style.bottom = "-56px";
            document.getElementById("lamp").style.bottom = "-56px";
            document.getElementById("flame").style.bottom = "-56px";
            alert(document.getElementById("flame").style.bottom)
        } 
      });
 */
    

    document.getElementById("enterUsername").addEventListener("input", (e) => {
        if(e.target.value !== ''){
            if (/\S/.test(e.target.value))
            { 
                document.querySelector(".fa-arrow-right").style.display = "block";
            }
        }else{
            document.querySelector(".fa-arrow-right").style.display = "none";
        }
    })

   /*  document.getElementById("enterUsername").addEventListener("keydown", (e) => {
        if(e.key === 'Enter'){
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
 */
    document.getElementById("arrow").addEventListener("click", (e) => {
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
        
        removeSM();
        document.getElementById("roundSign").style.display = "block";
        rounds = document.getElementById("roundRange").value;
        document.getElementById("timeSign").style.display = "block";
        t = time[document.getElementById("timeRange").value];
        document.getElementById("startGame").style.display = "block";
    })
    document.getElementById("multiplayer").addEventListener("click", (e) => {
        mode = "multiplayer";
        
        removeSM();
        document.getElementById("roundSign").style.display = "block";
        rounds = document.getElementById("roundRange").value;
        console.log(rounds);
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
