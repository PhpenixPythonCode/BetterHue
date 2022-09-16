function getList(){
    var request = new XMLHttpRequest();
    request.open('GET', '/getlightjson', false);
    request.send(null);

    if (request.status === 200) {
        return JSON.parse(request.responseText)
    }
}

function load(){
    const lightJSON = getList()
    Object.keys(lightJSON).forEach(key => {
        const light = lightJSON[key]

        const lightDiv = document.createElement('div')
        lightDiv.innerText = light.name
        if(light.state.xy){
            var x = light.state.xy[0]
            var y = light.state.xy[1]
            lightDiv.style.backgroundColor = xyBriToRgb(x, y, light.state.bri)
            if(lightOrDark(xyBriToRgb(x, y, light.state.bri)) == 'light'){
                lightDiv.style.color = '#000'
                console.log('light')
            }else{
                lightDiv.style.color = '#fff'
                console.log('dark')
            }
        }
        if(light.state.on == false){
            lightDiv.style.backgroundColor = '#000000'
            lightDiv.style.color = "#ffffff"
        }
        
        lightDiv.classList.add('light')
        document.getElementById("light-list").appendChild(lightDiv)
        var lightOn = light.state.on
        lightDiv.onclick = () => {
            toggleLight(key, lightOn)
        }
        lightDiv.setAttribute("id", key)
    });
}

function toggleLight(key, lightOn){
    lightOn = !lightOn
    if(lightOn == true){
        turnOnLight(key)
    }else{
        turnOffLight(key)
    }
}

function turnOnLight(key){
    var http = new XMLHttpRequest();
    var url = '/lighton';
    var params = 'key='+key;
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            console.log(http.responseText);
            
            var request = new XMLHttpRequest();
            request.open('GET', `http://192.168.4.53/api/aaRgRe-qO60KJhpdrDzzKvP-63vy6XKjgXA2f82B/lights/${key}`, false);
            request.send(null);

            if (request.status === 200) {
                var light = JSON.parse(request.responseText)
                const lightDiv = document.getElementById(key)
                if(light.state.xy){
                    var x = light.state.xy[0]
                    var y = light.state.xy[1]
                    lightDiv.style.backgroundColor = xyBriToRgb(x, y, light.state.bri)
                    if(lightOrDark(xyBriToRgb(x, y, light.state.bri)) == 'light'){
                        lightDiv.style.color = '#000'
                        console.log('light')
                    }else{
                        lightDiv.style.color = '#fff'
                        console.log('dark')
                    }
                }
                if(light.state.on == false){
                    lightDiv.style.backgroundColor = '#000000'
                    lightDiv.style.color = "#ffffff"
                }
                var lightOn = light.state.on
                lightDiv.onclick = () => {
                    toggleLight(key, lightOn)
                }
            }
        }
    }
    http.send(params);
}

function turnOffLight(key){
    var http = new XMLHttpRequest();
    var url = '/lightoff';
    var params = 'key='+key;
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            console.log(http.responseText);
            
            var request = new XMLHttpRequest();
            request.open('GET', `http://192.168.4.53/api/aaRgRe-qO60KJhpdrDzzKvP-63vy6XKjgXA2f82B/lights/${key}`, false);
            request.send(null);

            if (request.status === 200) {
                var light = JSON.parse(request.responseText)
                const lightDiv = document.getElementById(key)
                if(light.state.xy){
                    var x = light.state.xy[0]
                    var y = light.state.xy[1]
                    lightDiv.style.backgroundColor = xyBriToRgb(x, y, light.state.bri)
                    if(lightOrDark(xyBriToRgb(x, y, light.state.bri)) == 'light'){
                        lightDiv.style.color = '#000'
                        console.log('light')
                    }else{
                        lightDiv.style.color = '#fff'
                        console.log('dark')
                    }
                }
                if(light.state.on == false){
                    lightDiv.style.backgroundColor = '#000000'
                    lightDiv.style.color = "#ffffff"
                }
                var lightOn = light.state.on
                lightDiv.onclick = () => {
                    toggleLight(key, lightOn)
                }
            }
        }
    }
    http.send(params);

}

function lightOrDark(color) {

    // Variables for red, green, blue values
    var r, g, b, hsp;
    
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        
        r = color[1];
        g = color[2];
        b = color[3];
    } 
    else {
        
        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp>127.5) {

        return 'light';
    } 
    else {

        return 'dark';
    }
}

function xyBriToRgb(x, y, bri)
{
    z = 1.0 - x - y;

    Y = bri / 255.0; // Brightness of lamp
    X = (Y / y) * x;
    Z = (Y / y) * z;
    r = X * 1.612 - Y * 0.203 - Z * 0.302;
    g = -X * 0.509 + Y * 1.412 + Z * 0.066;
    b = X * 0.026 - Y * 0.072 + Z * 0.962;
    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
    maxValue = Math.max(r,g,b);
    r /= maxValue;
    g /= maxValue;
    b /= maxValue;
    r = r * 255;   if (r < 0) { r = 255 };
    g = g * 255;   if (g < 0) { g = 255 };
    b = b * 255;   if (b < 0) { b = 255 };

    r = Math.round(r).toString(16);
    g = Math.round(g).toString(16);
    b = Math.round(b).toString(16);

    if (r.length < 2)
        r="0"+r;        
    if (g.length < 2)
        g="0"+g;        
    if (b.length < 2)
        b="0"+r;        
    rgb = "#"+r+g+b;

    return rgb;             
}

load()