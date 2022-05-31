import API_KEY from "./config.js"
const ip_input = document.getElementById('ip-input');
const ip_text = document.getElementById('ip');
const location_text = document.getElementById('location');
const timezone_text = document.getElementById('timezone');
const isp_text = document.getElementById('isp');
let marker;
let map;
searchIP(true);

function searchIP(firstTime) {
    let ip_value = ip_input.value;
    if(ip_value != '' || firstTime){
        fetch('https://geo.ipify.org/api/v2/country,city?apiKey=' + API_KEY + '&ipAddress=' + ip_value + '&domain=' + ip_value)
        .then(response => response.json())
        .then(json => showDataAndMap(json, firstTime))        
    }else{
        alert('Please enter an IP');
    }
}


function showDataAndMap(json, firstTime) {
    let data = json;
    let ip = data['ip'];
    let loc = data['location'];
    let location_data = loc['city'] + ', ' + loc['region'] + ' ' + loc['postalCode'];
    let time = 'UTC ' + loc['timezone'];
    let lat = Number(loc['lat']);
    let lng = Number(loc['lng']);
    let isp = data['isp'];

    ip_text.innerHTML = ip;
    location_text.innerHTML = location_data;
    timezone_text.innerHTML = time;
    isp_text.innerHTML = isp;

    if(map === undefined){
        map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }
    else
        map.setView([lat, lng], 13);    

    if(firstTime){
        L.marker([lat, lng]).addTo(map)
            .bindPopup('You are <br> here.')
            .openPopup();
    }else{
        if(marker === undefined){
            marker = L.marker([lat, lng]).addTo(map)
            .openPopup();
        }
        else{
            marker.setLatLng([lat, lng]);
        }
    }
}
