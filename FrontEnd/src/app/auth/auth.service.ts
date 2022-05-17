import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/auth"

@Injectable({
  providedIn: "root"
})
export class AuthService {

  //@ts-ignore
  private token: string | null | undefined;
  private isAuthenticated = false;
  // @ts-ignore
  private tokenTimer: NodeJS.Timer;
  //@ts-ignore
  private userId: string | null;
  private authStatusListener = new Subject<boolean>();

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {}

  getToken(){
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  createUser(name: string, surname: string, email: string, password: string) {
    const authData: AuthData = { name: name, surname: surname, email: email, password: password};
    this.httpClient.post(BACKEND_URL + "/signup", authData)
      .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }


  loginUser(email: string, password: string) {
    const authData: { password: string; email: string } = { email: email, password: password };
    this.httpClient.post<{token: string, expiresIn: number, userId: string}>(
      BACKEND_URL + "/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;

        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation)
      return;

    const now = new Date();

    // @ts-ignore
    const expiresIn = authInformation?.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0){
      this.token = authInformation?.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate)
      return;

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout( () => {
      this.logout();
    }, duration * 1000);
  }
}
