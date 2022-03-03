var domain
var extension
var font_size
var json_data
window.onload = function(){
    domain = "alpha3"
    extension = "com"
    font_size = getComputedStyle(document.body).getPropertyValue('font-size')
    toggleRadioButtonBackground()
    setParagraphPadding()
    readTextFile("tester.json", function(text){
        json_data = JSON.parse(text);
        fillTables(domain,extension)
    });
    tilesOnLoad()
}; 

window.addEventListener('resize', function(event){
    toggleRadioButtonBackground()
    setParagraphPadding()
    setGradientVars()
    tilesOnResize()
});

function showResults(domain_input, extension_input) {
    if(domain_input != null){
        domain = domain_input
        var old_button = document.getElementsByClassName('domainRadioButton radioSelected')[0]
        old_button.classList.remove("radioSelected")
        old_button.classList.add("radioUnselected")
        var new_button = document.getElementById(domain_input)
        new_button.classList.remove("radioUnselected")
        new_button .classList.add("radioSelected")
    }
    if(extension_input != null){
        extension = extension_input
        var old_button = document.getElementsByClassName('extensionRadioButton radioSelected')[0]
        old_button.classList.remove("radioSelected")
        old_button.classList.add("radioUnselected")
        var new_button = document.getElementById(extension_input)
        new_button.classList.remove("radioUnselected")
        new_button .classList.add("radioSelected")
    }
    fillTables(domain,extension)
}

function toggleRadioButtonBackground(){
    var start_element_domain = document.getElementById("alpha1")
    var end_element_domain = document.getElementById("boynames")
    if(start_element_domain.offsetTop == end_element_domain.offsetTop){
        document.getElementById("domainNamesRadio").style.backgroundColor = "transparent";
    }
    else{
        document.getElementById("domainNamesRadio").style.backgroundColor = "#F1F1F1";
    }
    var start_element_domain = document.getElementById("com")
    var end_element_domain = document.getElementById("work")
    if(start_element_domain.offsetTop == end_element_domain.offsetTop){
        document.getElementById("extensionNamesRadio").style.backgroundColor = "transparent";
    }
    else{
        document.getElementById("extensionNamesRadio").style.backgroundColor = "#F1F1F1";
    }
}

function setParagraphPadding(){
    var element = document.getElementById("info")
    var container = document.getElementById("paragraphContainer")
    var computedStyle = getComputedStyle(element);
    var paragraph_height = element.clientHeight;  // height with padding    
    paragraph_height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
    var paragraph_height_em = paragraph_height/parseFloat(font_size)
    var increment_of_3 = Math.ceil(paragraph_height_em/2.0) * 2
    var container_height = increment_of_3 + "em"
    container.style.height = container_height
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function fillTables(domain,extension){
    var free_array = json_data[extension][domain.toUpperCase()]["Free"]
    var free_list = document.getElementById("freeList");
    free_list.innerHTML = "";
    for (var i = 0; i < free_array.length; i++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(free_array[i] + "." + extension));
        free_list.appendChild(li);
    }
    var taken_array = json_data[extension][domain.toUpperCase()]["Taken"]
    var taken_list = document.getElementById("takenList");
    taken_list.innerHTML = "";
    for (var i = 0; i < taken_array.length; i++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(taken_array[i] + "." + extension));
        taken_list.appendChild(li);
    }
}

function setGradientVars(){
    let root = document.documentElement
    var window_width = window.innerWidth
    var width = document.getElementById('info').offsetWidth
    var offset = (window_width - width) / 2
    var percent1 = (offset / window_width) * 100
    var percent2 = ((offset + width) / window_width) * 100
    console.log(percent1 + ":" + percent2)
    root.style.setProperty('--var2', percent1 + "%")
    root.style.setProperty('--var3', percent2 + "%")
}