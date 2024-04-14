import { Component } from '@angular/core';
import { GameState, StateService } from '../state.service';

@Component({
  selector: 'app-win',
  templateUrl: './win.component.html',
  styleUrls: ['./win.component.scss']
})
export class WinComponent {
  restart() {
    this.state.setState(GameState.intro);
  }

  constructor(private state: StateService) { }
}
