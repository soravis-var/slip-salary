import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import "../style.css";

const EarningDeductableModalForm = (props) => {
  const initialFieldValues = {
    description: "",
  };

  var [values, setValues] = useState(initialFieldValues);

  useEffect(() => {
    if (props.currentId == "")
      setValues({
        ["description"]: "",
      });
    else
      setValues({
        ...props.earningDeductableObjects[props.currentId],
      });
  }, [props.currentId, props.earningDeductableObjects]);

  const handleInputChange = (e) => {
    var { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    var isPass = true;
    var message = "";
    for (var i in props.earningDeductableObjects) {
      if (values.description == props.earningDeductableObjects[i].description) {
        isPass = false;
        message = "รายการนี้มีอยู่เเล้ว";
        break;
      }
    }
    if(values.description == ""){
      isPass = false;
      message = "กรุณากรอกฟอร์มให้ครบ";
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

  if (props.action != 0) {
    return (
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            ลบรายการนี้
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
              รายการ(เงิน)
            </Modal.Title>
          </Modal.Header>
          <div className="container-fluid">
            <form autoComplete="off" onSubmit={handleFormSubmit}>
              <Modal.Body>
                <div className="form-group row">
                  <label for="description" class="col-sm-3 col-form-label">
                    รายละเอียด
                  </label>
                  <div class="col-sm-8">
                    <input
                      className="form-control"
                      placeholder=""
                      name="description"
                      value={values.description}
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

export default EarningDeductableModalForm;
