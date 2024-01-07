import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "./fireBaseApp.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { readDataByCompanyUid } from "./crudUtilityHelper.js";

export const readCompanyUserStockItems = async (companyUid) => {
  return await readDataByCompanyUid("userStockItems", companyUid);
};

export const readCompanyOneUserStockItems = async (companyUid, userId) => {
  console.debug("companyUid", companyUid);
  console.debug("userId", userId);
  let resultData = [];
  try {
    const collectionRef = collection(db, "userStockItems");
    const q = query(collectionRef, where("companyUid", "==", companyUid), where("stockItemUserUid", "==", userId), where("removed", "==", 0));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let currentStockData = doc.data();
      currentStockData.documentId = doc.id;
      resultData.push(currentStockData);
    });
  } catch (err) {
    console.error(err);
  }
  return resultData;
};

export const readUserStockItem = async (stockItemDocumentId, userId) => {
  console.debug("stockItemDocumentId", stockItemDocumentId);
  console.debug("userId", userId);
  let resultData = [];
  try {
    const collectionRef = collection(db, "userStockItems");
    const q = query(collectionRef, where("stockItemDocumentId", "==", stockItemDocumentId), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let currentStockData = doc.data();
      currentStockData.documentId = doc.id;
      resultData.push(currentStockData);
    });
  } catch (err) {
    console.error(err);
  }
  return resultData;
};

export const addNewUserStockItem = async (newUserStockItemData) => {
    console.debug(newUserStockItemData);
    const collectionRef = collection(db, "userStockItems");
    const newItem = {
      ...newUserStockItemData,
      createdDate: serverTimestamp(),
      modifedDate: serverTimestamp(),
    };
    return await addDoc(collectionRef, newItem);
  };


export const modifyUserStockItem = async (userStockItemsData) => {
  console.debug("data", stockItemData);
  const id = userStockItemsData.documentId;
  console.debug("id", id);
  const docRef = doc(db, "userStockItems", id);
  await updateDoc(docRef, {
    removed : userStockItemsData.removed,
    modifedDate: serverTimestamp(),
  });
};