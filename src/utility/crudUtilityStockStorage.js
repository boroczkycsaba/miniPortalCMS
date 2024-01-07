import { readDataByCompanyUid, readDataByid } from "./crudUtilityHelper.js";
import { db } from "./fireBaseApp.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc
} from "firebase/firestore";

export const addNewStorageItemCompany = async (newStorageItemData) => {
  console.debug(newStorageItemData);
  const collectionRef = collection(db, "storageStockItems");
  const newItem = {
    ...newStorageItemData,
    createdDate: serverTimestamp(),
    modifedDate: serverTimestamp(),
  };
  const newDocRef = await addDoc(collectionRef, newItem);
};

export const modifyStorageItem = async (id, storageItemData) => {
  console.debug("data", storageItemData);
  console.debug("id", id);
  const docRef = doc(db, "storageStockItems", id);
  await updateDoc(docRef, {
    name: storageItemData.name,
    virual: storageItemData.virual,
    address: storageItemData.address,
    description: storageItemData.description,
    modifedDate: serverTimestamp(),
  });
};

export const readStorageItems = async (companyUid) => {
  return await readDataByCompanyUid("storageStockItems", companyUid);
};

export const readStorageItem = async (id) => {
  return await readDataByid("storageStockItems", id);
};
