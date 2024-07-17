import { Component } from '@angular/core';
import { SubmitService } from '../../../services/submit.service';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  scoreFormGroup = this.fb.nonNullable.group({
    score: new FormControl(0)
  });
  token: string | null = localStorage.getItem('token');

  constructor(private submitService: SubmitService, private fb: FormBuilder) {
  }

  get score() {
    let value = this.scoreFormGroup.get('score')?.value;
    if (value === undefined || value === null) {
      return 0;
    }
    return value;
  }




  addScore() {
    this.scoreFormGroup.get('score')?.setValue(this.score + 1);
  }

  submitScore(value: number) {
    if (this.token !== null) {
      this.submitService.addScore(this.token, value)
    }
  }

  ngOnDestroy() {
    this.submitScore(this.score);
  }

}
