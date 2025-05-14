#!/usr/bin/env python3
import re
import json
import argparse
import os
import sys


def unescape_ruby_string(s):
    """Unescape Ruby string literals with escaped characters."""
    return (s.replace('\\"', '"')
             .replace("\\'", "'")
             .replace("\\n", "\n")
             .replace("\\\\", "\\"))


def extract_ruby_array_items(array_content):
    """Extract items from a Ruby array/hash content."""
    # For debugging intermediate content
    if len(array_content) > 500:
        print(f"Processing array content with length {len(array_content)}")
        print(f"Content starts with: {array_content[:100]}...")
        print(f"Content ends with: ...{array_content[-100:]}")
    
    items = []
    current_item = ""
    depth = 0
    in_string = False
    escape_next = False
    
    i = 0
    while i < len(array_content):
        char = array_content[i]
        
        if escape_next:
            current_item += char
            escape_next = False
            i += 1
            continue
            
        if char == "\\":
            current_item += char
            escape_next = True
            i += 1
            continue
            
        if char == '"' and not in_string:
            current_item += char
            in_string = True
            i += 1
            continue
            
        if char == '"' and in_string:
            current_item += char
            in_string = False
            i += 1
            continue
            
        if in_string:
            current_item += char
            i += 1
            continue
            
        if char in "{[":
            current_item += char
            depth += 1
        elif char in "}]":
            current_item += char
            depth -= 1
        elif char == "," and depth == 0:
            # Complete item found
            items.append(current_item.strip())
            current_item = ""
        else:
            current_item += char
        
        i += 1
    
    # Add the last item if not empty
    if current_item.strip():
        items.append(current_item.strip())
    
    # Print the number of items found and first item for debugging
    if len(items) > 0:
        print(f"Found {len(items)} items in array")
        if len(items[0]) > 200:
            print(f"First item starts with: {items[0][:100]}...")
        else:
            print(f"First item: {items[0]}")
    
    return items


def extract_value_from_ruby_hash(hash_content, key):
    """Extract a value for a given key from a Ruby hash string."""
    # Look for the key pattern
    key_pattern = fr'"{key}"\s*=>\s*'
    match = re.search(key_pattern, hash_content)
    
    if not match:
        return None
        
    start_idx = match.end()
    value = ""
    in_string = False
    in_array = 0
    in_hash = 0
    escape_next = False
    
    # Determine if it's a simple value (string, number) or complex (hash, array)
    if hash_content[start_idx:].lstrip().startswith('"'):
        # String value
        i = start_idx
        while i < len(hash_content):
            char = hash_content[i]
            
            if escape_next:
                value += char
                escape_next = False
                i += 1
                continue
                
            if char == "\\":
                value += char
                escape_next = True
                i += 1
                continue
                
            if char == '"' and not in_string:
                in_string = True
                value += char
                i += 1
                continue
                
            if char == '"' and in_string:
                value += char
                i += 1
                # End of string found
                break
                
            value += char
            i += 1
    
    elif hash_content[start_idx:].lstrip().startswith('{'):
        # Hash value
        i = start_idx + hash_content[start_idx:].find('{')
        value += '{'
        in_hash = 1
        
        i += 1
        while i < len(hash_content) and in_hash > 0:
            char = hash_content[i]
            
            if escape_next:
                value += char
                escape_next = False
                i += 1
                continue
                
            if char == "\\":
                value += char
                escape_next = True
                i += 1
                continue
                
            if char == '"' and not in_string:
                in_string = True
                value += char
                i += 1
                continue
                
            if char == '"' and in_string:
                in_string = False
                value += char
                i += 1
                continue
                
            if not in_string:
                if char == '{':
                    in_hash += 1
                elif char == '}':
                    in_hash -= 1
            
            value += char
            i += 1
    
    elif hash_content[start_idx:].lstrip().startswith('['):
        # Array value
        i = start_idx + hash_content[start_idx:].find('[')
        value += '['
        in_array = 1
        
        i += 1
        while i < len(hash_content) and in_array > 0:
            char = hash_content[i]
            
            if escape_next:
                value += char
                escape_next = False
                i += 1
                continue
                
            if char == "\\":
                value += char
                escape_next = True
                i += 1
                continue
                
            if char == '"' and not in_string:
                in_string = True
                value += char
                i += 1
                continue
                
            if char == '"' and in_string:
                in_string = False
                value += char
                i += 1
                continue
                
            if not in_string:
                if char == '[':
                    in_array += 1
                elif char == ']':
                    in_array -= 1
            
            value += char
            i += 1
    
    else:
        # Number, nil, or boolean value (simple token until comma or end)
        i = start_idx
        while i < len(hash_content):
            char = hash_content[i]
            if char == ',' or char == '}':
                break
            value += char
            i += 1
    
    return value.strip()


