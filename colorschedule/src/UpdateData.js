import axios from 'axios';
import React,{Component} from 'react'; 
import Paper from '@material-ui/core/Paper';
import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';


const styles = theme => ({
    gridje: {
        background: '#00a6d6'
      },
    papertje: {
        textAlign: "center",
        width: "auto",
        padding: "50px"
    }
  });

class UpdateData extends Component { 
    state = { 
      // Initially, no file is selected 
      selectedFile: null,
      fileUploaded: false,
      databaseUpdated: false
    }; 
     
    // On file select (from the pop up) 
    onFileChange = event => { 
      // Update the state 
      this.setState({ selectedFile: event.target.files[0] }); 
    }; 
     
    // On file upload (click the upload button) 
    onFileUpload = () => { 
      // Create an object of formData 
      const formData = new FormData(); 
     
      // Update the formData object 
      formData.append( 
        "file", 
        this.state.selectedFile, 
        this.state.selectedFile.name 
      ); 
     
      // Request made to the backend api 
      // Send formData object 
      var self = this;
      axios.post("api/upload", formData).then(function (response) {
        // handle success
        console.log(response);
        self.setState({
            fileUploaded: true,
        })
        fetch("/api/excelFile")
            .then(res => {
                console.log(res)
                console.log("DONE");
                self.setState({
                    databaseUpdated: true
                })
            })
      }); 
    }; 
     
    isFileUploaded = () => {
        const {classes} = this.props
        if(this.state.selectedFile){
            return (
                <p>Selected filename: <b>{this.state.selectedFile.name}</b>
                <br /><br />
                <Button style={{ background: '#00a6d6', color: "white" }}  variant="contained" size="large"  onClick={this.onFileUpload}>Upload</Button>
                </p>
            )
        }
    }

    // Show page
    showPage = () => { 
        if(this.state.databaseUpdated){
            return ( 
                <div>
                  <p>The database is updated!</p> 
                  <p><a href="/calendar">View calendar</a> or <a href="/admin">perform another update</a></p> 
                </div>
              ); 
          }else if(this.state.fileUploaded) { 
            return ( 
                <div>
                  <p>The file is uploaded, the database will update now. Please wait until a new message is shown.</p> 
                </div>
              ); 
          } else { 
            return ( 
                  <div>
                  <p>Select the new excel file and then click upload. <br />Make sure that you have not changed any sheetnames or column names.</p> 
                  <Button variant="contained" size="small" component="label"> Select file
                    <input  accept="application/vnd.ms-excel.sheet.macroEnabled.12, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={this.onFileChange} type="file" hidden/>
                    </Button>
                    <br /><br />
                  {this.isFileUploaded()}
                </div>
            ); 
          } 
    }; 
     
    render() { 
     const {classes} = this.props

     return(
        <Grid className={classes.gridje}
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '100vh' }}
                    >
            <Paper elevation={3} className={classes.papertje}>
                <h2>Update colorschedule</h2>
                {this.showPage()}
            </Paper>
        </Grid>
     )

    } 
  } 
  
  export default withStyles(styles)(UpdateData);