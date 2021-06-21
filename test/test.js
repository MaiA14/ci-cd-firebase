const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = "test-ci-cd-8e4bf";
const myId = "user_abc";
const theirId = "user_xyz";
const myAuth = { uid: "user_abc", email: "abc@gmail.com" };

const getFirestore = (auth) => {
    return firebase.initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth }).firestore();
}

beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
})

describe("My app", () => {
    it("Understand basic addition", () => {
        assert.equal(2 + 2, 4);
    });


    it("Understand basic addition", () => {
        assert.equal(2 + 2, 6);
    });

    it("Can read items in read-only collection", async () => {
        const db = getFirestore(null);
        const testDoc = db.collection("readonly").doc("testDoc");
        await firebase.assertSucceeds(testDoc.get());
    });

    it("Can't write to items in read-only collection", async () => {
        const db = getFirestore(null);
        const testDoc = db.collection("readonly").doc("testDoc2");
        await firebase.assertFails(testDoc.set({ foo: "bar" }));
    });

    it("Can write to a user document with the same ID as our user", async () => {
        const db = getFirestore(myAuth);
        const testDoc = db.collection("users").doc(myId);
        await firebase.assertSucceeds(testDoc.set({ foo: "bar" }));
    });

    it("Can't write to a user document with a different ID as our user", async () => {
        const db = getFirestore(myAuth);
        const testDoc = db.collection("users").doc(theirId);
        await firebase.assertFails(testDoc.set({ foo: "bar" }));
    });

    it("Can read posts marked public", async () => {
        const db = getFirestore(myAuth);
        const testQuery = db.collection("posts").where("visibillity", "==", "public");
        await firebase.assertSucceeds(testQuery.get());
    });

    after(async () => {
        await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
    })
})