import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  permalink: string = '';
  selectedImage!: any;
  imgSrc: any = './assets/placeholder-image.jpg';
  categories!: Array<any>;
  postForm!: FormGroup;
  isDisabled: boolean = true;
  post!: any;
  formStatus: string = 'Add New';
  id!: string;

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((val) => {
      this.id = val.id;
      if (this.id) {
        console.log(val.id);
        this.postService.loadOneData(val.id).subscribe((post) => {
          this.post = post;
          this.postForm = this.fb.group({
            title: [
              this.post.title,
              [Validators.required, Validators.minLength(10)],
            ],
            permalink: [this.post.permalink, Validators.required],
            excerpt: [
              this.post.excerpt,
              [Validators.required, Validators.minLength(50)],
            ],
            category: [
              `${this.post.category.categoryId}-${this.post.category.category}`,
              [Validators.required],
            ],
            postImg: ['', Validators.required],
            content: [this.post.content, [Validators.required]],
          });
          console.log(this.post.permalink);
          this.imgSrc = this.post.postImgPath;
          this.formStatus = 'Edit';
          // this.postForm.get('permalink')?.disable();
        });
      } else {
        this.postForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: ['', Validators.required],
          excerpt: ['', [Validators.required, Validators.minLength(50)]],
          category: ['', [Validators.required]],
          postImg: ['', Validators.required],
          content: ['', [Validators.required]],
        });
      }
    });
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe((val) => {
      this.categories = val;
    });
  }

  get fc() {
    return this.postForm.controls;
  }

  onTitleChanged($event: any) {
    const title = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');

    console.log(this.permalink);
  }

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target != null) {
        this.imgSrc = e.target.result;
      }
    };
    reader.readAsDataURL($event.target.files[0]);
    this.selectedImage = $event.target.files[0];
  }

  onSubmit() {
    console.log(this.postForm.value);
    let catArray = this.postForm.value.category.split('-');
    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: catArray[1],
        category: catArray[0],
      },
      excerpt: this.postForm.value.excerpt,
      postImgPath: '',
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date(),
    };
    this.postService.uploadImage(
      this.selectedImage,
      postData,
      this.formStatus,
      this.id
    );
    this.postForm.reset();
    this.imgSrc = './assets/placeholder-image.jpg';
  }
}
