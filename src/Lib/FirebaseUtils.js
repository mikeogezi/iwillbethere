import { POSTERS_COLLECTION_NAME, POSTER_IMAGE_ROOT, POSTER_THUMBNAIL_ROOT } from './Constants'

import ImageUtils from './ImageUtils'

export default class FirebaseUtils {
    static async deletePoster (firebase, id) {
        const db = firebase.firestore()
        
        try {
            await db.collection(POSTERS_COLLECTION_NAME)
                    .doc(id)
                    .delete()
        }
        catch (e) {
            throw e;
        }   
    }

    static async createPoster (firebase, { title, phrase, shortCode }) {
        const db = firebase.firestore()

        try {
            const { uid } = firebase.auth().currentUser
            let poster = await db.collection(POSTERS_COLLECTION_NAME)
                .add({ title, phrase, shortCode, uid });
            return poster;
        }
        catch (e) {
            throw e;
        }
    }

    static async getPosters (firebase) {
        const db = firebase.firestore();

        try {
            const { uid } = firebase.auth().currentUser
            let posters = await db.collection(POSTERS_COLLECTION_NAME)
                .where("uid", "==", uid)
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
            const { uid } = firebase.auth().currentUser
            let poster = await db.collection(POSTERS_COLLECTION_NAME)
                .where("shortCode", "==", shortCode)
                .get();
            return poster;
        }
        catch (e) {
            throw e;
        }
    }

    static async uploadPosterImages (firebase, { posterImageSrc, thumbnailSrc, id }) {
        const storage = firebase.storage()

        try {
            const { uid } = firebase.auth().currentUser
            const pRef = storage.ref().child(`${POSTER_IMAGE_ROOT}/${uid}/${id}-original.jpeg`)
            const tRef = storage.ref().child(`${POSTER_THUMBNAIL_ROOT}/${uid}/${id}-thumbnail.jpeg`)
            // let pSnapshot = await pRef.put(window.atob(ImageUtils.removeImageDataPrefix(posterImageSrc)))
            // let tSnapshot = await tRef.put(window.atob(ImageUtils.removeImageDataPrefix(thumbnailSrc)))
            let pSnapshot = await pRef.putString(posterImageSrc, "data_url")
            let tSnapshot = await tRef.putString(thumbnailSrc, "data_url")

            return { pSnapshot, tSnapshot };
        }
        catch (e) {
            throw e;
        }
    }

    static async updatePosterDocWithImages (firebase, { posterImageUrl, thumbnailUrl, id }) {
        const db = firebase.firestore();

        try {
            let poster = await db.collection(POSTERS_COLLECTION_NAME)
                .doc(id)
                .update({
                    posterImageUrl,
                    thumbnailUrl
                });
            return poster;
        }
        catch (e) {
            throw e;
        }
    }

    static mountAuthStateListener (firebase, that, opts) {
        opts = opts || {}
        that.unregisterAuthObserver = firebase.auth()
            .onAuthStateChanged((user) => {
                if (!user) {
                    that.props.history.push("/sign-in/");
                }
                else if (opts.onSignedIn) {
                    opts.onSignedIn();
                }
            });
    }

    static unmountAuthStateListener (firebase, that) {
        if (that.unregisterAuthObserver) {
            that.unregisterAuthObserver();
        }
    }
}