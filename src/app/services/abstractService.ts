import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AbstractWS {
  constructor(private http: HttpClient) { }

  private getHeaders(token: string): Promise<HttpHeaders> {
    return new Promise(resolve => {
      let headers = new HttpHeaders();
      if (token) {
        headers = new HttpHeaders()
          .set('Accept', 'application/json')
          .set('Authorization', 'Token ' + token);
      } else {
        headers = new HttpHeaders().set('Accept', 'application/json');
      }
      resolve(headers);
    });
  }

  protected makeGetRequest(
    path: string,
    paramsRequest: any,
    token?: string
  ): Promise<any> {
    if (!paramsRequest) {
      paramsRequest = {};
    }
    return this.getHeaders(token).then(headers => {
      return new Promise((resolve, reject) => {
        this.http
          .get(path, { headers: headers, params: paramsRequest })
          .toPromise()
          .then(response => {
            resolve(response);
          })
          .catch(err => {
            if (err.status === 200) {
              resolve(null);
            } else {
              console.log(err);
              reject(err);
            }
          });
      });
    });
  }

  protected makePostRequestWithoutHeaders(
    path: string,
    data: any
  ): Promise<any> {
    let headers = new HttpHeaders().set('Accept', 'application/json');
    return this.http
      .post(path, data, { headers: headers })
      .toPromise()
      .then((response: HttpResponse<any>) => {
        return Promise.resolve(response);
      })
      .catch(function (error) {
        return Promise.reject(null);
      });
  }

  protected makePostRequest(
    path: string,
    data: any,
    token?: string
  ): Promise<any> {
    return this.getHeaders(token).then(headers => {
      return this.http
        .post(path, data, { headers: headers })
        .toPromise()
        .then((response: HttpResponse<any>) => {
          return Promise.resolve(response);
        })
        .catch(function (error) {
          return Promise.reject(null);
        });
    });
  }
}
