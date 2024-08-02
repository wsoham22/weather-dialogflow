const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const city = req.body.queryResult.parameters.city;  
  
  if (!city) {
    return res.json({
      fulfillmentText: "Please specify a city to get the weather information."
    });
  }
  
  try {
    const apiKey = '650e1c3c706df2f707579f993bf801de'; 
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`);
    const weather = response.data;
    
    const temperature = weather.main.temp;
    const condition = weather.weather[0].description;
    const cityName = weather.name;

    // Formulate response
    const fulfillmentText = `The current weather in ${cityName} is ${condition} with a temperature of ${temperature}°F.`;
    
    res.json({
      fulfillmentText: fulfillmentText
    });
  } catch (error) {
    console.error(error);
    res.json({
      fulfillmentText: "Sorry, I couldn't fetch the weather information right now."
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
