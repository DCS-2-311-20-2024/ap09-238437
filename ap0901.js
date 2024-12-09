//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G38437-2023　小松翔真
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { OrbitControls } from 'three/addons';
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
    50, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0,125,0);
  camera.lookAt(0,0,0);

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("output").appendChild(renderer.domElement);
  renderer.setClearColor(0x406080);

  //平面の設定
  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshBasicMaterial({ color: "green"});
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;//角度を調整
  plane.position.y = -1;
  scene.add(plane);

  // ボールの作成
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 24, 24),
    new THREE.MeshBasicMaterial({ color: "yellow" })
  );
  ball.position.set(0,0.5,0);
  scene.add(ball);

  // ボール操作
  {
    const plane2 = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const intersects = new THREE.Vector3();
    function ballMove(event) {
      mouse.x = (event.clientX / window.innerWidth) *2-1;
      mouse.z = (event.clientZ / window.innerHeight) *2-1;
      raycaster.setFromCamera(mouse,camera);
      raycaster.ray.intersectPlane(plane2,intersects);
      const offset = 100 / 2 -3
      const offset2 = 100 / 2 -3
      if(intersects.x < -offset){
        intersects.x = -offset;
      }
      else if (intersects.x > offset){
        intersects.x = offset;
      }
      ball.position.x = intersects.x;

      if(intersects.z < -offset2){
        intersects.z = -offset2;
      }
      else if (intersects.z > offset2){
        intersects.z = offset2;
      }
      ball.position.z = intersects.z;
    }
    window.addEventListener("mousemove", ballMove, false);
  }

  // 枠の作成
  //sita
  const waku = new THREE.Mesh(
    new THREE.BoxGeometry(100,2,2),
    new THREE.MeshBasicMaterial({color: "black"})
  );
  waku.position.set(0,0,51);
  scene.add(waku);
  //ue
  const waku1 = waku.clone();
  waku1.position.set(0,0,-51);
  scene.add(waku1);
  //migi
  const waku2 = new THREE.Mesh(
    new THREE.BoxGeometry(2,2,104),
    new THREE.MeshBasicMaterial({color: "black"})
  );
  waku2.position.set(51,0,0);
  scene.add(waku2);
  //hidari
  const waku3 = waku2.clone();
  waku3.position.set(-51,0,0);
  scene.add(waku3);

  // 構造物の作成
  const buildings = new THREE.Group();
  {
    const w = 5;
    const h = 2;
    const d = 5;
    const gap = 7;
    const n = 8;

    for (let c = 0; c < n; c++) {
      for (let r = 0; r < n; r++) {
        const building = new THREE.Mesh(
          new THREE.BoxGeometry(w, h, d),
          new THREE.MeshBasicMaterial({color: "black"})
        );
        building.position.set(
          (gap+w) * (c - (n-1)/2),
          0,
          (gap+d) * (r - (n-1)/2)
        )
        buildings.add(building);
      }
    }
  }
  scene.add(buildings);

  // 構造物２の作成（障壁）
  const kabes = new THREE.Group();
  {
    //壁
    const kabe = new THREE.Mesh(
      new THREE.BoxGeometry(5,2,7),
      new THREE.MeshBasicMaterial({color: "black"})
    );

    //migi
    const migi = kabe.clone();
    migi.position.set(6,0,0);
    kabes.add(migi);
    //hidari
    const hidari = kabe.clone();
    hidari.position.set(-6,0,0);
    kabes.add(hidari);
    //usiro
    const usiro = kabe.clone();
    usiro.position.set(0,0,6);
    usiro.rotation.y = -0.5 * Math.PI;//角度を調整
    kabes.add(usiro);

    //tate+
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 3; r++) {
        const tate = kabe.clone();
        tate.position.set(
          18+(12*c),
          0,
          0+(12*c)*r
        )
        kabes.add(tate);
      }
    }

    //tate-
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 3; r++) {
        const tate2 = kabe.clone();
        tate2.position.set(
          -(18+(12*c)),
          0,
          -(0+(12*c)*r)
        )
        kabes.add(tate2);
      }
    }

    //yoko+
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 3; r++) {
        const yoko = kabe.clone();
        yoko.position.set(
          -12+(24*c),
          0,
          -18+(-12*r)
        )
        yoko.rotation.y = -0.5 * Math.PI;//角度を調整
        kabes.add(yoko);
      }
    }

    //yoko-
    for (let r = 0; r < 3; r++) {
      const yoko2 = kabe.clone();
      yoko2.position.set(
        24+(-12*r),
        0,
        18+12*r
      )
      yoko2.rotation.y = -0.5 * Math.PI;//角度を調整
      kabes.add(yoko2);
    }

    //yoko3
    for (let r = 0; r < 3; r++) {
      const yoko3 = kabe.clone();
      yoko3.position.set(
        6+(-12*r),
        0,
        24+12*r
      )
      kabes.add(yoko3);
    }
    
  }
  scene.add(kabes);
  
  // 描画処理

  // カメラコントロール
  const orbitControls = new OrbitControls(camera, renderer.domElement);

  // 描画関数
  function render() {
    // カメラ制御の更新
    //orbitControls.update();
    // 座標軸の表示
    axes.visible = param.axes;
    // 描画
    renderer.render(scene, camera);
    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }

  // 描画開始
  render();
}

init();