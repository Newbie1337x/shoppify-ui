import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/auth/user';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-avatar.html',
  styleUrl: './user-avatar.css'
})
export class UserAvatar {
  @Input() user: User | null = null;
  @Input() avatarSrc: string = 'image/user.png';

  showMenu = false;

  constructor(private router: Router) {}

  toggleMenu() {
    if (!this.user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.showMenu = !this.showMenu;
  }

  hideMenu() {
    this.showMenu = false;
  }
}

