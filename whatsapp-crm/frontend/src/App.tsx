import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserDashboard from './pages/UserDashboard';
// Import other necessary components and pages

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/dashboard" component={UserDashboard} />
        {/* Add other routes for regular users */}
      </Switch>
    </Router>
  );
};

export default App;