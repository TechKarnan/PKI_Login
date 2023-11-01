import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http-service';
import { AuthenticateModel } from '../models/authenticateModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http:HttpService,private router:Router){
  }

  ngOnInit(): void {
  }

  navigate(){
    this.router.navigateByUrl("home");
  }

  onLogin(){
    let authModel = this.getAuthenticationModel();
    this.http.authenticate(authModel).subscribe((res:any)=>{
      console.log(res);
      let respData = JSON.parse(res.data);
      this.getStatusApi(respData.rescode);
     },(err)=>{
      console.log(err);
     })
  }

  getAuthenticationModel(){
    let authenticateModel = new AuthenticateModel();
      authenticateModel.id="6180167922300436";
      authenticateModel.org="jio";
      authenticateModel.hash="G4dKytJOUGjaWndrZtvQXTFoU7faMGl3bOI2pL1kvuE=";
      authenticateModel.reqType="signature";
      authenticateModel.docUrl="https://docurl";
      authenticateModel.respUrl="https://respurl"
      return authenticateModel;
  }

  getStatusApi(respcode:string):any{
      this.http.getStatus(respcode).subscribe((data:any)=>{      
        if(data.status == 0){
          console.log("retry..!");
          this.getStatusApi(respcode);
        }else{
          console.log(data);
          this.router.navigateByUrl("home");
        }
      },(err)=>{
        if(err.error.errorCd =="3105"){
          console.log("Session Timeout Please try again...!");
        };
      })
  }

}
