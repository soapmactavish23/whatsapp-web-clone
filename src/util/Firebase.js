import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";

export class Firebase {

    constructor() {
        this._config = {
            apiKey: "AIzaSyBIEYh22fSP6giRoUIGWooeJrN59xzU7Pw",
            authDomain: "whatsapp-clone-c5617.firebaseapp.com",
            projectId: "whatsapp-clone-c5617",
            storageBucket: "whatsapp-clone-c5617.appspot.com",
            messagingSenderId: "985131410383",
            appId: "1:985131410383:web:6551cef891dbe0e625e8ba",
            measurementId: "G-KKN0XYTYMR"
        };

        this.init();
    }

    init() {
        if (!window._initializedFirebase) {
            this.firebase = initializeApp(this._config);

            // this.firebase.firestore().settings({
            //     timestampsInSnapshot: true,
            // });

            window._initializedFirebase = true;
        }
    }

    static db() {

        return getFirestore(this.firebase);

    }

    static hd() {

        return getStorage();

    }

    initAuth() {
        return new Promise(function (s, f) {

            let provider = new GoogleAuthProvider();

            signInWithPopup(getAuth(), provider).then((result) => {

                let token = result.user.access_token;
                let user = result.user;

                s({ user, token });

            }).catch(err => {
                f("error: " + err);
            })
        })
    }

}