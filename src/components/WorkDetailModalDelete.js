import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import "../style.css";

const WorkDetailModalDelete = (props) => {

  const deleteOnClick = (e) => {
    props.onDelete(props.currentId);
  };

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
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
};

export default WorkDetailModalDelete;
