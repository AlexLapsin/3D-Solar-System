// Properties
//*****************************************************************

var cameraParams = {
    near: 1,
    far: 80000, // adjust to accommodate movement of camera in Z
    fov: 45,   // field of view
    aspectRatio: window.innerWidth/window.innerHeight,  
    atX: 0, // vector direction
    atY: 0,
    atZ: 0,
    eyeX: 0, //camera position
    eyeY: 100, 
    eyeZ: 600, 
    upX: 0,
    upY: 0,
    upZ: 0
};

var sunParams = {texture: "https://i.imgur.com/ZE5RVO8.jpg",
                 size: 45,
                 rotationSpeedRate: 0.0005};

var mercuryParams = {texture: "https://i.imgur.com/yGvWsA7.jpg",
                   size: 2,
                   distance: 55,
                   orbitSpeed: 5, // lower value = faster
                   rotationSpeedRate: 0.05};

var venusParams = {texture: "https://i.imgur.com/QuDySr0.jpg",
                   size: 4.5,
                   distance: 75,
                   orbitSpeed: 10,
                   rotationSpeedRate: -0.03};//the only planet that rotates clockwise

var earthParams = {texture: "https://i.imgur.com/NxIqS5o.jpg",
                   size: 5.5,
                   distance: 100,
                   orbitSpeed: 18, 
                   rotationSpeedRate: 0.02};

var marsParams = {texture: "https://i.imgur.com/OT3GWDl.jpg",
                  size: 4,
                  distance: 125,
                  orbitSpeed: 27,
                  rotationSpeedRate: 0.02};

var jupiterParams = {texture: "https://i.imgur.com/4Dw9oja.jpg",
                     size: 15,
                     distance: 180,
                     orbitSpeed: 85,
                     rotationSpeedRate: 0.006};

var saturnParams = {texture: "https://i.imgur.com/4aqxdnk.jpg",
                    ringTexture: "https://i.imgur.com/vRVuVYi.png",
                    size: 13,
                    distance: 230,
                    orbitSpeed: 95,
                    rotationSpeedRate: 0.0008};

var uranusParams = {texture: "https://i.imgur.com/WRHU8cg.jpg",
                    size: 10,
                    distance: 280,
                    orbitSpeed: 105,
                    rotationSpeedRate: 0.008};

var neptuneParams = {texture: "https://i.imgur.com/CrVf8ft.jpg",
                   size: 9.5,
                   distance: 335,
                   orbitSpeed: 115,
                   rotationSpeedRate: 0.008};

var plutoParams = {texture: "https://i.imgur.com/tAkjOyE.jpg",
                   size: 2,
                   distance: 395,
                   orbitSpeed: 150,
                   rotationSpeedRate: 0.01};

//*****************************************************************
// Creating Scene
var scene = new THREE.Scene();

// Creating Camera
var camera = setupCamera(cameraParams);
scene.add(camera);

// Creating Renderer
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth,window.innerHeight);
document.getElementById("canvas").appendChild(renderer.domElement);
//TW.mainInit(renderer,scene);

// Creating Controls
var controls = new THREE.OrbitControls(camera, renderer.domElement );

// Creating a Skybox
createSkyBox(40000);

// Creating Planets and Stars
var sun = createStar(sunParams);

var mercury = createPlanet(mercuryParams, mercuryParams.distance,0,0);
var mercuryOrbit = createOrbit(mercuryParams.distance);

var venus = createPlanet(venusParams, venusParams.distance,0,0);
var venusOrbit = createOrbit(venusParams.distance);

var earth = createPlanet(earthParams, earthParams.distance,0,0);
var earthOrbit = createOrbit(earthParams.distance);

var mars = createPlanet(marsParams, marsParams.distance,0,0);
var earthOrbit = createOrbit(marsParams.distance);

var jupiter = createPlanet(jupiterParams, jupiterParams.distance,0,0);
var jupiterOrbit = createOrbit(jupiterParams.distance);

var saturn = createPlanet(saturnParams, saturnParams.distance,0,0);
var saturnOrbit = createOrbit(saturnParams.distance);
var saturnRing = createPlanetRing(saturnParams, 17, 26);

var uranus = createPlanet(uranusParams, uranusParams.distance,0,0);
var uranusOrbit = createOrbit(uranusParams.distance);
uranus.rotation.z = Math.PI/2;
var uranusRing = createPlanetRing(uranusParams, 12, 13);

var neptune = createPlanet(neptuneParams, neptuneParams.distance,0,0);
var neptuneOrbit = createOrbit(neptuneParams.distance);

var pluto = createPlanet(plutoParams, plutoParams.distance,0,0);
var plutoOrbit = createOrbit(plutoParams.distance);


// Creating Light from the sun.
var sunlight = new THREE.PointLight(0x878787,5,500,2);
sunlight.castShadow = true;
scene.add(sunlight);

// Creating the Ambient light
var ambientLight = new THREE.AmbientLight(0xd0d4e8,0.4);
scene.add(ambientLight);

// Animating
updateState(renderer, scene);


// Functions ********************************************************************************

// Creates and returns a camera with the desired parameters
function setupCamera (cameraParameters) {
    var cp = cameraParameters;
    // create an initial camera with the desired shape
    var camera = new THREE.PerspectiveCamera(cp.fov, cp.aspectRatio, cp.near, cp.far);
    // set the camera location and orientation
    camera.position.set(cp.eyeX, cp.eyeY, cp.eyeZ);
    camera.lookAt(new THREE.Vector3(cp.atX, cp.atY, cp.atZ));
    return camera;
}

