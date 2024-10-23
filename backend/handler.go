package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/go-github/v47/github"
	models "github.com/riyuc/ephistomap/backend/model"
	"github.com/riyuc/ephistomap/backend/parser"
	"github.com/riyuc/ephistomap/backend/utils"
	githubclient "github.com/riyuc/ephistomap/backend/utils"
)

func GenerateGraphHandler(c *gin.Context) {
    var json struct {
        URL string `json:"url" binding:"required"`
    }

    if err := c.ShouldBindJSON(&json); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    repoURL := json.URL

    // Parse the GitHub URL
    owner, repo, err := utils.ParseGitHubURL(repoURL)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Fetch repository files
    files, err := githubclient.ListAllFiles(owner, repo)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Process files and build graph
    graphData, err := processFilesAndBuildGraph(owner, repo, files)
	fmt.Printf("Graph Data: %v\n", graphData)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, graphData)
}

func processFilesAndBuildGraph(owner, repo string, files []*github.TreeEntry) (models.Graph, error) {
    var graph models.Graph

    for _, file := range files {
        if *file.Type != "blob" {
            continue // Skip if not a file
        }

        path := *file.Path
        language := utils.GetLanguageFromExtension(path)
        if language == "" {
            continue // Unsupported file type
        }

        // Get file content
        content, err := githubclient.GetFileContent(owner, repo, path)
        if err != nil {
            fmt.Printf("Error fetching content for file %s: %v\n", path, err)
            continue
        }

        var parsedData map[string]interface{}

        switch language {
        case "Python":
            parsedData, err = parser.ParsePythonCode(content)
            if err != nil {
                fmt.Printf("Error parsing Python code in file %s: %v\n", path, err)
                continue
            }
        case "Go":
            parsedData, err = parser.ParseGoCode(content)
			fmt.Printf("Parsed Data for file %s: %v\n", path, parsedData)
            if err != nil {
                fmt.Printf("Error parsing Go code in file %s: %v\n", path, err)
                continue
            }
        // TODO: Add cases for other languages
        default:
            continue
        }

        graph = buildGraphFromParsedData(graph, path, parsedData)
    }

    return graph, nil
}

func buildGraphFromParsedData(graph models.Graph, fileName string, parsedData map[string]interface{}) models.Graph {
    fmt.Printf("Building graph for file: %s\n", fileName)
    fmt.Printf("Parsed Data passed: %v\n", parsedData)

    fileNodeID := "file:" + fileName
    if !nodeExists(graph.Nodes, fileNodeID) {
        fileNode := models.Node{
            ID:   fileNodeID,
            Type: "File",
            Name: fileName,
        }
        graph.Nodes = append(graph.Nodes, fileNode)
    }

    // Extract classes
    var classesSlice []map[string]interface{}
    if tempSlice, ok := parsedData["classes"].([]interface{}); ok {
        for _, item := range tempSlice {
            if classMap, ok := item.(map[string]interface{}); ok {
                classesSlice = append(classesSlice, classMap)
            } else {
                fmt.Printf("Failed to assert class item as map[string]interface{}\n")
            }
        }
    } else if tempSlice, ok := parsedData["classes"].([]map[string]interface{}); ok {
        classesSlice = tempSlice
    } else {
        fmt.Printf("Failed to assert classes as []map[string]interface{} or []interface{}\n")
        fmt.Printf("Type of classesInterface: %T\n", parsedData["classes"])
    }
    fmt.Printf("Classes: %v\n", classesSlice)

    // Extract functions
    var functionsSlice []string
    if tempSlice, ok := parsedData["functions"].([]interface{}); ok {
        for _, item := range tempSlice {
            if fnName, ok := item.(string); ok {
                functionsSlice = append(functionsSlice, fnName)
            } else {
                fmt.Printf("Failed to assert function item as string\n")
            }
        }
    } else if tempSlice, ok := parsedData["functions"].([]string); ok {
        functionsSlice = tempSlice
    } else {
        fmt.Printf("Failed to assert functions as []string or []interface{}\n")
        fmt.Printf("Type of functionsInterface: %T\n", parsedData["functions"])
    }
    fmt.Printf("Functions: %v\n", functionsSlice)

    // Process classes
    for _, classMap := range classesSlice {
        classNameInterface, ok := classMap["name"]
        if !ok {
            fmt.Printf("No 'name' key in classMap\n")
            continue
        }
        className, ok := classNameInterface.(string)
        if !ok {
            fmt.Printf("Failed to assert class name as string\n")
            continue
        }
        classNodeID := "class:" + className

        if !nodeExists(graph.Nodes, classNodeID) {
            classNode := models.Node{
                ID:   classNodeID,
                Type: "Class",
                Name: className,
            }
            graph.Nodes = append(graph.Nodes, classNode)
        }

        // Edge: File contains Class
        graph.Edges = append(graph.Edges, models.Edge{
            Source: fileNodeID,
            Target: classNodeID,
            Type:   "contains",
        })

        // Process methods
        methodsInterface, ok := classMap["methods"]
        if !ok {
            fmt.Printf("No 'methods' key in classMap\n")
            continue
        }
        var methodsSlice []string
        if tempMethodsSlice, ok := methodsInterface.([]interface{}); ok {
            for _, method := range tempMethodsSlice {
                if methodName, ok := method.(string); ok {
                    methodsSlice = append(methodsSlice, methodName)
                } else {
                    fmt.Printf("Failed to assert method name as string\n")
                }
            }
        } else {
            fmt.Printf("Failed to assert methods as []interface{}\n")
            fmt.Printf("Type of methodsInterface: %T\n", methodsInterface)
        }

        for _, methodName := range methodsSlice {
            methodNodeID := "method:" + className + "." + methodName

            if !nodeExists(graph.Nodes, methodNodeID) {
                methodNode := models.Node{
                    ID:   methodNodeID,
                    Type: "Function",
                    Name: methodName,
                }
                graph.Nodes = append(graph.Nodes, methodNode)
            }

            // Edge: Class contains Method
            graph.Edges = append(graph.Edges, models.Edge{
                Source: classNodeID,
                Target: methodNodeID,
                Type:   "contains",
            })
        }
    }

    // Process functions
    for _, fnName := range functionsSlice {
        fnNodeID := "function:" + fnName

        if !nodeExists(graph.Nodes, fnNodeID) {
            fnNode := models.Node{
                ID:   fnNodeID,
                Type: "Function",
                Name: fnName,
            }
            graph.Nodes = append(graph.Nodes, fnNode)
        }

        // Edge: File contains Function
        graph.Edges = append(graph.Edges, models.Edge{
            Source: fileNodeID,
            Target: fnNodeID,
            Type:   "contains",
        })
    }

    return graph
}

// Helper function to check if a node exists
func nodeExists(nodes []models.Node, id string) bool {
    for _, node := range nodes {
        if node.ID == id {
            return true
        }
    }
    return false
}

// Helper function to check if an edge exists
func edgeExists(edges []models.Edge, source, target, edgeType string) bool {
    for _, edge := range edges {
        if edge.Source == source && edge.Target == target && edge.Type == edgeType {
            return true
        }
    }
    return false
}
