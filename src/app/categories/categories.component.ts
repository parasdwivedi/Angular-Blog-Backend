import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categoryName!: string;
  catArray!: Array<any>;
  formStatus: string = 'Add';
  id: string = '';
  ngOnInit(): void {
    this.categoryService.loadData().subscribe((val) => {
      console.log(val);
      this.catArray = val;
    });
  }

  constructor(private categoryService: CategoriesService) {}

  onSubmit(data: NgForm) {
    let catData: Category = {
      category: data.value.categoryName,
    };
    // let subCatData = {
    //   subCategory: 'subCat1',
    // };

    if (this.formStatus == 'Add') {
      this.categoryService.saveData(catData);
    } else if (this.formStatus == 'Edit') {
      this.categoryService.updateData(this.id, catData);
    }
    this.formStatus = 'Add';
    data.reset();
  }
  onEdit(id: any, data: any) {
    this.categoryName = data;
    console.log(data);
    this.formStatus = 'Edit';
    this.id = id;
  }

  onDelete(id: any) {
    this.categoryService.deleteData(id);
  }
}
