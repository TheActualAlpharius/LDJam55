import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { IntroComponent } from './intro/intro.component';
import { WinComponent } from './win/win.component';
import { LossComponent } from './loss/loss.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    IntroComponent,
    WinComponent,
    LossComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
