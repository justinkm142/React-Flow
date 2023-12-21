import * as React from "react";
import Drawer from "@mui/material/Drawer";
import ImageUploading from "react-images-uploading";
import styled from "@emotion/styled";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import {updateNode } from "../../../../redux/slices/flow.slices"


import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { setSideMenu } from "../../../../redux/slices/flow.slices";


// parant componant 
export default function TemporaryDrawer({
  updateNode,
  
}) {

  const dispatch = useDispatch()

  const openSideMenu = useSelector((state)=> state.flow.openSideMenu)
  const node = useSelector((state)=> state.flow.node)
  const edges = useSelector((state)=> state.flow.edges)
  const nodeNameList = useSelector((state)=> state.flow.nodeNameList)
  
  const toggleDrawer = () => {
    dispatch(setSideMenu(false))
  };

  const Menu = () => (
    <Box sx={{ width: "full" }} role="presentation">
      <Box
        sx={{
          width: "full",
          textAlign: "right",
          padding: "10px",
          backgroundColor: "#ffd6d6",
        }}
      >
        <Typography
          sx={{ cursor: "pointer" }}
          variant="p"
          onClick={toggleDrawer}
        >
          {" "}
          X{" "}
        </Typography>
        <Typography variant="h5" sx={{ textAlign: "center", color: "#fa4b4b" }}>
          {" "}
          Default Buisness Unit Menu{" "}
        </Typography>
      </Box>

      <Divider />

      <FormForUpdate
        toggleDrawer={toggleDrawer}
        node={node}
        updateNode={updateNode}
        nodeNameList={nodeNameList}
      />
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <Drawer
          PaperProps={{
            sx: {
              margin: "10px",
              borderRadius: "10px",
              width: "400px",
            },
          }}
          anchor="right"
          open={openSideMenu}
          onClose={toggleDrawer}
        >
          {Menu()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}



const FormForUpdate = ({ toggleDrawer, nodeNameList }) => {

  const [selectedBusinessData, setSelectedBusinessData] = React.useState({});
  const [currentLogo, setCurrentLogo] = React.useState(
    selectedBusinessData.icon ? selectedBusinessData.icon : ""
  );

  const node = useSelector((state)=>state.flow.node)
  const edges = useSelector((state)=>state.flow.edges);

  const [values, setValues] = React.useState({ ...node });
  const [isDefault, setIsDefault] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);
  const [parantChange, setParantChange] = React.useState({status:false, newParantId:"",oldParantId:"", nodeId:node.id });
  const [parantId, setParantId] = React.useState("")
  const flowStatus = useSelector((state) => state.flow.flowStatus);
  
  React.useEffect(()=>{

    let getparantId = edges.filter((data)=>{
      if(data.target ===values.id){
        return data.source
      }})[0]?.source || ""
      
      setParantId(getparantId)

  },[])



  

  //   const onChangeImageUpload = (imageItem) => {
  //     setCurrentLogo(imageItem[0].dataURL);
  // };

  const handleChange = (e) => {
    if (e.target.name === "buisnessUnitName") {
      let nameList = nodeNameList.map(data=>data.name)
      if(nameList.includes(e.target.value)){
          setNameError(true)
      }else{
        setNameError(false)
      }
      setValues((prev) => {
        return { ...prev, data: { ...prev.data, label: e.target.value } };
      });
    } else if (e.target.name === "description") {
      setValues((prev) => {
        return { ...prev, data: { ...prev.data, description: e.target.value } };
      });
    } else {
      return null;
    }
    console.log(values);
  };

  const handleCheckBox = (e) => {
    if (e.target.id === "buisnessUnitCheckBox") {
      setValues((prev) => {
        return {
          ...prev,
          data: {
            ...prev.data,
            features: { ...prev.data.features, businessUnit: e.target.checked },
          },
        };
      });
    } else if (e.target.id === "monitoringUnitCheckBox") {
      setValues((prev) => {
        return {
          ...prev,
          data: {
            ...prev.data,
            features: {
              ...prev.data.features,
              monitoringUnit: e.target.checked,
            },
          },
        };
      });
    } else if (e.target.id === "billingUnitCheckBox") {
      setValues((prev) => {
        return {
          ...prev,
          data: {
            ...prev.data,
            features: { ...prev.data.features, billingUnit: e.target.checked },
          },
        };
      });
    } else {
      return null;
    }
    console.log(values);
  };

  const ImageBox = styled(Box)`
    width: 80px;
    height: 80px;
    margin: 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;

    &:hover > #closeIcon {
      cursor: pointer;
      display: flex;
      z-index: 2;
    }

    &:hover > #overlayBox {
      opacity: 1;
      cursor: pointer;
    }
  `;

  const OverlayBox = styled(Box)`
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    width: 80px;
    height: 80px;
    z-index: 1;
  `;

  const AutoComplete = styled(Autocomplete)`
    & .MuiInputBase-input {
      height: 2rem;
    }
  `;

  React.useEffect(() => {
    setCurrentLogo(selectedBusinessData.icon ? selectedBusinessData.icon : "");
  }, [selectedBusinessData.icon]);

  const dispatch = useDispatch()

  return (
    <>
      <Box sx={{ width: "full" }}>
        <form>
          <Grid container spacing={10} py={4} sx={{ overflow: "hidden" }}>
            <Grid item md={12} lg={12}>
              <Card sx={{ padding: "2rem", minHeight: "72vh", height: "110%" }}>
              
                <FormControl fullWidth sx={{ height: "7rem" }}>
                  <Stack direction="column" spacing={1} alignItems="baseline">
                    <Typography component="h2" variant="h6" mb={3}>
                      Default Buisness Unit Name
                    </Typography>
                    <TextField
                      name="buisnessUnitName"
                      label={null}
                      fullWidth
                      variant="outlined"
                      type="text"
                      value={values?.data?.label}
                      onChange={handleChange}
                      error={nameError}
                      helperText={ nameError ?  "Name already used" : ''}
                      sx={{
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                      }}
                    />
                  </Stack>
                </FormControl>
                <FormControl fullWidth sx={{ height: "7rem" }}>
                  <Stack direction="column" spacing={1} alignItems="baseline">
                    <Typography component="h2" variant="h6" mb={3}>
                      Description
                    </Typography>
                    <TextField
                      name="description"
                      label={null}
                      multiline={true}
                      rows={3}
                      fullWidth
                      variant="outlined"
                      type="text"
                      value={values?.data?.description}
                      onChange={handleChange}
                      sx={{
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                      }}
                    />
                  </Stack>
                </FormControl>
                <FormControl fullWidth sx={{ marginTop: "2.6rem" }}>
                  <Stack direction="column" spacing={1} alignItems="baseline">
                    <Typography component="h2" variant="h6" mb={3}>
                      Features
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            id="buisnessUnitCheckBox"
                            checked={
                              values?.data?.features?.businessUnit || false
                            }
                            onChange={(e) => {
                              return false;
                            }}
                          />
                        }
                        label="Buisness Unit"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            id="monitoringUnitCheckBox"
                            checked={
                              values?.data?.features?.monitoringUnit || false
                            }
                            onChange={(e) => {
                              return false;
                            }}
                          />
                        }
                        label="Monitoring Unit"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            id="billingUnitCheckBox"
                            checked={
                              values?.data?.features?.billingUnit || false
                            }
                            onChange={(e) => {
                              return false;
                            }}
                          />
                        }
                        label="Billing Unit"
                      />
                      {/* <FormControlLabel control={<Checkbox id='buisnessUnitCheckBox' checked={values?.data?.features?.businessUnit || false } onChange={(e)=>{handleCheckBox(e)}} />} label="Buisness Unit" />
                                              <FormControlLabel control={<Checkbox id='monitoringUnitCheckBox' checked={values?.data?.features?.monitoringUnit || false } onChange={(e)=>{handleCheckBox(e)}} />} label="Monitoring Unit" />
                                              <FormControlLabel control={<Checkbox id='billingUnitCheckBox' checked={values?.data?.features?.billingUnit || false } onChange={(e)=>{handleCheckBox(e)}} />} label="Billing Unit" /> */}
                    </FormGroup>
                  </Stack>
                </FormControl>

                <Stack
                  display="flex"
                  direction="row-reverse"
                  spacing={3}
                  mt={8}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    type="button"
                    disabled={nameError || (flowStatus==="Deployed")}
                    className="btn-theme"
                    onClick={() => {
                      
                      toggleDrawer();
                      
                      dispatch(updateNode({node:{...values},parantChange:{...parantChange},isDefault}))

                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    type="button"
                    className="btn-theme"
                    disabled={false}
                    onClick={toggleDrawer}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
};
