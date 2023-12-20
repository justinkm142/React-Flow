import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Grid, Card, CardContent, Box, Typography,Stack,Tooltip } from "@mui/material";
import React from "react";
import { Handle, Position } from "reactflow";
import { useRef } from "react";
import TroubleshootOutlinedIcon from '@mui/icons-material/TroubleshootOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import AddIcon from '@mui/icons-material/Add';
import CustomHandle from "./CustomHandle";
import {useSelector } from "react-redux";



export function BillingUnit(props) {
  const flowStatus = useSelector((state)=>state.flow.flowStatus)
  const handleConnect = (params) => {};

  


  return (
    <Card sx={{ width: "220px", height: "120px" }}>
      <CustomHandle type="target" position={Position.Top} isConnectable={1} /> 
      {/* <Handle type="target" position={Position.Top} onConnect={handleConnect} /> */}
      <CardContent sx={{ backgroundColor: "", padding: "0px" }}>
        <Box
          sx={{
            display: "flex",
            width: "full",
            backgroundColor: "#bfe9ff",
            height: "30px",
            marginBottom: "20px",
          }}
        >
          <Box
            sx={{
              marginBottom: "20px",
              textAlign: "center",
              backgroundColor: "#bfe9ff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30px",
              width: "90%",
            }}
          >
            <Stack
              direction={"row"}
              sx={{ marginRight: "5px", color: "#075985" }}
            >
              {props.data.features.businessUnit ? (
                <StorefrontOutlinedIcon style={{ fontSize: "15px" }} />
              ) : (
                ""
              )}
              {props.data.features.monitoringUnit ? (
                <TroubleshootOutlinedIcon style={{ fontSize: "15px" }} />
              ) : (
                ""
              )}
              {props.data.features.billingUnit ? (
                <ReceiptOutlinedIcon style={{ fontSize: "15px" }} />
              ) : (
                ""
              )}
            </Stack>

            <Typography variant="p" sx={{ fontSize: "20px", color: "#075985" }}>
              Billing Unit
            </Typography>
          </Box>
          
          <Box sx={{width:"26px", height:"25px"}}>  
          {flowStatus==="Draft"  && 
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
          }
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
