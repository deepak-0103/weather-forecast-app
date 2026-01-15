const userLocation = document.getElementById('userLocation'),
converter = document.getElementById('converter'),
weatherIcon = document. querySelector('.weatherIcon'),
temperature = document.querySelector('.temperature'),
feelsLike = document.querySelector('.feelsLike'),
description = document.querySelector('.description'),
date = document.querySelector('.date'),
city = document.querySelector('.city'),
HValue = document.getElementById('HValue'),
WValue = document.getElementById('WValue'),
PValue = document.getElementById('PValue'),
SRValue = document.getElementById('SRValue'),
SSValue = document.getElementById('SSValue'),
CValue = document.getElementById('CValue'),
UVValue = document.getElementById('UVValue'),

forcast = document.querySelector('.forcast');

// WEATHER_DATA_ENDPOINT=`https://api.openweathermap.org/data/2.5/onecall?appid=a5bb4718b30b6f58f58697997567fffa&exclude=minutely&units=metric&`;
//
//https://api.openweathermap.org/data/2.5/weather?appid=a5bb4718b30b6f58f58697997567fffa&q=
WEATHER_API_ENDPOINT=`https://api.openweathermap.org/data/2.5/weather?appid=ded7384fa6c0c2041814c28285d0dc5f&q=`;
WEATHER_DATA_ENDPOINT=`https://api.openweathermap.org/data/3.0/onecall?appid=ded7384fa6c0c2041814c28285d0dc5f&exclude=minutely&units=metric&`;
function findUserLocation(){
    forcast.innerHTML= "";
    fetch(WEATHER_API_ENDPOINT+ userLocation.value)
    .then(res=>res.json())
    .then((data)=>{
        if(data.cod != "" && data.cod != 200)
            {
           alert(data.message);
            return;
            }
        console.log(data);

        city.innerHTML = data.name + ", " + data.sys.country;
        weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`; 
        fetch(WEATHER_DATA_ENDPOINT+ `lon=${data.coord.lon}&lat=${data.coord.lat}`)
        .then(res=>res.json())
        .then(async (data)=>{
         console.log(data);
         temperature.innerHTML = TemConverter(data.current.temp);
         feelsLike.innerHTML = "Feels like " + data.current.feels_like;
         description.innerHTML = `<i class = "fa-brands fa-cloudversify"></i> &nbsp;` + data.current.weather[0].description;
         const options= { 
            weekday: "long", 
            month: "long", 
            day: "numeric",
            hour12: true,
            hour : "numeric", 
        };
         date.innerHTML=await getLongFormateDateTime(
            data.current.dt,data.timezone_offset, 
            options);

         HValue.innerHTML = Math.round(data.current.humidity)+ "<span>%</span>";
         WValue.innerHTML= Math.round(data.current.wind_speed)+ "<span>m/s</span>"; 
         const options1= { 
            hour: "numeric", 
            minute: "numeric", 
            hour12: true, 
        };
         SRValue.innerHTML=await getLongFormateDateTime(data.current.sunrise,data.timezone_offset, options1);
         SSValue.innerHTML= await getLongFormateDateTime(data.current.sunset,data.timezone_offset, options1);

         CValue.innerHTML = data.current.clouds+ "<span>%</span>";
         UVValue.innerHTML =data.current.uvi;
         PValue.innerHTML =data.current.pressure+ "<span>hPa</span>";
         data.daily.forEach((weather)=>{
              let div = document.createElement("div");
              const options ={ 
                 weekday: "long",
                 month: "long",
                 day: "numeric",
                 hour12: true,
                 hour : "numeric",       
                 
                };
            
              let daily = getLongFormateDateTime(weather.dt, 0, options).split(" at ");
              div.innerHTML= daily[0];
              div.innerHTML = getLongFormateDateTime(weather.dt,0, options);
              div.innerHTML+= `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png"/>`;
              div.innerHTML+= `<p class="forcast-desc">${weather.weather[0].description}</p>`;
              div.innerHTML += `<span><span>${TemConverter(weather.temp.min)}</span> </span>`
              div.innerHTML += `<span><span>${TemConverter(weather.temp.max)}</span> </span>`
              forcast.append(div);
            });
 
         });
       
    })
}
function formatUnixTime(dtValue, offSet, option = {}) {
    const date = new Date((dtValue+offSet)*1000);
    return date.toLocaleTimeString([], {timeZone: "UTC", ...option });
}
function getLongFormateDateTime(dtValue, offSet, option) {
    return formatUnixTime(dtValue, offSet, option);

}

function TemConverter(temp){
    let temValue = Math.round(temp);
    let message = "";
    if(converter.value == "°C"){
        message = temValue + "<span>"+"\xB0C</span>";
    }
    else{
        let ctof = (temValue * 9)/5 + 32;
        message = ctof + "<span>"+"\xB0F</span>";
    }
    return message;

}   
