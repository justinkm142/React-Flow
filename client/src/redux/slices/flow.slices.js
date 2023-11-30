import { createSlice } from '@reduxjs/toolkit'
import ReactFlow, { applyEdgeChanges, applyNodeChanges } from 'reactflow';
import dagre from "dagre";

const initialState = {
    nodes:[],
    edges:[],
    currentStatus : {nodes:[],edges:[]},
    stack : [],
    openSideMenu:false,
    node:{},
    nodeNameList:[],
}

export const flowSlice = createSlice({
  name: 'flowStack',
  initialState,
  reducers: {
    setNodes: (state,action) => {
      state.nodes= [...action.payload]
      state.stack.push({nodes: state.nodes, edges:state.edges})
    },
    setEdges: (state,action) => {
      state.edges= [...action.payload]
      state.stack.push({nodes: state.nodes, edges:state.edges})
    },

    setSingleNode: (state,action) => {
      state.nodes.push(action.payload)
      state.stack.push({nodes: state.nodes, edges:state.edges}) 
    },
    setSingleEdge: (state,action) => {
      state.edges.push(action.payload)
      state.stack.push({nodes: state.nodes, edges:state.edges})
    },
    
    onNodesChange: (state,action) => {
      state.nodes = [...applyNodeChanges(action.payload, state.nodes)]
      
    },

    onEdgesChange: (state,action) => {
      state.edges = [...applyEdgeChanges(action.payload, state.edges) ]  
    },
    
    addStack: (state,action) => {
      state.stack.push(action.payload)
      state.currentStatus = state.stack.pop()
    },

    undoStack: (state,action) => {
      state.currentStatus = state.stack.pop()
    },
    redoStack: (state, action) => {
      
    },
    onConnect: (state, action) => {
      state.edges.push({...action.payload, animated: true})
      state.stack.push({nodes: state.nodes, edges:state.edges})
    },
    setSideMenu:(state,action) => {
      state.openSideMenu=action.payload
      
    },
    setNode:(state,action)=>{
   
    state.node = {...action.payload}
      
    },
    updateNode:(state,action)=>{
      
      let node = action.payload.node;
      let isDefault = action.payload.isDefault;
      let parantChange = action.payload.parantChange;
      let nodesOld =[...state.nodes]
      let edgesOld = [...state.edges]
      
     let {nodes, edges} = updateNodeFunction(node,isDefault,parantChange,nodesOld ,edgesOld)
      if(nodes){
        state.nodes = [...nodes]
      }
      if(edges){
        state.edges = [...edges]
      }

    },
   setNodeNameList:(state,action)=>{
      state.nodeNameList = [...action.payload]  

    },
  
  },
})


export const { 
  addStack, 
  undoStack, 
  redoStack, 
  setNodes, 
  setEdges, 
  onNodesChange, 
  onEdgesChange, 
  setSingleNode, 
  setSingleEdge, 
  onConnect,
  setSideMenu,
  setNode,
  updateNode,
  setNodeNameList,
} = flowSlice.actions
export default flowSlice.reducer











// function for updating nodes
const updateNodeFunction = (node, isDefault, parantChange, nodes, edges) => {
   
  let tempNodes = nodes.map((data) => {

    if (data.id === node.id) {

      if (node.type === "defaultBusinessUnit") {
        return node;
      }

      if (node.data.features.businessUnit === true) {
        return { ...node, type: "businessUnit" };
      }

      if (node.data.features.billingUnit === true) {
        return { ...node, type: "billingUnit" };
      }
      if (node.data.features.monitoringUnit === true) {
        return { ...node, type: "monitoringUnit" };
      }
      if (
        node.data.features.monitoringUnit === false &&
        node.data.features.billingUnit === false &&
        node.data.features.businessUnit === false
      ) {
        return { ...node, type: "newNode" };
      }
      return node;
    } else {
      return data;
    }
  });

  if(isDefault){
    return changeDefaultUnit(node, tempNodes, nodes, edges)
  }else if(parantChange.status===true){
    return changeParant(parantChange,tempNodes,nodes, edges)
  }
  else{
    return {nodes:[...tempNodes]}
  }

};

// function for make any node into Defaultnode
const changeDefaultUnit = (node, Nodes, nodes, edges)=>{
  let newDefaultNode = node
  let oldDefaultNode = nodes.filter((data)=>{
    if (data.type==="defaultBusinessUnit"){
      return data
    }
  })
  let tempNodes = Nodes.map((data)=>{
    
    if(data.id===newDefaultNode.id){
      return {...data, type:"defaultBusinessUnit"}
    }
    if(data.id===oldDefaultNode[0].id){
      return {...data, type:"businessUnit"}
    }
    
    return data
  })

  let set =0
  let newEdges = edges.map((data)=>{
    if(data.source==="stratNodeId"){
      set++
      return {...data, source: node.id} 
    }
    if(data.target===node.id){
      set++
      return {...data, source: "stratNodeId"} 
    }
    return data
  })

  if(set<2){
    newEdges.push({id:`${newDefaultNode.id}-2`, source:"stratNodeId", target:newDefaultNode.id, animated:true})
  }


    const nodeWidth = 220;
    const nodeHeight = 120;
    
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    
    const getLayoutedElements = (nodes, edges, direction = "TB") => {
      const isHorizontal = direction === "LR";
      dagreGraph.setGraph({ rankdir: "TB" });
    
      nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      });
    
      edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });
    
      dagre.layout(dagreGraph);
    
      nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? "left" : "top";
        node.sourcePosition = isHorizontal ? "right" : "bottom";
    
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        };
    
        return node;
      });
    
      return { nodes, edges };
    };



    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(tempNodes, newEdges, "TB"); 
    return {nodes:[...layoutedNodes] , edges: [...layoutedEdges]}


}

// fucntion for change parant of the node 
const changeParant = (parantChange,tempNodes,nodes, edges)=>{
 

  let newEdges = []
  if(parantChange.oldParantId===""){

    newEdges = [...edges, {animated:true, hidden:false, id:`${parantChange.nodeId}-1`, source:parantChange.newParantId, target:parantChange.nodeId}]

  }else{

    newEdges = edges.map((data)=>{
      if(data.target===parantChange.nodeId){
        return ({...data, source:parantChange.newParantId})
      }else{
        return data
      }
    })
  }

  const nodeWidth = 200;
  const nodeHeight = 120;
  
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const getLayoutedElements = (nodes, edges, direction = "TB") => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: "TB" });
  
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
  
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
  
    dagre.layout(dagreGraph);
  
    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? "left" : "top";
      node.sourcePosition = isHorizontal ? "right" : "bottom";
  
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
  
      return node;
    });
  
    return { nodes, edges };
  };

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(tempNodes, newEdges, "TB");

  return {nodes:[...layoutedNodes] , edges: [...layoutedEdges]}

}





