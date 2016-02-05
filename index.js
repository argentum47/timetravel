function $(sel) {
  return document.querySelector.call(document, sel);
}

$("#generate").addEventListener("click", generateCounterUrl);

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
  
  return { diff: difference, days: d, hours: h, minutes: m, seconds: s };  
}

var validate = {
  date: (d) => {
    return d < 31 && d >= (new Date().getDate());
  },
  
  month: (m) => {
    return m < 13 && m >= (new Date().getMonth() + 1) ;
  },
  
  year: (y) => {
    return y >= new Date().getFullYear();
  }
};

var timer = null;

function generateCounterUrl(e) {
  e.preventDefault();
  var subject = $("#subject").value;
  var date = +$("#date").value;
  var month = +$("#month").value;
  var year = +$("#year").value;
  
  if(validate.date(date) && validate.month(month) && validate.year(year)) {
   runTimer(subject, date, month, year) 
  }
}

function runTimer(subject, date, month, year) {
  var endDate = new Date(year, month - 1, date);
  var timer = setInterval(() => {
    var t = DateMeasure(endDate);
    console.log(`${subject} returns in ${t.days} days, ${t.hours} hours, ${t.minutes} minutes, ${t.seconds} seconds`);
    
    if(t.diff <= 0) clearInterval(timer);
  }, 1001)
}