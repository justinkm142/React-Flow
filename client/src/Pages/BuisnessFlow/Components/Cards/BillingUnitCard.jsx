import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Grid, Card, CardContent, Box, Typography,Stack,Tooltip } from "@mui/material";
import React from "react";
import { Handle, Position } from "reactflow";
import { useRef } from "react";
import TroubleshootOutlinedIcon from '@mui/icons-material/TroubleshootOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import AddIcon from '@mui/icons-material/Add';



export function BillingUnit(props) {
  const handleConnect = (params) => {};

  return (
    <Card id="xxxxyy" sx={{ width:"200px", height:"120px" }}>
      <Handle type="target" position={Position.Top} onConnect={handleConnect} />
      <CardContent sx={{ backgroundColor: "", padding: "0px" }}>
        <Box sx={{display:"flex", width:"full", backgroundColor: "#bfe9ff", height:"30px", marginBottom: "20px"}}>  
        <Box
          sx={{
            marginBottom: "20px",
            textAlign: "center",
            backgroundColor: "#bfe9ff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height:"30px",
            width:"90%"
          }}
        >
        
          <Stack direction={"row"} sx={{marginRight:"5px", color:"#075985"}}>
            {props.data.features.businessUnit ? <StorefrontOutlinedIcon  style={{ fontSize: "15px" }} />: ""}
            {props.data.features.monitoringUnit ? <TroubleshootOutlinedIcon style={{ fontSize: "15px" }} />: ""}
            {props.data.features.billingUnit ? <ReceiptOutlinedIcon style={{ fontSize: "15px" }}/>: ""}
          </Stack>

          <Typography variant="p" sx={{ fontSize: "20px", color: "#075985" }}>
              Billing Unit
          </Typography>

        </Box>
        {/* <Box
            
            sx={{display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor:"pointer"}}> 
            
              <div id="id-addNode">
              <AddIcon />
              </div>
            
        </Box> */}
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
