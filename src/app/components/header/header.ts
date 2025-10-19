import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchBar } from '../search-bar/search-bar';
import { AvatarComponent, ButtonDirective, DropdownComponent, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective } from '@coreui/angular';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    SearchBar,
    AvatarComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {}
