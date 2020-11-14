import { Injectable } from '@angular/core';
import {formatDate,DatePipe} from '@angular/common';
import {CLIENTES} from './cliente.json';
import {Cliente} from './cliente';
import { of, Observable, throwError } from 'rxjs';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {map,catchError,tap} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Injectable()

export class ClienteService {

  private urlEndPoint:string = 'https://digi-apps-shool.herokuapp.com/api/clientes'
  //private urlEndPoint:string = 'http://localhost:8080/api/clientes'
  private httpHeaders = new HttpHeaders({'Content-type':'application/json'})
  constructor(private http: HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any>{
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      //El Tap sirve para inprimir en el LOG de la consola
    tap((response:any) => {
      response as Cliente[]
      console.log('ClienteService: tap 1');
      (response.content as Cliente[]).forEach(cliente => {
        console.log(cliente.nombre);
      });
    }),
    map( (response:any) => {
        (response.content as Cliente[]).map(cliente => {
          // Convierte los nombres, apellidos y email de la tabla en mayuscula
          cliente.nombre = cliente.nombre.toUpperCase();
          //cliente.apellido = cliente.apellido.toUpperCase();
          //cliente.email = cliente.email.toUpperCase();

          // Esta fución sirve para modificar el formato de la fecha con la función DatePipe
          let datePipe = new DatePipe('es-CO');
          //cliente.createAt = datePipe.transform(cliente.createAt,'dd/MM/yyyy hh:mm:ss');
          // Esta fución sirve para modificar el formato de la fecha con la función formatDate
          //cliente.createAt = formatDate(cliente.createAt,'dd-MM-yyyy hh:mm:ss', 'en-US');
          //Esta función permite manejar la fecha personalizada o con funciones como fulldate propia del lenguaje JavaScrip
          //cliente.createAt = datePipe.transform(cliente.createAt,'EEEE dd, MMMM yyyy');
          return cliente;
        });
        return response;
      }
    ),
    tap(response => {
      console.log('ClienteService: tap 2');
      (response.content as Cliente[]).forEach(cliente => {
        console.log(cliente.nombre);
      }
      )
    })
    );
  }
// En el observable se captura un mensaje tipo cliente.
  create(cliente:Cliente) : Observable<Cliente>{
    return this.http.post(this.urlEndPoint,cliente,{headers:this.httpHeaders}).pipe(
      map( (response:any) => response.cliente as Cliente),
      catchError(e => {
        if(e.status==400){
            return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);

      })
    );
  }

// En el observable se captura un mensaje tipo cliente.
  getCliente(id): Observable<Cliente>{

    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(

      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );

  }
  // En el observable se captura cualquier mensaje que llegue del backend
  update(cliente: Cliente):Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status==400){
            return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje,e.error.error, 'error');
        return throwError(e);

      })
    );
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje,e.error.error, 'error');
        return throwError(e);

      })
    );

  }

}
