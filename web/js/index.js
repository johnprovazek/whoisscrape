var domain
var extension
window.onload = function(){
    domain = "ALPHA3"
    extension = "com"
}; 

function showResults(domain_input, extension_input) {
    if(domain_input != null){
        domain = domain_input
        document.getElementById("domainDropdown").innerHTML = domain_input
    }
    if(extension_input != null){
        extension = extension_input
        document.getElementById("extensionDropdown").innerHTML = extension_input
    }
    console.log(domain + ":" + extension)
}