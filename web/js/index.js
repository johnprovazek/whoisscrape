var font_size
var json_data
window.onload = function(){
    font_size = getComputedStyle(document.body).getPropertyValue('font-size')
    toggleRadioButtonBackground()
    setParagraphPadding()
    readTextFile("results/results.json", function(text){
        json_data = JSON.parse(text);
        initRadioResults()
        // createListElements()
    });
    tilesOnLoad()
}; 

window.addEventListener('resize', function(event){
    toggleRadioButtonBackground()
    setParagraphPadding()
    tilesOnResize()
});

function initRadioResults(){
    setCookie(null,null)
    var domain_cookie = getCookie("domain")
    var extension_cookie = getCookie("extension")
    toggleRadioClasses(domain_cookie, extension_cookie)
    fillTables(domain_cookie,extension_cookie)
}

function showResults(domain_input, extension_input) {
    setCookie(domain_input,extension_input)
    var domain_cookie = getCookie("domain")
    var extension_cookie = getCookie("extension")
    toggleRadioClasses(domain_cookie, extension_cookie)
    fillTables(domain_cookie, extension_cookie)
}

function toggleRadioClasses(domain_input, extension_input){
    var domain_elements = document.getElementsByClassName("domainRadioButton")
    for (var i = 0; i < domain_elements.length; i++) {
        domain_elements[i].classList.remove("radioSelected")
        domain_elements[i].classList.add("radioUnselected")
    }
    document.getElementById(domain_input).classList.add("radioSelected")
    document.getElementById(domain_input).classList.remove("radioUnselected")
    var extension_elements = document.getElementsByClassName("extensionRadioButton")
    for (var i = 0; i < extension_elements.length; i++) {
        extension_elements[i].classList.remove("radioSelected")
        extension_elements[i].classList.add("radioUnselected")
    }
    document.getElementById(extension_input).classList.add("radioSelected")
    document.getElementById(extension_input).classList.remove("radioUnselected")
}

function fillTables(domain_input,extension_input){
    var free_array = json_data[extension_input][domain_input]["free"]
    var free_list = document.getElementById("freeList");
    free_list.innerHTML = "";
    for (var i = 0; i < free_array.length; i++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(free_array[i] + "." + extension_input));
        free_list.appendChild(li);
    }
    var taken_array = json_data[extension_input][domain_input]["taken"]
    var taken_list = document.getElementById("takenList");
    taken_list.innerHTML = "";
    for (var i = 0; i < taken_array.length; i++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(taken_array[i] + "." + extension_input));
        taken_list.appendChild(li);
    }
}

function toggleRadioButtonBackground(){
    var start_element_domain = document.getElementById("domainNamesRadio").firstElementChild
    var end_element_domain = document.getElementById("domainNamesRadio").lastElementChild
    if(start_element_domain.offsetTop == end_element_domain.offsetTop){
        document.getElementById("domainNamesRadio").style.backgroundColor = "transparent";
    }
    else{
        document.getElementById("domainNamesRadio").style.backgroundColor = "#F1F1F1";
    }
    var start_element_extension = document.getElementById("extensionNamesRadio").firstElementChild
    var end_element_extension = document.getElementById("extensionNamesRadio").lastElementChild
    if(start_element_extension.offsetTop == end_element_extension.offsetTop){
        document.getElementById("extensionNamesRadio").style.backgroundColor = "transparent";
    }
    else{
        document.getElementById("extensionNamesRadio").style.backgroundColor = "#F1F1F1";
    }
}

function setParagraphPadding(){
    var element = document.getElementById("preamble")
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

function setCookie(domain,extension) {
    var domain_cookie = getCookie("domain");
    var extension_cookie = getCookie("extension");
    if (domain_cookie == "") {
        document.cookie = "domain=alpha1;"
    }
    else if(domain != null) {
        document.cookie = "domain=" + domain + ";"
    } 
    if (extension_cookie == "") {
        document.cookie = "extension=com;"
    }
    else if(extension != null) {
        document.cookie = "extension=" + extension + ";"
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function createListElements(){
    var domain_elements = document.getElementsByClassName("domainRadioButton")
    var extension_elements = document.getElementsByClassName("extensionRadioButton")
    for (var i = 0; i < domain_elements.length; i++) {
        for (var j = 0; j < extension_elements.length; j++) {
            var do_id = domain_elements[i].id
            var ex_id = extension_elements[j].id
            var free_array = json_data[ex_id][do_id]["free"]
            freeList = document.createElement('ul')
            freeList.id = do_id + "_" + ex_id
            for (var k = 0; k < free_array.length; k++) {
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(free_array[k] + "." + ex_id));
                freeList.appendChild(li);
            }
            document.getElementById("speedyHiddenListContainer").appendChild(freeList);
        }
    }
}