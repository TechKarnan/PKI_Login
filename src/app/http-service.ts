import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environments/environments';
import { AuthenticateModel } from './models/authenticateModel';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  authenticate(authenticateModel:AuthenticateModel){
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(authenticateModel);
    console.log(body)
    return this.http.post(environment.authenticateDevUrl, body,{'headers':headers})

  }


  getStatus(respCode:string){
    let params = new HttpParams()
    params=params.set('rescode', respCode);
    return this.http.get(environment.getStatusDevUrl,{params});
  }

}
