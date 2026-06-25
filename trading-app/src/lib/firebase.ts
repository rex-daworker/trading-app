import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAdOejhSLogcbDfcArVj2O8NUBRBMplFbU",
  authDomain: "tradeflow-91a42.firebaseapp.com",
  projectId: "tradeflow-91a42",
  appId: "1:17938238074:web:b44f1f98dc797de30749c3",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)