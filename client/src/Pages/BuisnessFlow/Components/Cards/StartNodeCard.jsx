import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Grid, Card, CardContent, Box } from "@mui/material";
import React from "react";
import { Handle, Position } from "reactflow";
import { useRef } from "react";

export function StartNode(props) {
  const { data, type, id, xPos, yPos } = props;

  const handleConnect = (params) => {};

  return (
    <Card sx={{ width:"200px", height:"120px"}}>
      <CardContent>
        <Grid textAlign={"center"}>
          <AccountTreeIcon fontSize="large" />
          <Box>Start</Box>
        </Grid>
      </CardContent>
      <Handle
        isConnectable={false}
        type="source"
        className="source-handle"
        position={Position.Bottom}
        onConnect={handleConnect}
      />
    </Card>
  );
}
