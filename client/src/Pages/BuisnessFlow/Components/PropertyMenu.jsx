import DefaultBuisnessUnitMenu from "./PropertyMenu/DefaultBuisnessUnitMenu";
import MonitoringNodeMenu from "./PropertyMenu/MonitoringNodeMenu";
import NewNodeMenu from "./PropertyMenu/NewNodeMenu";
import BuillingUnitNodeMenu from "./PropertyMenu/BillingUnitNodeMenu";
import BuisnessUnitMenu from "./PropertyMenu/BuisnessUnitMenu";

import {  useSelector } from "react-redux";

const PropertyMenu = (  ) => {
 const node = useSelector((state)=>state.flow.node)



  let props = {};



  if (node?.type === "defaultBusinessUnit") {
    return (
      <DefaultBuisnessUnitMenu />
    );
  } else if (node?.type === "newNode") {
    return (
      <NewNodeMenu/>
    );
  } else if (node?.type === "businessUnit") {
    return (
      <BuisnessUnitMenu/>
    );
  } else if (node?.type === "monitoringUnit") {
    return (
      <MonitoringNodeMenu/>
    );
  } else if (node?.type === "billingUnit") {
    return (
      <BuillingUnitNodeMenu/>
    );
  } else {
    return null;
  }
};

export default PropertyMenu;
