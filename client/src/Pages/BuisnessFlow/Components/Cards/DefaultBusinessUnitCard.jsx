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
    <Card sx={{ maxWidth: 150, minWidth: 150 }}>
      <Handle type="target" position={Position.Top} onConnect={handleConnect} />
      <CardContent sx={{ backgroundColor: "", padding: "0px" }}>
        <Box
          sx={{
            marginBottom: "20px",
            height:"30px",
            textAlign: "center",
            backgroundColor: "#ffd6d6",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="p" sx={{ fontSize: "10px", color: "#fa4b4b", display:"block" }}>
            {props.type}
          </Typography>
          <Stack direction={"row"} sx={{marginLeft:"5px", color:"black"}}>
            <SchemaOutlinedIcon sx={{rotate:"0deg"}}/>
            {/* {props.data.features.businessUnit ? <StorefrontOutlinedIcon fontSize="small" />: ""}
            {props.data.features.monitoringUnit ? <TroubleshootOutlinedIcon fontSize="small" />: ""}
            {props.data.features.billingUnit ? <ReceiptOutlinedIcon fontSize="small" />: ""} */}
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
