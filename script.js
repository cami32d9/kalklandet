document.addEventListener("DOMContentLoaded", start);

// Variabler, som skal bruges senere, men bliver hentet fra Wordpress/de enkelte sider
let restapi = [];
let page = "";
let primaryTopicName = "";
let secondaryTopicName = "";

let urlParams = new URLSearchParams(window.location.search);
let primaryID = urlParams.get("primaryID");
let secondaryID = urlParams.get("secondaryID");
let fakeID = urlParams.get("fakeID"); // Kun til statiske sider - dvs. midlertidigt!

if (primaryID === null) {
    primaryID = "kalklandet"; // Sørger for, et index.html uden ID'er fører til forsiden
}

if (secondaryID === null) {
    secondaryID = "about"; // Sørger for, et index.html uden ID'er fører til forsiden
}

let mainDesign = document.querySelectorAll(".main_design");
let mainNavButtonPage = document.querySelectorAll(".main_nav_item.page"); // Knapperne til undersiderne
let mainNavButtonIndex = document.querySelectorAll(".main_nav_item.index"); // Knappen til forsiden (index)
let subNavButton = document.querySelectorAll(".sub_nav_item");


function start() {
    fixTitles();

    // Finder de "rigtige" titler ud fra ID, så det kan matche emnerne fra Wordpress, menuen osv.
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

        if (primaryID === "kalklandet") {
            primaryTopicName = "Kalklandet";
        }

        //SUB PAGES
        if (secondaryID === "about") {
            secondaryTopicName = "Om";
        }

        if (secondaryID === "visit") {
            secondaryTopicName = "Besøg os";
        }

        if (secondaryID === "tours") {
            secondaryTopicName = "Guidet tur";
        }

        if (secondaryID === "teaching") {
            secondaryTopicName = "Undervisning";
        }

        if (secondaryID === "handicap") {
            secondaryTopicName = "Info for handicappede";
        }

        if (secondaryID === "find") {
            secondaryTopicName = "Find vej";
        }
    }


    async function getJson() {
        let pagesUrl = "https://camillagejl.com/kea/2-semester/tema7/kalklandet/wordpress/wp-json/wp/v2/pages?per_page=100";
        let jsonData = await fetch(pagesUrl);
        restapi = await jsonData.json();
        restapi.forEach(obj => {
            // Matcher sidens ID'er med emnerne i json, så kun én side vises
            // [0] bruges, fordi det er det første i et array (i json). && betyder "og", fordi begge ID'er skal matche
            if (primaryTopicName === obj.primary_topic[0] && secondaryTopicName === obj.secondary_topic[0]) {
                page = obj;
            }
        });
        designPage();
    }


    function designPage() {
        // Sørger for, at den relevante knap i hovedmenuen har baggrundsfarve for "chosen"
        mainNavButtonPage.forEach(button => {
            let primaryAttribute = button.getAttribute("data-primary_attribute");
            if (primaryID === primaryAttribute) {
                button.classList.add("button_chosen");
            }
        });

        // Samme som ovenstående, men for forside-knappen
        mainNavButtonIndex.forEach(button => {
            let primaryAttribute = button.getAttribute("data-primary_attribute");
            if (primaryID === primaryAttribute) {
                button.classList.add("button_chosen");
            }
        });

        // Samme som ovenstående, for undermenuen
        subNavButton.forEach(button => {
            let secondaryAttribute = button.getAttribute("data-secondary_attribute");
            if (secondaryID === secondaryAttribute) {
                button.classList.add("button_chosen");
            }
        });

        // Sørger for, at "attraktioner" er valgt, hvis man er på en af attraktionerne
        if (primaryID === "stevnsfort" || primaryID === "stevns_klint" || primaryID === "geomuseum") {
            document.querySelector(".attraction_menu button").classList.add("button_chosen");
        }

        // Tilføjer en klasse til siden, for at header, footer osv. matcher emnet
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
        let dest = document.querySelector(".content");

        if (secondaryTopicName === "Om") {
            document.querySelector(".page_title").textContent = "Velkommen til " + primaryTopicName;
        }

        else {
            document.querySelector(".page_title").textContent = primaryTopicName;
        }

        // Kun til statiske sider, dvs. midlertidigt!
        console.log(fakeID);
        if (fakeID === "viden") {
            document.querySelector(".page_title").textContent = "Viden";
        }
        if (fakeID === "om-os") {
            document.querySelector(".page_title").textContent = "Om os";
        }
        if (fakeID === "nyheder") {
            document.querySelector(".page_title").textContent = "Nyheder";
        }

        // Sørger for, at sidens overskrift på mobilen er den samme som på desktop
        document.querySelector(".mobile_page_title").textContent = document.querySelector(".page_title").textContent;

        // Gemmer h1, hvis man er på en af attraktionernes forsider
        // Forklaring: Hvis hovedemnet ikke er Kalklandet, og underemnet er Om - dvs. attraktionernes forsider.
        if (primaryTopicName !== "Kalklandet" && secondaryTopicName === "Om") {
            dest.querySelector("h1").classList.add("hidden");
        }

        // Giver titel til Kalklandets forside, som ikke matcher emnenavnet
        else if (primaryTopicName === "Kalklandet" && secondaryTopicName === "Om") {
            dest.querySelector("h1").innerHTML = `Velkommen til Kalklandet <br> - en del af Østsjællands Museum`;
        }

        else {
            dest.querySelector("h1").textContent = secondaryTopicName;
        }

        // Ændrer titlen på siden (dvs. i browserens fane)
        if (secondaryTopicName === "Om") {
            document.querySelector("title").textContent = primaryTopicName;
        }

        else {
        document.querySelector("title").textContent = primaryTopicName + " - " + secondaryTopicName;
        }

        dest.querySelector("#text_content").innerHTML += page.content.rendered;

        // Tilføjer alle de billeder, der findes til siden, efter hinanden
        page.image.forEach(image => {
            dest.querySelector("#image_content").innerHTML += `<img src="${image.guid}">`;
        })
    }

    mainNavButtonPage.forEach(button => {
        button.addEventListener("click", function () {
            let primaryAttribute = this.getAttribute("data-primary_attribute");
            let secondaryAttribute = this.getAttribute("data-secondary_attribute");
            // Fører til en lokation med knappens atributter som ID'er
            location.href = "page.html?primaryID=" + primaryAttribute + "&secondaryID=" + secondaryAttribute;
        });
    });

    mainNavButtonIndex.forEach(button => {
        button.addEventListener("click", function () {
            let primaryAttribute = this.getAttribute("data-primary_attribute");
            let secondaryAttribute = this.getAttribute("data-secondary_attribute");
            // Fører til en lokation med knappens atributter som ID'er
            location.href = "index.html?primaryID=" + primaryAttribute + "&secondaryID=" + secondaryAttribute;
        });
    });

    subNavButton.forEach(button => {
        button.addEventListener("click", function () {
            let secondaryAttribute = this.getAttribute("data-secondary_attribute");
            // Fører til en lokation med knappens attribut som secondaryID, men uden at ændre det nuværende primaryID
            location.href = "page.html?primaryID=" + primaryID + "&secondaryID=" + secondaryAttribute;
        });
    });

    // Viser attraktions-menuen ved hover på attraktions-knappen + skjuler den, når musen er væk fra knappen/menuen
    document.querySelector(".attraction_menu").addEventListener("mouseover", function () {
        document.querySelector(".attraction_dropdown").classList.add("display");
        document.querySelector(".attraction_menu").addEventListener("mouseout", function () {
            document.querySelector(".attraction_dropdown").classList.remove("display");
        })
    });

    // Viser og skjuler menuerne, når man trykker på burger-iconet
    document.querySelector(".burger_icon").addEventListener("click", function () {
        let navigations = document.querySelectorAll(".burger_menu");
        navigations.forEach(nav => {

            if (nav.classList.contains("display")) {
                nav.classList.remove("display");
            }

            else {

                nav.classList.add("display");
            }
        });
        document.querySelector("#main_content").classList.toggle("hidden");
        document.querySelector("footer").classList.toggle("hidden");

    });

    getJson();
}

