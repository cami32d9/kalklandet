document.addEventListener("DOMContentLoaded", start);

let restapi = [];
let page = "";
let primaryTopicName = "";
let secondaryTopicName = "";
let subNavButton = document.querySelectorAll(".sub_nav_item");

let urlParams = new URLSearchParams(window.location.search);
let primaryID = urlParams.get("primaryID");
let secondaryID = urlParams.get("secondaryID");


function start() {
    fixTitles();
    function fixTitles() {
    //MAIN PAGES
    if (primaryID === "stevnsfort") {
        primaryTopicName = "Koldkrigsmuseum Stevnsfort";
    }

    if (primaryID === "stevns_klint") {
        primaryTopicName = "Stevns Klint";
    }

    if (primaryID === "geomuseum") {
        primaryTopicName = "Geomuseum Faxe";
    }

    //SUB PAGES
    if (secondaryID === "about") {
        secondaryTopicName = "Om";
    }

    if (secondaryID === "visit") {
        secondaryTopicName = "Besøg os";
    }

    if (secondaryID === "teaching") {
        secondaryTopicName = "Undervisning";
    }

    if (secondaryID === "handicap") {
        secondaryTopicName = "Info for handicappede";
    }

    if (secondaryID === "groups") {
        secondaryTopicName = "For grupper";
    }

    if (secondaryID === "find") {
        secondaryTopicName = "Find vej";
    }
    }

    console.log("start()");
    async function getJson() {
        let pagesUrl = "https://camillagejl.com/kea/2-semester/tema7/kalklandet/wordpress/wp-json/wp/v2/pages/";
        let jsonData = await fetch(pagesUrl);
        restapi = await jsonData.json();
        restapi.forEach(obj => {

            console.log("primaryID = ", primaryID);
            console.log("secondaryID = ", secondaryID);
            console.log("Primary topic = ", obj.primary_topic[0]);
            if (primaryTopicName === obj.primary_topic[0] && secondaryTopicName === obj.secondary_topic[0]) {
                console.log("JEG MATCHER!");
                page = obj;
            }
        });
        designPage();
    }

    function designPage() {

        subNavButton.forEach(button => {
        button.classList.remove("hidden");
        });

        let mainDesign = document.querySelectorAll(".main_design");
        console.log(page);
        mainDesign.forEach(designPart => {
            designPart.classList.remove(".kalklandet");
            designPart.classList.remove(".stevnsfort");
            designPart.classList.remove(".stevns_klint");
            designPart.classList.remove(".geomuseum");
            designPart.classList.add(primaryID);
        });
        showContent();
    }


    function showContent() {
        let dest = document.querySelector("main");
        document.querySelector(".page_title").textContent = primaryTopicName;

        if (secondaryTopicName === "Om") {
            dest.querySelector("h1").textContent = "Velkommen til " + primaryTopicName;
        }

        else {
            dest.querySelector("h1").textContent = secondaryTopicName;
        }

        dest.querySelector("#text_content").innerHTML += page.content.rendered;
        dest.querySelector("img").src = page.image[0].guid;

    }

    let mainNavButton = document.querySelectorAll(".main_nav_item");
    mainNavButton.forEach(button => {
        button.addEventListener("click", function () {
            let primaryAttribute = this.getAttribute("data-primary_attribute");
            let secondaryAttribute = this.getAttribute("data-secondary_attribute");
            location.href = "page.html?primaryID=" + primaryAttribute + "&secondaryID=" + secondaryAttribute;
            console.log(primaryAttribute);
        });
    });

    subNavButton.forEach(button => {
        button.addEventListener("click", function () {
            let secondaryAttribute = this.getAttribute("data-secondary_attribute");
            location.href = "page.html?primaryID=" + primaryID + "&secondaryID=" + secondaryAttribute;
            console.log(primaryAttribute);
        });
    });



    getJson();
}

