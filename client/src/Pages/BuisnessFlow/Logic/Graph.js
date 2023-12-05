class Graph {
    constructor() {
        this.nodes = {};
    }

    addNode(value) {
        this.nodes[value.id] = { value, parent: null, children: [] };
    }

    addEdge(parentValue, childValue) {
        this.nodes[parentValue].children.push(this.nodes[childValue]);
        this.nodes[childValue].parent = this.nodes[parentValue];
    }
}

// Function to traverse from a node to its root
export function traverseToRoot(graph, startNodeValue) {
    const pathToRoot = [];

    let currentNode = graph.nodes[startNodeValue];

    while (currentNode !== null) {
        pathToRoot.push(currentNode.value);
        currentNode = currentNode.parent;
    }

    return pathToRoot.reverse();
}


export default Graph



