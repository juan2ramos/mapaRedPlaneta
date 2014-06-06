var cities = { 
8:1,
25:2,
33:3,
14:4,
29:5,
31:6,
32:7,
38:8,
40:9,
47:10,
50:11,
51:12,
59:13,
63:14,
197:15,
228:16,
4:36,
88:18,
90:19,
95:20,
93:21,
109:22,
141:23,
161:24,
170:25,
180:26,
172:27,
61:28,
119:29,
230:30,
127:31,
204:32,
220:33,
227:34,
231:35,
6:37,
16:38,
19:39,
28:40,
26:41,
23:42,
94:43,
60:44,
66:45,
67:46,
69:47,
72:48,
57:49,
85:50,
96:51,
103:52,
106:53,
108:54,
133:55,
131:56,
132:57,
145:58,
138:59,
147:60,
163:61,
164:62,
176:63,
179:64,
77:65,
56:66,
184:67,
185:68,
205:69,
206:70,
39:71,
207:72,
226:73,
0:74,
12:75,
70:76,
142:77,
195:78,
118:79,
75:80,
166:81,
167:82,
174:83,
175:84,
237:85,
219:86,
0:87,
235:88,
62:89,
2:90,
20:91,
36:92,
21:93,
18:94,
43:95,
49:96,
37:97,
213:98,
48:99,
44:100,
45:101,
0:102,
64:103,
104:104,
65:105,
68:106,
76:107,
82:108,
80:109,
81:110,
83:111,
115:112,
130:113,
125:114,
126:115,
139:116,
154:117,
144:118,
153:119,
151:120,
136:121,
150:122,
156:123,
158:124,
160:125,
186:126,
203:127,
191:128,
210:129,
196:130,
200:131,
239:132,
189:133,
190:134,
208:135,
224:136,
214:137,
221:138,
225:139,
240:140,
241:141,
1:142,
188:143,
9:144,
17:145,
22:146,
24:147,
146:148,
34:149,
35:150,
117:151,
183:152,
41:153,
55:154,
178:156,
181:157,
173:158,
78:159,
97:160,
107:161,
112:162,
111:163,
114:164,
116:165,
122:166,
0:167,
124:168,
155:169,
140:170,
148:171,
165:172,
168:173,
169:174,
192:175,
211:176,
129:177,
215:178,
216:179,
217:180,
222:181,
229:182,
234:183,
238:184,
120:185,
7:186,
99:187,
105:188,
104:189,
};

d3.select(window).on("resize", throttle);

var zoom = d3.behavior.zoom()
.scaleExtent([1, 9])
.on("zoom", move);


var width = document.getElementById('container').offsetWidth;
var height = width / 2;

var topo,projection,path,svg,g;

var graticule = d3.geo.graticule();

var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

setup(width,height);

function setup(width,height){
  projection = d3.geo.mercator()
  .translate([(width/2), (height/2)])
  .scale( width / 2 / Math.PI);

  path = d3.geo.path().projection(projection);

  svg = d3.select("#container").append("svg")
  .attr("width", width)
  .attr("height", height + 8)
  .call(zoom)
  .on("click", click)
  .append("g");

  g = svg.append("g");

}

d3.json("https://api.github.com/gists/9398333", function(error, root) {

    var world = root.files['world.json'].content
  world = JSON.parse(world)
  var countries = topojson.feature(world, world.objects.countries).features;
  console.log(countries)
  topo = countries;
  draw(topo);

});

function draw(topo) {
/*
  svg.append("path")
  .datum(graticule)
  .attr("class", "graticule")
  .attr("d", path);
*/
/*
  g.append("path")
  .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
  .attr("class", "equator")
  .attr("d", path);
*/

  var country = g.selectAll(".country").data(topo);

  country.enter().insert("path")
  .attr("class", "country")
  .attr("d", path)
  .attr("id", function(d,i) { return d.id; })
  .attr("title", function(d,i) { return d.properties.name; })
  .style("fill", function(d, i) { return "#49cc90";return d.properties.color; });

  //offsets for tooltips
  var offsetL = document.getElementById('container').offsetLeft+20;
  var offsetT = document.getElementById('container').offsetTop+10;

  //tooltips
  country
  .on("mousemove", function(d,i) {

    var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

    tooltip.classed("hidden", false)
    .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
    .html(d.properties.name);

  })
  .on("mouseout",  function(d,i) {
    tooltip.classed("hidden", true);
  })
  
  .on("click",  function(d,i) {
    tooltip.classed("hidden", true); 
    var i = d.id;  
    window.location.href = window.top.location.href = "http://redplanetacolombia.com/redPlaneta/index.php/contienentes/viewgroup/"+cities[i]; 
  }); 
  $.getJSON( "http://smart-ip.net/geoip-json?callback=?",
        function(data){
          alert(data);
            console.log( data);
          addpoint(data.longitude, data.latitude, data.city);
          $("span.city").html(data.city);
        }
    );

}


function redraw() {
  width = document.getElementById('container').offsetWidth;
  height = width / 2;
  d3.select('svg').remove();
  setup(width,height);
  draw(topo);
}


function move() {

  var t = d3.event.translate;
  var s = d3.event.scale; 
  zscale = s;
  var h = height/4;


  t[0] = Math.min(
    (width/height)  * (s - 1), 
    Math.max( width * (1 - s), t[0] )
  );

  t[1] = Math.min(
    h * (s - 1) + h * s, 
    Math.max(height  * (1 - s) - h * s, t[1])
  );

  zoom.translate(t);
  g.attr("transform", "translate(" + t + ")scale(" + s + ")");

  //adjust the country hover stroke width based on zoom level
  d3.selectAll(".country").style("stroke-width", 1.5 / s);

}

var throttleTimer;
function throttle() {
  window.clearTimeout(throttleTimer);
  throttleTimer = window.setTimeout(function() {
    redraw();
  }, 200);
}


//geo translation on mouse click in map
function click() {
  var latlon = projection.invert(d3.mouse(this));
  console.log(latlon);
  

}


//function to add points and text to the map (used in plotting capitals)
function addpoint(longitude, latitude, text) {

  var gpoint = g.append("g").attr("class", "gpoint");
  var x = projection([longitude, latitude])[0];
  var y = projection([longitude, latitude])[1];

  gpoint.append("svg:circle")
  .attr("cx", x)
  .attr("cy", y)
  .attr("class","point")
  .attr("r", 2)
  .style("fill", "#fff");

  //conditional in case a point has no associated text
  if(text.length>0){
    gpoint.append("text")
    .attr("x", x+2)
    .attr("y", y+2)
    .attr("class","text")
    .text(text)
    .style("fill", "#fff");
  }

}

