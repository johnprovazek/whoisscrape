var jsonData; // JSON containing the demo project select results data.
var domainsPerPage = 500; // Number of domains to show per each page.

window.onload = function(){
  loadJsonFile('results/results.json', function(text){
    jsonData = JSON.parse(text);
    let loadingContainer = document.getElementById('loading-container');
    loadingContainer.remove();
    initRadioResults();
  });
};

// Handles loading a JSON file and returns the text to a callback function when loaded.
function loadJsonFile(file, callback) {
  let loadingLabel = document.getElementById('loading-label');
  let rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType('application/json');
  rawFile.open('GET', file, true);
  rawFile.onprogress = function(event) {
    let percentComplete = parseInt((event.loaded / event.total) * 100);
    if(!isNaN(percentComplete)) {
      loadingLabel.innerHTML = 'Loading Data: ' + percentComplete + '%'
    }
  }
  rawFile.onreadystatechange = function() {
    if(rawFile.readyState === 4 && rawFile.status == '200') {
      callback(rawFile.responseText);
    }
  }
  rawFile.send(null);
}

// Initializes the radio buttons and results.
function initRadioResults(){
  showResults(null, null);
  document.getElementById('free-taken-label-container').style.visibility = 'visible';
  document.getElementById('free-taken-container').style.visibility = 'visible';
}

// Handles when a radio toggle has been selected.
function showResults(domainInput,extensionInput) {
  setCookie(domainInput,extensionInput);
  let domainCookie = getCookie('domain');
  let extensionCookie = getCookie('extension');
  toggleRadioClasses(domainCookie,extensionCookie);
  setDownloadLinks(domainCookie,extensionCookie);
  setDateHeader(domainCookie,extensionCookie);
  fillTables(domainCookie,extensionCookie,1);
  pageToggle(1);
}

// Handles retrieving a cookie value.
function getCookie(cookieName) {
  let name = cookieName + '=';
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
  return '';
}

// Handles setting domain and extension cookie values.
function setCookie(domain,extension) {
  let domainCookie = getCookie('domain');
  let extensionCookie = getCookie('extension');
  if(domainCookie == '') {
    document.cookie = 'domain=alpha1;';
  }
  else if(domain != null) {
    document.cookie = 'domain=' + domain + ';';
  } 
  if(extensionCookie == '') {
    document.cookie = 'extension=com;';
  }
  else if(extension != null) {
    document.cookie = 'extension=' + extension + ';';
  }
}

// Toggles Domain and Extension radio classes.
function toggleRadioClasses(domainInput, extensionInput){
  // Toggle Domain radio classes.
  let domainElements = document.getElementsByClassName('domain-radio-button');
  for (let i = 0; i < domainElements.length; i++) {
    domainElements[i].classList.remove('radio-selected');
    domainElements[i].classList.add('radio-unselected');
  }
  let domainElement = document.getElementById(domainInput);
  domainElement.classList.remove('radio-unselected');
  domainElement.classList.add('radio-selected');
  // Toggle Extension radio classes.
  let extensionElements = document.getElementsByClassName('extension-radio-button');
  for (let i = 0; i < extensionElements.length; i++) {
    extensionElements[i].classList.remove('radio-selected');
    extensionElements[i].classList.add('radio-unselected');
  }
  let extensionElement = document.getElementById(extensionInput);
  extensionElement.classList.remove('radio-unselected');
  extensionElement.classList.add('radio-selected');
}

// Sets download links for text files of the free and taken domains.
function setDownloadLinks(domainCookie,extensionCookie){
  let date = jsonData[extensionCookie][domainCookie].date
  let freeDownload = document.getElementById('free-download')
  freeDownload.href = 'results/' + extensionCookie + '/' + domainCookie + '/domainfree/free' + date + '.txt'
  freeDownload.download = domainCookie + '_' + extensionCookie + '_free' + date + '.txt'
  let takenDownload = document.getElementById('taken-download')
  takenDownload.href = 'results/' + extensionCookie + '/' + domainCookie + '/domaintaken/taken' + date + '.txt'
  takenDownload.download = domainCookie + '_' + extensionCookie + '_taken' + date + '.txt'
}

