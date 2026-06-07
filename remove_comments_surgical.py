import re
import os

def remove_js_ts_comments(source):
    # This regex attempts to match strings and regexes first to avoid matching comments inside them.
    # Group 1, 2, 3: Strings and Template Literals
    # Group 4: Regex Literals
    # Group 5: JSX comments {/* ... */}
    # Group 6: Block comments /* ... */
    # Group 7: Inline comments // ...
    pattern = re.compile(
        r'("(?:\\.|[^"\\])*")|'          # 1: Double quoted strings
        r"('(?:\\.|[^'\\])*')|"          # 2: Single quoted strings
        r"(`(?:\\.|[^`\\]|\\`)*`)|"      # 3: Template literals
        r"(\/(?:\\.|[^\/\\])+\/)|"       # 4: Regex literals
        r"(\{\/\*[\s\S]*?\*\/\})|"       # 5: JSX comments
        r"(\/\*[\s\S]*?\*\/)|"           # 6: Block comments
        r"(\/\/[^\n]*)",                 # 7: Inline comments
        re.MULTILINE
    )
    
    def js_sub(match):
        # If we matched group 5, 6, or 7, it's a comment.
        comment = match.group(5) or match.group(6) or match.group(7)
        if comment:
            # Preserve TS directives
            if any(directive in comment for directive in ['@ts-ignore', '@ts-expect-error', '@ts-nocheck', '@ts-check']):
                return comment
            return ""
        # Otherwise, return the match as is (it's a string or regex).
        return match.group(0)
    
    # We run it multiple times if needed? No, sub should handle all.
    result = pattern.sub(js_sub, source)
    
    # Cleanup: remove lines that are now empty but weren't before? 
    # Or just leave them? The user said "correctly formatted".
    # Often, removing a comment line leaves a blank line. 
    # Multiple blank lines can be unsightly.
    # But let's stick to simple removal first.
    return result

def process_directory(dir_path):
    modified_files = []
    if not os.path.exists(dir_path):
        print(f"Directory not found: {dir_path}")
        return modified_files

    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js')):
                # Skip configuration files
                if file in ['config.server.ts', 'tailwind.config.js', 'vite.config.ts', 'eslint.config.js']:
                    print(f"Skipping config file: {file}")
                    continue
                
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = remove_js_ts_comments(content)
                    
                    if new_content != content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        modified_files.append(file_path)
                except Exception as e:
                    print(f"Failed to process {file_path}: {e}")
    return modified_files

directories = [
    "frontend/src/components",
    "frontend/src/hooks",
    "frontend/src/lib",
    "frontend/src/routes"
]

all_modified = []
for d in directories:
    full_path = os.path.join(os.getcwd(), d)
    all_modified.extend(process_directory(full_path))

print("\nModified files:")
for f in sorted(list(set(all_modified))):
    # Print relative path for cleaner output
    print(os.path.relpath(f, os.getcwd()))
