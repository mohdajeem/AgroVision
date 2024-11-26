
const express = require('express');
const multer = require('multer');  // To handle file uploads
const axios = require('axios');    // To send requests to Flask
const path = require('path');
const ejs = require('ejs');        // EJS templating engine
const fs = require('fs');          // File system module
const FormData = require('form-data'); // To handle form-data in axios

const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like CSS) from 'public' folder
app.use(express.static('public'));

// Set up multer for file handling (uploads folder)
const upload = multer({ dest: 'uploads/' });

// Route to display the form
app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'index.html'));
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/predict_disease', (req, res) => {
    return res.render('predict.ejs')
})
// Route to handle form submission
app.post('/analyze', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.send('No file uploaded.');
    }

    console.log(`File uploaded at: ${req.file.path}`);
    const imagePath = req.file.path;

    // Check if the file exists and is accessible
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File does not exist at: ${imagePath}`);
            return res.send('File upload failed.');
        }

        console.log(`File exists at: ${imagePath}`);

        const formData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));

        // Post request to Flask server
        axios.post('http://127.0.0.1:5000/predict_disease', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            const { crop, disease } = response.data;
            console.log(`Prediction result: Crop - ${crop}, Disease - ${disease}`);
            res.render('result', { crop, disease });
        })
        .catch(error => {
            console.error("Error occurred while analyzing the image:", error.response ? error.response.data : error.message);
            res.send('Error occurred while analyzing the image.');
        });
    });
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// const express = require('express');
// const multer = require('multer');  // To handle file uploads
// const axios = require('axios');    // To send requests to Flask
// const path = require('path');
// const ejs = require('ejs');        // EJS templating engine
// const fs = require('fs');          // File system module
// const FormData = require('form-data'); // To handle form-data in axios

// const app = express();
// const port = 3000;

// // Set EJS as the templating engine
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Serve static files (like CSS) from 'public' folder
// app.use(express.static('public'));

// // Set up multer for file handling (uploads folder)
// const upload = multer({ dest: 'uploads/' });

// // Route to display the form
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Route to handle file uploads and send it to Flask for analysis
// app.post('/analyze', upload.single('image'), (req, res) => {
//     if (!req.file) {
//         return res.send('No file uploaded.');
//     }

//     const imagePath = req.file.path;

//     // Create a FormData object and append the image file
//     const formData = new FormData();
//     formData.append('image', fs.createReadStream(imagePath)); // Attach image file to formData

//     // Send the image to Flask for prediction
//     axios.post('http://127.0.0.1:5000/predict_disease', formData, {
//         headers: {
//             ...formData.getHeaders()  // Set appropriate headers for form-data
//         }
//     })
//     .then(response => {
//         const { crop, disease } = response.data;
//         // Render the result using EJS template
//         res.render('result', { crop, disease });
//     })
//     .catch(error => {
//         console.error(error);
//         res.send('Error occurred while analyzing the image.');
//     });
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
