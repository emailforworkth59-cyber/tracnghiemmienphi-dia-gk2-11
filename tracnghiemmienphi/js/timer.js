let time=0
let timerInterval=null

document.getElementById("startTimer").onclick=function(){

timerInterval=setInterval(()=>{

time++

let min=Math.floor(time/60)
let sec=time%60

document.getElementById("timer").innerText=
min+":"+sec.toString().padStart(2,"0")

},1000)

}