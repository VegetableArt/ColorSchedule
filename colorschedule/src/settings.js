import moment from 'moment';

export const monthNames = ["01", "02", "03", "04", "05", "06",
  "07", "08", "09", "10", "11", "12"
];

export const calendars = [
    {
      id: "1",
      name: "Natuurkunde",
      color: "white",
      bgColor: "#009780",
      dragBgColor: "#9e5fff",
      borderColor: "#00A6D6"
    },
    {
      id: "2",
      name: "Werktuigbouwkunde",
      color: "white",
      bgColor: "#0059A8",
      dragBgColor: "#00a9ff",
      borderColor: "#00A6D6"
    },
    {
      id: "3",
      name: "Wiskunde",
      color: "white",
      bgColor: "#F0972D",
      dragBgColor: "#00a9ff",
      borderColor: "#00A6D6"
    }
  ];

const templates = {
timegridDisplayPrimaryTime: function(time) {
    var hour = time.hour;
    return hour + ':00'
},
time: function(time) {
  console.log(time)  
  return "<span style='font-size:13px'>" + time.title + "</span><br><span style='font-size:10px'>" + time.location + "</span><br><span style='font-size:10px'>" + time.raw.table + '</span>';
},
popupDetailDate: function(isAllDay, start, end) {
  var isSameDate = moment(start).isSame(end);
  if (isAllDay) {
      return moment(start).format('YYYY.MM.DD') + (isSameDate ? '' : ' - ' + moment(end).format('YYYY.MM.DD'));
  }
  if(new Date(start).getMinutes()==0){
    var startMin = "00"
  }else{
    var startMin = new Date(start).getMinutes()
  }
  if(new Date(end).getMinutes()==0){
    var endMin = "00"
  }else{
    var endMin = new Date(end).getMinutes()
  }
  return (new Date(start).getHours() + ":" + startMin + ' - ' +new Date(end).getHours() + ":" + endMin);
}
};


var themeConfig = {
  'week.daygridLeft.width': '40px',
  'week.timegridLeft.width': '40px',

}


export var calendarOptions = {
    view:"week",
    useCreationPopup:true,
    useDetailPopup:true,
    template:templates,
    theme: themeConfig,
    calendars:calendars,
    disableClick:true,
    taskView :false,
    isReadOnly :true,
    week : {
      startDayOfWeek : 1,
      workweek: true,
      hourStart: 7,
      hourEnd: 22
    },
    bgColor: "#000000"
  };

export  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  
  export function parseDate1(input) {
    var str = input;
    var dmy = str.split("/");
    var year = dmy[2];
    var month = "";
    var day = "";
    if(dmy[0]<10){
      month = "0"+dmy[0];
    }else{
      month = dmy[0];
    }
    if(dmy[1]<10){
      day = "0" + dmy[1]
    }else{
      day = dmy[1];
    }
    
    var d = (year + '-' +month + '-' + day);
    return d  
  }



export default { monthNames: monthNames, calendarOptions: calendarOptions, addDays: addDays, parseDate1: parseDate1 } 