import React from 'react'
import { Button } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import './index.css';
import { withStyles } from "@material-ui/core/styles";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import HomeIcon from '@material-ui/icons/Home';
import $ from 'jquery';




const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});



class Header extends React.Component {
  
    constructor(props) {
        super(props);
        this.escFunction = this.escFunction.bind(this);
    }
  
    escFunction(event){
      if(event.keyCode === 39) {
        this.props.hcn()
      }else if(event.keyCode === 37){
        this.props.hcp()
      }
    }

    handleSelectChangeGroup = (event) => {
      this.props.ug(event.target.value)
    }
    handleSelectChangeYear = (event) => {
      this.props.uy(event.target.value)
    }
    handleSelectChangeStudy = (event) => {
      this.props.us(event.target.value)
    }
    componentDidMount(){
      document.addEventListener("keydown", this.escFunction, false);
      setTimeout(function() { //Start the timer
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let group = params.get('group');
        let study = params.get('study');
        let year = params.get('year');
        console.log(year)
        $('.groupSelect option[value="'+group+'"]').attr('selected','selected');
        $('.yearSelect option[value="'+year+'"]').attr('selected','selected');
        $('.studySelect option[value="'+study+'"]').attr('selected','selected');
      

        this.handleSelectChangeGroup({target:{value:group}})
        this.handleSelectChangeYear({target:{value:year}})
        this.handleSelectChangeStudy({target:{value:study}})
      }.bind(this), 500)

    }
    componentWillUnmount(){
      document.removeEventListener("keydown", this.escFunction, false);
    }
  render() {
      const {classes} = this.props
      return (
        <div className="Header">
      <AppBar style={{ background: '#00a6d6' }} position="static">
        <Toolbar>
        <Typography variant="h6" className={classes.title}>
         Color<br />Schedule
          </Typography>
          <Paper variant="outlined" style={{"padding":"3px 5px 3px 5px", "margin":"3px 0px 3px 5px"}}>{this.props.year}-{this.props.month}</Paper>
          <Paper variant="outlined" style={{"padding":"3px 5px 3px 5px", "margin":"3px 0px 3px 5px"}}>Q{this.props.aq}:{((this.props.aw != 0) ? this.props.aw : '-')}</Paper> &nbsp;&nbsp;
          <ButtonGroup color="primary" >
            <Button style={{ background: '#002C53' }}  variant="contained" size="small" onClick={this.props.hct}><HomeIcon /></Button>
            <Button style={{ background: '#002C53' }}  variant="contained" size="small" onClick={this.props.hcp}><ArrowBackIcon /></Button>
            <Button style={{ background: '#002C53' }}  variant="contained" size="small" onClick={this.props.hcn}><ArrowForwardIcon /></Button>
          </ButtonGroup>
        </Toolbar>

        <Paper square>
      <FormControl style={{marginLeft:"20px"}} className={classes.formControl}>
        <InputLabel htmlFor="grouped-select">Study</InputLabel>
        <Select native defaultValue="" className="studySelect" id="grouped-select" onChange={this.handleSelectChangeStudy}>
          <option aria-label="None" value={"WB"} >WB</option>
          <option aria-label="None" value={"MM"} >MM</option>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="grouped-select">Year</InputLabel>
        <Select native defaultValue="" className="yearSelect" id="grouped-select" onChange={this.handleSelectChangeYear}>
          {[1,2].map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="grouped-select">Group</InputLabel>
        <Select native id="grouped-select" className="groupSelect" onChange={this.handleSelectChangeGroup}>
          <option aria-label="None" value={0} >Only all</option>

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
          
          {[16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
          
          {[31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45].map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
          
          {[46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60].map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
          
          {[61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75].map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
          
          {[76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90].map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        </Select>
      </FormControl>
      </Paper>
      </AppBar>
          
          
        </div>
      );
    }
  }
  
  export default withStyles(styles)(Header)