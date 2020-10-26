import firebaseDb from "../firebase";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import "../style.css";
import * as moment from "moment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import PaySlipModalDelete from "../components/PaySlipModalDelete";
import { useHistory } from "react-router-dom";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Sarabun: {
    normal: "Sarabun-Regular.ttf",
    bold: "Sarabun-Bold.ttf",
    italics: "Sarabun-Italic.ttf",
    bolditalics: "Sarabun-BoldItalic.ttf",
  },
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-MediumItalic.ttf",
  },
};
const db = firebaseDb.firestore();
const workDetailCollection = db.collection("workDetails");

const PaySlip = () => {
  let history = useHistory();
  var [workDetailObjects, setWorkDetailObjects] = useState({});
  var [employeeObjects, setEmployeeObjects] = useState({});
  var [currentId, setCurrentId] = useState("");
  var [modalFormShow, setModalFormShow] = useState(false);

  useEffect(() => {
    var selectedWorkPeriodId = localStorage.getItem("paySlipPeriodId");
    const unsubscribeDetail = db
      .collection("workDetails")
      .where("workPeriodId", "==", selectedWorkPeriodId)
      .onSnapshot((ss) => {
        var workDetails = {};
        ss.forEach((document) => {
          workDetails[document.id] = document.data();
        });
        for (var i in workDetails) {
          var totalAmount = 0.0;
          for (var j in workDetails[i].earningDeductables) {
            totalAmount += Number(workDetails[i].earningDeductables[j].amount);
          }
          workDetails[i].totalAmount = totalAmount;
        }
        setWorkDetailObjects(workDetails);
        return () => {
          unsubscribeDetail();
        };
      });

    const unsubscribeEmployee = db.collection("employees").onSnapshot((ss) => {
      var employees = {};
      ss.forEach((document) => {
        employees[document.id] = document.data();
      });
      setEmployeeObjects(employees);
      return () => {
        unsubscribeEmployee();
      };
    });
  }, []);

  const onEdit = (id) => {
    history.push({
      pathname: "/WorkDetailsForm",
      state: { currentId: id },
    });
  };

  const onDelete = (key) => {
    workDetailCollection.doc(currentId).delete();
  };

  const currencyFormat = (numString) => {
    var num = Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 2,
    }).format(numString);
    return num;
  };

  const pdfGenerator = () => {
    var doc = {
      pageSize: "A5",
      pageOrientation: "landscape",
      content: [],
      styles: {
        header: {
          fontSize: 12,
          margin: [0, 10, 0, 0],
        },
      },
      defaultStyle: {
        font: "Sarabun",
        fontSize: 10,
      },
    };

    var countPage = 0;

    Object.keys(workDetailObjects).map((id) => {
      var startDate = workDetailObjects[id].startDate;
      var endDate = workDetailObjects[id].endDate;
      startDate = moment(startDate).format("DD/MM/YYYY");
      endDate = moment(endDate).format("DD/MM/YYYY");
      var employeeFirstName = workDetailObjects[id].employeeFirstName;
      var employeeLastName = workDetailObjects[id].employeeLastName;
      var extendedInfo = workDetailObjects[id].extendedInfo;
      var earningDeductables = workDetailObjects[id].earningDeductables;
      var totalAmount = 0.0;
      for (var i in workDetailObjects) {
        var employeeId = workDetailObjects[i].employeeId;
        for (var j in employeeObjects) {
          if (j == employeeId) {
            var accountNum = employeeObjects[j].accNum;
            var employeeNum = employeeObjects[j].employeeNum;
          }
        }
      }

      for (var k in workDetailObjects[id].earningDeductables) {
        totalAmount += Number(
          workDetailObjects[id].earningDeductables[k].amount
        );
      }
      var horizontalLine = {};
      horizontalLine = {
        canvas: [
          { type: "line", x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 3 },
        ],
      };
      var horizontalLineSpace = { text: "", margin: [0, 5, 0, 0] };
      var pageBreak = {};
      if (countPage != 0) {
        pageBreak = { text: "", pageBreak: "before" };
      } else {
        pageBreak = { text: "" };
      }

      var infoTable = {
        table: {
          unbreakable: true,
          widths: ["*", "*", "*", "*"],
          body: [
            [
              { text: "งวด" },
              {
                text: startDate + " - " + endDate,
                bold: true,
                alignment: "right",
              },
              "เลขที่พนักงาน",
              { text: employeeNum, bold: true, alignment: "right" },
            ],
            [
              "ชื่อ-นามสกุล",
              {
                text: employeeFirstName + " " + employeeLastName,
                bold: true,
                alignment: "right",
              },
              "เลขที่บัญชี",
              { text: accountNum, bold: true, alignment: "right" },
            ],
            [
              "",
              "",
              "รวมยอดทั้งหมด",
              {
                text: currencyFormat(totalAmount),
                bold: true,
                alignment: "right",
                decoration: "underline",
              },
            ],
          ],
        },
        layout: "noBorders",
      };
      doc.content.push(pageBreak);
      doc.content.push({ text: "", margin: [0, 0, 0, 5] });
      doc.content.push(infoTable);

      var earningDeductableTableHeader = {
        table: {
          widths: ["*", "*", "*", "*"],
          body: [
            [
              { text: "รายการ", bold: true },
              { text: "จำนวน", bold: true, alignment: "right" },
              { text: "ยอดเงิน", bold: true, alignment: "right" },
              "",
            ],
          ],
        },
        layout: "noBorders",
      };
      doc.content.push(earningDeductableTableHeader);
      doc.content.push({
        canvas: [
          { type: "line", x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 },
        ],
      });

      Object.keys(earningDeductables).map((index) => {
        var earningDeductableBody = [];
        var EDCode = String(earningDeductables[index].EDCode);
        var unit = String(earningDeductables[index].unit);
        var amount = String(earningDeductables[index].amount);
        var remark = String(earningDeductables[index].remark);
        earningDeductableBody = [
          EDCode,
          { text: unit, alignment: "right" },
          { text: currencyFormat(amount), alignment: "right" },
          remark,
        ];

        var earningDeductableTable = {
          table: {
            widths: ["*", "*", "*", "*"],
            body: [earningDeductableBody],
          },
          layout: "noBorders",
        };
        doc.content.push(earningDeductableTable);
      });

      doc.content.push({ text: "วันลา", style: "header" });
      doc.content.push({
        canvas: [
          { type: "line", x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 },
        ],
      });
      Object.keys(extendedInfo).map((index) => {
        var extendedBody = [];
        var workCodeDate = extendedInfo[index].workCodeDate;
        workCodeDate = moment(workCodeDate).format("DD/MM/YYYY");
        extendedBody = [
          extendedInfo[index].workCode,
          { text: workCodeDate, alignment: "right" },
        ];
        var extendedTable = {
          table: {
            widths: ["*", "*", "*", "*"],
            body: [extendedBody],
          },
          layout: "noBorders",
        };
        doc.content.push(extendedTable);
      });
      var sickLeave = 0;
      var personalLeave = 0;
      var vacation = 0;
      var other = 0;
      for (var y in workDetailObjects[id].extendedInfo) {
        switch (workDetailObjects[id].extendedInfo[y].workCode) {
          case "ลาป่วย":
            sickLeave++;
            console.log("ลาป่วย");
            break;
          case "ลากิจ":
            personalLeave++;
            break;
          case "ลาพักร้อน":
            vacation++;
            break;
          case "ลาหยุดอื่นๆ":
            other++;
            break;
          default:
        }
      }
      var extendedTableTotal = {
        table: {
          widths: ["*", "*", "*", "*", "*", "*", "*", "*"],
          body: [
            [
              "ลาป่วย",
              { text: sickLeave + " วัน", bold: true, alignment: "right" },
              "ลากิจ",
              { text: personalLeave + " วัน", bold: true, alignment: "right" },
              "ลาพักร้อน",
              { text: vacation + " วัน", bold: true, alignment: "right" },
              "ลาหยุดอื่นๆ",
              { text: other + " วัน", bold: true, alignment: "right" }
            ],
          ],
        },
        layout: "noBorders",
      };
      doc.content.push({
        canvas: [
          { type: "line", x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 },
        ],
      });
      doc.content.push(extendedTableTotal);
      doc.content.push(horizontalLineSpace);
      doc.content.push(horizontalLine);
      countPage++;
    });
    pdfMake.createPdf(doc).open();
  };

  return (
    <>
      <Layout
        title="Earning Details List"
        description="Earning Deductable List"
        className="container-fluid col-md-10"
      >
        <div className="row">
          <h2 className="mb-4 mt-5">รวมรายการ</h2>
          <div class="mb-4 mt-5 ml-auto mr-3">
            <button
              className="btn btn-primary btn-block"
              onClick={pdfGenerator}
            >
              สร้าง PDF
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="col-12 col-mt-2">
              <table class="table" id="my-table">
                <tbody>
                  {Object.keys(workDetailObjects).map((id) => {
                    var startDate = workDetailObjects[id].startDate;
                    var endDate = workDetailObjects[id].endDate;
                    startDate = moment(startDate).format("DD/MM/YYYY");
                    endDate = moment(endDate).format("DD/MM/YYYY");
                    var employeeFirstName =
                      workDetailObjects[id].employeeFirstName;
                    var employeeLastName =
                      workDetailObjects[id].employeeLastName;
                    var extendedInfo = workDetailObjects[id].extendedInfo;
                    var earningDeductables =
                      workDetailObjects[id].earningDeductables;
                    for (var i in workDetailObjects) {
                      var employeeId = workDetailObjects[i].employeeId;
                      for (var j in employeeObjects) {
                        if (j == employeeId) {
                          var accountNum = employeeObjects[j].accNum;
                        }
                      }
                    }
                    return (
                      <tr key={id}>
                        <td>
                          {startDate} - {endDate}
                        </td>
                        <td>
                          <tr>
                            {employeeFirstName} {employeeLastName}
                            <tr>{accountNum}</tr>
                          </tr>
                        </td>
                        <td>
                          <th>วันลา</th>
                          <th>วันที่</th>
                          {Object.keys(extendedInfo).map((index) => {
                            var workCodeDate = extendedInfo[index].workCodeDate;
                            workCodeDate = moment(workCodeDate).format(
                              "DD/MM/YYYY"
                            );
                            return (
                              <tr key={index}>
                                <td>{extendedInfo[index].workCode}</td>
                                <td>{workCodeDate}</td>
                              </tr>
                            );
                          })}
                        </td>
                        <td>
                          <th>รายการ</th>
                          <th>หน่วย</th>
                          <th>ยอดเงิน</th>
                          <th>รายละเอียดเพิ่มเติม</th>
                          {Object.keys(earningDeductables).map((index) => {
                            return (
                              <tr key={index}>
                                <td>{earningDeductables[index].EDCode}</td>
                                <td class="text-right">
                                  {earningDeductables[index].unit}
                                </td>
                                <td class="text-right">
                                  {currencyFormat(
                                    earningDeductables[index].amount
                                  )}
                                </td>
                                <td class="text-right">
                                  {earningDeductables[index].remark}
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <th>Total</th>
                            <th></th>
                            <th class="text-right">
                              {currencyFormat(
                                workDetailObjects[id].totalAmount
                              )}
                            </th>
                            <th></th>
                          </tr>
                        </td>
                        <td>
                          <a
                            className="btn text-primary"
                            onClick={(e) => {
                              setCurrentId(id);
                              onEdit(id);
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
                        </td>
                        <td>
                          <a
                            className="btn text-danger"
                            onClick={(e) => {
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
                          <PaySlipModalDelete
                            {...{
                              onDelete,
                              currentId,
                              workDetailObjects,
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

export default PaySlip;
