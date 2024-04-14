import { Component } from '@angular/core';
import { GameState, StateService } from '../state.service';

@Component({
  selector: 'app-loss',
  templateUrl: './loss.component.html',
  styleUrls: ['./loss.component.scss']
})
export class LossComponent {
  restart() {
    this.state.setState(GameState.intro);
  }

  constructor(private state: StateService) { }
}
