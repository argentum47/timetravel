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
      $("#generate").classList.add("hidden");
      $("#generate").classList.remove("block");
      $("#reset").classList.remove("hidden");
      var u = new URLSearchParams(window.location.search.slice(1));
      var content = base64decode(u.get('content').slice(0, -1));
      var data = retriveContent(content);
      var date = new Date(data.date);

      $("#subject").value = data.subject;
      $("#date").value = date.getDate();
      $("#month").value = date.getMonth() + 1;
      $("#year").value = date.getFullYear();
      runTimer(data.subject, date);
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

  return { diff: difference, days: d, hours: h, minutes: m, seconds: s };
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
  var timer = setInterval(() => {
    var t = DateMeasure(endDate);
    $("output").innerHTML = `${subject} comming soon in <day>${t.days}</day> days <hour>${t.hours}</hour> hours <minute>${t.minutes}</minute> minutes <second>${t.seconds}</second> seconds`;
    if(t.diff <= 0) clearInterval(timer);
  }, 1001)
}
