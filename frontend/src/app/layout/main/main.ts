import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './main.html',
  styleUrls: ['./main.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Main {}
