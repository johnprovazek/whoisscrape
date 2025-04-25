import { loadFileJSON } from "./utils.js";
import { DEFAULT_DOMAIN, DEFAULT_EXTENSION, DOMAINS_PER_PAGE } from "./constants.js";

// HTML Elements.
const backButton = document.getElementById("back-button");
const dateLabel = document.getElementById("date-label");
const domainToggles = document.getElementById("domain-toggle").querySelectorAll(".toggle-button");
const extensionToggles = document.getElementById("extension-toggle").querySelectorAll(".toggle-button");
const freeDownloadButton = document.getElementById("free-download-button");
const freeList = document.getElementById("free-list");
const freeTakenLabel = document.getElementById("free-taken-label");
const freeTakenResults = document.getElementById("free-taken-results");
const nextButton = document.getElementById("next-button");
const pageNavigation = document.getElementById("page-navigation");
const pageNum = document.getElementById("page-num");
const takenDownloadButton = document.getElementById("taken-download-button");
const takenList = document.getElementById("taken-list");

let curPage = null;
let dataJSON = null;
let domain = DEFAULT_DOMAIN;
let extension = DEFAULT_EXTENSION;
let totalPages = null;

// Handles page setup.
window.onload = () => {
  domainToggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      if (dataJSON) {
        domain = event.target.dataset.value;
        updatePage();
      }
    });
  });
  extensionToggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      if (dataJSON) {
        extension = event.target.dataset.value;
        updatePage();
      }
    });
  });
  nextButton.addEventListener("click", () => {
    navigatePage(1);
  });
  backButton.addEventListener("click", () => {
    navigatePage(-1);
  });
  loadFileJSON("results/results.json", (text) => {
    dataJSON = JSON.parse(text);
    initApplication();
  });
};

// Initializes the application after data has been loaded.
const initApplication = () => {
  updatePage();
  freeTakenLabel.classList.remove("hidden");
  freeTakenResults.classList.remove("hidden");
  pageNavigation.classList.remove("hidden");
};

// Updates the page when a toggle button has been selected or the application was initialized.
const updatePage = () => {
  // Updating domain and extension toggle buttons.
  domainToggles.forEach((toggle) => {
    toggle.classList.remove("toggle-selected");
  });
  document.querySelector(`#domain-toggle > .toggle-button[data-value="${domain}"]`).classList.add("toggle-selected");
  extensionToggles.forEach((toggle) => {
    toggle.classList.remove("toggle-selected");
  });
  document
    .querySelector(`#extension-toggle > .toggle-button[data-value="${extension}"]`)
    .classList.add("toggle-selected");
  // Updating download links.
  const { date, free, taken } = dataJSON[extension][domain];
  updateDownloadLink(freeDownloadButton, free, "free", date);
  updateDownloadLink(takenDownloadButton, taken, "taken", date);
  // Updating date label.
  const [year, month, day] = dataJSON[extension][domain].date.split("_");
  dateLabel.innerHTML = `Date Ran: ${month}/${day}/${year}`;
  // Getting the total page count.
  const freePages = Math.ceil(dataJSON[extension][domain]["free"].length / DOMAINS_PER_PAGE);
  const takenPages = Math.ceil(dataJSON[extension][domain]["taken"].length / DOMAINS_PER_PAGE);
  totalPages = Math.max(freePages, takenPages);
  // Navigating to the current page.
  curPage = 0;
  navigatePage();
};

// Sets download links for text files of the free and taken domains.
const updateDownloadLink = (element, domains, type, date) => {
  const hasDomains = domains.length > 0;
  element.classList.toggle("hidden", !hasDomains);
  if (hasDomains) {
    element.href = `results/${extension}/${domain}/domain${type}/${type}${date}.txt`;
    element.download = `${domain}_${extension}_${type}${date}.txt`;
  } else {
    element.href = "";
    element.download = "";
  }
};

// Handles navigating to a different page.
const navigatePage = (pageChange = 0) => {
  curPage = curPage + pageChange;
  // Updating free and taken domain lists.
  const startIndex = curPage * DOMAINS_PER_PAGE;
  const domainData = dataJSON[extension][domain];
  updateList(freeList, domainData.free, startIndex);
  updateList(takenList, domainData.taken, startIndex);
  // Updating page navigation.
  const showPageNumber = totalPages > 1;
  const showBackButton = curPage > 0 && totalPages > 1;
  const showNextButton = curPage < totalPages - 1 && totalPages > 1;
  backButton.classList.toggle("hidden", !showBackButton);
  pageNum.classList.toggle("hidden", !showPageNumber);
  nextButton.classList.toggle("hidden", !showNextButton);
  pageNum.innerHTML = curPage + 1;
};

// Handles filling the list of free and taken domains.
const updateList = (listElement, list, startIndex) => {
  listElement.innerHTML = "";
  const endIndex = Math.min(startIndex + DOMAINS_PER_PAGE, list.length);
  for (let i = startIndex; i < endIndex; i++) {
    const listItem = document.createElement("li");
    listItem.appendChild(document.createTextNode(list[i]));
    listElement.appendChild(listItem);
  }
};
