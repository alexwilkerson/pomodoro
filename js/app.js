var beep = document.createElement("audio");
beep.setAttribute("src", "beep.mp3");

var state = "off";

var sessionTime = 25;
var sessionMinutes = 25;
var sessionSeconds = 0;
var breakTime = 5;
var breakMinutes = 5;
var breakSeconds = 0;

var sessionCirclePercent = 0;
var breakCirclePercent = 0;

var clock = $(".timer-text");
var breakClock = $(".timer-break-text");

var sessionCircle = $(".circle").get(0);
var breakCircle = $(".break-circle").get(0);

function setCircleLength(circ, percent){
  var pathLength = circ.getTotalLength();
  circ.setAttribute('stroke-dasharray', pathLength);
  var adjustedLength = percent * pathLength / 100;
  circ.setAttribute('stroke-dashoffset', pathLength - adjustedLength);
}

function startTimer() {
  if (state === "running"){
    decrementSession();
    setTimeout(function() {
      startTimer();
    }, 1000);
  }
}

var toggleTimer = function() {
  if (state === "off" || state == "paused") {
    state = "running";
    startTimer();
  } else {
    state = "paused";
  }
};

function updateDisplay() {
  clock.html(sessionMinutes + ":" + (sessionSeconds < 10 ? "0" : "") + sessionSeconds);
  breakClock.html(breakMinutes + ":" + (breakSeconds < 10 ? "0" : "") + breakSeconds); 
  var totalTime = sessionTime + breakTime;
  sessionCirclePercent = ((sessionTime - (sessionMinutes + sessionSeconds/60))/totalTime)*100;
  breakCirclePercent = (((breakTime - (breakMinutes + breakSeconds/60))/totalTime)*100)+sessionCirclePercent;
  setCircleLength(sessionCircle, sessionCirclePercent);
  setCircleLength(breakCircle, breakCirclePercent);
}

function decrementSession () {
  if (sessionSeconds === 0 && sessionMinutes === 0 && breakMinutes === 0 && breakSeconds === 0) {
    beep.play();
    reset();
  }
  if (sessionSeconds === 0 && sessionMinutes === 0 && breakMinutes === breakTime) {
    beep.play();
  }
  if (sessionSeconds === 0 && sessionMinutes === 0) {
    if (breakSeconds === 0) {
      breakMinutes--;
      breakSeconds = 59;
    } else {
      breakSeconds--;
    }
  } else {
    if (sessionSeconds === 0) {
      sessionMinutes--;
      sessionSeconds = 59;
    } else {    
      sessionSeconds--;
    }
  }
  updateDisplay();
}

function reset() {
  sessionMinutes = sessionTime;
  breakMinutes = breakTime;
  sessionSeconds = 0;
  breakSeconds = 0;
}

function setSessionTimerUp() {
  state = "off";
  if(sessionTime < 99) {
    sessionTime++;
  }
  sessionMinutes = sessionTime;
  reset();
  updateDisplay();
}

function setSessionTimerDown() {
  state = "off";
  if(sessionTime > 1) {
    sessionTime--;
  }
  sessionMinutes = sessionTime;
  reset();
  updateDisplay();
}

function setBreakTimerDown() {
  state = "off";
  if(breakTime > 1) {
    breakTime--;
  }
  breakMinutes = breakTime;
  reset();
  updateDisplay();
}

function setBreakTimerUp() {
  state = "off";
  if(breakTime < 99) {
    breakTime++;
  }
  breakMinutes = breakTime;
  reset();
  updateDisplay();
}

$(document).ready(function(){

  setCircleLength(sessionCircle, 0);
  setCircleLength(breakCircle, 0);

  $(".timer").click(toggleTimer);
  $("#btn-break-up").click(setBreakTimerUp);
  $("#btn-break-down").click(setBreakTimerDown);
  $("#btn-session-up").click(setSessionTimerUp);
  $("#btn-session-down").click(setSessionTimerDown);

});
