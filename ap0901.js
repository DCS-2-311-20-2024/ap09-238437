//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G38437-2023　小松翔真
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { GUI } from "ili-gui";

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    axes: true, // 座標軸
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "axes").name("座標軸");

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    50, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.set(0, 125, 0);
  camera.lookAt(0, 0, 0);

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("output").appendChild(renderer.domElement);
  renderer.setClearColor(0x406080);

  // 平面の設定
  const planeGeometry = new THREE.PlaneGeometry(102, 102);
  const planeMaterial = new THREE.MeshBasicMaterial({ color: "green" });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI; // 角度を調整
  plane.position.y = -1;
  scene.add(plane);

  // ボールの作成
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 24, 24),
    new THREE.MeshBasicMaterial({ color: "yellow" })
  );
  ball.position.set(50, 0, 50);
  ball.geometry.computeBoundingSphere();
  scene.add(ball);



  // キーボードイベントを追加
  // 移動処理
  let moveDirection = { x: 0, z: 1 };
  const speed1 = 0.5;
  const limit = 47.5;//範囲
  
  function handleKeyDown(event) {
    switch (event.key) {
      case "ArrowUp":
        moveDirection = { x: 0, z: -1 };
        break;
      case "ArrowDown":
        moveDirection = { x: 0, z: 1 };
        break;
      case "ArrowLeft":
        moveDirection = { x: -1, z: 0 };
        break;
      case "ArrowRight":
        moveDirection = { x: 1, z: 0 };
        break;
    }
  }
  window.addEventListener("keydown", handleKeyDown);

  // アニメーション
  function animate() {
    requestAnimationFrame(animate);

    ball.position.x += moveDirection.x * speed1;
    ball.position.z += moveDirection.z * speed1;

    // 壁に到達したら移動を制限
    ball.position.x = Math.max(-limit, Math.min(limit, ball.position.x));
    ball.position.z = Math.max(-limit, Math.min(limit, ball.position.z));

    renderer.render(scene, camera);
  }
  animate();

  // 枠の作成
  const waku = new THREE.Mesh(
    new THREE.BoxGeometry(106, 2, 2),
    new THREE.MeshBasicMaterial({ color: "black" })
  );
  waku.position.set(0, 0, 52);
  scene.add(waku);

  const waku1 = waku.clone();
  waku1.position.set(0, 0, -52);
  scene.add(waku1);

  const waku2 = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 104),
    new THREE.MeshBasicMaterial({ color: "black" })
  );
  waku2.position.set(52, 0, 0);
  scene.add(waku2);

  const waku3 = waku2.clone();
  waku3.position.set(-52, 0, 0);
  scene.add(waku3);

  //ゴール
  const gos = new THREE.Group();
  {
    const go = new THREE.Mesh(
      new THREE.BoxGeometry(5,2,7),
      new THREE.MeshBasicMaterial({color: "red"})
    );
    go.position.set(46,0,-2);
    go.rotation.y = -0.5 * Math.PI; // 角度を調整
    go.geometry.computeBoundingBox();
    gos.add(go);
  }
  scene.add(gos);
  // ブロックの衝突検出
  function brickCheck2() {
    let hit = false;
    const sphere = ball.geometry.boundingSphere.clone();
    sphere.translate(ball.position);
    gos.children.forEach((gos) => {
      if (!hit ) {
        let box = gos.geometry.boundingBox.clone();
        box.translate(gos.position);
        if (box.intersectsSphere(sphere)) {
          
          moveDirection = { x: 0, z: 0 };
          hit = true;
        }
      }
    });
  }

  // 構造物２の作成（障壁）
  const kabes = new THREE.Group();
  {
    //壁
    const kabe = new THREE.Mesh(
      new THREE.BoxGeometry(6,2,8),
      new THREE.MeshBasicMaterial({color: "black"})
    );

    //migi
    const migi = kabe.clone();
    migi.position.set(36,0,15);
    migi.geometry.computeBoundingBox();
    kabes.add(migi);
    //hidari
    const hidari = kabe.clone();
    hidari.position.set(24,0,15);
    kabes.add(hidari);
    //i
    const hidari2 = kabe.clone();
    hidari2.position.set(8.5,0,15);
    hidari2.rotation.y = -0.5 * Math.PI; // 角度を調整
    kabes.add(hidari2);
    //hidari3
    const hidari3 = kabe.clone();
    hidari3.position.set(40,0,45);
    kabes.add(hidari3);

    //u
    for(let t=1; t<5; t++){
      const u = kabe.clone();
      u.position.set(-36,0,40+(-10*t));
      kabes.add(u);
    }

    //u+
    for(let t=1; t<5; t++){
      const uu = kabe.clone();
      uu.position.set(-36,0,-2+(-11*t));
      uu.rotation.y = -0.5 * Math.PI; // 角度を調整
      kabes.add(uu);
    }
    

    //tate+
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 3; r++) {
        const tate = kabe.clone();
        tate.position.set(
          18+(12*c),
          0,
          -15+(12*c)*r
        )
        kabes.add(tate);
      }
    }

    //tate-
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 8; r++) {
        const tate2 = kabe.clone();
        tate2.position.set(
          -1-(24*c),
          0,
          42-(13*r)
        )
        kabes.add(tate2);
      }
    }

    //yoko+
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 6; r++) {
        const yoko = kabe.clone();
        yoko.position.set(
          -10+(28*c),
          0,
          16+(-12*r)
        )
        yoko.rotation.y = -0.5 * Math.PI;//角度を調整
        kabes.add(yoko);
      }
    }

    //yoko-
    for (let r = 0; r < 2; r++) {
      const yoko2 = kabe.clone();
      yoko2.position.set(
        -16+(-12*r),
        0,
        25+12*r
      )
      yoko2.rotation.y = -0.5 * Math.PI;//角度を調整
      kabes.add(yoko2);
    }
  }
  scene.add(kabes);

  // ブロックの衝突検出
  function brickCheck() {
    let hit = false;
    const sphere = ball.geometry.boundingSphere.clone();
    sphere.translate(ball.position);
    kabes.children.forEach((kabes) => {
      if (!hit ) {
        let box = kabes.geometry.boundingBox.clone();
        box.translate(kabes.position);
        if (box.intersectsSphere(sphere)) {
          ball.position.set(50,0,50);
          moveDirection = { x: 0, z: 0 };
          hit = true;
        }
      }
    });
  }

  // 描画処理
  // 描画関数
  function render() {
    // 座標軸の表示
    axes.visible = param.axes;
    // 描画
    renderer.render(scene, camera);
    // 次のフレームでの描画要請
    requestAnimationFrame(render);
    brickCheck(); // ブロックの衝突判定
    brickCheck2();
  }

  // 描画開始
  render();
}

init();