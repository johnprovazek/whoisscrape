var jsonData; // JSON object containing the demo project data.
var domainsPerPage = 500; // Number of domains to show per page.

// Handles page setup.
window.onload = () => {
  document
    .getElementById("domain-toggle")
    .querySelectorAll(".radio-button")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        updatePage(event.target.id, null);
      });
    });
  document
    .getElementById("extension-toggle")
    .querySelectorAll(".radio-button")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        updatePage(null, event.target.id);
      });
    });
  loadJsonFile("results/results.json", function (text) {
    jsonData = JSON.parse(text);
    document.getElementById("loading-label").remove();
    initApplication();
  });
};

// Handles loading a JSON file and returning text to a callback function when loaded.
function loadJsonFile(file, callback) {
  let loadingLabel = document.getElementById("loading-label");
  let rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onprogress = function (event) {
    let percentComplete = parseInt((event.loaded / event.total) * 100);
    if (!isNaN(percentComplete)) {
      loadingLabel.innerHTML = "Loading Data: " + percentComplete + "%";
    }
  };
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
}

// Initializes the application after data has been loaded.
function initApplication() {
  updatePage(null, null);
  document.getElementById("free-taken-label-container").classList.remove("hidden");
  document.getElementById("free-taken-results-container").classList.remove("hidden");
}

// Updates the page when a radio button has been selected or the application was initialized.
function updatePage(domainInput, extensionInput) {
  setCookie(domainInput, extensionInput);
  let domainCookie = getCookie("domain");
  let extensionCookie = getCookie("extension");
  updateRadioButtons(domainCookie, extensionCookie);
  updateDownloadLinks(domainCookie, extensionCookie);
  updateDateHeader(domainCookie, extensionCookie);
  updateTables(domainCookie, extensionCookie, 1);
  pageToggle(1);
}

