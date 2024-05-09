import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/weather", (req, res) => {
    res.render("weather", { message: null, cityName: null, maxTemp: null, minTemp: null });
});

app.get("/about", (req, res) => {
    res.render("about");
});


app.post("/weather", async (req, res) => {
    try {
      const { cityName } = req.body;
      const apiKey = "92567f1ccd68f9b1d3f66a54cdca4d52";
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`;
      
      const weatherResponse = await axios.get(weatherUrl);
      const weatherData = weatherResponse.data;

      if (weatherData.weather && weatherData.weather.length > 0) {
        const weatherCondition = weatherData.weather[0].main;
        const maxTemp = weatherData.main.temp_max;
        const minTemp = weatherData.main.temp_min;
        const message = weatherCondition === "Rain" ? "It will rain tomorrow in your location." : "It will not rain tomorrow in your location.";
        res.render("weather", { message, cityName, maxTemp, minTemp });
      } else {
        throw new Error("City not found or failed to fetch weather data.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.render("weather", { message: "City not found or failed to fetch weather data. Please try again.", cityName:"City not Found",maxTemp:"_",minTemp:"_"});
    }
  });
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
