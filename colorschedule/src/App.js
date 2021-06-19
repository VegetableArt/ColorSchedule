import React from "react";
import Calendar from './Calendar'
import UpdateData from './UpdateData'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  Redirect
} from "react-router-dom";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  


  render() {
    return (
          <Router>
          
          <span height="100%">
          <Switch>
          <Route
                exact
                path="/"
                render={() => {
                    return (
                      <Redirect to="/calendar" />
                    )
                }}
              />
            <Route path="/calendar">
              <Calendar />
            </Route>
            <Route path="/admin">
              <UpdateData />
            </Route>
          </Switch>
        </span>
        </Router>
        


        );
  }
}

export default App