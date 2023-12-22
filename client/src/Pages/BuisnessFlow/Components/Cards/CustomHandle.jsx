import React, { useMemo } from 'react';
import { getConnectedEdges, Handle, useNodeId, useStore } from 'reactflow';

const selector = (s) => ({
    nodeInternals: s.nodeInternals,
    edges: s.edges,
});


const CustomHandle = (props) => {
    const { nodeInternals, edges } = useStore(selector);
    const nodeId = useNodeId();

    const isHandleConnectable = useMemo(() => {
       

        if (typeof props.isConnectable === 'number') {
            const node = nodeInternals.get(nodeId);
            debugger
            const connectedEdges = getConnectedEdges([node], edges);

            const connectedEdgesTemp = connectedEdges.filter((data)=>data.target === node.id)

            return connectedEdgesTemp.length < props.isConnectable;
        }

        return props.isConnectable;
    }, [nodeInternals, edges, nodeId, props.isConnectable]);

    return (

        <Handle {...props} isConnectable={isHandleConnectable} ></Handle>
    );
};

export default CustomHandle;
