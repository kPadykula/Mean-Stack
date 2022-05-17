import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../post.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostsServices} from "../posts.services";
import {ActivatedRoute, ParamMap} from "@angular/router";
import { imageValid } from "./image-type.validator";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit, OnDestroy {

  isLoading = false;
  private mode = 'create';
  private postId: any | string;
  post: Post | any;
  //@ts-ignore
  form: FormGroup;
  // @ts-ignore
  imagePreview: string | ArrayBuffer | null;
  //@ts-ignore
  private authStatusSub: Subscription;

  constructor(
    private postsService: PostsServices,
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(
      authStatus => {
          this.isLoading = false;
        }
      );
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
        ]
      }),
      content: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }),
      image: new FormControl(null, {
        validators: [
          Validators.required,
        ],
        asyncValidators: [imageValid]
      })
    });

    this.route.paramMap
      .subscribe((paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postsService.getPost(this.postId)
            .subscribe(postData => {
              this.isLoading = false;
              this.post = {
                id: postData._id,
                title: postData.title,
                content: postData.content,
                imagePath: postData.imagePath,
              }
              this.form?.setValue({
                title: this.post.title,
                content: this.post.content,
                image: this.post.imagePath
              });
            });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

  onImagePicked(event: Event) {
    //@ts-ignore
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file
    });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid)
      return;

    this.isLoading = true;

    const post = {
      id: this.postId,
      title: this.form.value.title,
      content: this.form.value.content,
      image: this.form.value.image
    };

    if (this.mode === 'create'){
      this.postsService.addPost(post);
    } else {
      this.postsService.updatePost(
          this.postId,
          this.form.value.title,
          this.form.value.content,
          this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
