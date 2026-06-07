import re
import os
import io
import tokenize

def remove_python_comments_and_docstrings(source):
    """
    Removes Python comments and docstrings.
    Uses tokenize to safely distinguish between strings, docstrings, and comments.
    """
    io_obj = io.StringIO(source)
    out = ""
    prev_toktype = tokenize.INDENT
    last_lineno = -1
    last_col = 0
    
    tokens = tokenize.generate_tokens(io_obj.readline)
    
    # Heuristic for docstrings:
    # A string token is a docstring if it follows a COLON (for classes/functions) 
    # or if it's at the start of the module (before any other non-comment/non-newline tokens).
    
    can_be_docstring = True # At start of module
    
    for tok in tokens:
        token_type = tok.type
        token_string = tok.string
        start_line, start_col = tok.start
        end_line, end_col = tok.end
        
        # Preserve whitespace/newlines
        if start_line > last_lineno:
            last_col = 0
        if start_col > last_col:
            out += " " * (start_col - last_col)
        
        if token_type == tokenize.COMMENT:
            # Skip comments
            pass
        elif token_type == tokenize.STRING:
            # Check if it's a docstring
            if can_be_docstring and (prev_toktype in (tokenize.INDENT, tokenize.NEWLINE, tokenize.NL, tokenize.COLON)):
                # Skip docstring
                pass
            else:
                out += token_string
            
            # After any string, it's no longer the "start" of a block unless it was a docstring
            # But wait, if it WAS a docstring we skip it. If it WASN'T we keep it.
            # In either case, the next string won't be a docstring unless we hit a COLON.
            can_be_docstring = False
        else:
            out += token_string
            if token_type not in (tokenize.NEWLINE, tokenize.NL, tokenize.INDENT, tokenize.DEDENT):
                # If we hit a colon, the next string could be a docstring
                if token_type == tokenize.OP and token_string == ':':
                    can_be_docstring = True
                else:
                    can_be_docstring = False
        
        prev_toktype = token_type
        last_lineno = end_line
        last_col = end_col
        
    return out

def remove_js_ts_comments(source):
    pattern = re.compile(
        r'("(?:\\.|[^"\\])*")|'          # Double quoted strings
        r"('(?:\\.|[^'\\])*')|"          # Single quoted strings
        r"(`(?:\\.|[^`\\]|\\`)*`)|"      # Template literals
        r"(\/(?:\\.|[^\/\\])+\/)|"       # Regex literals
        r"(\/\*.*?\*\/)|"                # Block comments
        r"(\/\/.*)|"                     # Inline comments
        r"(\{\/\*.*?\*\/\})",            # JSX comments
        re.DOTALL | re.MULTILINE
    )
    
    def js_sub(match):
        if match.group(5) or match.group(6) or match.group(7):
            return ""
        return match.group(0)
    
    return pattern.sub(js_sub, source)

def remove_sql_comments(source):
    pattern = re.compile(
        r'("(?:\\.|[^"\\])*")|'  # Double quoted strings
        r"('(?:\\.|[^'\\])*')|"  # Single quoted strings
        r"(--.*)|"                # Inline comments
        r"(\/\*.*?\*\/)",        # Block comments
        re.DOTALL | re.MULTILINE
    )
    
    def sql_sub(match):
        if match.group(3) or match.group(4):
            return ""
        return match.group(0)
    
    return pattern.sub(sql_sub, source)

def remove_html_comments(source):
    return re.sub(r'<!--.*?-->', '', source, flags=re.DOTALL)

def process_file(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    print(f"Processing: {file_path}")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == '.py':
            new_content = remove_python_comments_and_docstrings(content)
        elif ext in ['.ts', '.tsx', '.js']:
            new_content = remove_js_ts_comments(content)
        elif ext == '.sql':
            new_content = remove_sql_comments(content)
        elif ext == '.html':
            new_content = remove_html_comments(content)
        else:
            new_content = content

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
    except Exception as e:
        print(f"Failed to process {file_path}: {e}")

files_to_process = [
    "main.py",
    "setup_db.py",
    "populate_db.py",
    "schema.sql",
    "index.html"
]

frontend_src = "frontend/src"
if os.path.exists(frontend_src):
    for root, dirs, files in os.walk(frontend_src):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js')):
                files_to_process.append(os.path.join(root, file))

for f in files_to_process:
    process_file(f)
