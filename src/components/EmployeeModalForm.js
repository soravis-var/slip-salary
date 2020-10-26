import firebaseDb from "../firebase";
import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../style.css";

const EmployeeModalForm = (props) => {
  const initialFieldValues = {
    employeeNum: "",
    firstName: "",
    lastName: "",
    accNum: "",
    rate: "",
    payPeriod: "",
    jobTitle: "",
  };

  var [values, setValues] = useState(initialFieldValues);

  const employeeNumPlusOne = (num) => {
    var zeros = "";
    for (var i = 0; i < num.length; i++) {
      if (num.charAt(i) == "0") {
        zeros = zeros + "0";
      } else {
        break;
      }
    }
    var plusOne = Number(num) + 1;
    return zeros + String(plusOne);
  };

  useEffect(() => {
    if (props.currentId == "" || props.action == 0) {
      var firstEmployeeNum = 0;
      for (var i in props.employeeObjects) {
        firstEmployeeNum = String(props.employeeObjects[i].employeeNum);
        break;
      }
      firstEmployeeNum = employeeNumPlusOne(firstEmployeeNum);
      setValues({
        ["employeeNum"]: firstEmployeeNum,
        ["firstName"]: "",
        ["lastName"]: "",
        ["accNum"]: "",
        ["rate"]: "",
        ["payPeriod"]: "",
        ["jobTitle"]: "",
      });
    } else {
      setValues({
        ...props.employeeObjects[props.currentId],
      });
    }
  }, [props.currentId, props.employeeObjects]);

  const handleInputChange = (e) => {
    var { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (props.action == 0) {
      console.log(String(values.accNum).length);
      var isPass = true;
      var message = "";
      for (var i in props.employeeObjects) {
        if (values.employeeNum == props.employeeObjects[i].employeeNum) {
          isPass = false;
          setValues({
            ...values,
            ["employeeNum"]: "",
          });
          message = "เลขที่พนักงานนี้มีอยู่เเล้ว";
          break;
        }
        if (values.accNum == props.employeeObjects[i].accNum) {
          isPass = false;
          setValues({
            ...values,
            ["accNum"]: "",
          });
          message = "เลขที่บัญชีนี้มีอยู่เเล้ว";
          break;
        }
        if (
          String(values.accNum).length !== 10 &&
          String(values.accNum).length !== 12
        ) {
          console.log(values.accNum);
          isPass = false;
          message = "เลขที่บัญชีผิดพลาด";
          setValues({
            ...values,
            ["accNum"]: "",
          });
          break;
        }
      }
    } else {
      var isPass = true;
      var message = "";
      for (var i in props.employeeObjects) {
        if (
          values.employeeNum == props.employeeObjects[i].employeeNum &&
          i != props.currentId
        ) {
          isPass = false;
          message = "เลขที่พนักงานนี้มีอยู่เเล้ว";
          break;
        }
        if (
          values.accNum == props.employeeObjects[i].accNum &&
          i != props.currentId
        ) {
          isPass = false;
          message = "เลขที่บัญชีนี้มีอยู่เเล้ว";
          break;
        }
        if (
          String(values.accNum).length !== 10 &&
          String(values.accNum).length !== 12
        ) {
          console.log(values.accNum);
          isPass = false;
          message = "เลขที่บัญชีผิดพลาด";
          setValues({
            ...values,
            ["accNum"]: "",
          });
          break;
        }
      }
    }
    if (
      values.employeeNum == "" ||
      values.firstName == "" ||
      values.lastName == "" ||
      values.accNum == ""
    ) {
      isPass = false;
      message = "กรุณากรอกข้อมูลสำคัญให้ครบ";
    }
    if (isPass) {
      props.addOrEdit(values);
      props.onHide()
    } else {
      alert(message);
    }
  };

  const deleteOnClick = (e) => {
    props.onDelete(props.currentId);
  };

  if (props.action == 2) {
    return (
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            ลบรายการพนักงานนี้
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>โปรดยืนยัน ?</Modal.Body>
        <Modal.Footer>
          <Button className="btn-light" onClick={props.onHide}>
            ยกเลิก
          </Button>
          <Button
            className="btn-danger"
            onClick={(e) => {
              props.onHide();
              deleteOnClick();
            }}
            Delete
          >
            ลบ
          </Button>
        </Modal.Footer>
      </Modal>
    );
  } else {
    return (
      <div>
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              เเบบฟอร์มพนักงาน
            </Modal.Title>
          </Modal.Header>
          <div className="container-fluid">
            <form onSubmit={handleFormSubmit}>
              <Modal.Body>
                <div className="form-group row">
                  <label for="employeeNum" class="col-sm-3 col-form-label">
                    เลขที่พนักงาน
                  </label>
                  <div class="col-sm-8">
                    <input
                      className="form-control"
                      placeholder="#"
                      name="employeeNum"
                      value={values.employeeNum}
                      onChange={handleInputChange}
                      autoComplete="off"
                    />
                  </div>
                  *
                </div>
                <div className="form-group row">
                  <label for="accNum" class="col-sm-3 col-form-label">
                    เลขที่บัญชี
                  </label>
                  <div class="col-sm-8">
                    <input
                      className="form-control"
                      placeholder="#"
                      name="accNum"
                      value={values.accNum}
                      onChange={handleInputChange}
                      autoComplete="off"
                    />
                    <small id="emailHelp" class="form-text text-muted">
                      กรอกเลขบัญชี 10 หรือ 12 หลัก
                    </small>
                  </div>
                  *
                </div>

                <div className="form-group row">
                  <label for="firstName" class="col-sm-3 col-form-label">
                    ชื่อ
                  </label>
                  <div class="col-sm-8">
                    <input
                      className="form-control"
                      placeholder=""
                      name="firstName"
                      value={values.firstName}
                      onChange={handleInputChange}
                      autoComplete="off"
                    />
                  </div>
                  *
                </div>
                <div className="form-group row">
                  <label for="lastName" class="col-sm-3 col-form-label">
                    นามสกุล
                  </label>
                  <div class="col-sm-8">
                    <input
                      className="form-control"
                      placeholder=""
                      name="lastName"
                      value={values.lastName}
                      onChange={handleInputChange}
                      autoComplete="off"
                    />
                  </div>
                  *
                </div>

                <div className="form-group row">
                  <label for="jobTitle" class="col-sm-3 col-form-label">
                    ตำเเหน่ง
                  </label>
                  <div class="col-sm-8">
                    <input
                      className="form-control"
                      placeholder=""
                      name="jobTitle"
                      value={values.jobTitle}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button className="btn-light" onClick={props.onHide}>
                  ยกเลิก
                </Button>
                <div className="form-group">
                  <input
                    type="submit"
                    value={props.currentId == "" ? "บันทึก" : "เเก้ไข"}
                    className="btn btn-primary btn-block"
                  />
                </div>
              </Modal.Footer>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
};

export default EmployeeModalForm;
