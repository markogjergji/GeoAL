window.addEventListener('DOMContentLoaded', () => {
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

    document.getElementById("refresh").addEventListener("click",() => {
        console.log("1")
        fetch('/refresh/',{
            method :'POST',
            headers:{
                'X-CSRFToken' : csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
    })
});