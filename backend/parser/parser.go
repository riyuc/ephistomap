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

	// Since Go doesn't have classes, we'll treat types with methods as "classes"
	methodsMap := make(map[string][]string)

	// Iterate over declarations
	for _, decl := range node.Decls {
		switch decl := decl.(type) {
		case *ast.FuncDecl:
			if decl.Recv != nil && len(decl.Recv.List) > 0 {
				// Method
				recvType := getTypeName(decl.Recv.List[0].Type)
				methodName := decl.Name.Name
				methodsMap[recvType] = append(methodsMap[recvType], methodName)
			} else {
				// Function
				functions = append(functions, decl.Name.Name)
			}
		case *ast.GenDecl:
			for _, spec := range decl.Specs {
				switch spec := spec.(type) {
				case *ast.TypeSpec:
					typeName := spec.Name.Name
					// We'll consider any type declaration as a "class"
					classes = append(classes, map[string]interface{}{
						"name":    typeName,
						"methods": []string{}, // Will fill in later from methodsMap
					})
				}
			}
		}
	}

	// Add methods to corresponding types
	for _, class := range classes {
		typeName := class["name"].(string)
		if methods, ok := methodsMap[typeName]; ok {
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
