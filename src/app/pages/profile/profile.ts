import { Component, OnInit, signal } from '@angular/core';
import { Product } from '../../models/product';
import { ProductCard } from "../../components/product-card/product-card";
import { UserService } from '../../services/user-service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/auth/user';
import { EditProfileForm } from '../../components/edit-profile-form/edit-profile-form';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth-service';
import Swal from 'sweetalert2';
import { ImageFallbackDirective } from "../../directives/image-fallback";

@Component({
  selector: 'app-profile',
  imports: [ProductCard, EditProfileForm, ImageFallbackDirective],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit{

  id?: number
  user!: User;
  wishList: Product[] = [];
  displayCount = 4;

  constructor(
    private uService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private aService: AuthService,
  ) {}

  ngOnInit() {
    this.id = this.aService.user()?.id
    this.uService.get(this.id!).subscribe({
      next: u => {
        this.user = u
        console.log(u)
      },
      error: (e) =>{
        console.log(e)
        this.router.navigate(["/auth/login"])
      }
    })
  }

  editarPerfil() {
    const dialogRef = this.dialog.open(EditProfileForm, {
      width: '80vw',
      data: this.user,
      disableClose: true,
      panelClass: 'profile-dialog-panel'
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.uService.patch(result).subscribe({
          next: () => {
            this.user = result
            Swal.fire("Perfil actualizado con éxito.")
        
          },
          error: (e) => console.error('Error al actualizar el perfil', e)
        })
      }
    })
  }

  editarConfiguracion() {
    this.router.navigate([""])  //TODO
  }

  verCompras() {
    this.router.navigate([""])  //TODO
  }

  ayuda() {
    this.router.navigate([""])  //TODO
  }

  verMas() {
    this.router.navigate([""]) //TODO
  }
}
