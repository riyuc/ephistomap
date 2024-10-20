import ast
import sys
import json

def parse_python_code(code):
    tree = ast.parse(code)
    classes = []
    functions = []
    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef):
            methods = [n.name for n in node.body if isinstance(n, ast.FunctionDef)]
            classes.append({'name': node.name, 'methods': methods})
        elif isinstance(node, ast.FunctionDef):
            functions.append(node.name)
    return {'classes': classes, 'functions': functions}

if __name__ == '__main__':
    code = sys.stdin.read()
    result = parse_python_code(code)
    print(json.dumps(result))
