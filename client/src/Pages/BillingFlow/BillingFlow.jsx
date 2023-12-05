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
  useReactFlow,
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
  Typography,
  Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavigationIcon from "@mui/icons-material/Navigation";
import SaveIcon from "@mui/icons-material/Save";
import MuiAlert from "@mui/material/Alert";

// component import
import { nodeTypes } from "./Components/Cards/Index";
import TemporaryDrawer from "./Components/PropertyMenu/DefaultBuisnessUnitMenu";
import PropertyMenu from "./Components/PropertyMenu";
import "reactflow/dist/style.css";
import { useNavigate } from "react-router-dom";

// store componant import

import { useSelector, useDispatch } from "react-redux";
import {
  addStack,
  undoStack,
  redoStack,
  setNodes,
  setEdges,
  onNodesChange,
  onEdgesChange,
  setSingleNode,
  onConnect,
  setSideMenu,
  setSingleEdge,
  setNode,
  setNodeNameList,
} from "../../redux/slices/flow.slices";

import Graph from "./Logic/graph";

// initialize values

const deletedNodes = [];
const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVWZVF3eV9sUW5Wdk9MZTZrTmJzcyJ9.eyJlbWFpbCI6ImRldmVsb3BtZW50LnRlc3RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vZGV2LTFzcG9jLnVzLmF1dGgwLmNvbS8iLCJhdWQiOiJTbzNvNTl2VVh0OHJmc0U1MzhkMnAwOFQzMW5jOW5EZyIsImlhdCI6MTY5OTI1MzkzOCwiZXhwIjoxNjk5Mjg5OTM4LCJzdWIiOiJhdXRoMHw2NTJmYzA3NGI0NGFjODQxZGQ5ZWFjNjkiLCJhdF9oYXNoIjoiaktNSWRjejZMdnhKTkRLZUk1M3ppdyIsIm5vbmNlIjoiOVBmLjhCZnFkeEthU19hVXpuQXBrcTg3UHQ3SkxRNjkifQ.KqrvsbPHl3v5EPZDqHii7it-omozEzSYtRL84LByGURHDtnXJy7U3Z0lbO-M8j9izbYwqDxKeyhHvxd7QJAhgtSShKjvxRF5O_1Wk0aX-I4br2IJvhuXwxuJSzBOvaD81SK_oPRZUZO7gVMFBFz_FiNNTGF89rn4GT32cxUnshVrbrzRYHn6AEupDAf4z6T-X1fUUF8tN3S9Sln5YmDwBMRjCH5dgnkb6j_cFbgma9x8k-esz0CdS4vsmfNY_3566R2vTMNPKetRxzU5u2oMwG3NIzCfWKWEX5NTs4c5gTg7S0krYP4XvlF7AUt0Y30PT9cRi2H0NBpjSSf77x_g1w";

const nodeWidth = 220;
const nodeHeight = 120;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

let count = 0;

