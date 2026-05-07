const fs = require('fs');
const path = require('path');

/**
 * Flattens all oneOf arrays in an OpenAPI document that contain only a single $ref
 * @param {string} inputFilePath - Path to the input OpenAPI JSON file
 * @param {string} outputFilePath - Path to save the processed file (optional, defaults to input-flattened.json)
 */
function flattenSingleOneOf(inputFilePath, outputFilePath) {
  // Set default output file path if not provided
  if (!outputFilePath) {
    const parsedPath = path.parse(inputFilePath);
    outputFilePath = path.join(parsedPath.dir, `${parsedPath.name}-flattened${parsedPath.ext}`);
  }

  try {
    // Read the OpenAPI document
    const openApiDoc = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));
    
    // Process the document recursively
    const processedDoc = processObject(openApiDoc);
    
    // Write the processed document
    fs.writeFileSync(outputFilePath, JSON.stringify(processedDoc, null, 2));
    
    console.log(`Successfully processed file. Output saved to: ${outputFilePath}`);
    return { success: true, outputPath: outputFilePath };
  } catch (error) {
    console.error('Error processing the OpenAPI document:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Recursively processes an object to find and flatten oneOf arrays
 * @param {object} obj - The object to process
 * @returns {object} - The processed object
 */
function processObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  // If it's an array, process each element
  if (Array.isArray(obj)) {
    return obj.map(item => processObject(item));
  }
  
  // Create a new object to avoid modifying the original
  const result = {};
  
  // Process each property
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'oneOf' && Array.isArray(value) && value.length === 1 && value[0].$ref) {
      // This is a oneOf with a single $ref, replace it with the direct $ref
      result.$ref = value[0].$ref;
    } else if (typeof value === 'object') {
      // Recursively process nested objects
      result[key] = processObject(value);
    } else {
      // Keep other properties as is
      result[key] = value;
    }
  }
  
  return result;
}

// Handle command line arguments if script is run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: node flatten-oneof.js <input-file> [output-file]');
    process.exit(1);
  }
  
  const inputFile = args[0];
  const outputFile = args[1];
  
  flattenSingleOneOf(inputFile, outputFile);
}

// Export the function for use as a module
module.exports = { flattenSingleOneOf };
