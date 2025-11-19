// 全局音乐播放控制脚本
class GlobalMusicPlayer {
    constructor() {
        this.audio = null;
        this.vinyl = null;
        this.isPlaying = false;
        this.init();
    }

    init() {
        // 创建音频元素
        this.audio = new Audio();
        this.audio.loop = true;
        this.audio.src = '222.mp3';
        
        // 创建黑胶唱片控件
        this.createPlayerUI();
        
        // 检查是否应该播放音乐
        if (this.shouldContinuePlaying()) {
            this.play();
        }
        
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.shouldContinuePlaying()) {
                // 页面重新可见时，如果应该继续播放则播放
                if (this.isPlaying) {
                    this.play();
                }
            }
        });
        
        // 页面卸载前更新播放时间
        window.addEventListener('beforeunload', () => {
            if (this.isPlaying) {
                this.updateLastPlayedTime();
            }
        });
    }
    
    createPlayerUI() {
        // 创建音乐播放器容器
        const playerContainer = document.createElement('div');
        playerContainer.className = 'music-player';
        playerContainer.innerHTML = `
            <div class="vinyl" id="global-vinyl">
                <div class="vinyl-record">
                    <div class="vinyl-hole"></div>
                    <div class="vinyl-label">
                        <i class="fas fa-music"></i>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(playerContainer);
        
        // 添加样式
        this.addStyles();
        
        // 绑定事件
        this.vinyl = document.getElementById('global-vinyl');
        this.vinyl.addEventListener('click', () => {
            this.togglePlay();
        });
    }
    
    addStyles() {
        // 检查是否已经添加过样式
        if (document.getElementById('global-music-player-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'global-music-player-styles';
        style.textContent = `
            /* 音乐播放器样式 */
            .music-player {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 10000;
            }
            
            .vinyl {
                width: 80px;
                height: 80px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .vinyl:hover {
                transform: scale(1.05);
            }
            
            .vinyl-record {
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(circle, #2c3e50 0%, #1a1a1a 70%, #0d0d0d 100%),
                    repeating-radial-gradient(
                        circle at center,
                        #34495e 0px,
                        #34495e 1px,
                        transparent 1px,
                        transparent 10px
                );
                border-radius: 50%;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 
                    0 10px 30px rgba(0, 0, 0, 0.5),
                    inset 0 0 20px rgba(0, 0, 0, 0.8);
                animation: rotate 20s linear infinite;
                animation-play-state: running;
            }
            
            .vinyl-hole {
                width: 20px;
                height: 20px;
                background: #0d0d0d;
                border-radius: 50%;
                position: absolute;
                z-index: 2;
                box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.8);
            }
            
            .vinyl-label {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #3498db, #2980b9);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 16px;
                box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
                z-index: 1;
            }
            
            .vinyl-label i {
                animation: pulse 1.5s infinite;
            }
            
            @keyframes rotate {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
            
            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.2);
                }
                100% {
                    transform: scale(1);
                }
            }
            
            .paused .vinyl-record {
                animation-play-state: paused;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    shouldContinuePlaying() {
        const lastPlayed = localStorage.getItem('musicLastPlayed');
        if (!lastPlayed) return false;
        
        const lastTime = parseInt(lastPlayed);
        const now = Date.now();
        // 如果30分钟内访问过其他页面，则继续播放
        return (now - lastTime) < 30 * 60 * 1000;
    }
    
    updateLastPlayedTime() {
        localStorage.setItem('musicLastPlayed', Date.now().toString());
    }
    
    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updateLastPlayedTime();
            if (this.vinyl) {
                this.vinyl.classList.remove('paused');
            }
        }).catch(error => {
            console.log('播放失败:', error);
        });
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        if (this.vinyl) {
            this.vinyl.classList.add('paused');
        }
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
}

// 初始化全局音乐播放器
document.addEventListener('DOMContentLoaded', () => {
    window.globalMusicPlayer = new GlobalMusicPlayer();
});