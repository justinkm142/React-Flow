import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Grid, Card, CardContent, Box, Typography,Stack,Paper } from "@mui/material";
import React from "react";
import { Handle, Position } from "reactflow";
import { useRef } from "react";
import TroubleshootOutlinedIcon from '@mui/icons-material/TroubleshootOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import SchemaOutlinedIcon from '@mui/icons-material/SchemaOutlined';
import { styled } from '@mui/material/styles';
import { red } from "@mui/material/colors";
import AddIcon from '@mui/icons-material/Add';




const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));



export function DefaultBusinessUnit(props) {
  const handleConnect = (params) => {};

  return (
    <Card sx={{ width:"250px", height:"120px" }}>
      {/* <Handle type="target" position={Position.Top} onConnect={handleConnect} isConnectable={false} /> */}
      <CardContent sx={{ backgroundColor: "", padding: "0px" }}>
      <Box
          sx={{
            display: "flex",
            width: "full",
            backgroundColor: "#ffd6d6",
            height: "30px",
            marginBottom: "20px",
          }}
        >

        <Box
          sx={{
            marginBottom: "20px",
            height:"30px",
            textAlign: "center",
            backgroundColor: "#ffd6d6",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
              width: "90%",
          }}
        >

          <Stack direction={"row"} sx={{marginRight:"5px", color:"#fa4b4b"}}>
            <SchemaOutlinedIcon sx={{rotate:"0deg", fontSize: "15px"}}/>
            {/* {props.data.features.businessUnit ? <StorefrontOutlinedIcon fontSize="small" />: ""}
            {props.data.features.monitoringUnit ? <TroubleshootOutlinedIcon fontSize="small" />: ""}
            {props.data.features.billingUnit ? <ReceiptOutlinedIcon fontSize="small" />: ""} */}
          </Stack>

          <Typography variant="p" sx={{ fontSize: "20px", color: "#fa4b4b", display:"block" }}>
              Default Buisness Unit 
          </Typography>
         
        </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              width: "25px",
              height: "25px",
              transition: "transform 0.2s",
              marginRight:"10px",
              marginY:"auto",
              ":hover": {
                transform: "scale(1.3)", // Increase the scale on hover
              },
              cursor: "pointer",
            }}
          >
            <AddIcon
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                color: "#075985", // Change the icon color as needed
                zIndex: 1, // Adjust the z-index to control the stacking order
                maskImage:
                  "radial-gradient(circle, transparent 100%, black 100%)", // Adjust the mask gradient as needed
              }}
            />
            <div
              id="id-addNodeButton"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.0)", // Change the color and opacity as needed
                zIndex: 2, // Adjust the z-index to control the stacking order
              }}
            ></div>
          </Box>
          </Box>
        <Box sx={{ textAlign: "center" }}>{props.data.label}</Box>
      </CardContent>
      <Handle
        isConnectable={true}
        type="source"
        position={Position.Bottom}
        onConnect={handleConnect}
      />
    </Card>
  );
}
