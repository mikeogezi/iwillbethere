import { POSTERS_COLLECTION_NAME, POSTER_IMAGE_ROOT, POSTER_THUMBNAIL_ROOT } from './Constants'

import ImageUtils from './ImageUtils'

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

    static async createPoster (firebase, { title, phrase, shortCode }) {
        const db = firebase.firestore()

        try {
            let poster = await db.collection(POSTERS_COLLECTION_NAME)
                .add({ title, phrase, shortCode });
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

    static async uploadPosterImages (firebase, { posterImageSrc, thumbnailSrc, id }) {
        const storage = firebase.storage()

        try {
            const pRef = storage.ref().child(`${POSTER_IMAGE_ROOT}/${id}-original.jpeg`)
            const tRef = storage.ref().child(`${POSTER_THUMBNAIL_ROOT}/${id}-thumbnail.jpeg`)
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

    static mountAuthStateListener (firebase, that) {
        that.unregisterAuthObserver = firebase.auth()
            .onAuthStateChanged((user) => {
                if (!user) {
                    that.props.history.push("/sign-in/");
                }
            });
    }

    static unmountAuthStateListener (firebase, that) {
        if (that.unregisterAuthObserver) {
            that.unregisterAuthObserver();
        }
    }
}