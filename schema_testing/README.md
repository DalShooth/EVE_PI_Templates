# EVE Online Planetary Interaction Template Schema

This directory contains tools for validating EVE Online planetary interaction templates.

## Files

- `planetary_interaction_schema.json` - The JSON schema that validates all template files
- `validate_templates.py` - Python script to validate all templates against the schema
- `requirements.txt` - Python dependencies for the validation script
- `SCHEMA_README.md` - This documentation file

## Schema Structure

The schema validates templates with the following structure:

### Root Object
- `CmdCtrLv` (integer): Command center level
- `Cmt` (string): Comment describing the template
- `Diam` (number): Planet diameter
- `L` (array): Array of links between facilities
- `P` (array): Array of pin positions on the planet
- `Pln` (integer): Planet ID
- `R` (array): Array of routes between facilities

### Link Objects (`L` array items)
- `D` (integer): Destination facility ID
- `Lv` (integer): Link level
- `S` (integer): Source facility ID

### Pin Objects (`P` array items)
- `H` (integer): Height/elevation
- `La` (number): Latitude coordinate
- `Lo` (number): Longitude coordinate
- `S` (integer|null): Structure ID (can be null for some pins)
- `T` (integer): Pin type ID

### Route Objects (`R` array items)
- `P` (array): Array of facility IDs in the route
- `Q` (integer): Quantity/amount
- `T` (integer): Route type ID

## Usage

### Using the Python Validator

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the validation script:
   ```bash
   # Validate templates in the default location (../PlanetaryInteractionTemplates)
   python validate_templates.py
   
   # Validate templates in a specific folder
   python validate_templates.py /path/to/templates
   
   # Validate templates in the current directory
   python validate_templates.py .
   ```

The script will validate all JSON files in the specified directory against the schema.

### Command Line Options

- `folder_path` (optional): Path to folder containing JSON template files
  - Default: `../PlanetaryInteractionTemplates` (relative to the script location)
  - Can be absolute or relative path
  - Examples:
    - `python validate_templates.py` (uses default)
    - `python validate_templates.py /path/to/templates`
    - `python validate_templates.py ../other_templates`

### Using the Schema Directly

You can use the schema with any JSON schema validator:

```python
import json
from jsonschema import validate

# Load your template
with open('template.json', 'r') as f:
    template = json.load(f)

# Load the schema
with open('planetary_interaction_schema.json', 'r') as f:
    schema = json.load(f)

# Validate
validate(instance=template, schema=schema)
```

## Template Types

The schema supports various types of templates including:

1. **Factory Templates**: Templates for manufacturing facilities
   - Example: `Factory – Barren - Biocells`

2. **Miner Templates**: Templates for extraction facilities
   - Example: `Miner – 00 – Bacteria`

## Validation Features

- **Type checking**: Ensures all fields have correct data types
- **Required fields**: Ensures all required fields are present
- **Array constraints**: Validates minimum/maximum array lengths
- **Null handling**: Properly handles nullable structure IDs in pin objects

## Error Reporting

The validation script provides detailed error reporting:
- File-level validation results
- Specific field validation errors
- JSON parsing errors
- Missing file errors

All validation errors include the exact path to the problematic field for easy debugging. 