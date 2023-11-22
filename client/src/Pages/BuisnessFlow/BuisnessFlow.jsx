import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  MiniMap,
  Controls,
  Background,
  Handle,
  useEdgesState,
  ReactFlowProvider,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
} from "reactflow";
import dagre from "dagre";
import axios from "axios";

// material ui import
import {
  Button,
  Grid,
  ButtonGroup,
  Fab,
  Box,
  Snackbar,
  LinearProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavigationIcon from "@mui/icons-material/Navigation";
import SaveIcon from "@mui/icons-material/Save";
import MuiAlert from "@mui/material/Alert";

// component import
import { nodeTypes } from "./Components/Cards/Index";
import TemporaryDrawer from "./Components/PropertyMenu/DefaultBuisnessUnitMenu";
import PropertyMenu from "./PropertyMenu";
import "reactflow/dist/style.css";
import { useNavigate } from "react-router-dom";

// initialize values
const initialNodes = [];
const initialEdges = [];
const deletedNodes = [];
const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVWZVF3eV9sUW5Wdk9MZTZrTmJzcyJ9.eyJlbWFpbCI6ImRldmVsb3BtZW50LnRlc3RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vZGV2LTFzcG9jLnVzLmF1dGgwLmNvbS8iLCJhdWQiOiJTbzNvNTl2VVh0OHJmc0U1MzhkMnAwOFQzMW5jOW5EZyIsImlhdCI6MTY5OTI1MzkzOCwiZXhwIjoxNjk5Mjg5OTM4LCJzdWIiOiJhdXRoMHw2NTJmYzA3NGI0NGFjODQxZGQ5ZWFjNjkiLCJhdF9oYXNoIjoiaktNSWRjejZMdnhKTkRLZUk1M3ppdyIsIm5vbmNlIjoiOVBmLjhCZnFkeEthU19hVXpuQXBrcTg3UHQ3SkxRNjkifQ.KqrvsbPHl3v5EPZDqHii7it-omozEzSYtRL84LByGURHDtnXJy7U3Z0lbO-M8j9izbYwqDxKeyhHvxd7QJAhgtSShKjvxRF5O_1Wk0aX-I4br2IJvhuXwxuJSzBOvaD81SK_oPRZUZO7gVMFBFz_FiNNTGF89rn4GT32cxUnshVrbrzRYHn6AEupDAf4z6T-X1fUUF8tN3S9Sln5YmDwBMRjCH5dgnkb6j_cFbgma9x8k-esz0CdS4vsmfNY_3566R2vTMNPKetRxzU5u2oMwG3NIzCfWKWEX5NTs4c5gTg7S0krYP4XvlF7AUt0Y30PT9cRi2H0NBpjSSf77x_g1w";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 200;
const nodeHeight = 100;

// auto graph making logic using dagree
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

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

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
);

