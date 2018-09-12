import React from "react";
import styles from "./UserInfoScreen.css";

import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


class UserInfoScreen extends React.Component {
  state = {
    activeStep: 0,
    value: 'female',
    fSrc:"../src/image/girlSelected.png",
    mSrc: "../src/image/boy.png",
    name: "",
    age:5
  };
  getSteps= () => {
    return [
      "Select master blaster campaign settings",
      "Create an ad group",
      "Create an ad",
    ];
  }

  
  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
         <div>
                <h1>Right your name here</h1>
                <TextField 
                    className={styles.userName}
                    id="name"
                    label="your Name"
                    placeholder="write here your name"
                    onChange={this.nameInput}
                    margin="normal"
                />
         </div>
            
        );
      case 1:
        return (
          <div>
          <h1>Are you .... ?</h1>
          <RadioGroup className={styles.gender}
          aria-label="Gender"
          name="gender1"
          value={this.state.value}
          onChange={this.handleChange}
        >
          <FormControlLabel value="female" control={<Radio className={styles.genderIcon}/>}
           label={<img className={styles.genderImage} src={this.state.fSrc} />}
           />
          <FormControlLabel value="male" control={<Radio className={styles.genderIcon}/>}
          label={<img className={styles.genderImage} src={this.state.mSrc} />}
           />
        </RadioGroup>
        </div>
        );
      case 2:
            return (
                <div>
                    <Select
                        value={this.state.age}
                        inputProps={{
                            name: 'age',
                            id: 'age-simple',
                        }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </div>
                );
      default:
        return "Uknown stepIndex";
    }
  }
  nameInput = event => {
      console.log(event.target.value)
      this.setState({
          name: event.target.value
      });
  }
  handleChange = event => {
    this.setState({ value: event.target.value });
    console.log(event.target.value)
    if( event.target.value==="female"){
      this.setState({
        fSrc:"../src/image/girlSelected.png",
        mSrc:"../src/image/boy.png"
      })
    }else if(event.target.value==="male"){
      this.setState({
        mSrc:"../src/image/boySelected.png",
        fSrc:"../src/image/girl.png"
      })
    }   
 

  };
  handleNext = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep + 1,
    });
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1,
    });
  };



  render() {
    const steps = this.getSteps();
    const { activeStep } = this.state;

    return (
      <div className={styles.root}>
          {this.getStepContent(activeStep)}
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => {
            return (
              <Step key={label}>
                <StepLabel className={styles.stepIconColor}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div>
          {this.state.activeStep === steps.length ? (
            <div>
              <Typography className={styles.instructions}>
                All steps completed
              </Typography>
            </div>
          ) : (
            <div>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={styles.backButton}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleNext}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default UserInfoScreen;
