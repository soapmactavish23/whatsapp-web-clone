
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

let encode64 = function (input) {
    return Buffer.from(input).toString('base64');
}

let decode64 = function (input) {
    return Buffer.from(input, 'base64').toString('ascii');
}

exports.saveLastMessage = functions.firestore.document('/chats/{chatId}/messages/{messageId}').onCreate((change, context) => {

    let chatId = context.params.chatId;
    let messageId = context.params.messageId;

    console.log('[CHAT ID]', chatId);
    console.log('[MESSAGE ID]', messageId);

    return new Promise((resolve, reject) => {

        let chatRef = db.collection('chats').doc(chatId);

        chatRef.onSnapshot(snapChat => {

            let chatDoc = snapChat.data();

            console.log('[CHAT DATA]', chatDoc);

            let messageRef = chatRef.collection('messages').doc(messageId).onSnapshot(snapMessage => {

                let messageDoc = snapMessage.data();

                console.log('[MESSAGE DATA]', messageDoc);
                console.log('[USERS]', Object.keys(chatDoc.users));
                console.log('[FROM BASE64]', encode64(messageDoc.from));

                let userFrom = messageDoc.from;

                console.log('[FROM]', userFrom);

                let userTo = Object.keys(chatDoc.users).filter(userId => userId !== encode64(messageDoc.from))[0];

                console.log('[TO]', userTo);
                console.log('[TO BASE64]', decode64(userTo));

                db.collection('users').doc(userTo).collection('contacts').doc(encode64(userFrom)).set({
                    lastMessage: messageDoc.content,
                    lastMessageTime: new Date()
                }, { merge: true }).then(e => {

                    console.log('[FINISH]', new Date());

                    resolve(e);
                    return true;
                }).catch(err => {

                    console.log('[ERROR]', err);

                    throw new Error(err);
                });

            });

        });

    })

});