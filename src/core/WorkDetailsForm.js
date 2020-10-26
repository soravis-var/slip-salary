import React, { useState, useEffect, Fragment } from "react";
import "../style.css";
import Layout from "../components/Layout";
import Form from "react-bootstrap/Form";
import firebaseDb from "../firebase";
import * as moment from "moment";
import { useLocation } from "react-router-dom";

const db = firebaseDb.firestore();
const workDetailCollection = db.collection("workDetails");

const WorkDetailsForm = () => {
  const location = useLocation();
  var [employeeObjects, setEmployeeObjects] = useState({});
  var [workPeriodObjects, setWorkPeriodObjects] = useState({});
  var [earningDeductableObjects, setEarningDeductableObjects] = useState({});
  var [selectedObject, setSelectedObject] = useState({});

  const initialFieldValues = {
    employeeId: "",
    employeeFirstName: "",
    employeeLastName: "",
    workPeriodId: "",
    startDate: "",
    endDate: "",
    extendedInfo: {},
    earningDeductables: {},
  };

  var [info, setInfo] = useState(initialFieldValues);

  const [earningDeductableFields, setEarningDeductableFields] = useState([
    { EDCode: "", unit: "", amount: "", remark: "" },
  ]);

  const [extendedFields, setExtendedFields] = useState([
    { workCode: "", workCodeDate: "" },
  ]);

  useEffect(() => {
    var employeeUnsubscribe = db
      .collection("employees")
      .orderBy("firstName", "asc")
      .onSnapshot((ss) => {
        var employees = {};
        ss.forEach((document) => {
          employees[document.id] = document.data();
        });
        setEmployeeObjects(employees);
        return () => {
          employeeUnsubscribe();
        };
      });
    var workPeriodUnsubscribe = db
      .collection("workPeriods")
      .orderBy("startDate", "desc")
      .onSnapshot((ss) => {
        var workPeriods = {};
        ss.forEach((document) => {
          workPeriods[document.id] = document.data();
        });
        setWorkPeriodObjects(workPeriods);
        return () => {
          workPeriodUnsubscribe();
        };
      });
    var earningDeductableUnsubscribe = db
      .collection("earningDeductables")
      .onSnapshot((ss) => {
        var earningDeductables = {};
        ss.forEach((document) => {
          earningDeductables[document.id] = document.data();
        });
        setEarningDeductableObjects(earningDeductables);
        return () => {
          earningDeductableUnsubscribe();
        };
      });

    if (location.state != null) {
      const workDetailCollectionSelected = db
        .collection("workDetails")
        .doc(location.state.currentId);
      var selectedWorkDetail = {};
      workDetailCollectionSelected
        .get()
        .then(function (doc) {
          if (doc.exists) {
            selectedWorkDetail = doc.data();
            setSelectedObject(selectedWorkDetail);
            if (selectedWorkDetail.extendedInfo != null) {
              const extendedFieldValues = [...extendedFields];
              for (var i in selectedWorkDetail.extendedInfo) {
                extendedFieldValues.push({
                  workCode: selectedWorkDetail.extendedInfo[i].workCode,
                  workCodeDate: selectedWorkDetail.extendedInfo[i].workCodeDate,
                });
              }
              extendedFieldValues.splice(0, 1);
              setExtendedFields(extendedFieldValues);
            }
            if (selectedWorkDetail.earningDeductables != null) {
              const earningDeductableValues = [...extendedFields];
              for (var j in selectedWorkDetail.earningDeductables) {
                earningDeductableValues.push({
                  EDCode: selectedWorkDetail.earningDeductables[j].EDCode,
                  unit: selectedWorkDetail.earningDeductables[j].unit,
                  amount: selectedWorkDetail.earningDeductables[j].amount,
                  remark: selectedWorkDetail.earningDeductables[j].remark,
                });
              }
              earningDeductableValues.splice(0, 1);
              setEarningDeductableFields(earningDeductableValues);
            }
            setInfo({
              ...info,
              ["employeeId"]: selectedWorkDetail.employeeId,
              ["employeeFirstName"]: selectedWorkDetail.employeeFirstName,
              ["employeeLastName"]: selectedWorkDetail.employeeLastName,
              ["workPeriodId"]: selectedWorkDetail.workPeriodId,
              ["startDate"]: selectedWorkDetail.startDate,
              ["endDate"]: selectedWorkDetail.endDate,
              ["extendedInfo"]: selectedWorkDetail.extendedInfo,
              ["earningDeductables"]: selectedWorkDetail.earningDeductables,
            });
          } else {
            console.log("No such document!");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    }
  }, []);

  const handleEmployeeInputChange = (e) => {
    var { name, value } = e.target;
    var firstName = "";
    var lastName = "";
    Object.keys(employeeObjects).map((id) => {
      if (id == value) {
        firstName = employeeObjects[id].firstName;
        lastName = employeeObjects[id].lastName;
      }
    });
    setInfo({
      ...info,
      ["employeeId"]: value,
      ["employeeFirstName"]: firstName,
      ["employeeLastName"]: lastName,
    });
  };

  const handleWorkPeriodInputChange = (e) => {
    var { name, value } = e.target;
    var startDate = "";
    var endDate = "";
    Object.keys(workPeriodObjects).map((id) => {
      if (id == value) {
        startDate = workPeriodObjects[id].startDate;
        endDate = workPeriodObjects[id].endDate;
      }
    });
    setInfo({
      ...info,
      ["workPeriodId"]: value,
      ["startDate"]: startDate,
      ["endDate"]: endDate,
    });
  };

  const checkInvalidExtendInfo = () => {
    for (var i in info.extendedInfo) {
      if (
        info.extendedInfo[i].workCode == "" ||
        info.extendedInfo[i].workCodeDate == ""
      ) {
        alert("โปรดเลือกทั้งวันลาเเละวันที่ลา");
        return true;
      }
    }
    return false;
  };

  const handleFormSubmit = (e) => {
    if (location.state != null) {
      e.preventDefault();
      if (checkInvalidExtendInfo()) {
      } else {
        workDetailCollection
          .doc(location.state.currentId)
          .set(info)
          .then(function () {
            alert("บันทึกเเล้ว");
          })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          })
          .then(() => {
            window.location.reload();
          });
      }
    } else {
      e.preventDefault();
      if (info.employeeId == "" || info.workPeriodId == "") {
        alert("โปรดเลือกพนักงานกับงวด");
      } else if (checkInvalidExtendInfo()) {
      } else {
        workDetailCollection
          .add(info)
          .then(function () {
            alert("บันทึกเเล้ว");
          })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          })
          .then(() => {
            window.location.reload();
          });
      }
    }
  };

  const handleEarningDeductableFields = (index, event) => {
    const values = [...earningDeductableFields];
    switch (event.target.name) {
      case "EDCode":
        values[index].EDCode = event.target.value;
        break;
      case "unit":
        values[index].unit = event.target.value;
        break;
      case "amount":
        var num = event.target.value.replace(/,/g, "");
        values[index].amount = num;
        break;
      case "remark":
        values[index].remark = event.target.value;
        break;
      default:
    }
    setEarningDeductableFields(values);
    var tempName = "earningDeductables";
    setInfo({
      ...info,
      [tempName]: earningDeductableFields,
    });
  };

  const handleEarningDeductableAddFields = () => {
    const values = [...earningDeductableFields];
    values.push({ EDCode: "", unit: "", amount: "", remark: "" });
    setEarningDeductableFields(values);
  };

  const handleEarningDeductableRemoveFields = (index) => {
    if (index == 0) {
      alert("ไม่สามารถลบได้ (ปล่อยว่างไว้ไม่มีผลต่อฟอร์ม)");
    } else {
      const values = [...earningDeductableFields];
      values.splice(index, 1);
      setEarningDeductableFields(values);
    }
  };

  const handleExtendedFields = (index, event) => {
    const values = [...extendedFields];
    switch (event.target.name) {
      case "workCode":
        values[index].workCode = event.target.value;
        break;
      case "workCodeDate":
        values[index].workCodeDate = event.target.value;
        break;
      default:
    }
    setExtendedFields(values);
    var tempName = "extendedInfo";
    setInfo({
      ...info,
      [tempName]: extendedFields,
    });
  };

  const handleExtendedAddFields = () => {
    const values = [...extendedFields];
    values.push({ workCode: "", workCodeDate: "" });
    setExtendedFields(values);
  };

  const handleExtendedRemoveFields = (index) => {
    if (index == 0) {
      alert("ไม่สามารถลบได้ (ปล่อยว่างไว้ไม่มีผลต่อฟอร์ม)");
    } else {
      const values = [...extendedFields];
      values.splice(index, 1);
      setExtendedFields(values);
    }
  };

  if (location.state != null) {
    var startDate = selectedObject.startDate;
    var endDate = selectedObject.endDate;
    startDate = moment(startDate).format("DD/MM/YYYY");
    endDate = moment(endDate).format("DD/MM/YYYY");

    return (
      <>
        <Layout
          title="Work Details"
          description="Work Details"
          className="container-fluid col-md-10"
        >
          <div className="container-fluid float-left ">
            <div className="row">
              <h2 className="mb-4 mt-5">สร้างรายการ</h2>
            </div>
            <form onSubmit={handleFormSubmit}>
              <Form.Group autoComplete="off" onSubmit={handleFormSubmit}>
                <div className="form-group row">
                  <label for="employee" class="col-sm-1 col-form-label">
                    พนักงาน
                  </label>
                  <div class="col-sm-5">
                    <Form.Control
                      as="select"
                      id="employeeId"
                      name="employeeId"
                      placeholder="employeeId"
                      onChange={handleEmployeeInputChange}
                      disabled
                    >
                      <option default selected>
                        {selectedObject.employeeFirstName}{" "}
                        {selectedObject.employeeLastName}
                      </option>
                    </Form.Control>
                  </div>
                </div>
                <div className="form-group row">
                  <label for="workPeriod" class="col-sm-1 col-form-label">
                    งวด
                  </label>
                  <div class="col-sm-5">
                    <Form.Control
                      as="select"
                      id="workPeriodId"
                      name="workPeriodId"
                      placeholder="workPeriodId"
                      onChange={handleWorkPeriodInputChange}
                      disabled
                    >
                      <option default selected hidden>
                        {startDate} {" - "} {endDate}
                      </option>
                    </Form.Control>
                  </div>
                </div>

                <div className="row">
                  <h2 className="mb-4 mt-5">วันลา</h2>
                </div>

                <div className="form-row">
                  {extendedFields.map((dynamicField, index) => (
                    <Fragment key={`${dynamicField}~${index}`}>
                      <div className=" form-group col-sm-4">
                        <Form.Control
                          as="select"
                          id="workCode"
                          name="workCode"
                          onChange={(event) =>
                            handleExtendedFields(index, event)
                          }
                          value={dynamicField.workCode}
                        >
                          <option default selected hidden>
                            เลือกวันลา
                          </option>
                          <option>ลาป่วย</option>
                          <option>ลากิจ</option>
                          <option>ลาพักร้อน</option>
                          <option>ลาหยุดอื่นๆ</option>
                        </Form.Control>
                      </div>

                      <div className="form-group col-sm-3">
                        <input
                          type="date"
                          className="form-control"
                          id="workCodeDate"
                          name="workCodeDate"
                          placeholder="date"
                          value={dynamicField.workCodeDate}
                          onChange={(event) =>
                            handleExtendedFields(index, event)
                          }
                        />
                      </div>
                      <div className="form-group col-sm-2">
                        <button
                          className="btn btn-link"
                          type="button"
                          onClick={() => handleExtendedRemoveFields(index)}
                        >
                          -
                        </button>
                        <button
                          className="btn btn-link"
                          type="button"
                          onClick={() => handleExtendedAddFields()}
                        >
                          +
                        </button>
                      </div>
                    </Fragment>
                  ))}
                </div>

                <div className="row">
                  <h2 className="mb-4 mt-5">รายการ(เงิน)</h2>
                </div>
                <div className="form-row">
                  {earningDeductableFields.map((dynamicField, index) => (
                    <Fragment key={`${dynamicField}~${index}`}>
                      <div className="form-group col-sm-3">
                        <Form.Control
                          as="select"
                          id="EDCode"
                          name="EDCode"
                          placeholder="ED Code"
                          value={dynamicField.EDCode}
                          onChange={(event) =>
                            handleEarningDeductableFields(index, event)
                          }
                        >
                          <option default selected hidden>
                            เลือกรายการ
                          </option>
                          {Object.keys(earningDeductableObjects).map((id) => {
                            return (
                              <option
                                key={id}
                                value={earningDeductableObjects[id].description}
                              >
                                {earningDeductableObjects[id].description}
                              </option>
                            );
                          })}
                        </Form.Control>
                      </div>
                      <div className="form-group col-sm-2">
                        <input
                          type="text"
                          className="form-control"
                          id="unit"
                          name="unit"
                          placeholder="หน่วย"
                          value={dynamicField.unit}
                          onChange={(event) =>
                            handleEarningDeductableFields(index, event)
                          }
                        />
                      </div>
                      <div className="form-group col-sm-2">
                        <input
                          type="text"
                          className="form-control"
                          id="amount"
                          name="amount"
                          placeholder="ยอดเงิน"
                          value={dynamicField.amount}
                          onChange={(event) =>
                            handleEarningDeductableFields(index, event)
                          }
                        />
                      </div>
                      <div className="form-group col-sm-3">
                        <input
                          type="text"
                          className="form-control"
                          id="remark"
                          name="remark"
                          placeholder="รายละเอียดเพิ่มเติม"
                          value={dynamicField.remark}
                          onChange={(event) =>
                            handleEarningDeductableFields(index, event)
                          }
                        />
                      </div>
                      <div className="form-group col-sm-2">
                        <button
                          className="btn btn-link"
                          type="button"
                          onClick={() =>
                            handleEarningDeductableRemoveFields(index)
                          }
                        >
                          -
                        </button>
                        <button
                          className="btn btn-link"
                          type="button"
                          onClick={() => handleEarningDeductableAddFields()}
                        >
                          +
                        </button>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div className="form-group col-1 float-left">
                  <input
                    type="submit"
                    value="บันทึก"
                    className="btn btn-primary btn-block"
                  />
                </div>
              </Form.Group>
            </form>
          </div>
        </Layout>
      </>
    );
  } else {
    return (
      <>
        <Layout
          title="Work Details"
          description="Work Details"
          className="container-fluid col-md-10"
        >
          <div className="container-fluid float-left ">
            <div className="row">
              <h2 className="mb-4 mt-5">สร้างรายการ</h2>
            </div>
            <form onSubmit={handleFormSubmit}>
              <Form.Group autoComplete="off" onSubmit={handleFormSubmit}>
                <div className="form-group row">
                  <label for="employee" class="col-sm-1 col-form-label">
                    พนักงาน
                  </label>
                  <div class="col-sm-5">
                    <Form.Control
                      as="select"
                      id="employeeId"
                      name="employeeId"
                      placeholder="employeeId"
                      onChange={handleEmployeeInputChange}
                    >
                      <option default selected hidden>
                        เลือกพนักงาน
                      </option>
                      {Object.keys(employeeObjects).map((id) => {
                        return (
                          <option key={id} value={id}>
                            {employeeObjects[id].firstName}{" "}
                            {employeeObjects[id].lastName}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </div>
                </div>
                <div className="form-group row">
                  <label for="workPeriod" class="col-sm-1 col-form-label">
                    งวด
                  </label>
                  <div class="col-sm-5">
                    <Form.Control
                      as="select"
                      id="workPeriodId"
                      name="workPeriodId"
                      placeholder="workPeriodId"
                      onChange={handleWorkPeriodInputChange}
                      required
                    >
                      <option default selected hidden>
                        เลือกงวด
                      </option>
                      {Object.keys(workPeriodObjects).map((id) => {
                        var startDate = workPeriodObjects[id].startDate;
                        var endDate = workPeriodObjects[id].endDate;
                        startDate = moment(startDate).format("DD/MM/YYYY");
                        endDate = moment(endDate).format("DD/MM/YYYY");
                        return (
                          <option key={id} value={id}>
                            {startDate}
                            {" - "}
                            {endDate}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </div>
                </div>

                <div className="row">
                  <h2 className="mb-4 mt-5">วันลา</h2>
                </div>

                <div className="form-row">
                  {extendedFields.map((dynamicField, index) => (
                    <Fragment key={`${dynamicField}~${index}`}>
                      <div className=" form-group col-sm-4">
                        <Form.Control
                          as="select"
                          id="workCode"
                          name="workCode"
                          onChange={(event) =>
                            handleExtendedFields(index, event)
                          }
                          value={dynamicField.workCode}
                        >
                          <option default selected hidden>
                            เลือกวันลา
                          </option>
                          <option>ลาป่วย</option>
                          <option>ลากิจ</option>
                          <option>ลาพักร้อน</option>
                          <option>ลาหยุดอื่นๆ</option>
                        </Form.Control>
                      </div>

                      <div className="form-group col-sm-3">
                        <input
                          type="date"
                          className="form-control"
                          id="workCodeDate"
                          name="workCodeDate"
                          placeholder="date"
                          value={dynamicField.workCodeDate}
                          onChange={(event) =>
                            handleExtendedFields(index, event)
                          }
                        />
                      </div>
                      <div className="form-group col-sm-2">
                        <button
                          className="btn btn-link"
                          type="button"
                          onClick={() => handleExtendedRemoveFields(index)}
                        >
                          -
                        </button>
                        <button
                          className="btn btn-link"
                          type="button"
                          onClick={() => handleExtendedAddFields()}
                        >
                          +
                        </button>
                      </div>
                    </Fragment>
                  ))}
                </div>

                <div className="row">
                  <h2 className="mb-4 mt-5">รายการ(เงิน)</h2>
                </div>
                <div className="form-row">
                  {earningDeductableFields.map((dynamicField, index) => (
                    <Fragment key={`${dynamicField}~${index}`}>
                      <div className="form-group col-sm-3">
                        <Form.Control
                          as="select"
                          id="EDCode"
                          name="EDCode"
                          placeholder="ED Code"
                          value={dynamicField.EDCode}
                          onChange={(event) =>
                            handleEarningDeductableFields(index, event)
                          }
                        >
                          <option default selected hidden>
                            เลือกรายการ
                          </option>
                          {Object.keys(earningDeductableObjects).map((id) => {
                            return (
                              <option
                                key={id}
                                value={earningDeductableObjects[id].description}
                              >
                                {earningDeductableObjects[id].description}
                              </option>
                            );
                          })}
                        </Form.Control>
                      </div>
                      <div className="form-group col-sm-2">
                        <input
                          type="text"
                          className="form-control"
                          id="unit"
                          name="unit"
                          placeholder="หน่วย"
                          value={dynamicField.unit}
                          onChange={(event) =>
                            handleEarningDeductableFields(index, event)
                          }
                        />
                      </div>
                      <div className="form-group col-sm-2">
                        <input
                          type="text"
                          className="form-control"
                          id="amount"
                          name="amount"
                          placeholder="ยอดเงิน"
                          value={dynamicField.amount}
                          onChange={(event) =>
                            handleEarningDeductableFields(index, event)
                          }
                        />
                      </div>
                      <div className="form-group col-sm-3">
                        <input
                          type="text"
                          className="form-control"
                          id="remark"
                          name="remark"
                          placeholder="รายละเอียดเพิ่มเติม"
                          value={dynamicField.remark}
                          onChange={(event) =>
                            handleEarningDeductableFields(index, event)
                          }
                        />
                      </div>
                      <div className="form-group col-sm-2">
                        <button
                          className="btn btn-link"
                          type="button"
                          onClick={() =>
                            handleEarningDeductableRemoveFields(index)
                          }
                        >
                          -
                        </button>
                        <button
                          className="btn btn-link"
                          type="button"
                          onClick={() => handleEarningDeductableAddFields()}
                        >
                          +
                        </button>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div className="form-group col-1 float-left">
                  <input
                    type="submit"
                    value="บันทึก"
                    className="btn btn-primary btn-block"
                  />
                </div>
              </Form.Group>
            </form>
          </div>
        </Layout>
      </>
    );
  }
};

export default WorkDetailsForm;
