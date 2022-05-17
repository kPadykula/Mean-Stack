import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";


const BACKEND_URL = environment.apiUrl + "/password-reset";

@Injectable({
  providedIn: "root"
})
export class PassresetService {

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {
  }

  sendEmail(email: string) {
    const resetData = { email: email };
    this.httpClient.post(BACKEND_URL, resetData)
      .subscribe(() => {
        this.router.navigate(['/login']);
      }, error => {
        console.log(error);
      });
  }

  resetPassword(id: string | null, token: string | null, password: string) {
    if (!id || !token)
      return;

    const resetData = {
      userId: id,
      token: token,
      password: password
    };

    return this.httpClient
      .patch( BACKEND_URL + "/" + id + "/" + token, resetData)
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }


}
