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

var anni =  []; //creo un array vuoto in cui inserirò gli anni per andare poi a comporre ogni layer
var comuni = [];
var groups_anni = []; //creo un array in cui inserirò i gruppi di marker per ogni layer
var groups_comuni = [];
axios.get('/markers')
    .then(function (response){
        response.data.forEach(marker => {
            console.log(marker);
            var data_inizio = marker.data_inizio_progetto.substr(0, 10);
            var data_fine = marker.data_fine_progetto.substr(0, 10);
            var anno = marker.data_inizio_progetto.substr(0,4) //Dalla data del progetto ottengo l'anno
            var existing = false; //variabile che serve per verificare se un'anno esiste già nell'array degli anni
            var link = "http://www.google.com/maps/place/"+marker.latitudine+","+marker.longitudine;
            var googleMaps = "<a href="+link+" target='_blank'>Google Maps</a>";
            var del = "/delete/"+marker.id;
            var elimina = "<a href="+del+">Elimina</a>";
            //inserisco in una variabile il contenuto del popup
            var popup_data = "<h3>" + marker.nome_progetto + "</h3>" + "<strong> Data inizio: </strong>" + data_inizio + "<br>" + "<strong>Data fine: </strong>" + data_fine + "<br>" +"<strong>Città:</strong>" + marker.citta + "<br>" + "<strong>Descrizione: </strong>" + marker.note + "<br>" + googleMaps + "<br>" + elimina;
            //inserisco in una variabile il marker
            var m = L.marker([marker.latitudine, marker.longitudine]).bindPopup(popup_data , {removable: true, editable: true});
            if (anni.length == 0) {     //per il primo marker aggiungo già l'anno nel'array e il marker nell'array dei gruppi
                anni[0]=anno;   //faccio questo per il primo elemento perchè nei for successivi la condizione i<anni.length non sarebbe verificata e non riuscirebbe mai ad entrare nei for
                groups_anni[0]=L.layerGroup([]);
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
                groups_anni[groups_anni.length] = L.layerGroup([]);
            }
            if (anni.length != 0){  //evito il for di inserimento per il primo elemento perchè l'ho già inserito sopra
                for (let i = 0; i < anni.length; i++) {
                    if (anno == anni[i]) {
                        //m.addTo(groups_anni[i]);
                        groups_anni[i].addLayer(m);   //aggiungo il marker all'elemento corrispondente dell'array gruppi (gruppi è un array in cui ogni elemento contiene i marker di quel layer e ogni elemento corrisponderà poi a un layer diverso)
                        break;
                    }
                }
            }





            //stessa cosa ma per le città
            var existing = false;
            if (comuni.length == 0) {     //per il primo marker aggiungo già l'anno nel'array e il marker nell'array dei gruppi
                comuni[0]= marker.citta;   //faccio questo per il primo elemento perchè nei for successivi la condizione i<anni.length non sarebbe verificata e non riuscirebbe mai ad entrare nei for
                groups_comuni[0]=L.layerGroup([]);
                existing = true;    //imposto a true così evito i successivi controlli che inserirebbero il primo elemento una seconda volta
            } else {
                for (let i = 0; i < comuni.length; i++) {  //verifico se l'anno del marker esiste già nell'array anni
                    if (marker.citta == comuni[i]) {
                        existing = true;
                        break;
                    }
                }
            }
            if (!existing) {  //se l'anno non esiste nell'array degli anni lo aggiungo e aggiungo un nuovo elemento nell'array dei gruppi
                comuni.push(marker.citta);
                groups_comuni[groups_comuni.length] = L.layerGroup([]);
            }
            if (comuni.length != 0){  //evito il for di inserimento per il primo elemento perchè l'ho già inserito sopra
                for (let i = 0; i < comuni.length; i++) {
                    if (marker.citta == comuni[i]) {
                        //m.addTo(groups_comuni[i]);
                        groups_comuni[i].addLayer(m);   //aggiungo il marker all'elemento corrispondente dell'array gruppi (gruppi è un array in cui ogni elemento contiene i marker di quel layer e ogni elemento corrisponderà poi a un layer diverso)
                        break;
                    }
                }
            }

});
        var overlayMaps = {}; //creo un ogetto vuoto
        console.log(anni); //per verificare se l'array anni e l'array groups sono corretti
        console.log(groups_anni);
        for (let i = 0; i < anni.length; i++) {  //inserisco nell'ogetto appena crato le coppie "nomelayer":markers (nomelayer è l'elemento dell'array anni e i markers sono l'elemento dell'array groups)
            groups_anni[i].addTo(map);
            overlayMaps[anni[i]] = groups_anni[i];
        }
        for (let i = 0; i < comuni.length; i++) {  //inserisco nell'ogetto appena crato le coppie "nomelayer":markers (nomelayer è l'elemento dell'array anni e i markers sono l'elemento dell'array groups)
            groups_comuni[i].addTo(map);
            overlayMaps[comuni[i]] = groups_comuni[i];
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

new L.LogoControl().addTo(map)