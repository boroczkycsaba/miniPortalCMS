import { readDataByCompanyUid, readDataByid } from "./crudUtilityHelper.js";
import { db} from "./fireBaseApp.js";
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

export const readStocks = async (companyUid) => {
  return await readDataByCompanyUid("stockItems", companyUid);
};

export const readStock = async (id) => {
  return await readDataByid("stockItems", id);
};

export const addNewStockItem = async (newStockItemData) => {
  console.debug(newStockItemData);
  const collectionRef = collection(db, "stockItems");
  const newItem = {
    ...newStockItemData,
    createdDate: serverTimestamp(),
    modifedDate: serverTimestamp(),
  };
  return await addDoc(collectionRef, newItem);
};

export const modifyStockItem = async (id, stockItemData) => {
  console.debug("data", stockItemData);
  console.debug("id", id);
  const docRef = doc(db, "stockItems", id);
  await updateDoc(docRef, {
    name: stockItemData.name,
    barcode: stockItemData.barcode,
    description: stockItemData.description,
    modifedDate: serverTimestamp(),
  });
};


export const modifyStockItemQuantity = async (id, quantity) => {
  console.debug("quantity", quantity);
  console.debug("id", id);
  const docRef = doc(db, "stockItems", id);
  await updateDoc(docRef, {
    quantity: quantity,
    modifedDate: serverTimestamp(),
  });
};