// Creates a Skybox 
function createSkyBox(cubeSize){
  TW.loadTextures([
      "https://i.imgur.com/cImxHvi.png",// right
      "https://i.imgur.com/Fy1xWVj.png",// left
      "https://i.imgur.com/ohfY7WH.png",// top
      "https://i.imgur.com/GxTCIi5.png",// bottom
      "https://i.imgur.com/7GHtF0Z.png",// front
      "https://i.imgur.com/TXAPRT2.png"// back
    ],
      function (textures) {
          var mats = [];
          for (var i = 0; i < 6; i++) {
              mats.push(new THREE.MeshBasicMaterial({map: textures[i],
                                                     side: THREE.BackSide}));
          }

      var spaceGeom = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize);
      var spaceMat = new THREE.MeshFaceMaterial(mats);
      spaceMesh = new THREE.Mesh(spaceGeom, spaceMat);
      scene.add(spaceMesh);
      //TW.render();
    }
  );
}

// Creates a sphere object
function createSphere(sphereMaterial, size) {
    var segments = size*10;
    var sphereGeom = new THREE.SphereGeometry(size, segments, segments);
    var sphere = new THREE.Mesh(sphereGeom, sphereMaterial);
    sphere.castShadow = true;

    return sphere;
}

// Creates a orbit around the sun
function createOrbit(distance) {
    var orbitGeom = new THREE.RingGeometry(distance, distance-0.35, distance);
    var orbitMaterial = new THREE.MeshBasicMaterial({color: 0xffffff,
                                                     side: THREE.DoubleSide});
    var orbit = new THREE.Mesh(orbitGeom, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    
    scene.add(orbit);
   // TW.render();
  
    return orbit;
}

// Creates a planet
function createPlanet(planetParams, x, y, z) {
    var planetTexture = new THREE.TextureLoader().load(planetParams.texture);
    var normal = new THREE.TextureLoader().load("https://i.imgur.com/JU6Nz02.png");
    var normalScale = new THREE.Vector2(6,6)
    var specular = new THREE.TextureLoader().load("https://i.imgur.com/Qk2vCVu.png")
    var planetMaterial;
  
    if (planetParams === earthParams){
      planetMaterial = new THREE.MeshPhongMaterial({map: planetTexture,
                                                    normalMap: normal,
                                                    specularMap: specular,
                                                    normalScale: normalScale})
    }
    else {
      planetMaterial = new THREE.MeshPhongMaterial({color: 0xffffff,
                                                    map: planetTexture})}

    planetMaterial.receiveShadow = true;
    planetMaterial.castShadow = true;

    var planet = createSphere(planetMaterial, planetParams.size);
    planet.position.set(x, y, z);
    scene.add(planet);
    //TW.render();
    return planet;
}

// Creates a planet ring
function createPlanetRing(planetParams, innerR, outerR){
    var ringTexture = new THREE.TextureLoader().load(planetParams.texture);
    // ringTexture.wrapT = THREE.RepeatWrapping;
  
    var ringGeom = new THREE.RingGeometry(innerR, outerR, 50, 50);
 
  
  
    var ringMaterial = new THREE.MeshLambertMaterial({color: 0xffffff,
                                                      side: THREE.DoubleSide,
                                                      map: ringTexture});
    ringMaterial.receiveShadow = true;
    ringMaterial.castShadow = true;
  
    var ring = new THREE.Mesh(ringGeom, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(planetParams.distance, 0, 0);
    
    scene.add(ring);
    //TW.render();
  
    return ring;
}

// Creates Sun
function createStar(starParams){
    var starTexture = new THREE.TextureLoader().load(starParams.texture);
    var starMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, map: starTexture});
  
    var star = createSphere(starMaterial, starParams.size);
    star.position.set(0, 0, 0);
    scene.add(star);
    //TW.render();
  
  return star;
}

// Rotates an object around its own axis and/or around the sun
function rotateObject(planet, planetParams, time) {
    if (planet == uranus)
      planet.rotation.z += planetParams.rotationSpeedRate; // around z axis
    else
      planet.rotation.y += planetParams.rotationSpeedRate; // around y axis
    
    var radius = planetParams.distance;  
    var value = planetParams.orbitSpeed * 500;
  
    // around the sun
    if (planet != sun) {
      planet.position.x = Math.cos(time / value) * radius;
      planet.position.z = Math.sin(time / value) * radius;
    }
}

// an update function that keeps calling itself infinitely
// therefore animating the scene
function updateState(renderer, scene) {
    var time = Date.now();
  
    rotateObject(sun, sunParams, time);
    rotateObject(mercury, mercuryParams, time);
    rotateObject(venus, venusParams, time);
    rotateObject(earth, earthParams, time);
    rotateObject(mars, marsParams, time);
    rotateObject(jupiter, jupiterParams, time);
    rotateObject(saturn, saturnParams, time);
    rotateObject(saturnRing, saturnParams, time);
    rotateObject(uranus, uranusParams, time);
    rotateObject(uranusRing, uranusParams, time);
    rotateObject(neptune, neptuneParams, time);
    rotateObject(pluto, plutoParams, time);
    
    controls.update();
    //TW.render();
    render();
  
    requestAnimationFrame(function () {
        updateState(renderer, scene);
    });
}

// a render function that assume global variables scene, renderer, and camera
function render() {
   renderer.render(scene,camera);
}