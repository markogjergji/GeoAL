window.addEventListener('DOMContentLoaded', () => {

    const inBrowser = typeof window !== 'undefined'
    const UA = inBrowser && window.navigator.userAgent.toLowerCase()
    const isChrome = UA && /chrome|crios/i.test(UA) && !/opr|opera|chromium|edg|ucbrowser|googlebot/i.test(UA)
    const isMobile = /\b(Android)\b/i.test(UA)

    if(isMobile && isChrome){
        if(window.innerWidth < 1000){
            document.querySelector("html").style.position = "sticky";
            document.querySelector("html").style.top = "56px";
            document.querySelector("html").style.overflow = "visible";
            document.querySelector("#card").style.marginBotttom = "56px";
        } 
    }

    window.addEventListener('resize', () => {
        if(isMobile && isChrome){
            if(window.innerWidth < 1000){
                document.querySelector("html").style.position = "sticky";
                document.querySelector("html").style.top = "56px";
                document.querySelector("html").style.overflow = "visible";
                document.querySelector("#card").style.marginBotttom = "56px";
            } 
        }
    });

    

    const csrftoken = Cookies.get('csrftoken');
    document.getElementById("progress").style.width = (parseInt(document.getElementById("tp").textContent) / ((parseInt(document.getElementById("tr").textContent)) * 50)) + "%";

    document.getElementById("goHomeButton").addEventListener("click",() => {
        window.location.href = ''
    })

    document.getElementById("playButton").addEventListener("click",() => {
        console.log("1")
        fetch('',{
            method :'POST',
            headers:{
                'X-CSRFToken' : csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }).then(() => window.location.href = '/singleplayer/')
    })

});