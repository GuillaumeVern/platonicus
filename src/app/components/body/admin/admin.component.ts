import { Component, OnInit } from '@angular/core';
import { SubmitService } from '../../../services/submit.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit{
  users: any[] = []
  token: string | null = localStorage.getItem('token');

  constructor(private submitService: SubmitService) {
    
  }

  ngOnInit() {
    if (this.token !== null) {
      this.submitService.getUsers(this.token).subscribe((data) => {
        this.users = data as any[];
        console.log(this.users)
      });
    }
  }


}
