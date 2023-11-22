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

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

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
          Billing Unit Menu{" "}
        </Typography>
      </Box>

      <Divider />

      <FormForUpdate
        toggleDrawer={toggleDrawer}
        node={node}
        updateNode={updateNode}
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

const FormForUpdate = ({ toggleDrawer, node, updateNode }) => {
  const [selectedBusinessData, setSelectedBusinessData] = React.useState({});
  const [currentLogo, setCurrentLogo] = React.useState(
    selectedBusinessData.icon ? selectedBusinessData.icon : ""
  );

  const [values, setValues] = React.useState({ ...node });
  const [isDefault, setIsDefault] = React.useState(false);

  //   const onChangeImageUpload = (imageItem) => {
  //     setCurrentLogo(imageItem[0].dataURL);
  // };

  const handleChange = (e) => {
    if (e.target.name === "name") {
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
                      Billing Unit Name
                    </Typography>
                    <TextField
                      name="name"
                      label={null}
                      fullWidth
                      variant="outlined"
                      type="text"
                      value={values?.data?.label}
                      onChange={handleChange}
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
                    disabled={false}
                    className="btn-theme"
                    onClick={() => {
                      toggleDrawer();
                      updateNode(values,isDefault);
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
