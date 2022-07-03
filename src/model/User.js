import { Firebase } from "../util/Firebase";
import { getDoc, collection, setDoc, doc, onSnapshot, Firestore } from "firebase/firestore";
import { Model } from "./Model";

export class User extends Model {

    constructor(id) {
        super();
        if (id) this.getById(id);

    }

    get name() { return this._data.name; }
    set name(value) { this._data.name = value; }

    get email() { return this._data.email; }
    set email(value) { this._data.email = value; }

    get photo() { return this._data.photo; }
    set photo(value) { this._data.photo = value; }

    getById(id) {
        const docRef = doc(Firebase.db(), '/users', id);
        onSnapshot(docRef, (doc) => {
            this.fromJSON(doc.data());
        });
    }

    save() {
        return new Promise((resolve, reject) => {
            const ref = User.getRef(this.email);

            setDoc(ref, this.toJSON()).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        })
    }

    static getRef(email) {
        return doc(Firebase.db(), 'users', email);
    }

    static findByEmail(email) {
        return Promise((s, f) => {
            const docRef = doc(Firebase.db(), '/users', email);
            getDoc(docRef).then((docSnap) => {
                s(docSnap);
            }).catch(err => f(err));
        });
    }

    addContact(contact) {
        // User.getRef().doc(this.email).collection('contacts').doc(btoa(contact.email));
        return new Promise((resolve, reject) => {
            const ref = doc(User.getRef(this.email), 'contacts', btoa(contact.email))
            setDoc(ref, contact.toJSON()).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        })
    }

}