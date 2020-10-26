import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import * as moment from "moment";
import firebaseDb from "../firebase";
import "../style.css";

const db = firebaseDb.firestore();

const PayslipModal = (props) => {
  var [workPeriodObjects, setWorkPeriodObjects] = useState({});
  var [values, setValues] = useState();

  useEffect(() => {
    var workPeriodUnsubscribe = db
      .collection("workPeriods")
      .orderBy("startDate", "desc")
      .onSnapshot((ss) => {
        var workPeriods = {};
        ss.forEach((document) => {
          workPeriods[document.id] = document.data();
        });
        setValues(Object.keys(workPeriods)[0])
        setWorkPeriodObjects(workPeriods);
        return () => {
          workPeriodUnsubscribe();
        };
      });
  }, []);

  const handleInputChange = (e) => {
    var { name, value } = e.target;
    setValues(value)
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    props.redirectPaySlip(values);
  };

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
            รวมรายการ
          </Modal.Title>
        </Modal.Header>
        <div className="container-fluid">
          <form autoComplete="off" onSubmit={handleFormSubmit}>
            <Modal.Body>
              <div className="form-group row">
                <label for="workPeriod" class="col-sm-2 col-form-label">
                  เลือกงวด
                </label>
                <div class="col-sm-5">
                  <Form.Control
                    as="select"
                    id="workPeriodId"
                    name="workPeriodId"
                    placeholder="workPeriodId"
                    onChange={handleInputChange}
                  >
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
            </Modal.Body>

            <Modal.Footer>
              <Button className="btn-light" onClick={props.onHide}>
                ยกเลิก
              </Button>
              <div className="form-group">
                <input
                  type="submit"
                  value="ยืนยัน"
                  className="btn btn-primary btn-block"
                  onClick={props.onHide}
                />
              </div>
            </Modal.Footer>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default PayslipModal;
