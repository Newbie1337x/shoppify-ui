import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchBar } from '../search-bar/search-bar';
import { UserAvatar } from '../user-avatar/user-avatar';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    SearchBar,
    UserAvatar
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {}
