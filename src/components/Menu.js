import React, { useState, useEffect } from "react";
import { withRouter, NavLink } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import PaySlipModal from "../components/PaySlipModal";
import "../style.css";

const logout = () => {
  firebase
    .auth()
    .signOut()
    .then(function () {
      console.log("logout");
    })
    .catch(function (error) {
      console.log(error);
    });
  localStorage.clear();
};

const isActive = (history, path) => {
  if (history.location.pathname === path){
    return { color: "#000000"}
  }else{
    // return { color: "#ffffff"}
  }
}

const Menu = ({ history }) => {
  var [modalFormShow, setModalFormShow] = useState(false);

  const redirectPaySlip = (obj) => {
    localStorage.setItem("paySlipPeriodId", obj);
    // to force useEffect in paySlip to update, incase you're on payslip page
    history.push("/PaySLip");
    window.location.reload();
  };

  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink class="navbar-brand" to="/EmployeeList">
          Slip Salary
        </NavLink>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav" id="menu">
            <NavLink class="nav-item nav-link" to="/EmployeeList" style={isActive(history, '/EmployeeList')}>
              พนักงาน
            </NavLink>
            <NavLink class="nav-item nav-link" to="/EarningDeductableList" style={isActive(history, '/EarningDeductableList')}>
              รายการ(เงิน)
            </NavLink>
            <NavLink class="nav-item nav-link" to="/WorkPeriodList" style={isActive(history, '/WorkPeriodList')}>
              งวด
            </NavLink>
            <NavLink class="nav-item nav-link" to="/WorkDetailsForm" style={isActive(history, '/WorkDetailsForm')}>
              สร้างรายการ
            </NavLink>
            <a
              class="nav-item nav-link"
              style={isActive(history, 'PaySLip')}
              onClick={(e) => {
                setModalFormShow(true);
                var periodId = localStorage.getItem("paySlipPeriodId");
                if (periodId != null) {
                  localStorage.removeItem("paySlipPeriodId");
                }
              }}
            >
              รวมรายการ/เเก้ไขรายการ
            </a>
            <PaySlipModal
              {...{ redirectPaySlip }}
              show={modalFormShow}
              onHide={() => setModalFormShow(false)}
            />
            <NavLink class="nav-item nav-link" to="/SummaryReport" style={isActive(history, '/SummaryReport')}>
              รายงานสรุปผล
            </NavLink>
          </div>
        </div>
        <div class="navbar-collapse collapse order-3 dual-collapse2">
          <div class="navbar-nav ml-auto">
            <NavLink class="nav-item nav-link" to="/" onClick={logout}>
              ลงชื่อออก
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};
export default withRouter(Menu);
