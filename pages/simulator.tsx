import Layout from '../components/layout'
import * as THREE from 'three'
import {useEffect} from 'react'

import grassSrc from './grass.jpg'

export default function Simulator() {
  useEffect(() => {
    // Define the glider and environment models
    var gliderModel, groundModel

    // Define the initial conditions for the simulation
    var gliderPosition = new THREE.Vector3(0, 0, 0)
    var gliderVelocity = new THREE.Vector3(0, 0, 0)
    var airDensity = 1.225 // kg/m^3
    var windSpeed = 0 // m/s

    var thrustAcceleration = 100 // m/s^2

    var gliderMass = 100 // kg

    // Define the simulation parameters
    var simulationTime = 0 // seconds
    var timeStep = 0.01 // seconds

    // Handle keyboard input
    var isSpacePressed = false

    // Implement the equations of motion, lift, and drag
    function calculateForces() {
      // Calculate the lift force
      var wingArea = 10 // m^2
      var liftCoefficient = 1.2
      var liftForce = new THREE.Vector3(0, airDensity * gliderVelocity.lengthSq() * wingArea * liftCoefficient, 0)

      // Calculate the drag force
      var dragCoefficient = 0.02
      var dragForce = gliderVelocity
        .clone()
        .multiplyScalar(-1)
        .normalize()
        .multiplyScalar(0.5 * airDensity * gliderVelocity.lengthSq() * wingArea * dragCoefficient)

      // Calculate the weight force
      var gravity = 9.81 // m/s^2
      var weightForce = new THREE.Vector3(0, -gliderMass * gravity, 0)

      // Calculate the thrust force
      var thrustForce = new THREE.Vector3(0, 0, 0)
      if (isSpacePressed) {
        // console.log('space')
        thrustForce = new THREE.Vector3(0, 0, -thrustAcceleration * gliderMass)
      }

      // Combine the forces to get the net force
      var netForce = new THREE.Vector3()
      netForce.addVectors(liftForce, weightForce)
      netForce.sub(dragForce)
      netForce.add(thrustForce)

      return netForce
    }

    function applyForces() {
      var netForce = calculateForces()
      var acceleration = netForce.divideScalar(gliderMass)

      // Check if the glider is making contact with the ground
      var isOnGround = gliderPosition.y <= groundModel.position.y + 0.5

      if (isOnGround) {
        // Disable vertical acceleration and velocity if on ground
        acceleration.y = 0
        gliderVelocity.y = 0

        // Set glider position to be at level of ground
        gliderPosition.y = groundModel.position.y + 0.5

        // Apply thrust if space is pressed
        if (isSpacePressed) {
          var thrustForce = new THREE.Vector3(0, 0, -thrustAcceleration * gliderMass)
          netForce.add(thrustForce)
        }
      }

      gliderVelocity.add(acceleration.multiplyScalar(timeStep))
      gliderPosition.add(gliderVelocity.clone().multiplyScalar(timeStep))

      gliderModel.position.copy(gliderPosition)
      gliderModel.lookAt(gliderPosition.clone().add(gliderVelocity))
    }

    // Create the Three.js scene, camera, and renderer
    var scene = new THREE.Scene()
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    var renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // Create the glider model
    var gliderGeometry = new THREE.BoxGeometry(1, 1, 1)
    var gliderMaterial = new THREE.MeshBasicMaterial({color: 0x005e99})
    gliderModel = new THREE.Mesh(gliderGeometry, gliderMaterial)
    scene.add(gliderModel)

    // Load the texture image
    var textureLoader = new THREE.TextureLoader()
    var groundTexture = textureLoader.load('./grass.jpg', (texture) => {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(50, 50)
    })

    // Create the ground model with the texture
    var groundGeometry = new THREE.PlaneGeometry(10000, 10000)
    var groundMaterial = new THREE.MeshBasicMaterial({map: groundTexture})
    groundModel = new THREE.Mesh(groundGeometry, groundMaterial)
    groundModel.rotation.x = -Math.PI / 2
    scene.add(groundModel)

    // Set the camera position
    camera.position.z = 5
    camera.position.y = 0
    camera.lookAt(gliderModel.position)

    document.addEventListener('keydown', function (event) {
      if (event.code === 'Space') {
        isSpacePressed = true

        console.log('space')
      }
    })

    document.addEventListener('keyup', function (event) {
      if (event.code === 'Space') {
        isSpacePressed = false

        console.log('space up')
      }
    })

    // Update the simulation for each time step
    function updateSimulation() {
      simulationTime += timeStep
      applyForces()

      // Return the glider state as a THREE.Object3D object
      return gliderModel
    }

    // Render the scene in Three.js
    function render() {
      requestAnimationFrame(render)

      // Update glider position and orientation based on physics
      var gliderState = updateSimulation()

      if (gliderState) {
        gliderModel.position.copy(gliderState.position)
        gliderModel.quaternion.copy(gliderState.quaternion)
      }

      // Update the camera position to be behind the glider
      var cameraDistance = 10
      var cameraOffset = new THREE.Vector3(0, 1, -cameraDistance)
      var cameraPosition = cameraOffset.applyQuaternion(gliderState.quaternion)
      cameraPosition.add(gliderState.position)
      camera.position.copy(cameraPosition)
      camera.lookAt(gliderState.position)

      renderer.render(scene, camera)
    }

    // Start rendering the scene
    render()
  }, [])
  return <div />
}
