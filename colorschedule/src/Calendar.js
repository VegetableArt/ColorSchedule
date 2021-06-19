import React from "react";
import TUICalendar from "@toast-ui/react-calendar";
import "tui-calendar/dist/tui-calendar.css";
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";
import './index.css';
import Header from './Header'
import {monthNames, calendarOptions, addDays, parseDate1} from './settings.js'
import Alert from '@material-ui/lab/Alert';
import { withRouter } from 'react-router-dom';


class Calendar extends React.Component {
  

  constructor(props){
    super(props)
    this.state = {
      startDate: "Init",
      month: "Init",
      year: "Init",
      academicWeek: "Init",
      academicQuarter: "Init",
      error: null,
      isLoaded: false,
      dates: [],
      activities: [],
      selectedGroup: 0,
      selectedYear: 1,
      selectedStudy: "WB"
    }
  }


  updateRange = () => {
    var startD = (this.calendarInstance.getDateRangeStart().toDate().toLocaleDateString('en-US'))
    var month = monthNames[this.calendarInstance.getDateRangeStart().toDate().getMonth()]
    var year = this.calendarInstance.getDateRangeStart().toDate().getFullYear()


    var rta =  this.state.dates.filter(it => new Date(it.date).toLocaleDateString('en-US') == startD);
    var countAW = Object.keys(rta).length;
    var aw = 0;
    var aq = 0;
    if(countAW == 0){
      aw = 0
      aq = 0
    }else{
      if(isFinite(rta[0].week)){
        aw = Number(rta[0].week)
      }else{
        aw = 0
      }
      
      aq = Number(rta[0].quarter)
    }


    var schedules = [];

    
    var groupData = {}
    if(this.state.selectedGroup == 0){
      var relevantActivities =  this.state.activities.filter(it => aw >= it.fromWeek && aw <= it.toWeek && aq == it.quarter && (it.cluster == "Alle") && this.state.selectedYear == it.studyyear && this.state.selectedStudy == it.study);
    }else{
      var relevantActivities =  this.state.activities.filter(it => aw >= it.fromWeek && aw <= it.toWeek && aq == it.quarter && 
              this.state.selectedYear == it.studyyear && 
              this.state.selectedStudy == it.study && 
                (
                  ((it.group+"").split(',').map(x=>+x)).includes(this.state.selectedGroup) ||
                  it.cluster == "Alle" || it.cluster == this.state.selectedCluster || 
                  it.cluster == this.state.selectedClusterAlt
                )
              );

      groupData =  this.state.groups.filter(it => (it.group + "").includes(this.state.selectedGroup) && it.studyyear == this.state.selectedYear && it.study == this.state.selectedStudy)[0];

    }
    
    for (var i = 0; i < relevantActivities.length; i++) {
      
      // Define style of the event
      var calID = "";
      if(relevantActivities[i].domain == "WER"){
        calID = "2"
      }else if(relevantActivities[i].domain == "NAT"){
        calID = "1"
      }else if(relevantActivities[i].domain == "WIS"){
        calID = "3"
      }

      // Gather the relevant activities and group data
      if(relevantActivities[i].type == "PRO"){
        if((relevantActivities[i].dayNumber == 1) || (relevantActivities[i].dayNumber == 2)){
            var table = "Table: " + groupData.table_day1
        }else if((relevantActivities[i].dayNumber == 3) || (relevantActivities[i].dayNumber == 4) || (relevantActivities[i].dayNumber == 5)){
          var table = "Table: " + groupData.table_day2
        }else{
          var table = "No table"
        }
      }else if(relevantActivities[i].type == "WC"){
          var table = "Instructionroom: " + groupData.instructionroom
      }else{
        var table = ""
      }
      
      if("locationOverwrite" in relevantActivities[i] && relevantActivities[i].locationOverwrite != ""){
        var loc = relevantActivities[i].locationOverwrite
      }else{
        var loc = relevantActivities[i].variant
        console.log("HIHI")
      }

      if(relevantActivities[i].comments != null){
        var com = "<br />" + relevantActivities[i].comments
      }else{
        var com = ""
      }

      schedules.push({
        calendarId: calID,
        category: "time",
        raw :{
          table : table
        },
        title: relevantActivities[i].title,
        location: loc,
        body: table + com,
        start: (addDays(parseDate1(startD)+" "+relevantActivities[i].fromHour,relevantActivities[i].dayNumber-1)),
        end: (addDays(parseDate1(startD)+" "+relevantActivities[i].toHour,relevantActivities[i].dayNumber-1))
      })
    }
    this.setState({
      startDate: startD,
      month: month,
      year: Number(year),
      academicWeek: aw,
      academicQuarter: aq,
      schedules: schedules
    },() =>{
      this.calendarInstance.clear();
      this.calendarInstance.createSchedules(schedules);
      this.calendarInstance.render();
    })
  };

