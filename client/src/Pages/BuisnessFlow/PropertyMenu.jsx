import DefaultBuisnessUnitMenu from "./Components/PropertyMenu/DefaultBuisnessUnitMenu";
import MonitoringNodeMenu from "./Components/PropertyMenu/MonitoringNodeMenu";
import NewNodeMenu from "./Components/PropertyMenu/NewNodeMenu";
import BuillingUnitNodeMenu from "./Components/PropertyMenu/BillingUnitNodeMenu";
import BuisnessUnitMenu from "./Components/PropertyMenu/BuisnessUnitMenu";

import {  useSelector } from "react-redux";

const PropertyMenu = (  ) => {
 const node = useSelector((state)=>state.flow.node)

  let props = {};



  if (node?.type === "defaultBusinessUnit") {
    return (
      <DefaultBuisnessUnitMenu
        

      />
    );
  } else if (node?.type === "newNode") {
    return (
      <NewNodeMenu
        // handleSideMenu={handleSideMenu}
        // openSideMenu={openSideMenu}
        // node={node}
        // updateNode={updateNode}
        // nodeNameList={nodeNameList}
        // edges={edges}
      />
    );
  } else if (node?.type === "businessUnit") {
    return (
      <BuisnessUnitMenu
        // handleSideMenu={handleSideMenu}
        // openSideMenu={openSideMenu}
        // node={node}
        // updateNode={updateNode}
        // nodeNameList={nodeNameList}
        // edges={edges}
      />
    );
  } else if (node?.type === "monitoringUnit") {
    return (
      <MonitoringNodeMenu
        // handleSideMenu={handleSideMenu}
        // openSideMenu={openSideMenu}
        // node={node}
        // updateNode={updateNode}
        // nodeNameList={nodeNameList}
        // edges={edges}
      />
    );
  } else if (node?.type === "billingUnit") {
    return (
      <BuillingUnitNodeMenu
        // handleSideMenu={handleSideMenu}
        // openSideMenu={openSideMenu}
        // node={node}
        // updateNode={updateNode}
        // nodeNameList={nodeNameList}
        // edges={edges}
      />
    );
  } else {
    return null;
  }
};

export default PropertyMenu;
