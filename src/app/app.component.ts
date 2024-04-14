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

  public turnToPixels(int: number) {
    return `${int}px`
  }

  yourGuys: GuyOptions[] = [];

  playerHurtBoxes: HurtBox[] = [];

  enemyHurtBoxes: HurtBox[] = [];

  spawnGuy() {
    if(this.playerMana < 10 || this.isPlayerSpawnBlocked()) {
      return;
    }
    this.changeMana(-10);
    this.yourGuys.push({
      x: this.spawnPoint,
      health: 20,
      damage: 5,
      speed: 2,
      id: uuidv4(),
      imgSrc: '/assets/zombie.png',
      attack: (i) => {if(i == 0) this.playerHurtBoxes.push({damage: 2, id: uuidv4(), speed: 0, ttl: 0, x: this.yourGuys[i].x + 32, y: this.groundLevel})}
    })
  }

  spawnSkeleton() {
    if(this.playerMana < 15 || this.isPlayerSpawnBlocked()) {
      return;
    }
    this.changeMana(-15);
    this.yourGuys.push({
      x: this.spawnPoint,
      health: 10,
      damage: 20,
      speed: 3,
      id: uuidv4(),
      imgSrc: '/assets/skeleton.png',
      attack: (i) => {if(i == 0) this.playerHurtBoxes.push({src: '/assets/fire.png', damage: 2, id: uuidv4(), speed: 5, ttl: 10000000, x: this.yourGuys[i].x + 32, y: this.groundLevel})}
    })
  }

  spawnEnemy() {
    this.enemyGuys.push({
      x: 902,
      damage: 5,
      health: 20,
      id: uuidv4(),
      speed: -4,
      imgSrc: '/assets/zombie.png',
      attack: (i) => {if(i == 0) this.enemyHurtBoxes.push({damage: 1, id: uuidv4(), speed: 0, ttl: 0, x: this.enemyGuys[i].x - 32, y: this.groundLevel})}
    })
  }

  gameLoop = interval(30);

  ngOnInit() {
    this.gameLoop.pipe(
      map(count => {
        if((count % 10) == 0) this.changeMana(1);
      }),
      //player attacks
      map(_ => {
        this.playerHurtBoxes = this.playerHurtBoxes
        .map((hurtbox) => {
          this.enemyGuys.map((enemy, i) => {
            if(this.collisionCheck(hurtbox.id, enemy.id)) {
              enemy.health -= hurtbox.damage;
              hurtbox.ttl = 0;
            }
          })
          hurtbox.ttl --;
          if(hurtbox.ttl <= 0) {
            return false;
          }
          hurtbox.x += hurtbox.speed;
          return hurtbox;
        })
        .filter(hurtbox => hurtbox) as HurtBox[];
      }),
      //enemy attack
      map(_ => {
        this.enemyHurtBoxes = this.enemyHurtBoxes
        .map((hurtbox) => {
          this.yourGuys.map((guy, i) => {
            if(this.collisionCheck(hurtbox.id, guy.id)) {
              console.log(`hit ${guy.id}`)
              guy.health -= hurtbox.damage;
              hurtbox.ttl = 0;
            }
          })
          hurtbox.ttl --;
          if(hurtbox.ttl <= 0) {
            return false;
          }
          hurtbox.x += hurtbox.speed;
          return hurtbox;
        })
        .filter(hurtbox => hurtbox) as HurtBox[];
      }),
      //enemy guy tick
      map(_ => {
        this.enemyGuys = this.enemyGuys
        .map((guy, i) => {
          if(this.collisionCheck(guy.id, 'PlayerCastle')) {
            this.damagePlayer(guy.damage);
            return false;
          }
          if(guy.health <= 0) {
            return false;
          }
          if(this.canEnemyMove(i)) {
            guy.x += guy.speed;
          } else {
            guy.attack(i);
          }
          return guy;
        })
        .filter(guy => guy) as GuyOptions[]
      }),
      //your guy tick
      map(_ => {
        this.yourGuys = this.yourGuys
        .map((guy, i) => {
          if(this.collisionCheck(guy.id, 'EnemyCastle')) {
            this.damageEnemy(guy.damage);
            return false;
          }
          if(guy.health <= 0) {
            return false;
          }
          if(this.canPlayerMove(i)) {
            guy.x += guy.speed;
          } else {
            guy.attack(i);
          }
          return guy;
        })
        .filter(guy => guy) as GuyOptions[]
      }),
      map(_ => {
        if(Math.random() < 0.005 && !this.isEnemySpawnBlocked()) {
          this.spawnEnemy();
        }
      }),
    ).subscribe()
  }

  enemyGuys: GuyOptions[] = [];
  
  damageEnemy(damage: number) {
    this.enemyHealth -= damage;
    this.enemyHealthPercentage = `${100*this.enemyHealth/this.MAX_HEALTH}%`;
  }

  damagePlayer(damage: number) {
    this.playerHealth -= damage;
    this.playerHealthPercentage = `${100*this.playerHealth/this.MAX_HEALTH}%`;
  }

  changeMana(change: number) {
    this.playerMana = Math.min(this.playerMana + change, this.MAX_MANA);
    this.playerManaPercentage = `${100*this.playerMana/this.MAX_MANA}%`
  }

  canPlayerMove(i: number) {
    const guy = this.yourGuys[i];
    const checkAgainst = i == 0 ? this.enemyGuys[0] : this.yourGuys[i-1];
    if(!checkAgainst) return true;
    return !this.collisionCheck(guy.id, checkAgainst.id);
  }

  canEnemyMove(i: number) {
    const guy = this.enemyGuys[i];
    const checkAgainst = i == 0 ? this.yourGuys[0] : this.enemyGuys[i-1];
    if(!checkAgainst) return true;
    return !this.collisionCheck(guy.id, checkAgainst.id);
  }

  isEnemySpawnBlocked() {
    return this.enemyGuys.some((guy) => this.collisionCheck(guy.id, 'enemySpawnPoint'))
  }

  isPlayerSpawnBlocked() {
    return this.yourGuys.some((guy) => this.collisionCheck(guy.id, 'playerSpawnPoint'))
  }

  //only checks horizontal collision
  private collisionCheck(idA: string, idB: string) {
    const elementA = document.getElementById(idA);
    const elementB = document.getElementById(idB);
    if(!elementA) {
      console.log(`A cant find ${idA} looking for ${idB}`);
      return false;
    }
    if(!elementB){
      console.log(`B cant find ${idB}`);
      return false;
    }
    const rectA = elementA!.getBoundingClientRect();
    const rectB = elementB!.getBoundingClientRect();
    return rectA.right > rectB.left && rectA.left < rectB.right;
  }

}

interface HurtBox {
  x: number,
  y: number,
  damage: number,
  speed: number,
  ttl: number,
  id: string,
  src?: string
}

interface GuyOptions {
  x: number,
  damage: number,
  health: number,
  speed: number,
  attack: (i: number) => void,
  id: string,
  imgSrc: string
}
