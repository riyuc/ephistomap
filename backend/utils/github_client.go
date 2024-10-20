package utils

import (
	"context"
	"os"
	"github.com/google/go-github/v47/github"
	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
)

func getGitHubClient() *github.Client {
	ctx := context.Background()
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}
	token := os.Getenv("GITHUB_TOKEN")
	if token == "" {
		panic("GITHUB_TOKEN environment variable is not set")
	}
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: token},
	)
	tc := oauth2.NewClient(ctx, ts)

	client := github.NewClient(tc)
	return client
}

func ListAllFiles(owner, repo string) ([]*github.TreeEntry, error) {
	client := getGitHubClient()
	ctx := context.Background()

	// Get the default branch (usually 'main' or 'master')
	repository, _, err := client.Repositories.Get(ctx, owner, repo)
	if err != nil {
		return nil, err
	}

	branch := repository.GetDefaultBranch()

	// Get the commit SHA of the default branch
	ref, _, err := client.Git.GetRef(ctx, owner, repo, "refs/heads/"+branch)
	if err != nil {
		return nil, err
	}

	// Get the tree of the default branch
	tree, _, err := client.Git.GetTree(ctx, owner, repo, *ref.Object.SHA, true)
	if err != nil {
		return nil, err
	}

	return tree.Entries, nil
}

func GetFileContent(owner, repo, path string) (string, error) {
	client := getGitHubClient()
	ctx := context.Background()

	fileContent, _, _, err := client.Repositories.GetContents(ctx, owner, repo, path, nil)
	if err != nil {
		return "", err
	}

	content, err := fileContent.GetContent()
	if err != nil {
		return "", err
	}

	return content, nil
}
