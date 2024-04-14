import { EventEmitter, Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private gameState: ReplaySubject<GameState> = new ReplaySubject<GameState>()

  public getState() {
    return this.gameState.asObservable();
  }

  public setState(newState: GameState) {
    this.gameState.next(newState);
  }

  constructor() { 
    this.gameState.next(GameState.intro)
  }
}

export enum GameState {
  intro = 'intro',
  game = 'game',
  win = 'win',
  lose = 'lose'
}