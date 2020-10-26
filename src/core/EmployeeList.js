import firebaseDb from "../firebase";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import EmployeeModalForm from "../components/EmployeeModalForm";
import "../style.css";

const db = firebaseDb.firestore();
const employeeCollection = db.collection("employees");
const employeeCollectionSorted = db.collection("employees").orderBy("employeeNum","desc");

const EmployeeList = () => {
  var [employeeObjects, setEmployeeObjects] = useState({});
  var [currentId, setCurrentId] = useState("");
  var [modalFormShow, setModalFormShow] = useState(false);
  var [action, setAction] = useState(0);

  useEffect(() => {
    const unsubscribe = employeeCollectionSorted.onSnapshot((ss) => {
      const employees = {};
      ss.forEach((document) => {
        employees[document.id] = document.data();
      });
      setEmployeeObjects(employees);
      return () => {
        unsubscribe();
      };
    });
  }, []);

  const addOrEdit = (obj) => {
    if (currentId == "") employeeCollection.add(obj);
    else employeeCollection.doc(currentId).set(obj);
  };

  const onDelete = (key) => {
    employeeCollection.doc(currentId).delete();
  };

  const inputClear = () => {
    setCurrentId("")
  }

  return (
    <>
      <Layout
        title="Employee List"
        description="Employee List"
        className="container-fluid col-md-10"
      >
        <div className="row">
          <h2 className="mb-4 mt-5">พนักงาน</h2>
          <div class="mb-4 mt-5 ml-auto mr-3">
            <a
              className="btn text-secondary"
              onClick={(e) => {
                setCurrentId("");
                setAction(0);
                setModalFormShow(true);
              }}
            >
              <svg
                width="3em"
                height="3em"
                viewBox="0 0 16 16"
                class="bi bi-plus-square"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"
                />
                <path
                  fill-rule="evenodd"
                  d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"
                />
                <path
                  fill-rule="evenodd"
                  d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                />
              </svg>
            </a>
            <EmployeeModalForm
              {...{ addOrEdit, currentId, employeeObjects, action, inputClear }}
              show={modalFormShow}
              onHide={() => setModalFormShow(false)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <hr />
            <div className="col-12 col-mt-2">
              <table class="table">
                <thead class="thead-dark">
                  <tr>
                    <th>เลขที่พนักงาน</th>
                    <th>เลขที่บัญชี</th>
                    <th>ชื่อ </th>
                    <th>นามสกุล</th>
                    <th>ตำเเหน่ง</th>
                    <th>เเก้ไข</th>
                    <th>ลบ</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(employeeObjects).map((id) => {
                    return (
                      <tr key={id}>
                        <td>{employeeObjects[id].employeeNum}</td>
                        <td>{employeeObjects[id].accNum}</td>
                        <td>{employeeObjects[id].firstName}</td>
                        <td>{employeeObjects[id].lastName}</td>
                        <td>{employeeObjects[id].jobTitle}</td>
                        <td>
                          <a
                            className="btn text-primary"
                            onClick={(e) => {
                              setAction(1);
                              setCurrentId(id);
                              setModalFormShow(true);
                            }}
                          >
                            <svg
                              width="1.5em"
                              height="1.5em"
                              viewBox="0 0 16 16"
                              class="bi bi-pencil-square"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fill-rule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                              />
                            </svg>
                          </a>

                          <EmployeeModalForm
                            {...{
                              addOrEdit,
                              currentId,
                              employeeObjects,
                              action,
                              inputClear
                            }}
                            show={modalFormShow}
                            onHide={() => setModalFormShow(false)}
                          />
                        </td>
                        <td>
                          <a
                            className="btn text-danger"
                            onClick={(e) => {
                              setAction(2);
                              setCurrentId(id);
                              setModalFormShow(true);
                            }}
                          >
                            <svg
                              width="1.5em"
                              height="1.5em"
                              viewBox="0 0 16 16"
                              class="bi bi-x-square"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                              />
                              <path
                                fill-rule="evenodd"
                                d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"
                              />
                              <path
                                fill-rule="evenodd"
                                d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"
                              />
                            </svg>
                          </a>
                          <EmployeeModalForm
                            {...{
                              addOrEdit,
                              onDelete,
                              currentId,
                              employeeObjects,
                              action,
                              inputClear
                            }}
                            show={modalFormShow}
                            onHide={() => setModalFormShow(false)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default EmployeeList;
