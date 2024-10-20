package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "healthy",
		})
	})

	r.POST("/api/v1/generate-graph", func(c *gin.Context) {
		var request struct {
			url string `json:"url" binding:required`
		}

		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		repoUrl := request.url

		graphData := gin.H{
			"nodes": []gin.H{},
			"edges": []gin.H{},
		  }
	  
		c.JSON(http.StatusOK, graphData)
		
	})

	r.Run()
}
