import { initializeApp } from "firebase/app";
import {
	getAuth,
	onAuthStateChanged,
	signOut,
	signInWithPopup,
	GoogleAuthProvider,
	NextOrObserver,
	User,
} from "firebase/auth";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_API_KEY,
	authDomain: import.meta.env.VITE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_ID,
	measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
// Removed for testing
// provider.setCustomParameters({ hd: "stanford.edu" });
const auth = getAuth(app);

export const signInWithGooglePopup = async () =>
	await signInWithPopup(auth, provider);

export const userStateListener = (callback: NextOrObserver<User>) => {
	return onAuthStateChanged(auth, callback);
};

export const SignOutUser = async () => await signOut(auth);
