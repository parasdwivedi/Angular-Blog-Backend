import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private afs: AngularFirestore, private toastr: ToastrService) {}

  saveData(catData: unknown) {
    this.afs
      .collection('categories')
      .add(catData)
      .then((docRef) => {
        console.log(docRef);
        this.toastr.success('Data Insert Successfully');
      })
      .catch((err) => console.log(err));

    //   this.afs
    //     .collection('categories')
    //     .doc(docRef.id)
    //     .collection('subcategories')
    //     .add(subCatData)
    //     .then((docRef1) => {
    //       console.log(docRef1);

    //       this.afs
    //         .doc(`/categories${docRef.id}/subcategories(${docRef1.id})`)
    //         .collection('subsubcategories')
    //         .add(subCatData)
    //         .then((docRef2) => console.log(docRef2));

    //       //both are same up and down but up one is less noisy

    //       this.afs
    //         .collection('categories')
    //         .doc(docRef.id)
    //         .collection('subcategories')
    //         .doc(docRef1.id)
    //         .collection('subsubcategories')
    //         .add(subCatData)
    //         .then((docRef2) => console.log(docRef2));
    //     });
    // })
  }

  loadData() {
    return this.afs
      .collection('categories')
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

  updateData(id: any, EditData: any) {
    this.afs
      .collection('categories')
      .doc(id)
      .update(EditData)
      .then((docRed) => this.toastr.success('Data Insert Successfully'));
  }

  deleteData(id: any) {
    this.afs
      .collection('categories')
      .doc(id)
      .delete()
      .then((docRed) => this.toastr.success('Data Deleted Successfully'));
  }
}
