package parser

import (
    "bytes"
    "encoding/json"
    "os/exec"
)

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

// TODO: Add functions to parse other languages (prio: go, python, js/ts)
