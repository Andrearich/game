class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        // 游戏状态
        this.score = 0;
        this.health = 100;
        this.gameOver = false;
        
        // 玩家属性
        this.player = {
            x: 50,
            y: this.canvas.height - 50,
            width: 30,
            height: 50,
            velocityY: 0,
            isJumping: false,
            color: '#FF5722'
        };
        
        // 游戏元素
        this.obstacles = [];
        this.enemies = [];
        this.projectiles = [];
        
        // 游戏配置
        this.gravity = 0.8;
        this.jumpForce = -15;
        this.obstacleSpeed = 5;
        this.enemySpeed = 3;
        this.projectileSpeed = 7;
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 开始游戏循环
        this.gameLoop();
        
        // 定时生成障碍物和敌人
        setInterval(() => this.generateObstacle(), 2000);
        setInterval(() => this.generateEnemy(), 3000);
    }
    
    bindEvents() {
        // 跳跃控制
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.player.isJumping) {
                this.jump();
            }
        });
        
        // 攻击控制
        document.addEventListener('click', (e) => {
            this.shoot();
        });
    }
    
    jump() {
        if (!this.player.isJumping) {
            this.player.velocityY = this.jumpForce;
            this.player.isJumping = true;
        }
    }
    
    shoot() {
        this.projectiles.push({
            x: this.player.x + this.player.width,
            y: this.player.y + this.player.height / 2,
            width: 20,
            height: 5,
            color: '#FFD700'
        });
    }
    
    generateObstacle() {
        this.obstacles.push({
            x: this.canvas.width,
            y: this.canvas.height - 30,
            width: 30,
            height: 30,
            color: '#673AB7'
        });
    }
    
    generateEnemy() {
        this.enemies.push({
            x: this.canvas.width,
            y: Math.random() * (this.canvas.height - 100),
            width: 30,
            height: 30,
            color: '#F44336'
        });
    }
    
    update() {
        if (this.gameOver) return;
        
        // 更新玩家位置
        this.player.velocityY += this.gravity;
        this.player.y += this.player.velocityY;
        
        // 地面碰撞检测
        if (this.player.y > this.canvas.height - this.player.height) {
            this.player.y = this.canvas.height - this.player.height;
            this.player.velocityY = 0;
            this.player.isJumping = false;
        }
        
        // 更新障碍物位置
        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.x -= this.obstacleSpeed;
            
            // 碰撞检测
            if (this.checkCollision(this.player, obstacle)) {
                this.health -= 10;
                return false;
            }
            
            return obstacle.x > -obstacle.width;
        });
        
        // 更新敌人位置
        this.enemies = this.enemies.filter(enemy => {
            enemy.x -= this.enemySpeed;
            
            // 碰撞检测
            if (this.checkCollision(this.player, enemy)) {
                this.health -= 20;
                return false;
            }
            
            return enemy.x > -enemy.width;
        });
        
        // 更新子弹位置
        this.projectiles = this.projectiles.filter(projectile => {
            projectile.x += this.projectileSpeed;
            
            // 检查子弹是否击中敌人
            this.enemies = this.enemies.filter(enemy => {
                if (this.checkCollision(projectile, enemy)) {
                    this.score += 10;
                    return false;
                }
                return true;
            });
            
            return projectile.x < this.canvas.width;
        });
        
        // 更新分数和生命值显示
        document.getElementById('score').textContent = this.score;
        document.getElementById('health').textContent = this.health;
        
        // 检查游戏是否结束
        if (this.health <= 0) {
            this.gameOver = true;
            alert('游戏结束！最终得分：' + this.score);
        }
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制玩家
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // 绘制障碍物
        this.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = obstacle.color;
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
        
        // 绘制敌人
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
        
        // 绘制子弹
        this.projectiles.forEach(projectile => {
            this.ctx.fillStyle = projectile.color;
            this.ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
        });
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 当页面加载完成后启动游戏
window.addEventListener('load', () => {
    new Game();
}); 