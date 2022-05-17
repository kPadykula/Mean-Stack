import {Post} from "./post.model";
import {Injectable} from "@angular/core";
import {map, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/posts";

@Injectable({
  providedIn: 'root'
})
export class PostsServices {

  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(
    private httpClinet: HttpClient,
    private router: Router
  ) {

  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.httpClinet
      .get<{ messages: string, posts: any, maxPosts: number} >(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: { title: string; content: string; _id: string; imagePath: any; creator: string}) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }), maxPosts: postData.maxPosts
          };
      }))
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.httpClinet.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string}>(
      BACKEND_URL + "/" + id
    )
  }

  addPost(posted: {title: string, content: string, image: File}) {
    const postData = new FormData();
    postData.append("title", posted.title);
    postData.append("content", posted.content);
    postData.append("image", posted.image, posted.title)

    const post: Post = {
      // @ts-ignore
      id: null,
      title: posted.title,
      content: posted.content,
      // @ts-ignore
      creator: null
    }
    this.httpClinet
      .post<{message: string, post: Post}>(
        BACKEND_URL,
        postData
      )
      .subscribe((responseData) => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        // @ts-ignore
        creator: null
      };
    }
    this.httpClinet
      .patch(BACKEND_URL + "/" + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }


  deletePost(postId: string) {
    return this.httpClinet
      .delete(BACKEND_URL + "/" + postId);
  }


}
