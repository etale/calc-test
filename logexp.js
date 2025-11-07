// グラフの描画と操作に関する変数
const INITIAL_SCALE_FACTOR = 50; 
let scaleFactor = INITIAL_SCALE_FACTOR; // ズームで値が変わるため let
let offsetX;                            // 原点X座標
let offsetY;                            // 原点Y座標

// ズーム感度
const ZOOM_SENSITIVITY = 0.01;
let lastTouchY = 0; 

// 💡 ダブルタップ検出用変数
const DOUBLE_TAP_THRESHOLD = 300; // 300ミリ秒以内をダブルタップと判定
let lastTapTime = 0;             // 前回のタップ時間を記録


// p5.jsの初期設定
function setup() {
    // キャンバスをウィンドウサイズに合わせる
    createCanvas(windowWidth, windowHeight);
    // 原点を中央に設定
    offsetX = width / 2;
    offsetY = height / 2;
}

// ウィンドウサイズが変更されたときにキャンバスもリサイズし、原点を再設定
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    offsetX = width / 2;
    offsetY = height / 2;
}


// p5.jsの描画ループ
function draw() {
    const BACKGROUND_COLOR = 255; 
    background(BACKGROUND_COLOR); 

    push(); // 現在の設定を保存
 
    // 座標系の移動 (原点を中央に)
    translate(offsetX, offsetY);
 
    drawGrid();
    drawAxes();
    drawFunctions();

    pop(); // 設定を元に戻す
}

// --- グラフ描画のヘルパー関数 ---

// グリッド（マス目）の描画
function drawGrid() {
    const GRID_COLOR = 240; 
    const GRID_WEIGHT = 1; 

    stroke(GRID_COLOR); 
    strokeWeight(GRID_WEIGHT);
 
    // 垂直線 (X=0から左右に描画) - 画面全体をカバー
    for (let x = 1; x * scaleFactor < width - offsetX; x++) { 
        line(x * scaleFactor, -offsetY, x * scaleFactor, height - offsetY);
    }
    for (let x = -1; x * scaleFactor > -offsetX; x--) { 
        line(x * scaleFactor, -offsetY, x * scaleFactor, height - offsetY);
    }

    // 水平線 (Y=0から上下に描画) - 画面全体をカバー
    for (let y = 1; y * scaleFactor < height - offsetY; y++) { 
        line(-offsetX, y * scaleFactor, width - offsetX, y * scaleFactor);
    }
    for (let y = -1; y * scaleFactor > -offsetY; y--) { 
        line(-offsetX, y * scaleFactor, width - offsetX, y * scaleFactor);
    }
}


// 軸（X軸とY軸）の描画
function drawAxes() {
    const AXIS_COLOR = 0; 
    const AXIS_WEIGHT = 2; 

    stroke(AXIS_COLOR); 
    strokeWeight(AXIS_WEIGHT);
 
    // X軸 - 画面全体に伸ばす
    line(-offsetX, 0, width - offsetX, 0); 
    // Y軸 - 画面全体に伸ばす
    line(0, -offsetY, 0, height - offsetY); 
}

