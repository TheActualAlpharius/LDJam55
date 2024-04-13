import { Component, HostBinding, OnInit } from '@angular/core';
import { from, interval, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'LDJam55';

  groundLevel = 128 - 32;

  spawnPoint = 64;

  MAX_HEALTH = 1000;
  MAX_MANA = 100;
  enemyHealth = this.MAX_HEALTH;
  playerHealth = this.MAX_HEALTH;
  playerMana = this.MAX_MANA;

  @HostBinding('style.--playerHealth')
  playerHealthPercentage = '100%';

  @HostBinding('style.--enemyHealth')
  enemyHealthPercentage = '100%';

  @HostBinding('style.--playerMana')
  playerManaPercentage = '100%';

  yourGuys: GuyOptions[] = [
  ]

  public turnToPixels(int: number) {
    return `${int}px`
  }

  spawnGuy() {
    console.log('spawning dude')
    this.yourGuys.push({
      x: this.spawnPoint,
      damage: 5,
      speed: 2,
      id: uuidv4()
    })
  }

  gameLoop = interval(30);

  ngOnInit() {
    this.gameLoop.pipe(
      map(_ => {
        this.yourGuys = this.yourGuys
        .map(guy => {
          if(this.collisionCheck(guy.id, 'EnemyCastle')) {
            this.damageEnemy(guy.damage);
            return false;
          }
          guy.x += guy.speed;
          return guy;
        })
        .filter(guy => guy) as GuyOptions[]
      })
    ).subscribe()
  }
  
  damageEnemy(damage: number) {
    this.enemyHealth -= damage;
    this.enemyHealthPercentage = `${100*this.enemyHealth/this.MAX_HEALTH}%`;
  }

  //only checks horizontal collision
  private collisionCheck(idA: string, idB: string) {
    const elementA = document.getElementById(idA);
    const elementB = document.getElementById(idB);
    if(!elementA) {
      console.log(`cant find ${idA}`);
      return false;
    }
    if(!elementB) {
      console.log(`cant find ${idB}`);
      return false;
    }
    const rectA = elementA!.getBoundingClientRect();
    const rectB = elementB!.getBoundingClientRect();
    return rectA.right > rectB.left && rectA.left < rectB.right;
  }

}


interface GuyOptions {
  x: number,
  damage: number,
  speed: number,
  id: string
}
