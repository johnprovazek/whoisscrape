var font_size
var json_data
window.onload = function(){
    font_size = getComputedStyle(document.body).getPropertyValue('font-size')
    setParagraphPadding()
    readTextFile("results/results.json", function(text){
        json_data = JSON.parse(text);
        initRadioResults()
    });
}; 

window.addEventListener('resize', function(event){
    setParagraphPadding()
});

function initRadioResults(){
    setCookie(null,null)
    var domain_cookie = getCookie("domain")
    var extension_cookie = getCookie("extension")
    toggleRadioClasses(domain_cookie, extension_cookie)
    setDownloadLinks(domain_cookie,extension_cookie)
    setDateHeader(domain_cookie,extension_cookie)
    fillTables(domain_cookie,extension_cookie,1)
    pageToggle(1)
    document.getElementById("freeTakenLabelContainer").style.visibility = "visible";
    document.getElementById("freeTakenContainer").style.visibility = "visible";
}

function showResults(domain_input, extension_input) {
    setCookie(domain_input,extension_input)
    var domain_cookie = getCookie("domain")
    var extension_cookie = getCookie("extension")
    toggleRadioClasses(domain_cookie, extension_cookie)
    setDownloadLinks(domain_cookie,extension_cookie)
    setDateHeader(domain_cookie,extension_cookie)
    fillTables(domain_cookie, extension_cookie,1)
    pageToggle(1)
    // document/getElementsByClassName
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

function nav(page_num){
    var domain_cookie = getCookie("domain")
    var extension_cookie = getCookie("extension")
    fillTables(domain_cookie,extension_cookie,page_num)
    pageToggle(page_num)
}

function fillTables(domain_input,extension_input,page_num){
    page_num = page_num - 1
    var free_array = json_data[extension_input][domain_input]["free"]
    var free_list = document.getElementById("freeList");
    free_list.innerHTML = "";
    var free_iter = 1000 * page_num
    var free_end = 1000 * (page_num + 1)
    if(free_end > free_array.length){
        free_end = free_array.length
    }
    if(free_iter < free_end){
        for (var free_iter; free_iter < free_end; free_iter++) {
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(free_array[free_iter]));
            free_list.appendChild(li);
        }
    }
    var taken_array = json_data[extension_input][domain_input]["taken"]
    var taken_list = document.getElementById("takenList");
    taken_list.innerHTML = "";
    var taken_iter = 1000 * page_num
    var taken_end = 1000 * (page_num + 1)
    if(taken_end > taken_array.length){
        taken_end = taken_array.length
    }
    if(taken_iter < taken_end){
        for (var taken_iter; taken_iter < taken_end; taken_iter++) {
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(taken_array[taken_iter]));
            taken_list.appendChild(li);
        }
    }
}

function pageToggle(cur_page){
    cur_page = cur_page
    var domain_cookie = getCookie("domain")
    var extension_cookie = getCookie("extension")
    var free_pages = Math.ceil(json_data[extension_cookie][domain_cookie]["free"].length/1000)
    var taken_pages = Math.ceil(json_data[extension_cookie][domain_cookie]["taken"].length/1000)
    var total_pages = free_pages
    if(taken_pages > free_pages){
        total_pages = taken_pages
    }

    // Getting the page toggle elements
    var back =  document.getElementById("back")
    var center =  document.getElementById("center")
    var forward =  document.getElementById("forward")

    // Back, forward, and center defaults
    back.style.color = "#292f33";
    back.style.cursor = "pointer";
    back.style.visibility = "visible";
    back.onclick = function () { nav(cur_page-1); };
    forward.style.color = "#292f33";
    forward.style.cursor = "pointer";
    forward.style.visibility = "visible";
    forward.onclick = function () { nav(cur_page+1); };
    center.style.visibility = "visible";

    // Back and forward exceptions
    if(cur_page == 1 && cur_page == total_pages){
        forward.style.visibility = "hidden";
        back.style.visibility = "hidden";
        center.style.visibility = "hidden";
    }
    if(cur_page == 1){
        back.style.color = "#F1F1F1";
        back.style.cursor = "default";
        back.onclick = function () { void(0); };
    }
    if(cur_page == total_pages){
        forward.style.color = "#F1F1F1";
        forward.style.cursor = "default";
        forward.onclick = function () { void(0); };
    }

    // Setting the page number
    center.innerHTML = cur_page
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

function setDownloadLinks(domain_cookie,extension_cookie){
    var date = json_data[extension_cookie][domain_cookie].date
    var free_download = document.getElementById("freeDownload")
    free_download.href = "results/" + extension_cookie + "/" + domain_cookie + "/domainfree/free" + date + ".txt"
    free_download.download = domain_cookie + "_" + extension_cookie + "_free" + date + ".txt"
    var taken_download = document.getElementById("takenDownload")
    taken_download.href = "results/" + extension_cookie + "/" + domain_cookie + "/domaintaken/taken" + date + ".txt"
    taken_download.download = domain_cookie + "_" + extension_cookie + "_taken" + date + ".txt"
}

function setDateHeader(domain_cookie,extension_cookie){
    var da = json_data[extension_cookie][domain_cookie]["date"].split("_")
    var date_formatted = da[1] + "/" + da[2] + "/" + da[0]
    var dateLabel = document.getElementById("dateLabel")
    dateLabel.innerHTML = "Date Ran: " + date_formatted
}