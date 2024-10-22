package parser

import (
	"testing"

	"github.com/go-playground/assert/v2"
)

func TestParsePythonCode(t *testing.T) {
	code := `
class MyClass:
    def method_one(self):
        pass

def function_one():
    pass
`
	result, err := ParsePythonCode(code)
	if err != nil {
		t.Errorf("Error parsing code: %v", err)
	}

	// Add assertions to verify the result
	assert.Equal(t, len(result), 2)
}
