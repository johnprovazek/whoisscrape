var screenHeight;
var screenWidth;
var numSquares;
var tile_distance;
var width_tiles;
var height_tiles;
var imgArray = new Array();
var imgGridArray;

function tilesOnResize() {
    var canvas = document.getElementById("tiles");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var context = canvas.getContext("2d");
    for (var i = 0; i < width_tiles; i++) {
        for (var j = 0; j < height_tiles; j++) {
            context.drawImage(imgArray[imgGridArray[i][j]], i*tile_distance, j*tile_distance, tile_distance, tile_distance);
        }
    }
}

function tilesOnLoad() {
    var canvas = document.getElementById("tiles");
    var context = canvas.getContext("2d");
    screenHeight = window.screen.height
    screenWidth = window.screen.width
    numSquares = 50
    canvas.width = screenWidth
    canvas.height = screenHeight
    var Counter = 0;
    var TotalImages = 2;
    imgArray[0] = new Image();
    imgArray[1] = new Image();
    var notLoadedImages = [];
    var onloadCallback = function(){
        Counter++;
        if(Counter < TotalImages){
            return;
        }
        allLoadedCallback();
    };
    var onerrorCallback = function(){
        Counter++;
        notLoadedImages.push(this);
        if(Counter < TotalImages){
            return;
        }
        allLoadedCallback();
    };
    var allLoadedCallback = function(){
        tile_distance = screenWidth/numSquares
        width_tiles = Math.ceil(numSquares + 1);
        height_tiles = Math.ceil(screenHeight/tile_distance + 1);
        imgGridArray = new Array(width_tiles);
        for (var i = 0; i < width_tiles; i++) {
            imgGridArray[i] = new Array(height_tiles);
            for (var j = 0; j < height_tiles; j++) {
                imgGridArray[i][j] = tilesGetRandomInt(2)
                context.drawImage(imgArray[imgGridArray[i][j]], i*tile_distance, j*tile_distance, tile_distance, tile_distance);
            }
        }
        tilesOnResize()
    };
    imgArray[0].onload = onloadCallback;
    imgArray[1].onload = onloadCallback;
    imgArray[0].onerror = onerrorCallback;
    imgArray[1].onerror = onerrorCallback;
    imgArray[0].src = "web/img/a.svg";
    imgArray[1].src = "web/img/b.svg";
}

function tilesGetRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function tilesSetGradientVars(){
    let root = document.documentElement
    var window_width = window.innerWidth
    var content_width = document.getElementById('info').offsetWidth
    var content_width_extended = content_width+ (content_width * (2/7))
    var offset = (window_width - content_width_extended) / 2
    var percent1 = (offset / window_width) * 100
    var percent2 = ((offset + content_width_extended) / window_width) * 100
    root.style.setProperty('--var2', percent1 + "%")
    root.style.setProperty('--var3', percent2 + "%")
}

document.addEventListener('mousemove',function(e) {
    // var rect = e.target.getBoundingClientRect();
    console.log(e.pageX + ":" + e.pageY)
    // X_CURSER = ((e.pageX - rect.left) - canvas.width/2)/(canvas.width/2);
    // Y_CURSER = (canvas.height/2 - (e.pageY - rect.top))/(canvas.height/2);
},true);