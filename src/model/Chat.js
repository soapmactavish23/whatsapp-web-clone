import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { Firebase } from "../util/Firebase";
import { Model } from "./Model";

export default class Chat extends Model {
    constructor() {
        super();
    }

    get users() { return this._data.users; }
    set users(users) { this._data.users = users; }

    get timestamp() { return this._data.timestamp; }
    set timestamp(timestamp) { this._data.timestamp = timestamp; }

    static getRef() {
        return collection(Firebase.db(), 'chats');
    }

    static create(meEmail, contactEmail) {
        return new Promise((resolve, reject) => {

            let users = {}

            users[meEmail] = true;
            users[contactEmail] = true;

            addDoc(Chat.getRef(), {
                users,
                timeStamp: new Date(),
            }).then((data) => {
                getDoc(doc(Firebase.db(), '/users', data.id)).then(chat => {
                    resolve(chat);
                }).catch((err) => reject(err));

            }).catch((err) => reject(err));
        });
    }

    static find(meEmail, contactEmail) {
        const q = query(Chat.getRef(), where(btoa(meEmail), '==', true), where(btoa(contactEmail), '==', true))
        return getDocs(q);
    }

    static createIfNotExists(meEmail, contactEmail) {
        return new Promise(function (resolve, reject) {
            
            Chat.find(meEmail, contactEmail).then((chats) => {

                if (chats.empty) {
                    Chat.create(meEmail, contactEmail).then((chat) => {
                        resolve(chat);
                    });
                } else {
                    chats.forEach((chat) => {
                        resolve(chat);
                    });
                }

            }).catch(err => reject(err));

        });
    }
} 