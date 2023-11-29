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

}

export const flowSlice = createSlice({
  name: 'flowStack',
  initialState,
  reducers: {
    setNodes: (state,action) => {
      state.nodes= [...action.payload]
      
    },
    setEdges: (state,action) => {
      state.edges= [...action.payload]
    },
    setSingleNode: (state,action) => {
      state.nodes.push(action.payload)
      
    },
    setSingleEdge: (state,action) => {
      state.edges.push(action.payload)
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
    },
    setSideMenu:(state,action) => {
      state.openSideMenu=action.payload
      
    },
    setNode:(state,action)=>{
   
    state.node = {...action.payload}
      
    },
    updateNode:(state,action)=>{
      console.log(state.nodes)
      let nodes = [...state.nodes]
      debugger
      let {node, isDefault, parantChange } = action.payload
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
      flowSlice.caseReducers.changeDefaultUnit(state, {node,tempNodes});
    }else if(parantChange?.status===true){
      
      flowSlice.caseReducers.changeParantNode(state, {parantChange:{...parantChange},tempNodes, edges:state.edges });
    }
    else{
      state.nodes = [...tempNodes]
    }


    },
    changeDefaultUnit:(state,action)=>{

      let newDefaultNode =action.payload.node;
      let Nodes = action.payload.tempNodes;
      let nodes = state.nodes
      let node = state.node
      let edges =state.edges


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
  
  
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(tempNodes, newEdges, "TB");
  
        state.nodes = [...layoutedNodes];
        state.edges = [...layoutedEdges];

    },


    changeParantNode:(state,action)=>{
      let parantChange = {...action.payload.parantChange};
      let tempNodes = action.payload.tempNodes;
      let edges = action.payload.edges

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
  
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(tempNodes, newEdges, "TB");
  
      state.edges = [...layoutedEdges]
      state.nodes = [...layoutedNodes]
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
} = flowSlice.actions
export default flowSlice.reducer






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