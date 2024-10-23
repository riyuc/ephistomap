package models

type Node struct {
    ID       string `json:"id"`
    Type     string `json:"type"` // "File", "Class", "Function"
    Name     string `json:"name"`
}

type Edge struct {
    Source string `json:"source"`
    Target string `json:"target"`
    Type   string `json:"type"` // "contains"
}

type Graph struct {
    Nodes []Node `json:"nodes"`
    Edges []Edge `json:"edges"`
}


// type Node struct {
//     Data NodeData `json:"data"`
// }

// type NodeData struct {
//     ID       string `json:"id"`
//     Label    string `json:"label"`
//     Language string `json:"language,omitempty"`
// }

// type Edge struct {
//     Data EdgeData `json:"data"`
// }

// type EdgeData struct {
//     ID     string `json:"id"`
//     Source string `json:"source"`
//     Target string `json:"target"`
//     Label  string `json:"label"`
// }

// type Graph struct {
//     Nodes []Node `json:"nodes"`
//     Edges []Edge `json:"edges"`
// }
