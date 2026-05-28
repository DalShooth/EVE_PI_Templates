#!/usr/bin/env python3
"""
EVE Online Planetary Interaction Template Validator

This script validates all JSON template files against the schema.
"""

import json
import os
import sys
import argparse
from pathlib import Path
from jsonschema import validate, ValidationError

def load_schema(schema_path):
    """Load the JSON schema from file."""
    try:
        with open(schema_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Schema file '{schema_path}' not found.")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in schema file: {e}")
        sys.exit(1)

def validate_file(file_path, schema):
    """Validate a single JSON file against the schema."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        validate(instance=data, schema=schema)
        return True, None
    except FileNotFoundError:
        return False, f"File not found: {file_path}"
    except json.JSONDecodeError as e:
        return False, f"Invalid JSON: {e}"
    except ValidationError as e:
        return False, f"Validation error: {e.message} at {' -> '.join(str(p) for p in e.path)}"

def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Validate EVE Online planetary interaction templates against JSON schema"
    )
    parser.add_argument(
        "folder_path",
        nargs="?",
        default="../PlanetaryInteractionTemplates",
        help="Path to folder containing JSON template files (default: ../PlanetaryInteractionTemplates)"
    )
    return parser.parse_args()

def get_templates_directory(folder_path):
    """Get and validate the templates directory path."""
    templates_dir = Path(folder_path).resolve()
    
    if not templates_dir.exists():
        print(f"Error: Templates directory '{templates_dir}' does not exist.")
        sys.exit(1)
    
    return templates_dir

def find_json_files(templates_dir):
    """Find all JSON files in the templates directory."""
    json_files = list(templates_dir.glob("*.json"))
    
    if not json_files:
        print(f"No JSON files found in {templates_dir}")
        sys.exit(1)
    
    return sorted(json_files)

def validate_all_files(json_files, schema):
    """Validate all JSON files and return results."""
    valid_count = 0
    invalid_count = 0
    
    for file_path in json_files:
        print(f"Validating: {file_path.name}")
        
        is_valid, error = validate_file(file_path, schema)
        
        if is_valid:
            print(f"  ✓ Valid")
            valid_count += 1
        else:
            print(f"  ✗ Invalid: {error}")
            invalid_count += 1
    
    return valid_count, invalid_count

def print_summary(valid_count, invalid_count, total_files):
    """Print validation summary."""
    print("=" * 60)
    print(f"Validation complete!")
    print(f"Valid files: {valid_count}")
    print(f"Invalid files: {invalid_count}")
    print(f"Total files: {total_files}")
    
    if invalid_count > 0:
        sys.exit(1)
    else:
        print("✓ All files are valid!")

def main():
    """Main validation function."""
    # Parse command line arguments
    args = parse_arguments()
    
    # Get the directory containing this script
    script_dir = Path(__file__).parent
    schema_path = script_dir / "planetary_interaction_schema.json"
    
    # Load the schema
    print("Loading schema...")
    schema = load_schema(schema_path)
    print("✓ Schema loaded successfully")
    
    # Get and validate templates directory
    templates_dir = get_templates_directory(args.folder_path)
    
    # Find JSON files
    json_files = find_json_files(templates_dir)
    print(f"\nFound {len(json_files)} JSON files to validate...")
    print("=" * 60)
    
    # Validate all files
    valid_count, invalid_count = validate_all_files(json_files, schema)
    
    # Print summary
    print_summary(valid_count, invalid_count, len(json_files))

if __name__ == "__main__":
    main() 