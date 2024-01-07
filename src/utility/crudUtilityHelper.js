import { db } from "./fireBaseApp.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  doc,
  getDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { v4 } from "uuid";

export const createBaseFirestoreData = async (fireStoreData, user, companyUid) => {
  fireStoreData.id = v4();
  fireStoreData.creatorUserUid = user.uid;
  fireStoreData.creatorUserMail = user.email;
  fireStoreData.modifierUserUid = user.uid;
  fireStoreData.modifierUserMail = user.email;
  if (companyUid) {
    fireStoreData.companyUid = companyUid;
  }
};

export const readDataByCompanyUid = async (storageName, companyUid) => {
  console.debug("companyUid", companyUid);
  let resultData = [];
  try {
    const collectionRef = collection(db, storageName);
    const q = query(collectionRef, where("companyUid", "==", companyUid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let currentData = doc.data();
      currentData.documentId = doc.id;
      resultData.push(currentData);
    });
  } catch (err) {
    console.error(err);
  }
  return resultData;
};

export const readDataByid = async (storageName, id) => {
  console.debug("id", id);
  let currentData;
  const docRef = doc(db, storageName, id);
  try {
    const docSnap = await getDoc(docRef);
    let doc = docSnap.data();
    if (doc) {
      currentData = doc;
      currentData.documentId = docSnap.id;
    }
  } catch (err) {
    console.error(err);
  }
  return currentData;
};
