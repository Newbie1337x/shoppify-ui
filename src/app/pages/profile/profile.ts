import { Component, OnInit, signal } from '@angular/core';
import { Product } from '../../models/product';
import { ProductCard } from "../../components/product-card/product-card";
import { UserService } from '../../services/user-service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/auth/user';
import { EditProfileForm } from '../../components/edit-profile-form/edit-profile-form';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  imports: [ProductCard],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit{

  id!: number
  user!: User;
  userMail!: string  //TODO
  wishList: Product[] = [];
  displayCount = 4;

  constructor(
    private uService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params["id"]
    this.uService.get(this.id).subscribe({
      next: u => {
        this.user = u
        console.log(u)
      },
      error: (e) =>{
        console.log(e)
        alert("Error al obtener tu perfil :c")
        this.router.navigate(["/"])
      }
    })
    
  }

  editarPerfil() {
    const dialogRef = this.dialog.open(EditProfileForm, {
      width: '450px',
      data: this.user,
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.uService.patch(result).subscribe({
          next: () => {
            this.user = result
            alert('Perfil actualizado con éxito ✅')
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
