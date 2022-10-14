const asyncRequest = require("async-request");
const accessKey = "b42fb491ff574bf0bc1cf5acfb8828a0";
let cityName = "tokyo";
// get thong tin thoi tiet thong qua api
const getWeather = async (accessKey, cityName) => {
  const url = `http://api.weatherstack.com/current?access_key=${accessKey}&query=${cityName}`;
  try {
    const res = await asyncRequest(url);
    const data = JSON.parse(res.body);
    const weather = {
      isSusccess: true,
      name: data.location.name,
      country: data.location.country,
      weatherIcon: data.current.weather_icons[0],
      temperature: data.current.temperature,
      weatherDescription: data.current.weather_descriptions[0],
      windSpeed: data.current.wind_speed,
      couldcover: data.current.cloudcover,
      precip: data.current.precip,
    };
    return weather;
  } catch (error) {
    return {
      isSuccess: false,
      error,
    };
  }
};

// dung server
// lay thu vien express
const express = require("express");
// tao mot ung dung express js
const app = express();

//! setting static file
const path = require("path"); //! thu vien co sang khi cai dat nodejs
const pathPublic = path.join(__dirname, "../public"); //!__dirname la duong dan toi file dang code (index.js);
app.use(express.static(pathPublic));

//tao chuong trinh hello world
// http://localhost:port/
app.get("/", async (req, res) => {
  const params = req.query;
  const address = params.address;
  const weather = await getWeather(accessKey, address);
  if (address) {
    res.render("weather", {
      //! truyen tham so qua trang hbs
      status: true,
      name: weather.name,
      country: weather.country,
      temperature: weather.temperature,
      weatherDescription: weather.weatherDescription,
      windSpeed: weather.windSpeed,
      couldcover: weather.couldcover,
      weatherIcon: weather.weatherIcon,
      precip: weather.precip,
    });
  } else {
    res.render("weather", {
      status: false,
    });
  }
});

// su dung cong nghe render trang html ra mam hinh
app.set("view engine", "hbs");

// muong ung dung chay tren moi truong web browser nen thi thiet lap nhu duoi
const port = 7000;
app.listen(port, () => {
  console.log(`app run on http://localhost:${port}`);
});
