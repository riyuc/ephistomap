package main

import (
	"github.com/gin-gonic/gin"
	"github.com/riyuc/ephistomap/backend/utils"
)

func main() {
	router := gin.Default()

	router.Use(utils.CORSMiddleware())

	InitializeRoutes(router)

	router.Run(":8080")
}
