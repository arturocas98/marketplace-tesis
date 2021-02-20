// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url_image : "assets/",
  url_api:"https://marketplace-tesis.firebaseio.com",
  firebase:{
    apiKey: "AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg",
    authDomain: "marketplace-tesis.firebaseapp.com",
    databaseURL: "https://marketplace-tesis.firebaseio.com",
    projectId: "marketplace-tesis",
    storageBucket: "marketplace-tesis.appspot.com",
    messagingSenderId: "205223564127",
    appId: "1:205223564127:web:d8923a287be60d1ee95cea"
  },
  sign_in:"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg",
  register:"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg",
  login:'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg',
  sendEmailVerification:'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg',
  confirmEmailVerification:"https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg",
  getUserData: 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg',
  SendPasswordResetEmail: "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg",
  VerifyPasswordResetCode:'https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg',
  ConfirmPasswordReset: 'https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg',
  ChangePassword:'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg',
  server:'http://localhost/marketplace-tesis/src/assets/img/index.php?key=AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg',
  serverDelete : 'http://localhost/marketplace-tesis/src/assets/img/delete.php?key=AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg',
  email:'http://localhost/marketplace-tesis/src/assets/email/index.php?key=AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
