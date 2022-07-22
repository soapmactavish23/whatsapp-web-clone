import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Firebase } from "./Firebase";

export class Upload {

    static send(file, from) {
        return new Promise((resolve, reject) => {

            const storageRef = ref(Firebase.hd(), Date.now() + '_' + from);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', snapshot => {

                console.log('upload', snapshot);

            }, err => {

                reject(err);

            }, success => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            });

        })
    }

}