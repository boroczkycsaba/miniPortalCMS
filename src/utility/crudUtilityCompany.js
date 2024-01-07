import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "./fireBaseApp.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  limit,
  getDocs,
  setDoc,
} from "firebase/firestore";

export const addNewCompany = async (newCompanyData) => {
  console.debug(newCompanyData);
  const collectionRef = collection(db, "companies");
  const newItem = {
    ...newCompanyData,
    createdDate: serverTimestamp(),
    modifedDate: serverTimestamp(),
  };
  const newDocRef = await addDoc(collectionRef, newItem);
};

export const readCompany = async (creatorUserUid) => {
  console.debug("creatorUserUid", creatorUserUid);
  let localStorageCompanyData = localStorage.getItem("miniPortalUserCompany");
  if (localStorageCompanyData && !localStorageCompanyData === "undefined") {
    localStorageCompanyData =JSON.parse(localStorageCompanyData);
  }
  let resultData;
  if (localStorageCompanyData && localStorageCompanyData.creatorUserUid == creatorUserUid) {
    resultData = localStorageCompanyData;
  } else {
    const collectionRef = collection(db, "companies");
    const q = query(
      collectionRef,
      where("creatorUserUid", "==", creatorUserUid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      resultData = doc.data();
      resultData.documentId = doc.id;
    });
    localStorage.setItem("miniPortalUserCompany", JSON.stringify(resultData))
  }
  return resultData;
};

export const modifyCompany = async (id, companyData) => {
  console.debug("id", id);
  const docRef = doc(db, "companies", id);
  await updateDoc(docRef, {
    name: companyData.name,
    countryName: companyData.countryName,
    countryDefaultValue: companyData.countryDefaultValue,
    taxNumber: companyData.taxNumber,
    phoneNumber: companyData.phoneNumber,
    faxNumber: companyData.faxNumber,
    description: companyData.description,
    modifedDate: serverTimestamp(),
  });
};
