import { Component } from '@angular/core';
import { GameState, StateService } from '../state.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent {
  start() {
    this.gameState.setState(GameState.game)
  } 

  constructor(private gameState: StateService) {}
}
