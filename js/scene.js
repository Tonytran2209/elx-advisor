
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  // ==========================================
  // CẤU HÌNH HỆ THỐNG CHUNG
  // ==========================================
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const mobileLayout = window.matchMedia('(max-width: 991px)');
  const maxPixelRatio = Math.min(window.devicePixelRatio, 1.5); 

  function createOptimizedRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance", 
      precision: "mediump",                
      stencil: false,                      
      depth: true
    });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.useLegacyLights = false; 
    return renderer;
  }

  // ==========================================
  // KHỞI TẠO KHUNG CỨNG CHO CÁC SCENE
  // ==========================================
  
  // --- SECTION 1 ---
  const scene1 = new THREE.Scene();
  const canvas1 = document.getElementById('three-canvas');
  const container1 = document.querySelector('.canvas-wrapper');
  const clock1 = new THREE.Clock();
  const camera1 = new THREE.PerspectiveCamera(45, container1.clientWidth / container1.clientHeight, 0.1, 1000);
  const renderer1 = createOptimizedRenderer(canvas1);
  renderer1.setSize(container1.clientWidth, container1.clientHeight);
  renderer1.setPixelRatio(maxPixelRatio); 
  scene1.add(new THREE.AmbientLight(0xffffff, 35));
  let mixer1, model1, isVisible1 = false, isLoaded1 = false;

  // --- SECTION 2 ---
  const scene2 = new THREE.Scene();
  const canvas2 = document.getElementById('three-canvas-2'); 
  const container2 = document.querySelector('.canvas-wrapper-2');
  const clock2 = new THREE.Clock();
  const camera2 = new THREE.PerspectiveCamera(35, container2.clientWidth / container2.clientHeight, 0.1, 10000);
  function setDesktopTurbineCamera() {
    camera2.position.set(-30.34, 22.167, 21.268);
    camera2.rotation.set(THREE.MathUtils.degToRad(-33.04), THREE.MathUtils.degToRad(-50.10), THREE.MathUtils.degToRad(-26.52));
    camera2.near = 0.1;
    camera2.far = 10000;
  }
  setDesktopTurbineCamera();
  const renderer2 = createOptimizedRenderer(canvas2);
  renderer2.setSize(container2.clientWidth, container2.clientHeight);
  renderer2.setPixelRatio(1.0); 
  scene2.add(new THREE.AmbientLight(0xffffff, 2.0));
  const dirLight2 = new THREE.DirectionalLight(0xffffff, 3.0);
  dirLight2.position.set(10, 20, 10);
  scene2.add(dirLight2);
  let mixer2, model2, isVisible2 = false, isLoaded2 = false;

  // --- SECTION 3 ---
  const scene3 = new THREE.Scene();
  const canvas3 = document.getElementById('three-canvas-3');
  const container3 = document.querySelector('.canvas-wrapper-3');
  const camera3 = new THREE.PerspectiveCamera(45, canvas3.clientWidth / canvas3.clientHeight, 0.1, 3000);
  const renderer3 = createOptimizedRenderer(canvas3);
  renderer3.setSize(canvas3.clientWidth, canvas3.clientHeight, false);
  renderer3.setPixelRatio(1.0); 
  scene3.add(new THREE.AmbientLight(0xffffff, 60));
  const dirLight3 = new THREE.DirectionalLight(0xffffff, 2.5);
  dirLight3.position.set(10, 15, 10);
  scene3.add(dirLight3);
  const controls3 = new OrbitControls(camera3, renderer3.domElement);
  controls3.enableDamping = true;       
  controls3.dampingFactor = 0.05;
  controls3.enableZoom = false;         
  controls3.enablePan = false;          
  controls3.minPolarAngle = Math.PI / 4;  
  controls3.maxPolarAngle = Math.PI / 1.8; 
  let loadedModel3, isVisible3 = false, isLoaded3 = false;

  // ==========================================
  // HÀM TẢI FILE GLB CHI TIẾT
  // ==========================================
  
  function loadModelSection1() {
    if (isLoaded1) return;
    isLoaded1 = true;
    loader.load('/models/scene.glb', (gltf) => {
      model1 = gltf.scene;
      if (gltf.animations && gltf.animations.length > 0) {
        mixer1 = new THREE.AnimationMixer(model1);
        mixer1.clipAction(gltf.animations[0]).play();
      }
      const box = new THREE.Box3().setFromObject(model1);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model1.position.x += (model1.position.x - center.x);
      model1.position.y += (model1.position.y - center.y);
      model1.position.z += (model1.position.z - center.z);

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera1.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.2;
      camera1.position.z = cameraZ;
      camera1.far = cameraZ * 10;
      camera1.updateProjectionMatrix();
      scene1.add(model1);
      if (mobileLayout.matches) resizeMobileScenes();
    });
  }

  function loadModelSection2() {
    if (isLoaded2) return;
    isLoaded2 = true;
    loader.load('/models/turbin-v1.glb', (gltf) => {
      model2 = gltf.scene;
      
      model2.traverse((child) => {
        if (child.isMesh) {
          child.material.precision = "mediump";
          child.frustumCulled = true;
        }
      });

      if (gltf.animations && gltf.animations.length > 0) {
        mixer2 = new THREE.AnimationMixer(model2);
        const clip = gltf.animations[0];
        clip.duration = 8.62; 
        mixer2.clipAction(clip).play();
      }
      const box = new THREE.Box3().setFromObject(model2);
      const center = box.getCenter(new THREE.Vector3());
      model2.position.x += (model2.position.x - center.x);
      model2.position.y += (model2.position.y - center.y);
      model2.position.z += (model2.position.z - center.z);
      model2.scale.set(1.5, 1.5, 1.5);
      model2.position.x -= 12; 
      model2.position.y -= -3;
      scene2.add(model2);
      if (mobileLayout.matches) resizeMobileScenes();
    });
  }

  function loadModelSection3() {
    if (isLoaded3) return;
    isLoaded3 = true;
    loader.load('/models/hydrolyzer-v3.glb', (gltf) => {
      loadedModel3 = gltf.scene;
      
      loadedModel3.traverse((child) => {
        if (child.isMesh) {
          child.material.precision = "mediump";
          child.frustumCulled = true;
        }
      });

      const box = new THREE.Box3().setFromObject(loadedModel3);
      const center = box.getCenter(new THREE.Vector3());
      loadedModel3.position.x += (loadedModel3.position.x - center.x);
      loadedModel3.position.y += (loadedModel3.position.y - center.y);
      loadedModel3.position.z += (loadedModel3.position.z - center.z);
      scene3.add(loadedModel3);
      if (mobileLayout.matches) resizeMobileScenes();
      else updateCameraDistance3();

      // SỬA LỖI ĐỘ TRỄ: Render mồi ngay lập tức một frame để GPU nạp sẵn hình ảnh model vào bộ nhớ cache
      renderer3.render(scene3, camera3);
    });
  }

  // Tải liên tục ngay khi load trang
  loadModelSection3();

  function updateCameraDistance3() {
    if (!loadedModel3 || !camera3) return;
    camera3.near = 0.1;
    const box = new THREE.Box3().setFromObject(loadedModel3);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera3.fov * (Math.PI / 180);
    const aspect = canvas3.clientWidth / canvas3.clientHeight;
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.15;
    if (aspect < 1) cameraZ *= (1.0 / aspect);
    camera3.position.set(cameraZ * 0.8, cameraZ * 0.5, cameraZ * 0.9);
    camera3.far = cameraZ * 20;
    controls3.target.set(0, 0, 0);
    camera3.updateProjectionMatrix();
    controls3.update();
  }

  // ==========================================
  // BỘ ĐIỀU PHỐI OBSERVER
  // ==========================================
  const observerOptions = { 
    rootMargin: "400px 0px 400px 0px" 
  };

  const globalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const isIntersecting = entry.isIntersecting;

      if (entry.target === container1) {
        if (isIntersecting) { loadModelSection1(); isVisible1 = true; } else { isVisible1 = false; }
      }
      if (entry.target === container2) {
        if (isIntersecting) { loadModelSection2(); isVisible2 = true; } else { isVisible2 = false; }
      }
      if (entry.target === container3) {
        isVisible3 = isIntersecting;
      }
    });
  }, observerOptions);

  globalObserver.observe(container1);
  globalObserver.observe(container2);
  globalObserver.observe(container3);

  // ==========================================
  // VÒNG LẶP ENGINE ANIMATE (SỬA ĐỂ HIỂN THỊ LUÔN)
  // ==========================================
  function globalAnimateLoop() {
    requestAnimationFrame(globalAnimateLoop);

    if (isVisible1 && model1) {
      const delta1 = clock1.getDelta();
      if (mixer1) mixer1.update(delta1);
      model1.rotation.y += 0.005; 
      renderer1.render(scene1, camera1);
    }

    if (isVisible2 && model2) {
      const delta2 = clock2.getDelta();
      if (mixer2) mixer2.update(delta2);
      renderer2.render(scene2, camera2);
    }

    // THAY ĐỔI CHIẾN THUẬT: Chỉ cần model load xong là liên tục vẽ để đảm bảo 100% không bao giờ trống không
    if (loadedModel3) {
      controls3.update();
      renderer3.render(scene3, camera3);
    }
  }
  globalAnimateLoop();

  // ==========================================
  // SỰ KIỆN CO GIÃN MÀN HÌNH
  // ==========================================
  function resizeDesktopScenes() {
    camera1.aspect = container1.clientWidth / container1.clientHeight;
    camera1.updateProjectionMatrix();
    renderer1.setSize(container1.clientWidth, container1.clientHeight);

    camera2.aspect = container2.clientWidth / container2.clientHeight;
    camera2.updateProjectionMatrix();
    renderer2.setSize(container2.clientWidth, container2.clientHeight);

    const w3 = canvas3.clientWidth;
    const h3 = canvas3.clientHeight;
    camera3.aspect = w3 / h3;
    updateCameraDistance3();
    renderer3.setSize(w3, h3, false);
  }

  function fitModel(camera, model, direction, padding = 1.2) {
    const sphere = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere());
    if (!Number.isFinite(sphere.radius) || sphere.radius <= 0) return;
    const vertical = THREE.MathUtils.degToRad(camera.fov) / 2;
    const horizontal = Math.atan(Math.tan(vertical) * camera.aspect);
    const distance = sphere.radius / Math.sin(Math.min(vertical, horizontal)) * padding;
    camera.position.copy(sphere.center).add(direction.clone().normalize().multiplyScalar(distance));
    camera.near = Math.max(0.01, distance / 1000);
    camera.far = distance + sphere.radius * 10;
    camera.lookAt(sphere.center);
    camera.updateProjectionMatrix();
    return sphere.center;
  }

  function resizeMobileScenes() {
    if (!mobileLayout.matches) return;
    for (const [canvas, renderer, camera] of [[canvas1, renderer1, camera1], [canvas2, renderer2, camera2], [canvas3, renderer3, camera3]]) {
      const host = canvas.parentElement;
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }
    if (model1) fitModel(camera1, model1, new THREE.Vector3(0, 0, 1));
    if (model2) fitModel(camera2, model2, new THREE.Vector3(-30.34, 22.167, 21.268), 1.15);
    if (loadedModel3) {
      const center = fitModel(camera3, loadedModel3, new THREE.Vector3(0.8, 0.5, 0.9), 1.12);
      if (center) controls3.target.copy(center);
      controls3.update();
    }
  }

  function applyLayout() {
    controls3.touches.ONE = mobileLayout.matches ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE;
    if (mobileLayout.matches) {
      resizeMobileScenes();
    } else {
      setDesktopTurbineCamera();
      camera1.near = 0.1;
      if (model1) {
        const size = new THREE.Box3().setFromObject(model1).getSize(new THREE.Vector3());
        const distance = Math.max(size.x, size.y, size.z) / (2 * Math.tan(THREE.MathUtils.degToRad(camera1.fov) / 2)) * 1.2;
        camera1.position.set(0, 0, distance);
        camera1.far = distance * 10;
        camera1.rotation.set(0, 0, 0);
      }
      resizeDesktopScenes();
    }
  }

  const sceneResizeObserver = new ResizeObserver(resizeMobileScenes);
  [canvas1, canvas2, canvas3].forEach(canvas => sceneResizeObserver.observe(canvas.parentElement));
  window.addEventListener('resize', () => {
    if (mobileLayout.matches) resizeMobileScenes();
    else resizeDesktopScenes();
  });
  mobileLayout.addEventListener('change', applyLayout);
  if (mobileLayout.matches) applyLayout();
