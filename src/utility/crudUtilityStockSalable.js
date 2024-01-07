import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "./fireBaseApp.js";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { readDataByCompanyUid } from "./crudUtilityHelper.js";

export const createStockItemSalable = async (newStockItemSalable) => {
  console.debug(newStockItemSalable);
  const collectionRef = collection(db, "stockItemsSalable");
  const newItem = {
    ...newStockItemSalable,
    createdDate: serverTimestamp(),
    modifedDate: serverTimestamp(),
  };
  const newDocRef = await addDoc(collectionRef, newItem);
};

export const readSalableStocks = async (companyUid) => {
  return await readDataByCompanyUid("stockItemsSalable", companyUid);
};