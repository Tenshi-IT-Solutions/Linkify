# Execution Scripts

This directory contains deterministic Python scripts used by the Agent.

## Rules for Scripts
1. **Deterministic**: Given the same input, they must produce the same output (or fail predictably).
2. **Arguments**: Use `argparse` to handle command-line arguments.
3. **Environment**: Use `python-dotenv` to load `.env` variables if needed.
4. **Intermediate Files**: Write all temporary files to `../.tmp/`.
5. **Output**: Print results to stdout as JSON or structured text if possible, or save to a file and print the path.
6. **Error Handling**: Print clear errors to stderr and exit with non-zero status code on failure.

## Example `hello_world.py` structure
```python
import argparse
import os

def main():
    parser = argparse.ArgumentParser(description="Example script")
    parser.add_argument("--name", required=True, help="Name to greet")
    args = parser.parse_args()

    # Logic
    greeting = f"Hello, {args.name}!"
    
    # Check .tmp exists
    os.makedirs("../.tmp", exist_ok=True)
    
    # Write output
    with open("../.tmp/greeting.txt", "w") as f:
        f.write(greeting)
        
    print(f"Greeting written to .tmp/greeting.txt")

if __name__ == "__main__":
    main()
```
