package handler

import (
	"github.com/google/go-github/github"
	"github.com/riyuc/ephistomap/backend/model"
	"github.com/riyuc/ephistomap/backend/parser"
	"github.com/riyuc/ephistomap/backend/utils"
	githubclient "github.com/riyuc/ephistomap/backend/utils"
)

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
			return graph, err
		}

		var parsedData map[string]interface{}

		switch language {
		case "Python":
			parsedData, err = parser.ParsePythonCode(content)
			if err != nil {
				return graph, err
			}
			// Build nodes and edges from parsedData
			graph = buildGraphFromParsedData(graph, parsedData)
			// Add cases for other languages
		}
	}

	return graph, nil
}

func buildGraphFromParsedData(graph models.Graph, parsedData map[string]interface{}) models.Graph {
	// Extract classes and functions
	classes, _ := parsedData["classes"].([]interface{})
	functions, _ := parsedData["functions"].([]interface{})

	// Add function nodes
	for _, fn := range functions {
		fnName := fn.(string)
		node := models.Node{
			Data: models.NodeData{
				ID:    fnName,
				Label: "Function",
			},
		}
		graph.Nodes = append(graph.Nodes, node)
	}

	// Add class nodes and method edges
	for _, cls := range classes {
		classMap := cls.(map[string]interface{})
		className := classMap["name"].(string)

		classNode := models.Node{
			Data: models.NodeData{
				ID:    className,
				Label: "Class",
			},
		}
		graph.Nodes = append(graph.Nodes, classNode)

		methods, _ := classMap["methods"].([]interface{})
		for _, method := range methods {
			methodName := method.(string)
			methodNodeID := className + "." + methodName

			methodNode := models.Node{
				Data: models.NodeData{
					ID:    methodNodeID,
					Label: "Method",
				},
			}
			graph.Nodes = append(graph.Nodes, methodNode)

			edge := models.Edge{
				Data: models.EdgeData{
					ID:     className + "_contains_" + methodName,
					Source: className,
					Target: methodNodeID,
					Label:  "contains",
				},
			}
			graph.Edges = append(graph.Edges, edge)
		}
	}

	return graph
}
