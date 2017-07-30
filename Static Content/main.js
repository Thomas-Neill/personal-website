$(document).ready(function () {

var width = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;
var height = window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight;
$('#main').prepend("<canvas id='background' width="+width+" height="+height+"'></canvas>")
var canvas = document.getElementById('background');
var ctx = canvas.getContext('2d');
var MAX_RAINDROPS = 1000;

var mtc = 'rgb(75,75,75)';
var bgc = 'rgb(125,125,190)';
var raincolor = 'blue';

function Point(x,y) {
  this.x = x;
  this.y = y;
}

function Line(start,end) {
  this.start = start;
  this.end = end;
  this.draw = function() {
    ctx.fillStyle = mtc;
    ctx.beginPath();
    ctx.moveTo(this.start.x,this.start.y);
    ctx.lineTo(this.end.x+1,this.end.y);
    ctx.lineTo(this.end.x+1,height);
    ctx.lineTo(this.start.x,height);
    ctx.lineTo(this.start.x,this.start.y);
    ctx.fill();
    ctx.closePath();
  };
  this.split = function(amplifier) {
    var mid = new Point(
      (start.x+end.x)/2,
      (start.y+end.y)/2 + (Math.random()-0.5)*amplifier
    );
    return [new Line(this.start,mid),new Line(mid,this.end)];
  };
  this.mountians = function(recursion,amplifier) {
    if(recursion == 0) return [this];
    else {
      var splitted = this.split(amplifier);
      var result1 = splitted[0].mountians(recursion-1,amplifier/2);
      var result2 = splitted[1].mountians(recursion-1,amplifier/2);
      return result1.concat(result2);
    }
  };
  this.calculateIntersect = function(x) {
    slope = (this.end.y-this.start.y)/(this.end.x-this.start.x);
    yint = this.start.y - this.start.x*slope;
    return x * slope + yint;
  };
}

function Raindrop(x,y,w,h,speed,limit) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.speed = speed;
  this.limit = limit;
  this.update = function() {
    this.y += this.speed;
    if(this.limit < this.y) {
      return spawnRaindrop();
    }
  };
  this.draw = function() {
    ctx.fillStyle = raincolor;
    ctx.fillRect(this.x,this.y,this.w,this.h);
  };
}

function find(needle,haystack) {
  for(var i = 0;haystack.length > i;i++) {
    if(haystack[i].start.x < needle && haystack[i].end.x > needle)
      return haystack[i].calculateIntersect(needle);
  }
}


function spawnRaindrop(y=0) {
  var x = Math.random()*width;
  return new Raindrop(x,y,2,5,Math.random()*5+5,find(x,mts));
}


function Rain() {
  this.raindrops = [];
  while(this.raindrops.length < MAX_RAINDROPS) {
    this.raindrops.push(spawnRaindrop(Math.random()*height/3));
  }
  this.update = function() {
    for(var i = 0;i<this.raindrops.length;i++) {
      drop = this.raindrops[i];
      var result = drop.update();
      if(result) {this.raindrops[i] = result;}
      drop.draw();
    }
  };
  this.warmup = function(times) {
    if(times) {
      this.raindrops.forEach(function(x){
        x.update();
      });
      this.warmup(times-1);
    }
  };
}

var ln = new Line(new Point(0,height/2),new Point(width,height/2));
var mts = ln.mountians(10,height/2);
var r = new Rain();
function update() {
  ctx.fillStyle = bgc;
  ctx.fillRect(0,0,width,height);
  r.update();
  mts.forEach(function(x){x.draw();});
  window.requestAnimationFrame(update);
}
update();
});//End JQuery wrapper