// Handles retrieving a cookie value.
function getCookie(cookieName) {
  let name = cookieName + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Handles setting domain and extension cookie values.
function setCookie(domain, extension) {
  let domainCookie = getCookie("domain");
  let extensionCookie = getCookie("extension");
  if (domainCookie == "") {
    document.cookie = "domain=a1;";
  } else if (domain != null) {
    document.cookie = "domain=" + domain + ";";
  }
  if (extensionCookie == "") {
    document.cookie = "extension=com;";
  } else if (extension != null) {
    document.cookie = "extension=" + extension + ";";
  }
}

// Updates the Domain and Extension radio buttons.
function updateRadioButtons(domainInput, extensionInput) {
  // Toggle Domain radio classes.
  document
    .getElementById("domain-toggle")
    .querySelectorAll(".radio-button")
    .forEach((button) => {
      button.classList.remove("radio-selected");
    });
  document.getElementById(domainInput).classList.add("radio-selected");
  // Toggle Extension radio classes.
  document
    .getElementById("extension-toggle")
    .querySelectorAll(".radio-button")
    .forEach((button) => {
      button.classList.remove("radio-selected");
    });
  document.getElementById(extensionInput).classList.add("radio-selected");
}

// Sets download links for text files of the free and taken domains.
function updateDownloadLinks(domainCookie, extensionCookie) {
  let date = jsonData[extensionCookie][domainCookie].date;
  let freeDownload = document.getElementById("free-download");
  if (jsonData[extensionCookie][domainCookie].free.length === 0) {
    freeDownload.classList.add("hidden");
    freeDownload.href = "";
    freeDownload.download = "";
  } else {
    freeDownload.classList.remove("hidden");
    freeDownload.href = "results/" + extensionCookie + "/" + domainCookie + "/domainfree/free" + date + ".txt";
    freeDownload.download = domainCookie + "_" + extensionCookie + "_free" + date + ".txt";
  }
  let takenDownload = document.getElementById("taken-download");
  if (jsonData[extensionCookie][domainCookie].taken.length === 0) {
    takenDownload.classList.add("hidden");
    takenDownload.href = "";
    takenDownload.download = "";
  } else {
    takenDownload.classList.remove("hidden");
    takenDownload.href = "results/" + extensionCookie + "/" + domainCookie + "/domaintaken/taken" + date + ".txt";
    takenDownload.download = domainCookie + "_" + extensionCookie + "_taken" + date + ".txt";
  }
}

// Sets the date label with the date the data was gathered.
function updateDateHeader(domainCookie, extensionCookie) {
  let date = jsonData[extensionCookie][domainCookie]["date"].split("_");
  let dateFormatted = date[1] + "/" + date[2] + "/" + date[0];
  document.getElementById("date-label").innerHTML = "Date Ran: " + dateFormatted;
}

// Handles filling the list of free and taken domains.
function updateTables(domainInput, extensionInput, pageNum) {
  pageNum = pageNum - 1;
  let freeArray = jsonData[extensionInput][domainInput]["free"];
  let freeList = document.getElementById("free-list");
  freeList.innerHTML = "";
  let freeIter = domainsPerPage * pageNum;
  let freeEnd = domainsPerPage * (pageNum + 1);
  if (freeEnd > freeArray.length) {
    freeEnd = freeArray.length;
  }
  if (freeIter < freeEnd) {
    for (freeIter; freeIter < freeEnd; freeIter++) {
      let li = document.createElement("li");
      li.appendChild(document.createTextNode(freeArray[freeIter]));
      freeList.appendChild(li);
    }
  }
  let takenArray = jsonData[extensionInput][domainInput]["taken"];
  let takenList = document.getElementById("taken-list");
  takenList.innerHTML = "";
  let takenIter = domainsPerPage * pageNum;
  let takenEnd = domainsPerPage * (pageNum + 1);
  if (takenEnd > takenArray.length) {
    takenEnd = takenArray.length;
  }
  if (takenIter < takenEnd) {
    for (takenIter; takenIter < takenEnd; takenIter++) {
      let li = document.createElement("li");
      li.appendChild(document.createTextNode(takenArray[takenIter]));
      takenList.appendChild(li);
    }
  }
}

// Handles the page toggle buttons.
function pageToggle(curPage) {
  let domainCookie = getCookie("domain");
  let extensionCookie = getCookie("extension");
  let freePages = Math.ceil(jsonData[extensionCookie][domainCookie]["free"].length / domainsPerPage);
  let takenPages = Math.ceil(jsonData[extensionCookie][domainCookie]["taken"].length / domainsPerPage);
  let totalPages = freePages > takenPages ? freePages : takenPages;
  // Getting the page toggle elements.
  let backButton = document.getElementById("back-button");
  let pageNum = document.getElementById("page-num");
  let nextButton = document.getElementById("next-button");
  // Setting onclick handlers for the back and next buttons.
  backButton.onclick = function () {
    nav(curPage - 1);
  };
  nextButton.onclick = function () {
    nav(curPage + 1);
  };
  // Removing any disabled navigation toggles.
  backButton.classList.remove("hidden");
  pageNum.classList.remove("hidden");
  nextButton.classList.remove("hidden");
  // Handling exceptions where toggles need to be disabled.
  if (curPage == 1 && curPage == totalPages) {
    // There are not multiple pages. No toggles need to be shown.
    backButton.classList.add("hidden");
    pageNum.classList.add("hidden");
    nextButton.classList.add("hidden");
  } else if (curPage == 1) {
    // At the first page, cannot go back any further. Back toggle disabled.
    backButton.classList.add("hidden");
    backButton.onclick = function () {
      void 0;
    };
  } else if (curPage == totalPages) {
    // At the last page, cannot go any further. Next toggle disabled.
    nextButton.classList.add("hidden");
    nextButton.onclick = function () {
      void 0;
    };
  }
  // Setting the page number.
  pageNum.innerHTML = curPage;
}

// Handles navigating to a different page.
function nav(pageNum) {
  let domainCookie = getCookie("domain");
  let extensionCookie = getCookie("extension");
  updateTables(domainCookie, extensionCookie, pageNum);
  pageToggle(pageNum);
}
