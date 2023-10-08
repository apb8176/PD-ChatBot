import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient) { }

  postQuery(data: any): Promise<any> {
    //this.cmnService.tokenRefresh();
    let header = {
      headers: new HttpHeaders({
        // 'Content-Type':'application/json',
        // "Accept": "*/*",
        // 'Access-Control-Allow-Origin': '*',
        
        // // 'Authorization': 'Bearer '+localStorage.getItem('currentToken'),
        // // //'Authorization': 'Bearer '+ 'eyJ0eXAiOiJKV1QiLCJub25jZSI6InhvOXg4MXlSSVY3TDVsamtxWV9uS1hEZ1ZuRTNMa21xUDRkMnZrejhScFUiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81NDk1MWI4Zi1mM2IxLTRiMDQtOWE1Yi1iMDEwMTJhYjY4MjEvIiwiaWF0IjoxNjg3MTc4MTkwLCJuYmYiOjE2ODcxNzgxOTAsImV4cCI6MTY4NzE4MjM2NCwiYWNjdCI6MSwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhUQUFBQUI4cXFNWEFNdDFtS3l1SS9MLzBmWDJNSUZ6b0V6TTg0SG1lb2IwRDNPOHkvZXZqRzBHcUxuMTFrMEV5aW9ueGRDNHJ1QkpqekNFQjNvajY0K1E4bW53PT0iLCJhbHRzZWNpZCI6IjU6OjEwMDMyMDAyNUI3MzJENDUiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IldlbGNvbWUgUGxhbmNrdG9uRGF0YS1hcHBzIiwiYXBwaWQiOiJjNGM4MDE5OS01N2M3LTQyYjctYTBmOC1iNjJmZGViZGQ3ZjEiLCJhcHBpZGFjciI6IjAiLCJlbWFpbCI6ImFyY2hhbmFAcGxhbmNrdG9uZGF0YS5jb20iLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82MjA1NzY4Ni0zMTQ4LTRmM2UtYWYxOC0xZmQ3NmI3ZTMzMWYvIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMjQwMTo0OTAwOjFjYmM6OWZkYTo2NThlOmY2ZDM6MzY6NWU3ZCIsIm5hbWUiOiJBcmNoYW5hIiwib2lkIjoiYjQ1NzEzZmUtOGU1MS00Y2E5LWFlNjItMzAxMTc5OTM5ZjYwIiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDAyNkQ0NENEQjkiLCJyaCI6IjAuQVgwQWp4dVZWTEh6QkV1YVc3QVFFcXRvSVFNQUFBQUFBQUFBd0FBQUFBQUFBQUNjQUdvLiIsInNjcCI6Im9wZW5pZCBwcm9maWxlIFVzZXIuUmVhZCBlbWFpbCIsInN1YiI6InNFZU9SeU8zV09EdHVjX18xQ01JakhPR3VsUjVRNEZiaUM4UnNmai1pUGsiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiTkEiLCJ0aWQiOiI1NDk1MWI4Zi1mM2IxLTRiMDQtOWE1Yi1iMDEwMTJhYjY4MjEiLCJ1bmlxdWVfbmFtZSI6ImFyY2hhbmFAcGxhbmNrdG9uZGF0YS5jb20iLCJ1dGkiOiJwVElqekVtUkNrS2ZrSDl6VEJDN0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyIxM2JkMWM3Mi02ZjRhLTRkY2YtOTg1Zi0xOGQzYjgwZjIwOGEiXSwieG1zX3N0Ijp7InN1YiI6IldzMkgtak45bVlWckRxR1JQOUpUY1UxTWlpQTZLS1FYeTBSUTNJVnp5VjgifSwieG1zX3RjZHQiOjE2NjY4ODYyNzJ9.IGEdTZZ2VtOqHNbxFTl-k--tUTf_7sCNpl5M05x5Ttbg8urhKnyQhJ3BbMGwhWVBLaY7r1OyPv7HVWYliXSAuipgPG-QUn0T7QZeVm02j0Dt1URbjlbqn19kkuZjk65Thkg6fQkf1wPSVKg9S_5O3w1UB_7_dF8M1UZEHF8EhQSHZuNNMd0xBOEnoTcq28aDcVGZrExGw_SE9MRgcBrxCJrM_y_i6pDc_qR_owxd5s2EDQkpcdTlVP0C5TVsayDDI0r6ZeFmUWs7MWVnALU31DJxJ6FfcDIGmpCrJLEln3AWhou39yc5tkn79vAxYoNAsKmb9xkNXH5DYchDw8vZAQ',
        // // 'XApiKey':  '',
        // // 'creationTime':  new Date().toString()
        // "Cookie":'ext_name=ojplmecpdpgccookcobabopnaifgidhf; AppServiceAuthSession=KlMCHIhWQR5gt03Jw6vC5UicLZYUk12pc1lSU0pw+/FZIgvbMSu8QfRJbQyc0+mxzxiQOahMhzAh3TdHHlIQwwifTxOsJ7BPNAmNY/CmSueCbpw5dfNJ4sbbYuQh8N5BnzkvJrVKCXFdHKL28TD7z+r0ULORFT6XZyfRC/rF4GQkIw0Fy/GZ98jfZEwSHi8ZMRqDiOjuZzQoNQOJZOonaSNhdqEKXOmeCLVn/R3VR1KsGNtpsWgW43mDLVjhXHo0ougzTc12mWSWB6MuYSwB/xOzt/4KoSmJCNgGi8CgQuPnHTxIpU9XQ03D3vapXTvQYZftjdahopOHAmvpMTjG58C6OX+EZR4mHxyWSRT8DZvMM6Qo4oW9k2KQctJCk6l4vM4THt6Ln3+/KygkPKdDiw116hjMojsyQx4mgz7gjyxmQlAVWAl0WLGb4VXFc0g/PIe9Wpj05YszOyVPIxdkNLqPF60H2/TvwgZTvGBEPesUrW8BBE331YJHgDUNZcOVe0dlj0B6FciwFOykCN6b74PNnXgEqvmJl7bdv68LdkrlPOed/I28hpqnDLaFm6i3JRemOku+s6LXZ+BADR/oxOSwecpaR/wAsfcI3UisD4L6r93zrDdMdR/j+NAXv6wNyb5Ia7tK7tr5ZDt/hCKZQVwl5SK5KMq24xXldxg311zYmf2pQzOaq2NYTOFoOD7fN4ajFWPkQ5P60hlJysQPnQflwyN6MywbsPJLKf2QtOEliyXoIiTLQyueMZCrcbspEv+h0URSzXvuLAJPBrt+Z1rnny1S+VAo9FS0dA2oK/9eqg/A40x8SsYJV3Wlp0lEBfB0+4lyl4eJXK6AugsCaJNtjJFw+Tef+WcMEbyz/rWajGcZUWoXAnLhvmPpeY80U02KcnI8FIkEUGyUARWgy5Pdrqj7lhI5QlDwgPJKl1CmOTQOhXcR3RF7ZPtcXZHCMW4N8EJu6x0xcV78O+44txhxsAJUaJJJz6RZM9TRaYmDCqCKb5gyAsswb624Bp3bC78dkCVKXJiuXMhMPruc0ymrt+AgvOKF9E6kwzpnRtLP+gRN9safX24buGZJGIAJ' 
        "Accept":"*/*",

        "Accept-Language":"en-US,en;q=0.9",
        "Content-Type":"application/json",

        
     })}

    data={
      "history": [
          {
              "user": "\"what is the guidance for estimating emissions from industrial processes?"
          }
      ],
      "approach": "rrr",
      "overrides": {
          "retrieval_mode": "hybrid",
          "semantic_ranker": true,
          "semantic_captions": false,
          "top": 3,
          "suggest_followup_questions": false
      }
  }
    const url = 'https://3c0f466f-706a-4d8b-9353-69b426399366.mock.pstmn.io/test';   
    return new Promise((resolve, reject) => {
      this._http.post(url,data,header).subscribe({
        next: (response: any) => { 
          console.log("Msg", response);       
          resolve(response);
        },
        error: (error) => {
          console.log("Error",error);
          
          reject(error.message);
        }
      })
    });
  }
}
