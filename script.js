document.addEventListener("DOMContentLoaded", start);

let restapi = [];
let page = "";
let primaryTopicName = "";
let urlParams = new URLSearchParams(window.location.search);
let primaryID = urlParams.get("primaryID");


function start() {
    if (primaryID === "stevnsfort") {
        primaryTopicName = "Koldkrigsmuseum Stevnsfort";
    }

    if (primaryID === "stevns_klint") {
        primaryTopicName = "Stevns Klint";
    }

    if (primaryID === "geomuseum") {
        primaryTopicName = "Geomuseum Faxe";
    }

    console.log("I'm starting");
    console.log("primaryID = ", primaryID);
    async function getJson() {
        let url = "https://camillagejl.com/kea/2-semester/tema7/kalklandet/wordpress/wp-json/wp/v2/pages/";
        let jsonData = await fetch(url);
        restapi = await jsonData.json();
        restapi.forEach(obj => {

            console.log("I'm here", obj);
            console.log("primaryID = ", primaryID);
            console.log("Primary topic = ", obj.primary_topic[0]);
            if (primaryTopicName === obj.primary_topic[0]) {
                console.log("cool bro");
                page = obj;
            }
        });
        designPage();
    }

    function designPage() {

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
        dest.querySelector("h1").textContent = page.title.rendered;
        dest.querySelector("#text_content").innerHTML = page.content.rendered;
        dest.querySelector("img").src = page.image[0].guid;

    }

    let mainNavButton = document.querySelectorAll(".main_nav_item");
    mainNavButton.forEach(button => {
        button.addEventListener("click", function () {
            let primaryAttribute = this.getAttribute("data-primary_attribute");
            location.href = "om.html?primaryID=" + primaryAttribute;
            console.log(primaryAttribute);
        });
    });

    getJson();
}

