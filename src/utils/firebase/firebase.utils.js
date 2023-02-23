import { initializeApp } from 'firebase/app'
import  { 
    getAuth, 
    signInWithRedirect, 
    signInWithPopup, 
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth'
import {
    getFirestore,
    doc,
    getDoc,
    setDoc
} from 'firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyAoVwh1C_hK1e9tk3FqfiJUcU8Nk7cayQE",
    authDomain: "sample-ecommerce-site-b5bef.firebaseapp.com",
    projectId: "sample-ecommerce-site-b5bef",
    storageBucket: "sample-ecommerce-site-b5bef.appspot.com",
    messagingSenderId: "482853747529",
    appId: "1:482853747529:web:7b5689f4df0b493519f898"
 };
  
const firebaseApp = initializeApp(firebaseConfig)

const googleProvider = new GoogleAuthProvider() // this is just firebase auth
// there are other google auth providers, this is the main one
googleProvider.setCustomParameters({
    prompt: "select_account"
})

export const auth = getAuth(); // google implements 1 type of auth
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider)
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider)

export const db = getFirestore() // variable db now directly points to our firebase database

// this function creates a user document once a user is authenticated
export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
    if(!userAuth) return;
    // to check if there is an existing user document reference --> this reference is an 
    // instance of a document model
    const userDocRef = doc(db, 'users', userAuth.uid)
    console.log(userDocRef)

    const userSnapShot = await getDoc(userDocRef)
    console.log(userSnapShot)
    console.log(userSnapShot.exists())

    if(!userSnapShot.exists()){
        const {displayName, email} = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                ...additionalInformation
            })
        } catch (error) {
            console.log('error creating the user', error.message)
        }

    }

    return userDocRef
}

export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if(!email || !password) return;
    return await createUserWithEmailAndPassword(auth, email, password)
}

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if(!email || !password) return;
    return await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async () => await signOut(auth)

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback)