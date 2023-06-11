import 'expo-router/entry';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInAnonymously } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyAuu3ZktC9KRVBz45rvUxXmSJFIs6N2b8M',
	authDomain: 'manhunt-7bbae.firebaseapp.com',
	databaseURL: 'https://manhunt-7bbae-default-rtdb.firebaseio.com/',
	projectId: 'manhunt-7bbae',
	storageBucket: 'manhunt-7bbae.appspot.com',
	messagingSenderId: '256284468313',
	appId: '1:256284468313:web:ec1261155fed4c5b70bd48',
	measurementId: 'G-NZL9SSLBP7',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();
const analytics = getAnalytics(app);

auth.onAuthStateChanged((user) => {
	console.log(user)
	if (user) {
		// you are logged in
	} else {
		// you are logged out
	}
});

signInAnonymously(auth).catch((e) => {
	console.log(`Error code: ${e.code}\nError message: ${e.message}`);
});
