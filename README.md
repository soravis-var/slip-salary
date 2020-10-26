# Slip Salary

This is student project created by Soravis V. (5913094) for course CS4200.  

### Goal
- let student develop skill while doing the project
- Able to apply the project for selected user in real scenario
### Frameworks
- Google Firebase
- React.js
### Setup
- Create **Firebase project**
       - Create **Firestore**
- Install dependencies
- **Replace** slip-salary/src/firebase.js with your firebase project config
    ```
    var firebaseConfig = {
      apiKey: "API_KEY",
      authDomain: "PROJECT_ID.firebaseapp.com",
      databaseURL: "https://PROJECT_ID.firebaseio.com",
      projectId: "PROJECT_ID",
      storageBucket: "PROJECT_ID.appspot.com",
      messagingSenderId: "SENDER_ID",
      appId: "APP_ID",
      measurementId: "G-MEASUREMENT_ID",
    };
    ```
* Setup rules in your **Firestore**
    ```
    service cloud.firestore {
        match /databases/{database}/documents {
        function isAdmin() {
              return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
            }
            match /{document=**} {
            allow read: if isAdmin();
              allow write: if isAdmin();
            }
        }
    }

    ```
### Deployment
* Firebase hosting
### Auth setup
* Enable Google Sign-In in the Firebase console:
    * In the Firebase console, open the **Auth** section.
    * On the **Sign in** method tab, enable the **Google sign-in** method and click Save.
    * more information -> https://firebase.google.com/docs/auth/web/google-signin
* try login the application -> get error pop-up (Your Google account will be appear in **Auth** section)
* Go to Firebase project
    * In the Firebase console, open the **Auth** section
    * On the **Users** tab, copy **User UID**
* Go to FireStore
    * Create `users` collection
    * Create document:
        * let **User UID** as document ID
        * Add info -> Field : **isAdmin**, Type : **boolean**, Value : **true**
        
That Google Account should be able to login by now

### Features
User are able to:
* CRUD `employee information`
* CRUD `money option`
* CRUD `work period`
* Create record in **form** -> assign to specific **work period**
* Edit and Delete created record
* View `Report Summary`
