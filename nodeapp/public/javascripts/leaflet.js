var map = L.map('map').setView([45.43, 10.99], 10);
//Creo una serie di variabili in cui ognuna contiene i dati relativi a una mappa di base diversa
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
//Creo un oggetto che contiene tutte le mappe di base, poi lo aggiungerò al menù dei layer
var baseMaps = {
    "OpenStreetMap": osm,
    "Terreno": Stamen_Terrain,
    "Satellite": Esri_WorldImagery
}

var markersLayer = new L.layerGroup([]);
var anni =  []; //creo un array vuoto in cui inserirò gli anni per andare poi a comporre ogni layer
var groups = []; //creo un array in cui inserirò i gruppi di marker per ogni layer
axios.get('/markers')
    .then(function (response){
        response.data.forEach(marker => {
            console.log(marker);
            var data_inizio = marker.data_inizio_progetto.substr(0, 10);
            var data_fine = marker.data_fine_progetto.substr(0, 10);
            var anno = marker.data_inizio_progetto.substr(0,4) //Dalla data del progetto ottengo l'anno
            var existing = false; //variabile che serve per verificare se un'anno esiste già nell'array degli anni
            var link = "http://www.google.com/maps/place/"+marker.latitudine+","+marker.longitudine;
            var del = "/delete/:"+marker.id;
            var googleMaps = "<a href="+link+" target='_blank'>Indicazioni</a>";
            //var elimina = "<a href="+del+">Elimina</a>";
            var elimina = "<a href="+del+"> Elimina</a>";
            //inserisco in una variabile il contenuto del popup
            var popup_data = "<h3>" + marker.nome_progetto + "</h3>" + 
                "<strong> Data inizio: </strong>" + data_inizio + "<br>" + 
                "<strong>Data fine: </strong>" + data_fine + "<br>" + 
                "<strong>Descrizione: </strong>" + marker.note + "<br>" + 
                "<button class='indicazioni'>" + '<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#4c3e38"><path d="M4.031 8.917l15.477-4.334a.5.5 0 01.616.617l-4.333 15.476a.5.5 0 01-.94.067l-3.248-7.382a.5.5 0 00-.256-.257L3.965 9.856a.5.5 0 01.066-.94z" stroke="#4c3e38" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>' + googleMaps + "</button>" + 
                "<button class='elimina'>" + '<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" stroke-width="1.8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M8.992 13h6" stroke="#000000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.04 4.294a.496.496 0 01.191-.479C3.927 3.32 6.314 2 12 2s8.073 1.32 8.769 1.815a.496.496 0 01.192.479l-1.7 12.744a4 4 0 01-1.98 2.944l-.32.183a10 10 0 01-9.922 0l-.32-.183a4 4 0 01-1.98-2.944l-1.7-12.744zM3 5c2.571 2.667 15.429 2.667 18 0" stroke="#000000" stroke-width="1.8"></path></svg>' + elimina + "</button>";
            //inserisco in una variabile il marker
            var m = L.marker([marker.latitudine, marker.longitudine]).bindPopup(popup_data);
            var m2 = L.marker([marker.latitudine, marker.longitudine], {title: marker.nome_progetto});
            m2.setOpacity(0);
            markersLayer.addLayer(m2);
            if (anni.length == 0) {     //per il primo marker aggiungo già l'anno nel'array e il marker nell'array dei gruppi
                anni[0]=anno;   //faccio questo per il primo elemento perchè nei for successivi la condizione i<anni.length non sarebbe verificata e non riuscirebbe mai ad entrare nei for
                groups[0]=L.layerGroup([]);
                existing = true;    //imposto a true così evito i successivi controlli che inserirebbero il primo elemento una seconda volta
            } else {
                for (let i = 0; i < anni.length; i++) {  //verifico se l'anno del marker esiste già nell'array anni
                    if (anno == anni[i]) {
                        existing = true;
                        break;
                    }
                }
            }
            if (!existing) {  //se l'anno non esiste nell'array degli anni lo aggiungo e aggiungo un nuovo elemento nell'array dei gruppi
                anni.push(anno);
                groups[groups.length] = L.layerGroup([]);
            }
            if (anni.length != 0){  //evito il for di inserimento per il primo elemento perchè l'ho già inserito sopra
                for (let i = 0; i < anni.length; i++) {
                    if (anno == anni[i]) {
                        groups[i].addLayer(m);   //aggiungo il marker all'elemento corrispondente dell'array gruppi (gruppi è un array in cui ogni elemento contiene i marker di quel layer e ogni elemento corrisponderà poi a un layer diverso)
                        break;
                    }
                }
            }
        });
        var overlayMaps = {}; //creo un ogetto vuoto
        console.log(anni); //per verificare se l'array anni e l'array groups sono corretti
        console.log(groups);
        for (let i = 0; i < anni.length; i++) {  //inserisco nell'ogetto appena crato le coppie "nomelayer":markers (nomelayer è l'elemento dell'array anni e i markers sono l'elemento dell'array groups)
            groups[i].addTo(map);
            overlayMaps[anni[i]] = groups[i];
        }
        //creo il layer controller (menù) con le mappe di base e i layers e lo aggiungo alla mappa
        var layerControl = L.control.layers(baseMaps, overlayMaps, {position: 'topleft'}).addTo(map);
    });
//auth0
const logoutButton = document.getElementById("logout-button");
const logoutLink = document.getElementById("logout-link");
if (logoutButton && logoutLink) {
    logoutButton.addEventListener("click", () => {
    logoutLink.click();
    });
}

/*aggiunta logo georicerche*/
L.LogoControl = L.Control.extend({
    options: {
        position: 'bottomleft'
        //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control logo-control');
        var button = L.DomUtil.create('a', '', container);
            container.innerHTML = '<img width="200px" class="logo-control-img" src="https://georicerche.com/wp-content/uploads/2019/03/logo-2018.png">';
        L.DomEvent.disableClickPropagation(container);
        container.title = "Georicerche";

        return container;
    },
});

new L.LogoControl().addTo(map);


map.addLayer(markersLayer);
var searchControl = new L.Control.Search({
    layer: markersLayer,
    initial: false,
    marker: false,
    zoom: 12
});
map.addControl(searchControl);