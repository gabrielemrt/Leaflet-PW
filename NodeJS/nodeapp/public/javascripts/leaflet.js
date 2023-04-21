var map = L.map('map').setView([45.43, 10.99], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

axios.get('/markers')
    .then(function (response){
        response.data.forEach(marker => {
            console.log(marker);
            L.marker([marker.WGS84_Y, marker.WGS84_X]).bindPopup(marker.DESCRIZIONE).addTo(map);    
        });
        
    })