import { Firebase } from "../util/Firebase";
import { ClassEvent } from "../util/ClassEvent";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";

export class User extends ClassEvent {

    static getRef() {
        return collection(Firebase.db(), '/users',);

    }

    static findByEmail(user) {
        return new Promise((resolve, reject) => {
            const ref = doc(Firebase.db(), 'users', user.email);
            setDoc(ref, {
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
            }).then((result) => {
                resolve(result);
            }).catch((err) => reject(err));
        });

    }

}