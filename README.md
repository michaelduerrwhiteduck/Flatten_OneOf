# OpenAPI oneOf Flattener

This script processes an OpenAPI document in JSON format and flattens any `oneOf` arrays that contain only a single `$ref` object.

## Example

It transforms structures like:

```json
"oneOf": [
    {
      "$ref": "#/components/schemas/TemplateDto"
    }
]
```

into:

```json
"$ref": "#/components/schemas/TemplateDto"
```

## Usage

### Command Line

```bash
node flatten-oneof.js <input-file-path> [output-file-path]
```

If no output file path is provided, the result will be saved as `<input-filename>-flattened.json` in the same directory.

### As a Module

```javascript
const { flattenSingleOneOf } = require('./flatten-oneof');

flattenSingleOneOf('input.json', 'output.json');
```

## Test

A test OpenAPI document is included in this repository. To test the function, run:

```bash
node flatten-oneof.js test-openapi.json
```

This will create a new file called `test-openapi-flattened.json` with the processed content.
