from flask import Flask, request, render_template, jsonify
import torch
import timm
from PIL import Image
from torchvision import transforms as T
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Crop classes
classes = {
    'Corn___Common_Rust': 0,
    'Corn___Gray_Leaf_Spot': 1,
    'Corn___Healthy': 2,
    'Corn___Northern_Leaf_Blight': 3,
    'Potato___Early_Blight': 4,
    'Potato___Healthy': 5,
    'Potato___Late_Blight': 6,
    'Rice___Brown_Spot': 7,
    'Rice___Healthy': 8,
    'Rice___Leaf_Blast': 9,
    'Rice___Neck_Blast': 10,
    'Sugarcane_Bacterial_Blight': 11,
    'Sugarcane_Healthy': 12,
    'Sugarcane_Red_Rot': 13,
    'Wheat___Brown_Rust': 14,
    'Wheat___Healthy': 15,
    'Wheat___Yellow_Rust': 16
}


device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load the saved model
model = timm.create_model("rexnet_150", pretrained=False, num_classes=len(classes))
model.load_state_dict(torch.load("crop_best_model.pth", map_location=device))  # Use map_location
model = model.to(device).eval()  # Set the model to evaluation mode

#(resize, normalize)
mean, std, im_size = [0.485, 0.456, 0.406], [0.229, 0.224, 0.225], 224
tfs = T.Compose([T.Resize((im_size, im_size)), T.ToTensor(), T.Normalize(mean=mean, std=std)])

def predict_image(image, model, transformations, class_names):
    
    im = transformations(image).unsqueeze(0).to(device)  # Add batch dimension and map to device
    
    
    with torch.no_grad():
        preds = model(im)
        pred_class = torch.argmax(preds, dim=1).item()
    
    # Get predicted class name
    class_name = class_names[pred_class]
    
    return class_name

# @app.route('/')
# def home():
#     return render_template('index.html')

@app.route('/predict_disease', methods=['POST'])
def predict_disease():
    if 'image' not in request.files:
        return "No image file provided", 400

    image_file = request.files['image']
    if image_file.filename == '':
        return "No selected image", 400

    try:
        # Open image directly from the file object
        image = Image.open(image_file.stream).convert("RGB")
        
        # Predict using the model
        predicted_class = predict_image(image, model, tfs, list(classes.keys()))
        crop = predicted_class.split('_')[0]
        # disease = predicted_class.split('_')[-1]
        # Render the result
        # return render_template('predict_disease.html', predicted_class=predicted_class)
        print(predicted_class)
        print(predicted_class.split('_'))
        res = []
        for i in predicted_class.split('_'):
            if i == '':
                continue
            else:
                res.append(i)

        print(res)
        disease = ''
        for i in range(1,len(res)):
            disease+=res[i]+" "

        print(disease)
        # return render_template('predict_disease.html', crop=crop, disease = disease)
        return jsonify({"crop": crop, "disease": disease})
    except Exception as e:
        # return f"An error occurred: {e}", 500
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/goodbye')
def goodbye():
    return "Goodbye, have a nice day"

if __name__ == '__main__':
    app.run(debug=True)