// parant component
const BillingFlow = () => {
  
  const [loadPage, setloadPage] = useState(true);

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState("");
  const [snakBarType, setSnakBarType] = React.useState("success");
  const [loading, setLoading] = React.useState(false);
  const [deletablenode, setDeletablenode] = React.useState(true);
    

  const currentState = useSelector((state) => state.flow.currentStatus);
  const undoRedoStack = useSelector((state) => state.flow.stack);
  const nodes = useSelector((state) => state.flow.nodes);
  const edges = useSelector((state) => state.flow.edges);
  const openSideMenu = useSelector((state) => state.flow.openSideMenu);
  const node = useSelector((state) => state.flow.node);


  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  // auto graph making logic using dagree
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

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

  // useEffect for navigate to login page if not logedin
  React.useEffect(() => {
 
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      getNodesFromServer(userData.accountData._id);
    } else {
      navigate("/login");
    }
  }, []);


  React.useEffect(() => {
    let namelist = [];
    nodes.forEach((data) => {
      namelist.push({ name: data.data.label, id: data.id });
    });
    dispatch(setNodeNameList(namelist))
  }, [nodes]);

  // function - open side menu  on node single click
  let timeoutForMouseClick;
  const onNodeClick = (e, node) => {
    console.log("target id2", e.target.id);

    if(e.target.id === "id-addNodeButton") {
    
      createChildtoParant(node)
      return true;
    }

    count++;
    window.clearTimeout(timeoutForMouseClick);
    timeoutForMouseClick = setTimeout(() => {
      if (count > 1) {
        count = 0;
        window.clearTimeout(timeoutForMouseClick);
      } else {
        //  let tempNode = {...node}
        //  debugger
        dispatch(setNode({ ...node }));
        dispatch(setSideMenu(true));
        console.log("node clicket1", node);
        window.clearTimeout(timeoutForMouseClick);
        count = 0;
      }
    }, 400);
    if (node.type === "defaultBusinessUnit") {
      setDeletablenode(false);
    } else {
      setDeletablenode(true);
    }
  };

  // function - add node to its parant on double click
  const onNodeDoubleClick = async (e, node) => {
    window.clearTimeout(timeoutForMouseClick);
    console.log("double", node);
    createChildtoParant(node)
  };


  // axios - add child node when clicking the node + button 
  const createChildtoParant = async (node)=>{
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
        let serverRespose = await axios({
          method: "post",
          url: "http://localhost:4001/",
          data: {
            name: "New BU",
            type: "newNode",
            parent_id: node.id,
            orgId: userData.accountData._id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // setNodes((nds) => [...nds, serverRespose.data.node]);
        // setEdges((eds) => addEdge({_id:"dfjbjkdfbk", target:serverRespose.data.node.id, source: node.id , animated: true }, eds));
  
        let nodesCopy = nodes.map((data) => {
          return { ...data };
        });
        let edgesCopy = edges.map((data) => {
          return { ...data };
        });
  
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(
            [...nodesCopy, serverRespose.data.node],
            [
              ...edgesCopy,
              {
                id: `${serverRespose.data.node.id}-2`,
                target: serverRespose.data.node.id,
                source: node.id,
                animated: true,
                hidden: false,
              },
            ],
            "TB"
          );
  
        dispatch(setEdges([...layoutedEdges]));
        dispatch(setNodes([...layoutedNodes]));






    } catch (error) {
      console.log(error)
    }
  }


  // axios -  for  get all  node and edges from server
  const getNodesFromServer = async (orgId) => {
    try {
      let serverRespose = await axios({
        method: "get",
        url: "http://localhost:4001/billingUnitFlow",
        params: { orgId: orgId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });



      const { nodes: layoutedNodes, edges: layoutedEdges } =getLayoutedElements([...serverRespose.data.node],[...serverRespose.data.edges],"TB");

      dispatch(setNodes(layoutedNodes));
      dispatch(setEdges(layoutedEdges));
      setloadPage(!loadPage);
    } catch (error) {
      console.log(error);
    }
  };

  // axios - add new node
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
          orgId: userData.accountData._id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("serverRespose.data.node", serverRespose.data.node)

      dispatch(setSingleNode(serverRespose.data.node));
  
      // const newNode = {id:uniqid(), type: "newNode", parent_id:"", position:{x: 100, y: 100}, data: {features:{businessUnit: false, monitoringUnit: false, billingUnit: false} , label: "New Node"}}

      // setNodes((nds)=>[...nds,newNode])
    } catch (error) {
      console.log(error);
    }
  };

  // axios - create edge
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

  // axios - save flow in server
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
          orgId: userData.accountData._id,
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

  // function- add nodes
  const addNodes = useCallback(() => {
    createNodeInServer();
  }, []);

  // function - handle signout
  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  //  function - handle node delete
  const onNodesDelete = useCallback(
    (deleted) => {
      deletedNodes.push(deleted[0].id);
      dispatch(setSideMenu(false));
    },
    [nodes, edges]
  );

  // function - auto arrage on click
  const onLayout = useCallback(
    (direction) => {
      let nodesCopy = nodes.map((data) => {
        return { ...data };
      });
      let edgesCopy = edges.map((data) => {
        return { ...data };
      });
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodesCopy, edgesCopy, direction);

      dispatch(setNodes([...layoutedNodes]));
      dispatch(setEdges([...layoutedEdges]));
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
         <nav style={{width:'full' , height:'50px', backgroundColor:"#ccc"}}>
            <Typography variant="h4" sx={{textDecoration:"underline", textAlign:"center"}}>
            Billing Arrangement View
            </Typography>
        </nav>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(nds) => dispatch(onNodesChange(nds))}
          onEdgesChange={(eds) => dispatch(onEdgesChange(eds))}
          onConnect={(connection) => dispatch(onConnect(connection))}
          onNodeClick={onNodeClick}
          onNodesDelete={onNodesDelete}
          onNodeDoubleClick={onNodeDoubleClick}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView={true}

          nodeTypes={nodeTypes}
          deleteKeyCode={deletablenode ? "Delete" : ""}
        >
          {loading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          )}

          <Panel position="top-right">
            <Box sx={{ "& > :not(style)": { m: 1 } }}>
              {/* <Fab
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
              </Fab> */}
              <Fab variant="extended" onClick={() => onLayout("TB")}>
                Auto Arrange
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
          <Panel position="top-left">
          <Stack spacing={2}>
              <a href="/">
                <Fab variant="extended" onClick={() =>{
                //navigate("/billingUnits")
                }}>
                  Organizaion View
                </Fab>
              </a>
                <a href="/billingUnits">
                <Fab variant="extended" onClick={() =>{
                //navigate("/billingUnits")
                }}>
                  Billig Units View
                </Fab>
              </a>
              
              <a href="/monitoringUnits">
                <Fab variant="extended" onClick={() =>{
                //navigate("/billingUnits")
                }}>
                  Monitoring Units View
                </Fab>
              </a>

                
              </Stack>
          </Panel>
          {/* <Panel position="top-center">
            <Typography variant="h4" sx={{textDecoration:"underline"}}>
              Billing Arrangement View
            </Typography>

          </Panel> */}
          <Controls style={{marginBottom:"100PX"}} />
          {/* <MiniMap /> */}
          <Background gap={40} variant={"dots"} size={0} color="#ccc" />
        </ReactFlow>
      </ReactFlowProvider>
      {PropertyMenu()}
      <Snackbar
        sx={{
          marginTop: "60px",
        }}
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
// window.addEventListener("beforeunload", (ev) => {
//   console.log("sdjbkjs", ev?.target?.location?.pathname);
//   if (ev?.target?.location?.pathname === "/") {
//     ev.preventDefault();
//     return (ev.returnValue = "Are you sure you want to close?");
//   } else {
//     return true;
//   }
// });

export default BillingFlow;
