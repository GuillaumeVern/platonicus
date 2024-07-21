import { Component, OnInit } from '@angular/core';
import { MainPageComponent } from './components/main-page/main-page.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainPageComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'Platonicus';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.checkCreds();
  }
}
