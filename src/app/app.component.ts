import { Component, OnInit } from '@angular/core';
import { StateService, GameState } from './state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'LDJam55';

  intro = 'intro';

  constructor( private state: StateService ) { }
  
  gameState!: Observable<GameState>;

  ngOnInit(): void {
    this.gameState = this.state.getState();
    this.gameState.subscribe(x => console.log(`game state is ${x}`))
  }
  


}

