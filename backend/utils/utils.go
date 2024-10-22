package utils

import (
	"errors"
	"log"
	"path/filepath"
	"regexp"
	"strings"
    "github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func ParseGitHubURL(url string) (owner string, repo string, err error) {
	re := regexp.MustCompile(`https://github\.com/([^/]+)/([^/]+)`)
	matches := re.FindStringSubmatch(url)
	if len(matches) < 3 {
		err = errors.New("invalid GitHub repository URL")
		return
	}
	owner = matches[1]
	repo = strings.TrimSuffix(matches[2], ".git")
	return
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

func CheckError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

// CORS middleware
func CORSMiddleware() gin.HandlerFunc {
	return cors.Default()
}
