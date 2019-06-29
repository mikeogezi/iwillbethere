import { POSTERS_COLLECTION_NAME } from './Collections'

export default class FirebaseUtils {
    static async deletePoster (firebase, posterId) {
        const db = firebase.firestore()
        
        try {
            await db.collection(POSTERS_COLLECTION_NAME)
                    .doc(posterId)
                    .delete()
        }
        catch (e) {
            throw e;
        }   
    }

    static async createPoster (firebase, { title, phrase, posterImageSrc, shortCode }) {
        const db = firebase.firestore()

        try {
            let poster = await db.collection(POSTERS_COLLECTION_NAME)
                .add({ title, phrase, posterImageSrc, shortCode });
            return poster;
        }
        catch (e) {
            throw e;
        }
    }

    static async getPosters (firebase) {
        const db = firebase.firestore();

        try {
            let posters = await db.collection(POSTERS_COLLECTION_NAME)
                .get();
            return posters;
        }
        catch (e) {
            throw e;
        }
    }

    static async getPoster (firebase, shortCode) {
        const db = firebase.firestore()

        try {
            let poster = await db.collection(POSTERS_COLLECTION_NAME)
                .where("shortCode", "==", shortCode)
                .get();
            return poster;
        }
        catch (e) {
            throw e;
        }
    }

    static isLoggedIn (context) {
        return context.signedIn;
        // return !!firebase.auth().currentUser;
    }
}