  handleClickNextButton = () => {
    this.calendarInstance.next();
    this.updateRange();

  };
  handleClickPreviousButton = () => {
    this.calendarInstance.prev();
    this.updateRange();
  };

  handleClickTodayButton = () => {
    this.calendarInstance.today();
    this.updateRange();
  };

  updateGroupSelection = (groupNum) => {
    var selectData = this.state.groups.filter(it => it.group == groupNum)[0];
    if(selectData == undefined){
      var selCluster = "0";
      var selClusterAlt = "0";
      var selTableOne = "0";
      var selTableTwo = "0";
      var selInstructionroom = "0";
    }else{
      var selCluster = selectData.cluster;
      var selClusterAlt = selCluster.split("-")[0];
      var selTableOne = selectData.table_day1;
      var selTableTwo = selectData.table_day2;
      var selInstructionroom = selectData.instructionroom;
    }

    this.setState({
      selectedGroup: Number(groupNum),
      selectedCluster: selCluster,
      selectedClusterAlt: selClusterAlt,
      selectedTableOne: selTableOne,
      selectedTableTwo: selTableTwo,
      selectedInstructionRoom: selInstructionroom
    },() => {
        this.updateRange();
        this.props.history.push({
          search: '?study='+this.state.selectedStudy+'&year='+this.state.selectedYear+'&group='+groupNum
        });
    })
  };

  updateYearSelection = (yearNum) => {
    this.setState({
      selectedYear: yearNum
    },() => {
        this.updateRange();
        this.props.history.push({
          search: '?study='+this.state.selectedStudy+'&year='+yearNum+'&group='+this.state.selectedGroup
        });
    })
  };


  updateStudySelection = (study) => {
    this.setState({
      selectedStudy: study
    },() => {
        this.updateRange();
        this.props.history.push({
          search: '?study='+study+'&year='+this.state.selectedYear+'&group='+this.state.selectedGroup
        });
        
    })
  };
  componentDidMount() {
    this.calendarRef = React.createRef();

    fetch("/api/dates")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            dates: result
          });
          fetch("/api/activities")
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                activities: result,
              },()=>{
                fetch("/api/groups")
                  .then(res => res.json())
                  .then(
                    (result) => {
                      this.setState({
                        groups: result
                      }, () => {
                        this.calendarInstance = this.calendarRef.current.getInstance();
                        this.handleClickTodayButton()
                        this.updateRange()
                        
                        let search = window.location.search;
                        let params = new URLSearchParams(search);
                        let group = params.get('group');
                        let study = params.get('study');
                        let year = params.get('year');
                        if(group == null || group == "" || study == null || study == "" || year == null || year == ""){
                          this.props.history.push({
                            search: '?study='+this.state.selectedStudy+'&year='+this.state.selectedYear+'&group='+this.state.selectedGroup
                          });
                        }else{
                          this.props.history.push({
                            search: '?study='+study+'&year='+year+'&group='+group
                          });
                        }
                      })
                    }
                  )

                
              });

            })
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded} = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <Alert severity="info">Loading... Take some water and stretch a bit in the meantime</Alert>;
    } else {
      return (
        <span height="100%">
          <Header aq={this.state.academicQuarter} aw={this.state.academicWeek} hct={this.handleClickTodayButton} hcp={this.handleClickPreviousButton} hcn={this.handleClickNextButton} endd={this.state.startDate} startd={this.state.endDate} month={this.state.month} year={this.state.year} ug={this.updateGroupSelection} uy={this.updateYearSelection} us={this.updateStudySelection}/>
      
          
          <TUICalendar style={{"max-height":"100%"}}
            ref={this.calendarRef}
            {...calendarOptions}
          />
        </span>
      );
    }
  }
}

export default withRouter(Calendar)