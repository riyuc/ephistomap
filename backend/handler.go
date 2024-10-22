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
	fmt.Println("GenerateGraphHandler")
	var json struct {
		URL string `json:"url" binding:"required"`
	}

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("URL: %s\n", json.URL)
	repoURL := json.URL

	// Parse the GitHub URL
	owner, repo, err := utils.ParseGitHubURL(repoURL)
	fmt.Printf("Owner: %s, Repo: %s\n", owner, repo)
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
		fmt.Printf("Path: %s, Language: %s\n", path, language)
		if language == "" {
			continue // Unsupported file type
		}

		// Get file content
		content, err := githubclient.GetFileContent(owner, repo, path)
		fmt.Printf("Content: %s\n", content)
		if err != nil {
			return graph, err
		}

		var parsedData map[string]interface{}

		switch language {
		case "Python":
			parsedData, err = parser.ParsePythonCode(content)
			if err != nil {
				return graph, err
			}
		case "Go":
			parsedData, err = parser.ParseGoCode(content)
			if err != nil {
				return graph, err
			}
			fmt.Printf("Parsed Data: %v\n", parsedData)
		// Add cases for other languages
		default:
			continue // Skip unsupported languages
		}

		// Build nodes and edges from parsedData
		graph = buildGraphFromParsedData(graph, parsedData)
		fmt.Printf("Graph: %v\n", graph)
	}

	return graph, nil
}

func buildGraphFromParsedData(graph models.Graph, parsedData map[string]interface{}) models.Graph {
	// Extract classes and functions
	fmt.Printf("Parsed Data inside buildGraph: %v\n", parsedData)
	classes, _ := parsedData["classes"].([]interface{})
	functions, _ := parsedData["functions"].([]interface{})
	fmt.Printf("Classes: %v, Functions: %v\n", classes, functions)

	// Add function nodes
	for _, fn := range functions {
		fnName := fn.(string)
		nodeID := fnName

		// Check if the node already exists
		if !nodeExists(graph.Nodes, nodeID) {
			node := models.Node{
				Data: models.NodeData{
					ID:    nodeID,
					Label: "Function",
				},
			}
			graph.Nodes = append(graph.Nodes, node)
		}
	}

	// Add class/type nodes and method edges
	for _, cls := range classes {
		classMap := cls.(map[string]interface{})
		className := classMap["name"].(string)

		// Check if the node already exists
		if !nodeExists(graph.Nodes, className) {
			classNode := models.Node{
				Data: models.NodeData{
					ID:    className,
					Label: "Class", // Or "Type" for Go
				},
			}
			graph.Nodes = append(graph.Nodes, classNode)
		}

		methods, _ := classMap["methods"].([]interface{})
		for _, method := range methods {
			methodName := method.(string)
			methodNodeID := className + "." + methodName

			if !nodeExists(graph.Nodes, methodNodeID) {
				methodNode := models.Node{
					Data: models.NodeData{
						ID:    methodNodeID,
						Label: "Method",
					},
				}
				graph.Nodes = append(graph.Nodes, methodNode)
			}

			edgeID := className + "_contains_" + methodName

			if !edgeExists(graph.Edges, edgeID) {
				edge := models.Edge{
					Data: models.EdgeData{
						ID:     edgeID,
						Source: className,
						Target: methodNodeID,
						Label:  "contains",
					},
				}
				graph.Edges = append(graph.Edges, edge)
			}
		}
	}

	return graph
}

// Helper function to check if a node exists
func nodeExists(nodes []models.Node, id string) bool {
	for _, node := range nodes {
		if node.Data.ID == id {
			return true
		}
	}
	return false
}

// Helper function to check if an edge exists
func edgeExists(edges []models.Edge, id string) bool {
	for _, edge := range edges {
		if edge.Data.ID == id {
			return true
		}
	}
	return false
}
