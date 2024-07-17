import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { SubmitService } from '../../../services/submit.service';
import { UserInfo } from '../../../interfaces/user-info';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatDividerModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent {
  playerList: UserInfo[] = [];
  constructor(private submitService: SubmitService) {
    let token = localStorage.getItem('token');
    if (token !== null) {
      this.submitService.getLeaderboard(token).subscribe((data) => {
        console.log(data)
        this.playerList = data;
      });
    }
  }


}
