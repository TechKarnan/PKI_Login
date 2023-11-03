import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http-service';
import { AuthenticateModel } from '../models/authenticateModel';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isRejected:boolean=false;
  hashResult:string="";
  noMobileNumber:boolean=false;
  errorMsg:string="";
  isError=false;

  loginForm = new FormGroup({
    mobileNumber: new FormControl(),
  })

  constructor(private http:HttpService,private router:Router,private ngxService: NgxUiLoaderService){
  }

  ngOnInit(): void {
   
  }

  navigate(){
    this.router.navigateByUrl("home");
  }

  onLogin(){
    if(this.loginForm.get('mobileNumber')?.value==null){
          this.noMobileNumber=true;
    }else{
    this.getPayloadSignature(this.loginForm.get('mobileNumber')?.value).then((data)=>{
      let authModel = this.getAuthenticationModel(this.loginForm.get('mobileNumber')?.value,data);
     console.log(authModel);
     this.ngxService.start();
     this.http.authenticate(authModel).subscribe((res:any)=>{
      console.log(res);
      let obj =JSON.parse(res.data)
      this.getStatusApi(obj.rescode)
     },(err)=>{
        this.isError=true;
        this.errorMsg=err.error.errorDesc;
        console.log(err.error.errorDesc);
     })

    })
  }
  }

  getAuthenticationModel(mobileNumber:any,data:any){
    let authenticateModel = new AuthenticateModel();
      authenticateModel.phoneNumber=mobileNumber;
      authenticateModel.organizationName="jio";
      authenticateModel.hash=this.hashResult;
      authenticateModel.reqType="authentication";
      authenticateModel.timestamp=new Date().getTime();
      authenticateModel.signature=data+"";
      authenticateModel.docURL="URL";
      authenticateModel.transactionId="1234567890123456"
      authenticateModel.responseURL="URL"
      return authenticateModel;
  }

 
  getHash(){
    const buffer = new Uint8Array(32);
      const randomBuffer = crypto.getRandomValues(buffer); // Generate a random 32-byte buffer (256 bits for SHA-256)
      const dataArray = Array.from(randomBuffer); // Convert Uint8Array to array of numbers
      const wordArray = CryptoJS.lib.WordArray.create(dataArray);
      const hash = CryptoJS.SHA256(wordArray);
      this.hashResult = hash.toString(CryptoJS.enc.Base64);
      console.log('Base64-encoded random hash:', this.hashResult);
      return this.hashResult;
  }

  getStatusApi(respcode:string):any{
      this.http.getStatus(respcode).subscribe((data:any)=>{      
        if(data.status == 0){
          console.log("retry..!");
          this.getStatusApi(respcode);
        }else if(data.status=="D100"){
          this.ngxService.stop();
            this.isRejected=true;
        }
        else{
          console.log(data);
          this.ngxService.stop();
          this.router.navigateByUrl("home");
        }
      },(err)=>{
        if(err.error.errorCd =="3105"){
          this.ngxService.stop();
          console.log("Session Timeout Please try again...!");
        }else{
          this.ngxService.stop();
        }
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
        hash:this.getHash(),
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