// 関数の描画
function drawFunctions() {
    const step = 0.5; 
    const LINE_WEIGHT = 3; 
    
    // 画面の上下端のピクセル座標（クランプ用）
    const CLAMP_TOP    = -offsetY * 2;       
    const CLAMP_BOTTOM = height - offsetY + height/2; 
    
    // X軸方向の描画範囲を左右に広げる
    const PX_START = -width / 2;
    const PX_END = width + width / 2;
    
    // Y軸に近いと見なすX軸上のピクセル距離
    const NEAR_Y_AXIS_PIXELS = 1;

    // --- 指数関数: y = exp(x) (赤) ---
    const EXP_COLOR = [255, 0, 0];
    stroke(EXP_COLOR[0], EXP_COLOR[1], EXP_COLOR[2]); 
    strokeWeight(LINE_WEIGHT);
    noFill();
    beginShape();
    
    for (let px = PX_START; px <= PX_END; px += step) {
        const x = (px - offsetX) / scaleFactor; 
        const y = Math.exp(x);
        let py = -y * scaleFactor; 
        
        if (py < CLAMP_TOP) {
            py = CLAMP_TOP; 
        } else if (py > CLAMP_BOTTOM) {
            py = CLAMP_BOTTOM;
        }
        
        vertex(px - offsetX, py); 
    }
    endShape();
 
    // --- 対数関数: y = log(x) (青) ---
    const LOG_COLOR = [0, 0, 255]; 
    stroke(LOG_COLOR[0], LOG_COLOR[1], LOG_COLOR[2]); 
    strokeWeight(LINE_WEIGHT);
    noFill();
    
    beginShape();
    
    for (let px = PX_START; px <= PX_END; px += step) {
        const x_local_px = px - offsetX; // Y軸からのピクセル距離 (X=0が-offsetX)
        const x = x_local_px / scaleFactor;
        
        if (x > 0) { 
            let py;

            // Y軸に極めて近い（1ピクセル以内）場合、Y座標を画面下端に強制固定
            if (x_local_px <= NEAR_Y_AXIS_PIXELS) {
                py = CLAMP_BOTTOM; 
            } else {
                // それ以外は通常の対数計算
                const y = Math.log(x);
                py = -y * scaleFactor;
            }

            // クランプ処理
            if (py > CLAMP_BOTTOM) {
                py = CLAMP_BOTTOM;
            } else if (py < CLAMP_TOP) {
                py = CLAMP_TOP;
            }
            
            vertex(px - offsetX, py);
        } else if (x_local_px < 0) {
            // xが負の領域（定義域外）の場合、線を途切れさせる
            endShape();
            noFill();
            beginShape(); // 次の描画のためにbeginShapeをすぐに再開
        }
    }
    endShape(); 
}

// --- ユーザー操作（ズーム） ---

// マウスホイールでのズーム操作 (デスクトップ/トラックパッド用)
function mouseWheel(event) {
    // ズーム率 (1.1倍または1/1.1倍)
    const zoom = event.delta > 0 ? 1 / 1.1 : 1.1;

    // スケールを更新
    scaleFactor *= zoom;

    // スクロールバーの移動をキャンセル
    return false; 
}

// 💡 修正済み：タッチ開始時 (モバイル用)
function touchStarted() {
    // 1本指タッチの場合のみ処理
    if (touches.length === 1) {
        const currentTime = millis(); // p5.jsの経過時間（ミリ秒）
        const timeDiff = currentTime - lastTapTime;

        if (timeDiff > 0 && timeDiff < DOUBLE_TAP_THRESHOLD) {
            // 💡 ダブルタップと判定し、リセット実行
            scaleFactor = INITIAL_SCALE_FACTOR; 
            lastTapTime = 0; // 連続したトリガーを防ぐ
            return false;
        } else {
            // シングルタップまたは長すぎるタップとして、ズームの準備
            lastTapTime = currentTime;
            lastTouchY = touches[0].y;
        }
    }
    
    // ブラウザのデフォルトの動作（スクロールなど）を抑制
    return false;
}

// タッチ移動時 (モバイル用)
function touchMoved() {
    // 1本指ドラッグの場合のみ処理
    if (touches.length === 1) {
        const currentTouchY = touches[0].y;
        const deltaY = currentTouchY - lastTouchY; // 下方向へのスワイプで正の値になる

        // ズームファクターを計算
        const zoomFactor = 1 + deltaY * ZOOM_SENSITIVITY;
        
        // スケールを更新
        scaleFactor *= zoomFactor;

        // スケールに下限を設定
        scaleFactor = max(scaleFactor, 10);

        // 次の移動のために現在のY座標を記録
        lastTouchY = currentTouchY;

        // ブラウザのデフォルトの動作（スクロールなど）を抑制
        return false;
    }
}


// キー操作（スペースキーでリセット）
function keyPressed() {
    const RESET_KEY = ' ';
    if (key === RESET_KEY) {
        scaleFactor = INITIAL_SCALE_FACTOR;
    }
}