// parant component
const LayoutFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const [loadPage, setloadPage] = useState(true);
  const [openSideMenu, setSideMenu] = useState(false);
  const [node, setNode] = useState({});
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState("");
  const [snakBarType, setSnakBarType] = React.useState("success");
  const [loading, setLoading] = React.useState(false);
  const [orgId, setOrgId] = React.useState("");

  const navigate = useNavigate();

  const handleSideMenu = (status) => {
    setSideMenu(status);
  };

  const updateNode = (node, isDefault) => {
   

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
      changeDefaultUnit(node, tempNodes)
    }else{
      setNodes(tempNodes);
    }

  };



  // function for make any node into Defaultnode

  const changeDefaultUnit = (node, Nodes)=>{
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

    let newEdges = edges.map((data)=>{
      if(data.source==="stratNodeId"){
        return {...data, source: node.id} 
      }
      if(data.target===node.id){
        return {...data, source: "stratNodeId"} 
      }
      return data
    })
    console.log(newEdges)
    setEdges(newEdges)
    setNodes(tempNodes);
    
  }


  // useEffect for navigate to login page if not logedin
  React.useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    console.log("userData11", userData?.accountData?._id);
    if (userData) {
      getNodesFromServer(userData.accountData._id);
    } else {
      navigate("/login");
    }
  }, []);

  const onNodeClick = (e, node) => {
    setNode(node);
    handleSideMenu(true);
    console.log("node clicket", node);
  };

  const getNodesFromServer = async (orgId) => {
    try {
      let serverRespose = await axios({
        method: "get",
        url: "http://localhost:4001/",
        params: { orgId: orgId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNodes(serverRespose.data.node);
      setEdges(serverRespose.data.edges);
      setloadPage(!loadPage);
    } catch (error) {
      console.log(error);
    }
  };

  const createNodeInServer = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    try {
      let serverRespose = await axios({
        method: "post",
        url: "http://localhost:4001/",
        data: {
          name: "New BU",
          type: "newNode",
          parent_id: "",
          orgId:userData.accountData._id
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("serverRespose.data.node", serverRespose.data.node)

      setNodes((nds) => [...nds, serverRespose.data.node]);

      // const newNode = {id:uniqid(), type: "newNode", parent_id:"", position:{x: 100, y: 100}, data: {features:{businessUnit: false, monitoringUnit: false, billingUnit: false} , label: "New Node"}}

      // setNodes((nds)=>[...nds,newNode])
    } catch (error) {
      console.log(error);
    }
  };

  const createEdgeInServer = async (params) => {
    try {
      let serverRespose = await axios({
        method: "patch",
        url: "http://localhost:4001/",
        data: {
          _id: params.target,
          dataToUpdate: { parent_id: params.source },
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    } catch (error) {
      console.log(error);
    }
  };

  const saveFlowInServer = async (nodes, edges) => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("userData"));

      let serverRespose = await axios({
        method: "put",
        url: "http://localhost:4001/",
        data: {
          nodes,
          edges,
          deletedNodes,
          orgId:userData.accountData._id
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("server response after save", serverRespose.data.status);
      if (serverRespose.data.status === "success") {
        setSnakBarType("success");
        setSnackBarMessage(serverRespose.data.message);
        setOpenSnackbar(true);
      }
      if (serverRespose.data.status === "error") {
        setSnakBarType("error");
        setSnackBarMessage(serverRespose.data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.log(error);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, []);

  const addNodes = useCallback(() => {
    createNodeInServer();
  }, []);

  const handleSignOut = ()=>{
    localStorage.clear();
    navigate("/login");
  }

  const onNodesDelete = useCallback(
    (deleted) => {
      deletedNodes.push(deleted[0].id);
      setSideMenu(false);
    },
    [nodes, edges]
  );

  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );

 

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgb(242, 242, 242)",
      }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodesDelete={onNodesDelete}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          nodeTypes={nodeTypes}
          deleteKeyCode={"Delete"}
        >
          {loading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          )}

          <Panel position="top-right">
            <Box sx={{ "& > :not(style)": { m: 1 } }}>
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => {
                  addNodes();
                }}
              >
                <AddIcon />
              </Fab>
              <Fab
                color="secondary"
                aria-label="edit"
                onClick={() => saveFlowInServer(nodes, edges)}
              >
                <SaveIcon />
              </Fab>
              <Fab variant="extended" onClick={() => onLayout("TB")}>
                vertical layout
                <NavigationIcon sx={{ mr: 1, transform: "rotate(180deg)" }} />
              </Fab>
              <Fab variant="extended" onClick={() => handleSignOut()}>
                Sign Out
              </Fab>


              {/* <Fab variant="extended" onClick={() => onLayout('LR')}>
                  horizontal layout
                    <NavigationIcon sx={{ mr: 1, transform: 'rotate(90deg)' }} />
            
                </Fab> */}
            </Box>
          </Panel>
          <Controls />
          {/* <MiniMap /> */}
          <Background gap={40} variant={"dots"} size={0} color="#ccc" />
        </ReactFlow>
      </ReactFlowProvider>
      {PropertyMenu(handleSideMenu, openSideMenu, node,updateNode)}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setOpenSnackbar(!openSnackbar);
        }}
        message={snackBarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(!openSnackbar)}
          severity={snakBarType}
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};


// code for alert while closing the tab
window.addEventListener("beforeunload", (ev) => {
  console.log("sdjbkjs",ev?.target?.location?.pathname)
  if(ev?.target?.location?.pathname==="/"){
    ev.preventDefault();
    return (ev.returnValue = "Are you sure you want to close?");
  }else{
    return true
  }
  
});

export default LayoutFlow;
