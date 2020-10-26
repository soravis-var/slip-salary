import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import EmployeeList from "./core/EmployeeList";
import EarningDeductableList from "./core/EarningDeductableList";
import WorkPeriodList from "./core/WorkPeriodList";
import WorkDetailsForm from "./core/WorkDetailsForm";
import SummaryReport from "./core/SummaryReport";
import Login from "./core/Login"
import PrivateRoute from './components/PrivateRoute';

import PaySlip from "./core/PaySlip";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        {/* <Route path="/" exact component={EmployeeList} /> */}
        <Route path="/" exact component={Login} />
        <PrivateRoute path="/EmployeeList" exact component={EmployeeList} />
        <PrivateRoute path="/EarningDeductableList" exact component={EarningDeductableList} />
        <PrivateRoute path="/WorkPeriodList" exact component={WorkPeriodList} />
        <PrivateRoute path="/WorkDetailsForm" exact component={WorkDetailsForm} />
        <PrivateRoute path="/PaySlip" exact component={PaySlip} />
        <PrivateRoute path="/SummaryReport" exact component={SummaryReport} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
