import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http-service';
import { AuthenticateModel } from '../models/authenticateModel';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    mobileNumber: new FormControl(),
  })

  constructor(private http:HttpService,private router:Router){
  }

  ngOnInit(): void {
    
  }

  navigate(){
    this.router.navigateByUrl("home");
  }

  onLogin(){
    
    this.getPayloadSignature(this.loginForm.get('mobileNumber')?.value).then((data)=>{
      let authModel = this.getAuthenticationModel(this.loginForm.get('mobileNumber')?.value,data);
     console.log(authModel);

     this.http.authenticate(authModel).subscribe((res:any)=>{
      console.log(res);
      let obj =JSON.parse(res.data)
      this.getStatusApi(obj.rescode)
     })

    })
  }

  getAuthenticationModel(mobileNumber:any,data:any){
    let authenticateModel = new AuthenticateModel();
      authenticateModel.phoneNumber=mobileNumber;
      authenticateModel.organizationName="jio";
      authenticateModel.hash="G4dKytJOUGjaWndrZtvQXTFoU7faMGl3bOI2pL1kvuE=";
      authenticateModel.reqType="authentication";
      authenticateModel.timestamp=new Date().getTime();
      authenticateModel.signature=data+"";
      authenticateModel.docURL="URL";
      authenticateModel.transactionId="1234567890123456"
      authenticateModel.responseURL="URL"
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

  async getPayloadSignature(mobileNumber:any) {
    console.log("getPayloadSignature() called");
    try {
      const apiUrl = 'http://10.145.52.88:8007/getSignature/4zsNgHORMx';
      
      const requestData = {
        phoneNumber:mobileNumber,
        transactionId:"1234567890123456",
        organizationName:"jio",
        hash:"G4dKytJOUGjaWndrZtvQXTFoU7faMGl3bOI2pL1kvuE=",
        reqType:"authentication",
        responseURL:"URL",
        docURL:"URL",
        signature:"",
        timestamp: new Date().getTime(), 
      };
  
      const response = await axios.post(apiUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('getPayloadSignature API Response:', response.data);
      return response.data;
    } catch (error:any) {
      console.error('getPayloadSignature API Response:', error);
    }
  }

}
