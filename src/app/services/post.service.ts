import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toster: ToastrService,
    private router: Router
  ) {}

  uploadImage(
    selectedImage: any,
    postData: any,
    formStatus: string,
    id: string
  ) {
    const filePath = `postIMG/${Date.now()}`;
    console.log(filePath);

    this.storage.upload(filePath, selectedImage).then(() => {
      console.log('Post Image uploaded');

      this.storage
        .ref(filePath)
        .getDownloadURL()
        .subscribe((url) => {
          postData.postImgPath = url;
          console.log(postData);
          if (formStatus == 'Add New') {
            this.saveData(postData);
          } else if (formStatus == 'Edit') {
            this.updateData(id, postData);
          }
        });
    });
  }
  saveData(postData: any) {
    this.afs
      .collection('posts')
      .add(postData)
      .then((docRef) => this.toster.success('Data Inserted Successfully'));
    this.router.navigate(['/posts']);
  }

  loadData() {
    return this.afs
      .collection('posts')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  loadOneData(id: any) {
    return this.afs.collection('posts').doc(id).valueChanges();
  }

  updateData(id: any, postData: any) {
    console.log(postData);
    this.afs
      .collection('posts')
      .doc(id)
      .update(postData)
      .then(() => {
        this.toster.success('Data Updated Successfully!');
        this.router.navigate(['/posts']);
      });
  }

  deleteData(postImgPath: string, id: string) {
    this.storage.storage
      .refFromURL(postImgPath)
      .delete()
      .then(() => {
        this.afs
          .collection('posts')
          .doc(id)
          .delete()
          .then(() => this.toster.warning('Post deleted Successfully'));
      });
  }

  markFeatured(id: string, featuredData: any) {
    this.afs
      .collection('posts')
      .doc(id)
      .update(featuredData)
      .then(() => this.toster.info('Featured Status Updated'));
  }
}
