import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Grid, Card, CardContent, Box, Typography,Stack } from "@mui/material";
import React from "react";
import { Handle, Position } from "reactflow";
import { useRef } from "react";
import TroubleshootOutlinedIcon from '@mui/icons-material/TroubleshootOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';

export function BillingUnit(props) {
  const handleConnect = (params) => {};

  return (
    <Card sx={{ maxWidth: 150, minWidth: 150 }}>
      <Handle type="target" position={Position.Top} onConnect={handleConnect} />
      <CardContent sx={{ backgroundColor: "", padding: "0px" }}>
        <Box
          sx={{
            marginBottom: "20px",
            textAlign: "center",
            backgroundColor: "#bfe9ff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height:"30px",
          }}
        >
          <Typography variant="p" sx={{ fontSize: "10px", color: "#075985" }}>
            {props.type}
          </Typography>
          <Stack direction={"row"} sx={{marginLeft:"5px", color:"black"}}>
            {props.data.features.businessUnit ? <StorefrontOutlinedIcon fontSize="small" />: ""}
            {props.data.features.monitoringUnit ? <TroubleshootOutlinedIcon fontSize="small" />: ""}
            {props.data.features.billingUnit ? <ReceiptOutlinedIcon fontSize="small" />: ""}
          </Stack>
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