// Sets the date label with the date the data was gathered.
function setDateHeader(domainCookie,extensionCookie){
  let date = jsonData[extensionCookie][domainCookie]['date'].split('_')
  let dateFormatted = date[1] + '/' + date[2] + '/' + date[0]
  let dateLabel = document.getElementById('date-label')
  dateLabel.innerHTML = 'Date Ran: ' + dateFormatted
}

// Handles filling the list of free and taken domains.
function fillTables(domainInput,extensionInput,pageNum){
  pageNum = pageNum - 1;
  let freeArray = jsonData[extensionInput][domainInput]['free'];
  let freeList = document.getElementById('free-list');
  freeList.innerHTML = '';
  let freeIter = domainsPerPage * pageNum;
  let freeEnd = domainsPerPage * (pageNum + 1);
  if(freeEnd > freeArray.length){
    freeEnd = freeArray.length;
  }
  if(freeIter < freeEnd){
    for (freeIter; freeIter < freeEnd; freeIter++) {
      let li = document.createElement('li');
      li.appendChild(document.createTextNode(freeArray[freeIter]));
      freeList.appendChild(li);
    }
  }
  let takenArray = jsonData[extensionInput][domainInput]['taken'];
  let takenList = document.getElementById('taken-list');
  takenList.innerHTML = '';
  let takenIter = domainsPerPage * pageNum;
  let takenEnd = domainsPerPage * (pageNum + 1);
  if(takenEnd > takenArray.length){
    takenEnd = takenArray.length;
  }
  if(takenIter < takenEnd){
    for (takenIter; takenIter < takenEnd; takenIter++) {
      let li = document.createElement('li');
      li.appendChild(document.createTextNode(takenArray[takenIter]));
      takenList.appendChild(li);
    }
  }
}

// Handles the page toggle buttons.
function pageToggle(curPage){
  let domainCookie = getCookie('domain');
  let extensionCookie = getCookie('extension');
  let freePages = Math.ceil(jsonData[extensionCookie][domainCookie]['free'].length/domainsPerPage);
  let takenPages = Math.ceil(jsonData[extensionCookie][domainCookie]['taken'].length/domainsPerPage);
  let totalPages = freePages > takenPages ? freePages : takenPages;

  // Getting the page toggle elements.
  let back = document.getElementById('back');
  let pageNum = document.getElementById('page-num');
  let forward = document.getElementById('forward');

  // Setting onclick handlers for the forward and back buttons.
  back.onclick = function(){ 
    nav(curPage-1);
  };
  forward.onclick = function(){ 
    nav(curPage+1);
  };

  // Removing any disabled navigation toggles.
  back.classList.remove('nav-toggle-disabled');
  pageNum.classList.remove('page-num-disabled')
  forward.classList.remove('nav-toggle-disabled');

  // Handling exceptions where toggles need to be disabled.
  if(curPage == 1 && curPage == totalPages){ // There are not multiple pages. No toggles need to be shown.
    back.classList.add('nav-toggle-disabled');
    pageNum.classList.add('page-num-disabled')
    forward.classList.add('nav-toggle-disabled');
  }
  else if(curPage == 1){ // At the first page, cannot go back any further. Back toggle disabled.
    back.classList.add('nav-toggle-disabled');
    back.onclick = function(){
      void(0); 
    };
  }
  else if(curPage == totalPages){ // At the last page, cannot go any further. Forward toggle disabled.
    forward.classList.add('nav-toggle-disabled');
    forward.onclick = function(){
      void(0);
    };
  }

  // Setting the page number.
  pageNum.innerHTML = curPage;
}

// Handles navigating to a different page.
function nav(pageNum){
  let domainCookie = getCookie('domain');
  let extensionCookie = getCookie('extension');
  fillTables(domainCookie,extensionCookie,pageNum);
  pageToggle(pageNum);
}