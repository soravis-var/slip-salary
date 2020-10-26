import firebaseDb from "../firebase";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import "../style.css";
import * as moment from "moment";

const db = firebaseDb.firestore();
const workDetailCollection = db
  .collection("workDetails")
  .orderBy("startDate", "desc");
const workDetailCollectionSorted = db.collection("workDetails");
var years = [];

const SummaryReport = () => {
  var [workDetailObjects, setWorkDetailObjects] = useState({});

  useEffect(() => {
    const unsubscribe = workDetailCollection.onSnapshot((ss) => {
      const workDetails = {};
      ss.forEach((document) => {
        workDetails[document.id] = document.data();
      });
      // console.log(workDetails);
      getYears(workDetails);
      setWorkDetailObjects(workDetails);
      return () => {
        unsubscribe();
      };
    });
  }, []);

  const getYears = (collection) => {
    Object.keys(collection).map((id) => {
      var startDate = collection[id].startDate;
      var thisYear = moment(startDate).year();
      var notDuplicate = true;
      for (var i in years) {
        // console.log(years[i]);
        if (years[i] == thisYear) {
          notDuplicate = false;
        }
      }
      if (notDuplicate) {
        years.push(thisYear);
      }
    });
    // console.log(years);
  };

  const getMonthName = (thisMonth) => {
    var months = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    switch (thisMonth) {
      case 1:
        return months[0];
      case 2:
        return months[1];
      case 3:
        return months[2];
      case 4:
        return months[3];
      case 5:
        return months[4];
      case 6:
        return months[5];
      case 7:
        return months[6];
      case 8:
        return months[7];
      case 9:
        return months[8];
      case 10:
        return months[9];
      case 11:
        return months[10];
      case 12:
        return months[11];
      default:
    }
  };

  const getMonthArray = (year) => {
    var months = [];
    Object.keys(workDetailObjects).map((index) => {
      var monthNotExist = true;
      if (moment(workDetailObjects[index].startDate).year() == year) {
        if (months.length != 0) {
          for (var i in months) {
            if (
              moment(workDetailObjects[index].startDate).month() + 1 ==
              months[i]
            ) {
              monthNotExist = false;
            }
          }
        }
        if (monthNotExist) {
          months.push(moment(workDetailObjects[index].startDate).month() + 1);
        }
      }
    });
    console.log(months);
    return months;
  };

  const currencyFormat = (numString) => {
    var num = Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 2,
    }).format(numString);
    return num;
  };

  return (
    <>
      <Layout
        title="Earning Deductable List"
        description="Earning Deductable List"
        className="container-fluid col-md-10"
      >
        <div className="row">
          <h2 className="mb-4 mt-5">รายงานสรุปผล</h2>
        </div>

        <div className="row">
          <div className="col-md-12">
            <table class="table" id="my-table">
              <tbody>
                {Object.keys(years).map((i) => {
                  var months = getMonthArray(years[i]);
                  var yearTotal = 0;
                  return (
                    <tr key={i}>
                      <td>
                        <h2>{years[i]}</h2>
                        {Object.keys(months).map((j) => {
                          var periodAmount1 = 0;
                          var periodAmount2 = 0;
                          var periodDate1 = "-";
                          var periodDate2 = "-";
                          var monthTotal = 0;
                          return (
                            <tr key={j}>
                              <h4 class="text-secondary">
                                {getMonthName(months[j])}
                              </h4>
                              {Object.keys(workDetailObjects).map((k) => {
                                if (
                                  moment(
                                    workDetailObjects[k].startDate
                                  ).month() ==
                                  months[j] - 1
                                ) {
                                  if (
                                    moment(
                                      workDetailObjects[k].startDate
                                    ).date() == 1
                                  ) {
                                    periodDate1 =
                                      moment(
                                        workDetailObjects[k].startDate
                                      ).date() +
                                      " - " +
                                      moment(
                                        workDetailObjects[k].endDate
                                      ).date();

                                    for (var r in workDetailObjects[k]
                                      .earningDeductables) {
                                      periodAmount1 += Number(
                                        workDetailObjects[k].earningDeductables[
                                          r
                                        ].amount
                                      );
                                      yearTotal += Number(
                                        workDetailObjects[k].earningDeductables[
                                          r
                                        ].amount
                                      );
                                    }
                                  } else if (
                                    moment(
                                      workDetailObjects[k].startDate
                                    ).date() == 16
                                  ) {
                                    periodDate2 =
                                      moment(
                                        workDetailObjects[k].startDate
                                      ).date() +
                                      " - " +
                                      moment(
                                        workDetailObjects[k].endDate
                                      ).date();

                                    for (var y in workDetailObjects[k]
                                      .earningDeductables) {
                                      periodAmount2 += Number(
                                        workDetailObjects[k].earningDeductables[
                                          y
                                        ].amount
                                      );
                                      yearTotal += Number(
                                        workDetailObjects[k].earningDeductables[
                                          y
                                        ].amount
                                      );
                                    }
                                  }
                                  monthTotal = periodAmount1 + periodAmount2;
                                }
                              })}
                              <tr>
                                <td>{periodDate1}</td>
                                <th class="text-right">
                                  {currencyFormat(periodAmount1)}
                                </th>
                              </tr>
                              <tr>
                                <td>{periodDate2}</td>
                                <th class="text-right">
                                  {currencyFormat(periodAmount2)}
                                </th>
                              </tr>
                              <tr>
                                <td>Month Total</td>
                                <th class="text-right">
                                  <u>{currencyFormat(monthTotal)}</u>
                                </th>
                              </tr>
                            </tr>
                          );
                        })}
                        <td>
                          <h3>Year Total</h3>
                        </td>
                        <td>
                          <h3>
                            <u>{currencyFormat(yearTotal)}</u>
                          </h3>
                        </td>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SummaryReport;
