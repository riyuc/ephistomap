package main

import (
	"github.com/gin-gonic/gin"
)

func InitializeRoutes(router *gin.Engine) {
	api := router.Group("/api/v1")
	{
		api.POST("/generate-graph", GenerateGraphHandler)
	}
}
