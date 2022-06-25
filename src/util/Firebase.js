import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

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
        if (!this._initialized) {
            this.firebase = initializeApp(this._config);

            // this.firebase.firestore().settings({
            //     timestampsInSnapshot: true,
            // });

            this._initialized = true;
        }
    }

    static db() {

        return getFirestore();

    }

    static hd() {

        return getStorage();

    }

}