package parser

import (
	"bytes"
	"encoding/json"
	"go/ast"
	"go/parser"
	"go/token"
	"os/exec"
	"path/filepath"
	"strings"
)

// TODO: Add functions to parse other languages (prio: go, python, js/ts)
func ParsePythonCode(code string) (map[string]interface{}, error) {
	cmd := exec.Command("python3", "parser/parser.py")
	cmd.Stdin = bytes.NewBufferString(code)
	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		return nil, err
	}
	var result map[string]interface{}
	err = json.Unmarshal(out.Bytes(), &result)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func GetLanguageFromExtension(filename string) string {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".py":
		return "Python"
	case ".js":
		return "JavaScript"
	case ".go":
		return "Go"
	default:
		return ""
	}
}

func ParseGoCode(code string) (map[string]interface{}, error) {
    fset := token.NewFileSet()
    node, err := parser.ParseFile(fset, "", code, 0)
    if err != nil {
        return nil, err
    }

    classes := []map[string]interface{}{}
    functions := []string{}

    // Map to keep track of methods associated with types
    methodsMap := make(map[string][]string)

    // Collect type declarations
    ast.Inspect(node, func(n ast.Node) bool {
        switch x := n.(type) {
        case *ast.FuncDecl:
            if x.Recv != nil && len(x.Recv.List) > 0 {
                // Method with receiver
                recvType := getTypeName(x.Recv.List[0].Type)
                methodName := x.Name.Name
                methodsMap[recvType] = append(methodsMap[recvType], methodName)
            } else {
                // Function
                functions = append(functions, x.Name.Name)
            }
        case *ast.TypeSpec:
            typeName := x.Name.Name
            // Initialize methods slice in case there are no methods
            classes = append(classes, map[string]interface{}{
                "name":    typeName,
                "methods": []string{},
            })
        }
        return true
    })

    // Associate methods with their types
    for _, class := range classes {
        typeName := class["name"].(string)
        if methods, exists := methodsMap[typeName]; exists {
            class["methods"] = methods
        }
    }

    result := map[string]interface{}{
        "classes":   classes,
        "functions": functions,
    }

    return result, nil
}

// Helper function to get type name from ast.Expr
func getTypeName(expr ast.Expr) string {
    switch t := expr.(type) {
    case *ast.Ident:
        return t.Name
    case *ast.StarExpr:
        return getTypeName(t.X)
    case *ast.SelectorExpr:
        return getTypeName(t.X) + "." + t.Sel.Name
    default:
        return ""
    }
}

