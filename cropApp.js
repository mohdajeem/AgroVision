// const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');
// const axios = require('axios'); // To send HTTP requests
// const app = express();

// // Body parser middleware to parse form data
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Serve static files (like HTML) from 'public' folder
// app.use(express.static(path.join(__dirname, 'public')));

// // Route to serve the home page (index.html)
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Route to handle form submission and send data to Flask API
// app.post('/predict_crop', (req, res) => {
//     // Extract form data sent by the user
//     const { Nitrogen, Phosporus, Potassium, Temperature, Humidity, Ph, Rainfall } = req.body;

//     // Send a POST request to the Flask API running on localhost:5000 (or other URL if hosted remotely)
//     axios.post('http://127.0.0.1:5000/predict', {
//         Nitrogen: Nitrogen,
//         Phosporus: Phosporus,
//         Potassium: Potassium,
//         Temperature: Temperature,
//         Humidity: Humidity,
//         Ph: Ph,
//         Rainfall: Rainfall
//     })
//     .then(response => {
//         // Render result from Flask API in response
//         const result = response.data.result;  // Extracting the prediction result from Flask response
//         // res.send(`<h1>${result}</h1><a href="/">Go Back</a>`);
//         // res.render('index',{result : result});
//         res.sendFile(path.join(__dirname, 'public', 'index.html'));
//     })
//     .catch(error => {
//         console.error(error);
//         res.send(`<h1>Error: Could not make a prediction. Please try again later.</h1><a href="/">Go Back</a>`);
//     });
// });

// // Start the Node.js server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios'); // To send HTTP requests
const cors = require('cors');   // CORS middleware
const app = express();

// Enable CORS for all routes (you can restrict it to specific origins if needed)
app.use(cors());

// Body parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (like HTML) from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the home page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle form submission and send data to Flask API
app.post('/predict_crop', (req, res) => {
    // Extract form data sent by the user
    const { Nitrogen, Phosporus, Potassium, Temperature, Humidity, Ph, Rainfall } = req.body;
    console.log(req.body);
    // Send a POST request to the Flask API running on localhost:5000 (or other URL if hosted remotely)
    axios.post('http://127.0.0.1:5000/predict', {
        Nitrogen: Nitrogen,
        Phosporus: Phosporus,
        Potassium: Potassium,
        Temperature: Temperature,
        Humidity: Humidity,
        Ph: Ph,
        Rainfall: Rainfall
    })
    .then(response => {
        // Render result from Flask API in response
        const result = response.data.result;  // Extracting the prediction result from Flask response
        // You could render the result dynamically or serve it on the page
        console.log(result)
        res.json({ result: result });
        // res.render('index.html',{result : result})
    })
    .catch(error => {
        console.error('Error in POST /predict_crop:', error);
        res.status(500).send('Error: Could not make a prediction. Please try again later.');
    });
});

// Start the Node.js server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
