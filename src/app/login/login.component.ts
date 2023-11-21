import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http-service';
import { AuthenticateModel } from '../models/authenticateModel';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as forge from 'node-forge';
import { ConversionUtils } from 'turbocommons-ts';

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
   let data:any= {
      id: "6180167922300436",
      phoneNumber: "7718800612",
      sign: "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",
      txn: "t1",
      respcode: "f4acb239-192e-4cba-8611-5406709c0607"
  }
  let issuerName = this.extractPKCS7(data.sign);
  console.log(issuerName);
    this.router.navigate(["home"], { state:{name:issuerName} });
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
        this.ngxService.stop();
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
          this.ngxService.stop();
          let issuerName = this.extractPKCS7(data.sign);
          this.router.navigate(["home"], { state:{name:issuerName} });

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

  extractPKCS7(sign:any):string{
     let testsign ="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";
    let data = '-----BEGIN PKCS7-----\r\n' + sign + '\r\n-----END PKCS7-----\r\n';
    let p7d:any = forge.pkcs7.messageFromPem(data);
    let issuerName = p7d.certificates[0].subject.attributes[2].value;
    //console.log(p7d.certificates[0].subject.attributes[2].value);
    return issuerName;
  }

}
