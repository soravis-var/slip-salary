import React, { useState, useEffect } from "react";
import "../style.css";
import Layout from "../components/Layout";
import firebase from "firebase/app";
import "firebase/auth";
import { Redirect } from "react-router-dom";
import firebaseDb from "../firebase";

const db = firebaseDb.firestore();
const userCollection = db.collection("users");

// Login is just to get refreshToken -> let user redirect to private route
// However if user is not in firestore collection -> the user cannot update data.
const Login = () => {
  var [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
      } else {
      }
    });
  }, []);

  if (isLogin) {
    localStorage.setItem("isLogin", isLogin);
    return <Redirect to="/EmployeeList" />;
  } else {
    // let page refresh just once
    window.onload = function () {
      if (!window.location.hash) {
        window.location = window.location + "#loaded";
        window.location.reload();
      }
    };
  }

  const onSubmit = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
   });
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;
        var docRef = userCollection.doc(user.uid)
        docRef.get().then(function(doc) {
          if (doc.exists && doc.data().isAdmin == true) {
            setIsLogin(true)
          } 
      }).catch(function(error) {
          console.log("Error getting document:", error);
          alert("บัญชีของคุณไม่ได้รับอนุญาติให้เข้าถึงข้อมูล โปรดลงชื่อด้วยบัญชีอื่น หรือ ติดต่อผู้ดูเเล")
      });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <div class="centered">
        <div class="card text-center col-5">
          <div class="card-header">
            <h3 class="font-weight-light">Slip Salary</h3>
          </div>
          <div class="card-body">
            <h5 class="card-title">ลงชื่อเพื่อเข้าใช้</h5>
            <p class="card-text">by Google</p>
            <div className="btn btn-primary">
              <input
                type="submit"
                value="Google Sign-in"
                className="btn btn-primary btn-block"
                onClick={onSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
