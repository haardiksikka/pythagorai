const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

/**
 * Checks if Python and a specific module are available
 * @param {string} module - Module to check
 * @returns {Promise<boolean>} - True if module is available
 */
const isPythonModuleAvailable = (module) => {
  return new Promise((resolve) => {
    console.log(`Checking if Python module ${module} is available...`);
    const pythonProcess = spawn('python', [
      '-c', 
      `try:
    import ${module}
    print("Module available")
except ImportError:
    print("Module not available")`
    ]);
    
    let output = '';
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    pythonProcess.on('close', () => {
      resolve(output.includes("Module available"));
    });
  });
};

/**
 * Simulates GNN-FakeNews analysis with a mock response
 * @param {string} text - Tweet text to analyze
 * @returns {Object} - Mock analysis results
 */
const mockAnalyzeTweet = (text) => {
  console.log('Using mock analysis since Python dependencies are not available');
  
  // Simple mock algorithm based on text characteristics
  // This is only for development/testing when GNN-FakeNews is unavailable
  const indicators = [
    'fake', 'conspiracy', 'shocking', 'they dont want you to know',
    'secret', 'banned', 'censored', 'msm wont report', 'share before deleted'
  ];
  
  let score = 0.5; // Default neutral score
  
  // Calculate simple score based on presence of suspicious phrases
  const lowerText = text.toLowerCase();
  for (const indicator of indicators) {
    if (lowerText.includes(indicator)) {
      score += 0.1; // Increase fake likelihood for each suspicious phrase
    }
  }
  
  // Check for multiple exclamation marks or all caps (common in fake news)
  if (text.includes('!!!')) score += 0.05;
  if (text === text.toUpperCase() && text.length > 10) score += 0.05;
  
  // Cap the score at 0.9 for mock results
  score = Math.min(score, 0.9);
  
  return {
    isFakeNews: score > 0.6,
    confidenceScore: score
  };
};

/**
 * Executes a Python script with the GNN-FakeNews library to analyze a tweet
 * Falls back to mock analysis if Python dependencies are not available
 * @param {string} text - The tweet text to analyze
 * @returns {Promise<Object>} - Analysis results with isFakeNews and confidenceScore
 */
const analyzeTweetWithGNN = async (text) => {
  try {
    // Check if numpy is available (one of the key dependencies)
    const isNumPyAvailable = await isPythonModuleAvailable('numpy');
    const isTorchAvailable = await isPythonModuleAvailable('torch');
    
    if (!isNumPyAvailable || !isTorchAvailable) {
      console.log('Required Python modules not available. Using mock analysis.');
      return mockAnalyzeTweet(text);
    }
    
    return new Promise((resolve, reject) => {
      // Path to the Python script that will use GNN-FakeNews
      const scriptPath = path.join(__dirname, '../scripts/analyze_tweet.py');

      console.log(`Running Python script: ${scriptPath}`);

      // Spawn a Python process
      const pythonProcess = spawn('python', [scriptPath, text]);

      let result = '';
      let errorOutput = '';

      // Collect data from stdout
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      // Collect error data if any
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error(`Python error: ${data.toString()}`);
      });

      // Handle process completion
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.log('Python script failed. Falling back to mock analysis.');
          return resolve(mockAnalyzeTweet(text));
        }

        try {
          // Parse the JSON output from the Python script
          const analysisResult = JSON.parse(result);
          resolve(analysisResult);
        } catch (error) {
          console.error('Failed to parse Python output. Using mock analysis.');
          resolve(mockAnalyzeTweet(text));
        }
      });
    });
  } catch (error) {
    console.error(`Error in analyzeTweetWithGNN: ${error.message}. Using mock analysis.`);
    return mockAnalyzeTweet(text);
  }
};

module.exports = {
  analyzeTweetWithGNN,
  isPythonModuleAvailable,
  mockAnalyzeTweet
};