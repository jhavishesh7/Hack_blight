// Example API endpoint for disease detection
// This is a Node.js/Express example - adapt it to your backend framework

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Disease detection endpoint
app.post('/api/disease-detection', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = req.file.path;
    
    // TODO: Replace this with your actual model prediction
    // Example integration with your trained model:
    
    // Option 1: If using Python model with child_process
    // const { spawn } = require('child_process');
    // const pythonProcess = spawn('python', ['disease_detection.py', imagePath]);
    
    // Option 2: If using TensorFlow.js
    // const tf = require('@tensorflow/tfjs-node');
    // const model = await tf.loadLayersModel('file://./path/to/your/model');
    
    // Option 3: If using ONNX Runtime
    // const ort = require('onnxruntime-node');
    // const session = await ort.InferenceSession.create('./path/to/your/model.onnx');
    
    // For now, returning mock data
    const mockPrediction = {
      disease: 'Leaf Spot Disease',
      confidence: 87.5,
      description: 'A fungal disease that causes circular or irregular brown spots on leaves. The spots may have yellow halos and can cause leaves to drop prematurely.',
      treatment: 'Remove infected leaves, improve air circulation, avoid overhead watering, and apply fungicide if necessary.',
      severity: 'medium'
    };

    // Clean up uploaded file
    fs.unlinkSync(imagePath);

    res.json(mockPrediction);
  } catch (error) {
    console.error('Error in disease detection:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

// Get disease information endpoint
app.get('/api/diseases/:id', (req, res) => {
  const diseaseId = req.params.id;
  
  // TODO: Replace with database lookup
  const diseaseInfo = {
    id: diseaseId,
    name: 'Leaf Spot Disease',
    symptoms: ['Brown spots on leaves', 'Yellow halos around spots', 'Premature leaf drop'],
    causes: ['Fungal infection', 'Poor air circulation', 'Overhead watering'],
    prevention: ['Improve air circulation', 'Avoid overhead watering', 'Remove infected leaves'],
    treatment: ['Remove infected leaves', 'Apply fungicide', 'Improve growing conditions']
  };

  res.json(diseaseInfo);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Disease detection API running on port ${PORT}`);
});

// Example Python integration (disease_detection.py)
/*
import sys
import numpy as np
from PIL import Image
import tensorflow as tf

def predict_disease(image_path):
    # Load your trained model
    model = tf.keras.models.load_model('path/to/your/model.h5')
    
    # Preprocess image
    img = Image.open(image_path)
    img = img.resize((224, 224))  # Adjust size based on your model
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    # Make prediction
    prediction = model.predict(img_array)
    
    # Map prediction to disease classes
    disease_classes = ['Healthy', 'Leaf Spot', 'Powdery Mildew', 'Rust']
    predicted_class = disease_classes[np.argmax(prediction)]
    confidence = float(np.max(prediction) * 100)
    
    return {
        'disease': predicted_class,
        'confidence': confidence,
        'description': get_disease_description(predicted_class),
        'treatment': get_disease_treatment(predicted_class),
        'severity': get_disease_severity(predicted_class)
    }

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python disease_detection.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    result = predict_disease(image_path)
    print(result)
*/ 