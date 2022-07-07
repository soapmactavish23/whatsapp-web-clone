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
    
    get chatId() { return this._data.chatId; }
    set chatId(value) { this._data.chatId = value; }

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

    static getContactsRef(id) {
        return doc(User.getRef(this.email), 'contacts', btoa(id));
    }

    addContact(contact) {
        console.log(contact);
        return new Promise((resolve, reject) => {
            const ref = User.getContactsRef(contact.email);
            setDoc(ref, contact.toJSON()).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        })
    }

    getContacts() {
        return new Promise((resolve, reject) => {
            onSnapshot(collection(User.getRef(this.email), 'contacts'), (docs) => {
                let contacts = [];

                docs.forEach(doc => {
                    let data = doc.data();

                    data.id = doc.id;

                    contacts.push(data);

                });

                this.trigger('contactschange', docs);

                resolve(contacts);

            });
        });
    }

}