// Generic definitions - variables

var WIDTH = document.body.clientWidth, HEIGHT = document.body.clientHeight;

var scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000),
    renderer = new THREE.WebGLRenderer({ alpha: true }),
    light, geometry, material, cubes = [],
    button = document.querySelector("button#start");

// Generic definitions functions

function startRenderLoop(device) {
  requestAnimationFrame(function draw() {

    var state = device.getState() // obtains position & orientation
    if(state.position && state.orientation) { // they might not be available yet, though...
      camera.quaternion.copy(state.orientation)
      camera.position.set(state.position.x * 3, state.position.y * -1, state.position.z * 3) // the multiplication gives us a bit of a speed boost :)
    }

    // Let the cubes rain!
    for(var i=0;i<100;i++) {
      cubes[i].rotation.y += Math.PI / 100;
      cubes[i].position.y -= 0.25;
      if(cubes[i].position.y < 2.5) {
        cubes[i].position.set(-100 + Math.random() * 200, 10 + Math.random() * 50, -100 + Math.random() * 200)
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(draw);
  })
}

// Initialisiation and run!

var floorTex = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("floor.jpg", null, function() {
  floorTex.map.wrapS = floorTex.map.wrapT = THREE.RepeatWrapping
  floorTex.map.repeat.set(100, 100)
  floorTex.map.needsUpdate = true
  floorTex.needsUpdate = true
})})

var floor = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000),
  floorTex
);

floor.position.y = -5;
floor.rotation.x = -Math.PI/2;
scene.add(floor)

light = new THREE.PointLight(0xffffff, 1, 200);
scene.add(light);

geometry = new THREE.BoxGeometry(5, 5, 5);
material = new THREE.MeshLambertMaterial({
  map: THREE.ImageUtils.loadTexture('logo.png')
})

// create 100 cubes, randomly positioned around and above us
for(var i=0; i<100; i++) {
  var cube = new THREE.Mesh(geometry, material)
  cube.position.set(-100 + Math.random() * 200, 10 + Math.random() * 50, -100 + Math.random() * 200)
  scene.add(cube)
  cubes.push(cube)
}

button.addEventListener("click", function() {
  document.body.removeChild(document.getElementById("instructions"));

  document.body.appendChild(renderer.domElement);
  renderer.setSize(WIDTH, HEIGHT);

  // Get the position sensor
  navigator.getVRDevices().then(function(devices) {
    console.log(devices[0])
    devices[0].resetSensor() // set the current position as (0, 0, 0)

    // give the user a possibility to reset the position at any time
    document.getElementById('reset').addEventListener('click', function() {
      devices[0].resetSensor()
    })

    // get drawin'
    startRenderLoop(devices[0])
  })

});
