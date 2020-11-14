import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente'
import {ClienteService} from './cliente.service'
import {Router, ActivatedRoute} from '@angular/router'
import Swal from 'sweetalert2'
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente()

  public titulo:string = "Crear cliente"

  public errores: string[];

  constructor(private clienteService: ClienteService,  private router: Router,  private ActivatedRoute: ActivatedRoute) { }
  
  public ngOnInit() {
    this.cargarCliente()
  }

  public cargarCliente(): void{
    this.ActivatedRoute.params.subscribe(params =>{
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente)
      }
    })
  }
  
  // Se susbcribe un objeto tipo cliente, este muestra en el mensaje.
  public create(): void{
    this.clienteService.create(this.cliente).subscribe(cliente => {
      //this.router.navigate([''])
      Swal.fire('Nuevo Cliente',`El cliente ${cliente.nombre}: ha sido creado con éxito!.`,'success')
      this.cliente= new Cliente();
      window.location.href=environment.redirectSite;
    },
    err => {
      this.errores =  err.error.errors as string[];
      console.error('Codigo del error desde el backend: ' + err.status);
      console.error(err.error.errors);
    }
    );
  }
//Se subscribe un objeto cualquiera "json" esto se muestra en el mensaje
update():void{
  this.clienteService.update(this.cliente)
    .subscribe( json => {
    this.router.navigate(['/clientes'])
    Swal.fire('Cliente Actualizado',`${json.mensaje}: ${json.cliente.nombre}`,'success')
  },
  err => {
    this.errores =  err.error.errors as string[];
    console.error('Codigo del error desde el backend: ' + err.status);
    console.error(err.error.errors);
  }
)
}
}
