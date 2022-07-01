import { Firebase } from "../util/Firebase";
import { getDoc, collection, setDoc, doc } from "firebase/firestore";
import { Model } from "./Model";
import { f } from "pdfjs-dist";

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

    async getById(id) {
        const docRef = doc(Firebase.db(), '/users', id);
        const docSnap = await getDoc(docRef)

        this.fromJSON(docSnap.data());
    }

    save() {
        return new Promise((resolve, reject) => {
            const ref = doc(Firebase.db(), 'users', this.email);

            setDoc(ref, this.toJSON()).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        })
    }

    static getRef() {
        return collection(Firebase.db(), '/users',);
    }

    static findByEmail(email) {
        return Promise((s, f) => {
            const docRef = doc(Firebase.db(), '/users', email);
            getDoc(docRef).then((docSnap) => {
                s(docSnap);
            }).catch(err => f(err));
        });
    }

}