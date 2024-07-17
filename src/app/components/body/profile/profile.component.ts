import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserInfo } from '../../../interfaces/user-info';
import { jwtDecode } from 'jwt-decode';
import { SubmitService } from '../../../services/submit.service';
import { fromEvent } from 'rxjs';
import { map, debounceTime, tap, merge, delay, mapTo, share, repeat, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userInfo: UserInfo | undefined;
  fb: FormBuilder = new FormBuilder();
  height!: number;
  width!: number;
  backgroundImage!: string;
  mouseX = 0;
  mouseY = 0;
  get mousePX() {
    return this.mouseX / this.width;
  }
  get mousePY() {
    return this.mouseY / this.height;
  }

  @Input() cardBgImage: string = '';
  @ViewChild('card', { static: true }) card!: ElementRef;
  cardStyling = this.cardStyle();

  cardStyle() {
    return this.transformStyle();
  }

  cardBgTransform() {
    return this.transformStyle();
  }

  private transformStyle() {
    const tX = this.mousePX * 30;
    const tY = this.mousePY * -30;
    return { transform: `rotateY(${tX}deg) rotateX(${tY}deg)` };
  }
  get nativeElement(): HTMLElement {
    return this.card.nativeElement;
  }
  ngOnInit() {

    let token = localStorage.getItem('token');
    if (token !== null) {
      this.submitService.getUserInfo(token).subscribe((data) => {
        this.userInfo = data;
        if (this.userInfo !== undefined) {
          this.userForm.setValue(this.userInfo);
        }
      });
    }

    const mouseMove$ = fromEvent<MouseEvent>(
      this.card.nativeElement,
      'mousemove'
    );
    const mouseLeave$ = fromEvent<MouseEvent>(
      this.card.nativeElement,
      'mouseleave'
    ).pipe(delay(100), mapTo({ mouseX: 0, mouseY: 0 }), share());
    const mouseEnter$ = fromEvent<MouseEvent>(
      this.card.nativeElement,
      'mouseenter'
    ).pipe(takeUntil(mouseLeave$));

    mouseEnter$
      .pipe(
        switchMap(() => mouseMove$),
        map((e) => ({
          mouseX: e.pageX - this.nativeElement.offsetLeft - this.width / 2,
          mouseY: e.pageY - this.nativeElement.offsetTop - this.height / 2,
        })),
        merge(mouseLeave$),
        repeat()
      )
      .subscribe((e) => {
        this.mouseX = e.mouseX;
        this.mouseY = e.mouseY;
      });
  }
  ngAfterViewInit() {
    this.width = this.card.nativeElement.offsetWidth;
    this.height = this.card.nativeElement.offsetHeight;
  }

  userForm = this.fb.nonNullable.group({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    pseudo: new FormControl(''),
    highscore: new FormControl(''),
    gamesplayed: new FormControl('')
  });

  constructor(private submitService: SubmitService) {

  }

  get username() { return this.userForm.get('username')?.value; }
  get email() { return this.userForm.get('email')?.value; }
  get password() { return this.userForm.get('password')?.value; }
  get pseudo() { return this.userForm.get('pseudo')?.value; }
  get highscore() { return this.userForm.get('highscore')?.value; }
  get gamesplayed() { return this.userForm.get('gamesplayed')?.value; }

}
