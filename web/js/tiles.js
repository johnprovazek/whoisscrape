var screenHeight
var screenWidth
var numSquares
var tile_distance
var width_tiles
var height_tiles
var imgArray = new Array();
var imgGridArray

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


    // Create the flag variables (counter and total of images)
    var Counter = 0;
    var TotalImages = 2;
    // Create an instance of your images
    imgArray[0] = new Image();
    imgArray[1] = new Image();
    // Store the images that were not correctly loaded inside an array to show later
    var notLoadedImages = [];
    // The onload callback is triggered everytime an image is loaded
    var onloadCallback = function(){
        // Increment the counter
        Counter++;
        // Verify if the counter is less than the number of images
        if(Counter < TotalImages){
            return;
        }
        // Trigger the final callback if is the last img
        allLoadedCallback();
    };
    // The onerror callback is triggered everytime an image couldn't be loaded
    var onerrorCallback = function(){
        // Increment the counter
        Counter++;
        // Add the current image to the list of not loaded images
        notLoadedImages.push(this);
        // Verify if the counter is less than the number of images
        if(Counter < TotalImages){
            return;
        }
        // Trigger the final callback if is the last img
        allLoadedCallback();
    };
    // The callback that is executed when all the images have been loaded or not
    var allLoadedCallback = function(){
        tile_distance = screenWidth/numSquares
        width_tiles = Math.ceil(numSquares + 1);
        height_tiles = Math.ceil(screenHeight/tile_distance + 1);
        imgGridArray = new Array(width_tiles);
        for (var i = 0; i < width_tiles; i++) {
            imgGridArray[i] = new Array(height_tiles); // make each element an array
            for (var j = 0; j < height_tiles; j++) {
                imgGridArray[i][j] = tilesGetRandomInt(2)
                context.drawImage(imgArray[imgGridArray[i][j]], i*tile_distance, j*tile_distance, tile_distance, tile_distance);
            }
        }
        tilesOnResize()
    };
    // Attach onload callbacks
    imgArray[0].onload = onloadCallback;
    imgArray[1].onload = onloadCallback;
    // Attach onerror callbacks
    imgArray[0].onerror = onerrorCallback;
    imgArray[1].onerror = onerrorCallback;
    // Load the images !
    imgArray[0].src = "web/img/A.svg";
    imgArray[1].src = "web/img/B.svg";
}

function tilesGetRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// document.addEventListener('mousemove',function(e) {
//     // var rect = e.target.getBoundingClientRect();
//     // console.log(e.pageX + ":" + e.pageY)
//     // X_CURSER = ((e.pageX - rect.left) - canvas.width/2)/(canvas.width/2);
//     // Y_CURSER = (canvas.height/2 - (e.pageY - rect.top))/(canvas.height/2);
// },true);