def parse_ruby_hash(hash_content):
    """Parse a Ruby hash string into a Python dictionary."""
    result = {}
    
    # Extract keys from the hash
    keys = re.findall(r'"([^"]+)"\s*=>', hash_content)
    
    for key in keys:
        value_str = extract_value_from_ruby_hash(hash_content, key)
        if value_str is None:
            continue
            
        # Parse the value based on its type
        if value_str.startswith('"') and value_str.endswith('"'):
            # String value
            result[key] = unescape_ruby_string(value_str[1:-1])
        elif value_str.startswith('{') and value_str.endswith('}'):
            # Hash value
            result[key] = parse_ruby_hash(value_str)
        elif value_str.startswith('[') and value_str.endswith(']'):
            # Array value
            items = extract_ruby_array_items(value_str[1:-1])
            result[key] = [parse_ruby_value(item) for item in items]
        elif value_str.isdigit():
            # Integer value
            result[key] = int(value_str)
        elif value_str == "nil":
            # Nil value
            result[key] = None
        elif value_str == "true":
            # Boolean true
            result[key] = True
        elif value_str == "false":
            # Boolean false
            result[key] = False
        else:
            # Default to string
            result[key] = value_str
    
    return result


def parse_ruby_value(value_str):
    """Parse a Ruby value string into an appropriate Python object."""
    value_str = value_str.strip()
    
    if value_str.startswith('"') and value_str.endswith('"'):
        # String value
        return unescape_ruby_string(value_str[1:-1])
    elif value_str.startswith('{') and value_str.endswith('}'):
        # Hash value
        return parse_ruby_hash(value_str)
    elif value_str.startswith('[') and value_str.endswith(']'):
        # Array value
        items = extract_ruby_array_items(value_str[1:-1])
        return [parse_ruby_value(item) for item in items]
    elif value_str.isdigit():
        # Integer value
        return int(value_str)
    elif value_str == "nil":
        # Nil value
        return None
    elif value_str == "true":
        # Boolean true
        return True
    elif value_str == "false":
        # Boolean false
        return False
    else:
        # Default to string
        return value_str


def extract_logs_mock_data(ruby_content, debug=False):
    """Extract and parse logs_mock_data from Ruby content."""
    # Find the logs_mock_data method
    method_match = re.search(r'def logs_mock_data[^{]*{([\s\S]*?)}\s*end', ruby_content)
    if not method_match:
        raise ValueError("logs_mock_data method not found in the Ruby file")
    
    method_content = method_match.group(1)
    if debug:
        print(f"Found logs_mock_data method with {len(method_content)} characters")
    
    # Direct parsing of the entire Ruby hash
    return parse_ruby_hash(method_content)


def extract_sessions_mock_data(ruby_content, debug=False):
    """Extract and parse sessions_mock_data from Ruby content."""
    # Find the sessions_mock_data method
    method_match = re.search(r'def sessions_mock_data[^{]*{([\s\S]*?)}\s*end', ruby_content)
    if not method_match:
        if debug:
            print("sessions_mock_data method not found")
        return None  # Sessions mock data might not exist

    method_content = method_match.group(1)
    if debug:
        print(f"Found sessions_mock_data method with {len(method_content)} characters")
    
    # Direct parsing of the entire Ruby hash
    return parse_ruby_hash(method_content)


def main():
    parser = argparse.ArgumentParser(description='Convert Ruby mock data to JSON')
    parser.add_argument('input_file', help='Path to Ruby mock data file')
    parser.add_argument('--output', '-o', help='Path to output JSON file (default: derived from input filename)')
    parser.add_argument('--debug', '-d', action='store_true', help='Enable debug output')
    parser.add_argument('--verbose', '-v', action='store_true', help='Enable verbose output with content snippets')
    
    args = parser.parse_args()
    debug = args.debug or args.verbose
    
    # Set default output filename if not provided
    if not args.output:
        base_name = os.path.splitext(os.path.basename(args.input_file))[0]
        args.output = f"{base_name}.json"
    
    # Read the Ruby file
    try:
        with open(args.input_file, 'r', encoding='utf-8') as f:
            ruby_content = f.read()
        if debug:
            print(f"Read {len(ruby_content)} characters from {args.input_file}")
    except Exception as e:
        print(f"Error reading input file: {e}", file=sys.stderr)
        return 1
    
    # Extract and parse mock data
    data = {}
    try:
        # Try to extract logs_mock_data
        try:
            logs_data = extract_logs_mock_data(ruby_content, debug)
            data.update(logs_data)
            if debug:
                if 'results' in logs_data:
                    print(f"Successfully extracted logs_mock_data with {len(logs_data['results'])} results")
                else:
                    print("logs_mock_data extracted but 'results' key not found")
        except Exception as e:
            print(f"Error extracting logs_mock_data: {e}", file=sys.stderr)
            if debug:
                import traceback
                traceback.print_exc()
        
        # Try to extract sessions_mock_data
        try:
            sessions_data = extract_sessions_mock_data(ruby_content, debug)
            if sessions_data:
                data.update(sessions_data)
                if debug:
                    if 'sessions' in sessions_data:
                        print(f"Successfully extracted sessions_mock_data with {len(sessions_data['sessions'])} sessions")
                    else:
                        print("sessions_mock_data extracted but 'sessions' key not found")
        except Exception as e:
            print(f"Error extracting sessions_mock_data: {e}", file=sys.stderr)
            if debug:
                import traceback
                traceback.print_exc()
        
        # Check if we extracted any data
        if not data:
            print("No data could be extracted from the Ruby file", file=sys.stderr)
            return 1
        
    except Exception as e:
        print(f"Error processing Ruby content: {e}", file=sys.stderr)
        if debug:
            import traceback
            traceback.print_exc()
        return 1
    
    # Write the JSON output
    try:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print(f"Successfully converted {args.input_file} to {args.output}")
    except Exception as e:
        print(f"Error writing output file: {e}", file=sys.stderr)
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main()) 