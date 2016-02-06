function $(sel) {
  return document.querySelector.call(document, sel);
}

$("#generate").addEventListener("click", generateCounter);
$("#reset").addEventListener("click", resetStuff);

window.onload = startCounter;

function resetStuff() {
  window.location.assign(`http://${window.location.host}`)
}

function generateCounter(e) {
  e.preventDefault();
  var subject = $("#subject").value;
  var date    = +$("#date").value;
  var month   = +$("#month").value;
  var year    = +$("#year").value;

  if(validate.date(date) && validate.month(month) && validate.year(year)) {
    var endDate = new Date(year, month - 1, date);
    var content = generateUrl(subject, endDate);
    $(".url-container").innerHTML = `<a href=${content}>share url</a>`;
  }
}

function startCounter() {
  if(window.location.search) {
    if(URLSearchParams) {
      $(".form").classList.add("hidden");
      $(".form").classList.remove("block");
      $("#reset").classList.remove("hidden");
      $("#myCanvas").classList.remove("hidden");
      
      var u = new URLSearchParams(window.location.search.slice(1));
      var content = base64decode(u.get('content').slice(0, -1));
      var data = retriveContent(content);

      runTimer(data.subject, new Date(data.date));
    }
  }
}

function DateMeasure(endtime) {
  var difference = endtime - new Date();
  var d, h, m, s;

  s = Math.floor(difference / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;

  return { diff: difference, days: d, hours: h, minutes: m, seconds: s, milliseconds: endtime.getMilliseconds() };
}

var validate = {
  today: () => {
    if(this.__date) return this.__date;
    this.__date = new Date;
    return this.__date;
  },

  date: function(d) {
    return d < 31 && d >= (this.today().getDate());
  },

  month: function(m) {
    return m < 13 && m >= (this.today().getMonth() + 1) ;
  },

  year: function(y) {
    return y >= this.today().getFullYear();
  }
};

function base64encode(str) {
  return encodeURIComponent(btoa(str));
}

function base64decode(str) {
  return decodeURIComponent(atob(str));
}

function retriveContent(str) {
  var parser = new DOMParser().parseFromString(str, "text/html");
  return {subject: parser.querySelector("name").textContent, date: parser.querySelector("date").textContent};
}

function generateUrl(subject, date) {
  var location = window.location.href;
  var content = `<name>${subject}</name><date>${date.toString()}</date>`;

  if(!location.endsWith('/')) location += '/';

  return `${location}?content=${base64encode(content)}`;
}

function runTimer(subject, endDate) {  
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");

  var r1 = 40, r2 = 60, r3 = 80, r4 = 100;
  var x1 = r1 + 20, x2 = 2 * r1 + 20 + 30 + r2;
  var x3 = 2 * r1 + 20 + 2 * r2 + 20 + 50 + r3, x4 = 2 * r1 + 20 + 2 * r2 + 20 + 2 * r3 + 20 + 70 + r4;

  var height = c.height;
  var txtWidth;
  var fram;
  
  function degToRad(degree) {
    return degree * (Math.PI / 180);
  }

  function play() {
    fram = requestAnimationFrame(drawCircle);
  }
  
      function stop() {
      if(fram) {
        cancelAnimationFrame(fram);
        fram = undefined;
      }
    }
    
    function drawCircle() {
      var date = DateMeasure(endDate);
      
      ctx.fillStyle =  "ffffff";
      ctx.fillRect(0, 0, c.width,c.height);
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.lineWidth = 5;

      // days
      renderDays(date)
    
      // hour
      renderHours(date);
    
      // minute
      renderMinutes(date);
      
      // second
      renderSeconds(date)
      
      fram = requestAnimationFrame(drawCircle);
      if(date.diff <= 0) stop();
    }
    
     function renderDays(date) {
      var day = date.days;
      ctx.beginPath();
      ctx.arc(x1, height / 2, r1, 0, Math.PI);
      ctx.strokeStyle = "#6366ce";
      ctx.stroke();
      ctx.closePath();
      
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.font = "bold " + r1/2 +"px serif";
      txtWidth = ctx.measureText(day).width;
      ctx.fillText(day, x1 - txtWidth/2,  height / 2 + txtWidth / 4);
      ctx.font = "normal " + r1/4 +"px serif";
      txtWidth = ctx.measureText("days").width;
      ctx.fillText("days", x1 - txtWidth/2,  height / 2 + txtWidth / 4 + 20);
      ctx.closePath();
    }
    
    function renderHours(date) {
      var hour = date.hours;
      var minute = date.minutes;
      var sec = date.seconds;
      ctx.beginPath();
      ctx.arc(x2, height / 2, r2, 0, degToRad(hour * 15 + minute * 0.25 + sec * 0.00417)); // each hour is 30 degree, but because 24 hour clock is 30 / 2
      ctx.strokeStyle = "#49dd8e";
      ctx.stroke();
      ctx.closePath();
      
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.font = "bold " + r2/2 +"px serif";
      txtWidth = ctx.measureText(hour).width;
      ctx.fillText(hour, x2 - txtWidth/2,  height / 2 + txtWidth / 4);
      ctx.font = "normal " + r2/4 +"px serif";
      txtWidth = ctx.measureText("hours").width;
      ctx.fillText("hours", x2 - txtWidth/2,  height / 2 + txtWidth / 4 + 20);
      ctx.closePath();
    }
    
    function renderMinutes(date) {
      var minute = date.minutes;
      var sec = date.seconds;
      ctx.beginPath();
      ctx.arc(x3, height / 2, r3, 0, degToRad(minute * 6 + sec * 0.1)); // each minute is 6 degree + equivalent degree for second
      ctx.strokeStyle = "#f25f5c";
      ctx.stroke();
      ctx.closePath();
      
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.font = "bold " + r3/2 +"px serif";
      txtWidth = ctx.measureText(minute).width;
      ctx.fillText(minute, x3 - txtWidth/2,  height / 2 + txtWidth / 4);
      ctx.font = "normal " + r3/4 +"px serif";
      txtWidth = ctx.measureText("seconds").width;
      ctx.fillText("minutes", x3 - txtWidth/2,  height / 2 + txtWidth / 4 + 20);
      ctx.closePath();
    }
    
    function renderSeconds(date) {
      var sec  = date.seconds;
      var nuSec = sec + (date.milliseconds/1000);
      
      ctx.beginPath();
      ctx.arc(x4, height / 2, r4, 0, degToRad(nuSec * 6));
      ctx.strokeStyle = "#224870";
      ctx.stroke();  
      ctx.closePath();
      
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.font = "bold " + r4/2 +"px serif";
      txtWidth = ctx.measureText(sec).width;
      ctx.fillText(sec, x4 - txtWidth/2,  height / 2 + txtWidth / 4);
      ctx.font = "normal " + r4/4 +"px serif";
      txtWidth = ctx.measureText("seconds").width;
      ctx.fillText("seconds", x4 - txtWidth/2,  height / 2 + txtWidth / 4 + 20);
      ctx.closePath();
    }
    play();  
    
    
  var content = `${subject} comming soon in`;
  $("output").innerHTML = content;
  
}
