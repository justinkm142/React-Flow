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
function traverseToRoot(graph, startNodeValue) {
    const pathToRoot = [];

    let currentNode = graph.nodes[startNodeValue];

    while (currentNode !== null) {
        pathToRoot.push(currentNode.value);
        currentNode = currentNode.parent;
    }

    return pathToRoot.reverse();
}


export default Graph




// Example usage:
const myGraph = new Graph();
// Add nodes to the graph
myGraph.addNode({id:"A", name:"a"});
myGraph.addNode({id:"B", name:"b"});
myGraph.addNode({id:"C", name:"c"});
myGraph.addNode({id:"D", name:"d"});
myGraph.addEdge("A", "B");
myGraph.addEdge("B", "C");
myGraph.addEdge("A", "D");
const nodeToRootPath = traverseToRoot(myGraph, "D");
console.log("Path from node to root:", nodeToRootPath);
