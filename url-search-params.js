/*! (C) WebReflection Mit Style License */
var URLSearchParams=URLSearchParams||function(){"use strict";function o(e){return encodeURIComponent(e).replace(t,i)}function u(e){return decodeURIComponent(e.replace(n," "))}function a(e){this[s]=Object.create(null);if(!e)return;for(var t,n,r=(e||"").split("&"),i=0,o=r.length;i<o;i++)n=r[i],t=n.indexOf("="),-1<t&&this.append(u(n.slice(0,t)),u(n.slice(t+1)))}var e=a.prototype,t=/[!'\(\)~]|%20|%00/g,n=/\+/g,r={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"},i=function(e){return r[e]},s="__URLSearchParams__:"+Math.random();return e.append=function(t,n){var r=this[s];t in r?r[t].push(""+n):r[t]=[""+n]},e.delete=function(t){delete this[s][t]},e.get=function(t){var n=this[s];return t in n?n[t][0]:null},e.getAll=function(t){var n=this[s];return t in n?n[t].slice(0):[]},e.has=function(t){return t in this[s]},e.set=function(t,n){this[s][t]=[""+n]},e.toJSON=function(){return{}},e.toString=function f(){var e=this[s],t=[],n,r,i,u;for(r in e){i=o(r);for(n=0,u=e[r];n<u.length;n++)t.push(i+"="+o(u[n]))}return t.join("&")},a}();