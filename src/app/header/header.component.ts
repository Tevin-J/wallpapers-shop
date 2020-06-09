import { Component, OnInit } from '@angular/core';
import {AppService} from '../services/app-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public appService: AppService) { }

  ngOnInit(): void {
  }

}
