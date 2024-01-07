import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "./fireBaseApp.js";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { readDataByCompanyUid } from "./crudUtilityHelper.js";

export const createStockItemModifiedQuantity = async (newStockItemQuantityData) => {
  console.log(newStockItemQuantityData);
  const collectionRef = collection(db, "stockItemsModified");
  const newItem = {
    ...newStockItemQuantityData,
    createdDate: serverTimestamp(),
    modifedDate: serverTimestamp(),
  };
  const newDocRef = await addDoc(collectionRef, newItem);
};

export const readModifiedStocks = async (companyUid) => {
  return await readDataByCompanyUid("stockItemsModified", companyUid);
};