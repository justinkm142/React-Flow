import * as React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import styled from "@emotion/styled";

import PropTypes from 'prop-types';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import { Popper as BasePopper } from '@mui/base/Popper';

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


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





export default function TemporaryDrawer({
  handleSideMenu,
  openSideMenu,
  node,
  updateNode,
  nodeNameList,
  edges
}) {
  const [state, setState] = React.useState(true);

  const toggleDrawer = () => {
    handleSideMenu(false);
  };

  const Menu = () => (
    <Box sx={{ width: "full" }} role="presentation">
      <Box
        sx={{
          width: "full",
          textAlign: "right",
          padding: "10px",
          backgroundColor: "#73f6d1",
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
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          {" "}
          New Node Menu{" "}
        </Typography>
      </Box>

      <Divider />

      <FormForUpdate
        toggleDrawer={toggleDrawer}
        node={node}
        updateNode={updateNode}
        nodeNameList={nodeNameList}
        edges={edges}
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



// child component 
const FormForUpdate = ({ toggleDrawer, node, updateNode, nodeNameList , edges }) => {
  const [selectedBusinessData, setSelectedBusinessData] = React.useState({});
  const [currentLogo, setCurrentLogo] = React.useState(
    selectedBusinessData.icon ? selectedBusinessData.icon : ""
  );

  const [values, setValues] = React.useState({ ...node });
  const [isDefault, setIsDefault] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);
  const [parantChange, setParantChange] = React.useState({status:false, newParantId:"",oldParantId:"", nodeId:node.id });
  const [parantId, setParantId] = React.useState("")

  //   const onChangeImageUpload = (imageItem) => {
  //     setCurrentLogo(imageItem[0].dataURL);
  // };


  React.useEffect(()=>{

    let getparantId = edges.filter((data)=>{
      if(data.target ===values.id){
        return data.source
      }})[0]?.source || ""
      
      setParantId(getparantId)

  },[])

  const handleChange = (e) => {
    if (e.target.name === "name") {
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
    } else if (e.target.id === "makeDefaultBusinessUnit"){
      setIsDefault(e.target.checked)
      if(e.target.checked){
        setValues((prev) => {
          return {
            ...prev,
            data: {
              ...prev.data,
              features: { ...prev.data.features, billingUnit: true,monitoringUnit:true,businessUnit:true },
            },
          };
        });
      }
    } 
    else {
      return null;
    }
    console.log(values);
  };


  React.useEffect(() => {
    setCurrentLogo(selectedBusinessData.icon ? selectedBusinessData.icon : "");
  }, [selectedBusinessData.icon]);

  const handleParantChange = (e)=>{
    let oldParantId = edges.filter((data)=>{
      if(data.target ===values.id){
        
        return data
      }
      
    })[0]?.source || ""

    let newParantId = e.target.value
    setParantId(e.target.value)
   
    if (oldParantId===newParantId){
      setParantChange({...parantChange, status:false, newParantId:newParantId,oldParantId:oldParantId})
    }else{
      setParantChange({...parantChange, status:true, newParantId:newParantId,oldParantId:oldParantId})
    }

    console.log("parantChange", parantChange)
  } 

  return (
    <>
      <Box sx={{ width: "full" }}>
        <form>
          <Grid container spacing={10} py={4} sx={{ overflow: "hidden" }}>
            <Grid item md={12} lg={12}>
              <Card sx={{ padding: "2rem", minHeight: "72vh", height: "110%" }}>
                {/* <FormControl fullWidth>
                                        <Stack direction="column" spacing={1} alignItems="baseline" mb={4}>
                                            <Typography component="h2" variant="h6" mb={3}>
                                              
                                            </Typography>
                                            <ImageUploading maxFileSize={2107637} acceptType={['jpg', 'png', 'jpeg']}
                                                            maxNumber={1} onChange={onChangeImageUpload}>
                                                {({onImageUpload, dragProps, errors}) => (
                                                    <Card className="p_img-upload "
                                                          onClick={onImageUpload}  {...dragProps}
                                                          sx={{
                                                              border: '1px dashed #6C757D',
                                                              cursor: 'pointer',
                                                              height: '122px !important',
                                                              display: 'flex',
                                                              width: "100%",
                                                              flexDirection: 'column',
                                                              alignItems: 'stretch',
                                                              borderRadius:'10px'
                                                          }}>
                                                        <CardContent sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            paddingBottom: 0
                                                        }}>
                                                           < CloudUploadOutlinedIcon fontSize='large' />
                                                          <Stack> Drag your image here or Click to upload </Stack>
                                                            
                                                        </CardContent>
                                                        {errors && (<Stack> {errors.maxNumber && <Alert
                                                            severity="error"></Alert>}
                                                            {errors.acceptType && <Alert
                                                                severity="error"></Alert>}
                                                            {errors.maxFileSize && <Alert
                                                                severity="error"></Alert>}
                                                        </Stack>)
                                                        }
                                                    </Card>
                                                )}
                                            </ImageUploading>
                                            {currentLogo && <ImageBox>
                                                <OverlayBox id="overlayBox"/>
                                                {<CloseIcon id="closeIcon" sx={{
                                                    position: "absolute",
                                                    backgroundColor: "#fff",
                                                    display: "none",
                                                    padding: "2px",
                                                    zIndex: 2,
                                                    borderRadius: "50%"
                                                }} color="primary" onClick={() => setCurrentLogo('')}/>}
                                                <Box py={2} component="img" src={currentLogo} 
                                                     sx={{width: "80px", height: "80px"}}/></ImageBox>}
                                        </Stack>
                                    </FormControl> */}
                <FormControl fullWidth sx={{ height: "7rem" }}>
                  <Stack direction="column" spacing={1} alignItems="baseline">
                    <Typography component="h2" variant="h6" mb={3}>
                      New Node Name
                    </Typography>
                    <TextField
                      name="name"
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
                  <FormGroup>

                        <FormControlLabel
                          control={
                            <Checkbox
                              id="makeDefaultBusinessUnit"
                              checked={
                                isDefault || false
                              }
                              onChange={(e) => {
                                handleCheckBox(e);
                              }}
                            />
                          }
                          label="Make Default BusinessUnit"
                        />

                        </FormGroup>

                        <Typography component="h2" variant="h6" mb={3}>
                        Parent Business Unit
                    </Typography>
                    <FormGroup>
                      
                          
                                    <TextField
                                    fullWidth={true}
                                    select
                                    disabled={isDefault}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        SelectProps={{
                                          MenuProps: {
                                              sx: {maxHeight: 400, maxWidth: 250},
                                              PaperProps: {sx: {boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px', borderRadius: '8px'},
                                                    }
                                          }
                                      }}
                                      sx={{
                                          '& legend': {display: 'none'},
                                          '& fieldset': {top: 0},
                                          width:"330px"

                                      }}

                                        label=""
                                        value={parantId}
                                        onChange={(e)=>{handleParantChange(e)}} 
                                        
                                      >
                                        {
                                          
                                          nodeNameList.map((data, key)=>{
                                            console.log(parantId,"<<<<<>>>>>>",data.id)
                                                 if(data.id!=values.id && data.id !="stratNodeId"){
                                                  
                                                  return <MenuItem  key={key} value={data.id}>{data.name}</MenuItem>
                                                 } 
                                                return null
                                          })}
                   
                                      </TextField>

                        
                 
                    
                    </FormGroup>
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
                              handleCheckBox(e);
                            }}
                          />
                        }
                        label="Business Unit"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            id="billingUnitCheckBox"
                            checked={
                              values?.data?.features?.billingUnit || false
                            }
                            onChange={(e) => {
                              handleCheckBox(e);
                            }}
                          />
                        }
                        label="Billing Unit"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            id="monitoringUnitCheckBox"
                            checked={
                              values?.data?.features?.monitoringUnit || false
                            }
                            onChange={(e) => {
                              handleCheckBox(e);
                            }}
                          />
                        }
                        label="Monitoring Unit"
                      />
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
                    disabled={nameError}
                    className="btn-theme"
                    onClick={() => {
                      toggleDrawer();
                      updateNode(values,isDefault,parantChange);
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







