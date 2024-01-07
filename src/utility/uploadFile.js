import {storage} from "./fireBaseApp.js";
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage'
import { v4 } from "uuid";

const firebaseDocUploadFunction = `${import.meta.env.VITE_DOCUMENT_UPLOAD_REAL_FUNCTIONS}`

export const uploadDocument=async (file, uploadDocumentFolder)=>{
    if (!uploadDocumentFolder) {
        uploadDocumentFolder = "stockDocuments";
    }
    try{
        console.debug(file);
        const fileName = `${file.name + v4()}`;
        if (firebaseDocUploadFunction === "yes") {
            const stockDocumentsRef = ref(storage, uploadDocumentFolder);
            const fileRef = ref(stockDocumentsRef, fileName);
            
            console.debug(fileName);

            await uploadBytes(fileRef,file)
            return await getDownloadURL(fileRef);
        } else {
            console.warn("Firebase dokumentum feltöltés funkció nincs bekapcsolva");
           return fileName;
        }
       
    }catch(err){
        console.error('Hiba a fájlfeltöltés során:',err);
        throw err
    }
}
