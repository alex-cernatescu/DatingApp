import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if(error){
          //debugger; 
          switch(error.status)
          {
            case 400: 
              if(error.error.errors){
                const modalStateErrors = [];
                for(const key in error.error.errors){
                  if (error.error.errors[key]){
                    modalStateErrors.push(error.error.errors[key]);
                    
                  }
                }
                throw modalStateErrors.flat();
                //console.log(modalStateErrors);
               // const response = new HttpResponse<object>({
                //debugger; //throw modalStateErrors.flat(); 
                //return new Observable<HttpEvent<any>>();
                //throw error;
              //  });
              //return response;
                //console.log(modalStateErrors);
                //return throwError(modalStateErrors.flat());
               // throw new HttpErrorResponse({
                //  error: 'validation error',
               //   status: 400
               // });
              }
              else {
                this.toastr.error(error.error, error.status);
              }
              break;
            case 401:
              this.toastr.error(error.statusText, error.status);
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {state: {error: error.error}};
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.toastr.error('Something unexpected went wrong');
              console.log(error);
              break;
          }
        }
        return throwError(error);
      })
    )
  }
}
