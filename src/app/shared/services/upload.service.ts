import { Injectable } from '@angular/core';
import {  
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor() {}

  uploadFile(file: File, filedate: number, folder: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const storage = getStorage();
      const metadata = {
        contentType: file.type,
      };

      const newFileName = filedate + '_' + file.name;
      const storageRef = ref(storage, folder + '/' + newFileName);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              reject(error);
              break;
            case 'storage/canceled':
              reject(error);
              break;
            case 'storage/unknown':
              reject(error);
              break;
            default:
              reject(error);
              break;
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              reject(error);
            });
        }
      );
    });
  }   
}
