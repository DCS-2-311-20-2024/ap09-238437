//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G38437-2023　小松翔真
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { OrbitControls } from 'three/addons';
import { GUI } from "ili-gui";

let course;

export const origin = new THREE.Vector3();
export const controlPoints = [
    [  0, 50],
    [-50, 50],
    [-50, -50],
    [50,-50],
    [50,50],
    [0,50]
  ]

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
  camera.position.set(150,100,0);
  camera.lookAt(0,0,0);

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, innerHeight);
  document.getElementById("output").appendChild(renderer.domElement);

  //平面の設定
  const planeGeometry = new THREE.PlaneGeometry(130, 130);
  const planeMaterial = new THREE.MeshBasicMaterial({ color: "green"});
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;//角度を調整
  plane.position.y = -0.1;
  scene.add(plane);

  // コース(描画)
  course = new THREE.CatmullRomCurve3(
    controlPoints.map((p) => {
        return (new THREE.Vector3()).set(
            p[0],
            0,
            p[1]
        );
    }), false
  )
  
  //曲線から、、、
  const points =course.getPoints(500);
  points.forEach((point) => {
      const road = new THREE.Mesh(
          new THREE.CircleGeometry(2,116),
          new THREE.MeshLambertMaterial({
              color: "gray",
          })
      )
      road.rotateX(-Math.PI/2);
      road.position.set(
          point.x,
          0,
          point.z
      );
      scene.add(road);
  })

  



  // 描画処理

  // カメラコントロール
  const orbitControls = new OrbitControls(camera, renderer.domElement);

  // 描画関数
  function render() {
    
    // カメラ制御の更新
    orbitControls.update();
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