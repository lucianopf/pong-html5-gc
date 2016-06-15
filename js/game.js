// Variáveis da cena
var renderer
var scene
var camera
var pointLight
var spotLight

// Variáveis do campo
var fieldWidth = 400
var fieldHeight = 200

// Variáveis das barras do jogadores
var paddleWidth
var paddleHeight
var paddleDepth
var paddleQuality
var paddle1DirY = 0
var paddle2DirY = 0
var paddleSpeed = 3

// Variável da bola
var ball
var paddle1
var paddle2
var ballDirX = 1
var ballDirY = 1
var ballSpeed = 2

// Variáveis relacionadas com o jogo
var score1 = 0
var score2 = 0
// Valor de pontos para acabar o jogo (OBS:. valor alterrado para qualquer inteiro positivo)
var maxScore = 7

// Dificuldade (OBS:. valor de 0 a 1)
var difficulty = 0.2

function init () {
  // Exibe o placar maximo para o fim do jogo
  document.getElementById('winnerBoard').innerHTML = 'Faça ' + maxScore + ' primeiro e ganhe!'
  score1 = 0
  score2 = 0
  // Configura todos os objetos 3D na cena
  createScene()
  draw()
}

function createScene () {
  // Defini o tamanho da cena
  var WIDTH = 640
  var HEIGHT = 360
  // Atributos da câmera
  var VIEW_ANGLE = 60
  var ASPECT = WIDTH / HEIGHT
  var NEAR = 0.1
  var FAR = 10000

  var c = document.getElementById('gameCanvas')

  // Cria um WebGL renderer, câmera e uma cena
  renderer = new THREE.WebGLRenderer()
  camera =
    new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR)

  scene = new THREE.Scene()

  // Adiciona a câmera para a cena
  scene.add(camera)

  // Define uma posição predefinida para a câmara
  camera.position.z = 320

  // Iniciar o Renderizador
  renderer.setSize(WIDTH, HEIGHT)

  // TODO
  c.appendChild(renderer.domElement)

  // Configura o plano de superfície de jogo 
  var planeWidth = fieldWidth
  var planeHeight = fieldHeight
  var planeQuality = 10

  // Cria o material da barra do player1
  var paddle1Material = new THREE.MeshLambertMaterial(
    {
      color: 0x1B32C0
    })
  // Cria o material da barra do player2
  var paddle2Material =
  new THREE.MeshLambertMaterial(
    {
      color: 0xFF4045
    })
  // Cria o material TODO	
  var planeMaterial =
  new THREE.MeshLambertMaterial(
    {
      color: 0x4BD121
    })
  // Cria o material da mesa
  var tableMaterial =
  new THREE.MeshLambertMaterial(
    {
      color: 0x111111
    })
  // Cria o material dos pilares TODO
//   var pillarMaterial =
//   new THREE.MeshLambertMaterial(
//     {
//       color: 0x534d0d
//     })
  // Cria o material do solo
  var groundMaterial =
  new THREE.MeshLambertMaterial(
    {
      color: 0x000000
    })

  // Plano de superficie do jogo
  var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(
      planeWidth * 0.95, // 95% da largura da tabela, uma vez que queremos mostrar onde a bola vai para fora da quadra
      planeHeight,
      planeQuality,
      planeQuality),
	planeMaterial)

  scene.add(plane)
  plane.receiveShadow = true

  var table = new THREE.Mesh(
    new THREE.CubeGeometry(
      planeWidth * 1.05, // Cria a sensação de uma mesa de bilhar, com um forro
      planeHeight * 1.03,
      100, // Uma profundidade arbitrária, já que câmera não pode ver muito de qualquer maneira
      planeQuality,
      planeQuality,
      1),

    tableMaterial)
  table.position.z = -51; // A mesa foi afundada 50 unidades. O adicional 1 é de modo que o plano pode ser visto
  scene.add(table)
  table.receiveShadow = true
  // Configura as variaveis da esfera
  // 'segment' and 'ring' valores para aumento de desempenho
  var radius = 5
  var segments = 6
  var rings = 6
  // // Cria o material da esfera
  var sphereMaterial =
  new THREE.MeshLambertMaterial(
    {
      color: 0xD43001
    })
  // Cria uma bola esferica
  ball = new THREE.Mesh(
    new THREE.SphereGeometry(
      radius,
      segments,
      rings),
    sphereMaterial)
  // Adiciona a esfera a cena
  scene.add(ball)
  ball.position.x = 0
  ball.position.y = 0
  // Incere a bola acima da superfície da mesa 
  ball.position.z = radius
  ball.receiveShadow = true
  ball.castShadow = true
  // Configura as variaveis das barras dos player's
  paddleWidth = 10
  paddleHeight = 30
  paddleDepth = 10
  paddleQuality = 1
  paddle1 = new THREE.Mesh(
    new THREE.CubeGeometry(
      paddleWidth,
      paddleHeight,
      paddleDepth,
      paddleQuality,
      paddleQuality,
      paddleQuality),
    paddle1Material)

  // // Adiciona a barra do player1 a cena
  scene.add(paddle1)
  paddle1.receiveShadow = true
  paddle1.castShadow = true

  paddle2 = new THREE.Mesh(
    new THREE.CubeGeometry(
      paddleWidth,
      paddleHeight,
      paddleDepth,
      paddleQuality,
      paddleQuality,
      paddleQuality),
    paddle2Material)
  // // Adiciona a barra do player2 a cena
  scene.add(paddle2)
  paddle2.receiveShadow = true
  paddle2.castShadow = true
  // Possição de cada barras do lado da mesa 
  paddle1.position.x = -fieldWidth / 2 + paddleWidth
  paddle2.position.x = fieldWidth / 2 - paddleWidth

  // lift paddles over playing surface TODO
  paddle1.position.z = paddleDepth
  paddle2.position.z = paddleDepth

  // Finalmente, terminada a adição do plano de terra para mostrar as sombras
  var ground = new THREE.Mesh(

    new THREE.CubeGeometry(
      1000,
      1000,
      3,
      1,
      1,
      1),

    groundMaterial)
  // Defini terreno para a posição z arbitrária para melhor mostrar o sombreamento
  ground.position.z = -132
  ground.receiveShadow = true
  scene.add(ground)

  // // Cria um ponto de luz
  pointLight =
    new THREE.PointLight(0xF8D898)

  // Define sua posição
  pointLight.position.x = -1000
  pointLight.position.y = 0
  pointLight.position.z = 1000
  pointLight.intensity = 2.9
  pointLight.distance = 10000
  // Adiciona a cena
  scene.add(pointLight)

  // Adiciona um holofote
  spotLight = new THREE.SpotLight(0xF8D898)
  spotLight.position.set(0, 0, 460)
  spotLight.intensity = 1.5
  spotLight.castShadow = true
  scene.add(spotLight)

  // MAGIC SHADOW CREATOR DELUXE EDITION com luz PackTM DLC
  renderer.shadowMapEnabled = true
}

function draw () {
  // Desenha a cena THREE.JS
  renderer.render(scene, camera)
  // loop
  requestAnimationFrame(draw)

  ballPhysics()
  paddlePhysics()
  cameraPhysics()
  playerPaddleMovement()
  opponentPaddleMovement()
}

function ballPhysics () {
  // if ball goes off the 'left' side (Player's side)
  if (ball.position.x <= -fieldWidth / 2) {
    // CPU scores
    score2++
    // update scoreboard HTML
    document.getElementById('scores').innerHTML = score1 + '-' + score2
    // reset ball to center
    resetBall(2)
    matchScoreCheck()
  }

  // if ball goes off the 'right' side (CPU's side)
  if (ball.position.x >= fieldWidth / 2) {
    // Player scores
    score1++
    // update scoreboard HTML
    document.getElementById('scores').innerHTML = score1 + '-' + score2
    // reset ball to center
    resetBall(1)
    matchScoreCheck()
  }

  // if ball goes off the top side (side of table)
  if (ball.position.y <= -fieldHeight / 2) {
    ballDirY = -ballDirY
  }
  // if ball goes off the bottom side (side of table)
  if (ball.position.y >= fieldHeight / 2) {
    ballDirY = -ballDirY
  }

  // update ball position over time
  ball.position.x += ballDirX * ballSpeed
  ball.position.y += ballDirY * ballSpeed

  // limit ball's y-speed to 2x the x-speed
  // this is so the ball doesn't speed from left to right super fast
  // keeps game playable for humans
  if (ballDirY > ballSpeed * 2) {
    ballDirY = ballSpeed * 2
  }
  else if (ballDirY < -ballSpeed * 2) {
    ballDirY = -ballSpeed * 2
  }
}

// Handles CPU paddle movement and logic
function opponentPaddleMovement () {
  // Lerp towards the ball on the y plane
  paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty

  // in case the Lerp function produces a value above max paddle speed, we clamp it
  if (Math.abs(paddle2DirY) <= paddleSpeed) {
    paddle2.position.y += paddle2DirY
  }
  // if the lerp value is too high, we have to limit speed to paddleSpeed
  else {
    // if paddle is lerping in +ve direction
    if (paddle2DirY > paddleSpeed) {
      paddle2.position.y += paddleSpeed
    }
    // if paddle is lerping in -ve direction
    else if (paddle2DirY < -paddleSpeed) {
      paddle2.position.y -= paddleSpeed
    }
  }
  // We lerp the scale back to 1
  // this is done because we stretch the paddle at some points
  // stretching is done when paddle touches side of table and when paddle hits ball
  // by doing this here, we ensure paddle always comes back to default size
  paddle2.scale.y += (1 - paddle2.scale.y) * 0.2
}

// Handles player's paddle movement
function playerPaddleMovement () {
  // move left
  if (Key.isDown(Key.A)) {
    // if paddle is not touching the side of table
    // we move
    if (paddle1.position.y < fieldHeight * 0.45) {
      paddle1DirY = paddleSpeed * 0.5
    }
    // else we don't move and stretch the paddle
    // to indicate we can't move
    else {
      paddle1DirY = 0
      paddle1.scale.z += (10 - paddle1.scale.z) * 0.2
    }
  }
  // move right
  else if (Key.isDown(Key.D)) {
    // if paddle is not touching the side of table
    // we move
    if (paddle1.position.y > -fieldHeight * 0.45) {
      paddle1DirY = -paddleSpeed * 0.5
    }
    // else we don't move and stretch the paddle
    // to indicate we can't move
    else {
      paddle1DirY = 0
      paddle1.scale.z += (10 - paddle1.scale.z) * 0.2
    }
  }
  // else don't move paddle
  else {
    // stop the paddle
    paddle1DirY = 0
  }

  paddle1.scale.y += (1 - paddle1.scale.y) * 0.2
  paddle1.scale.z += (1 - paddle1.scale.z) * 0.2
  paddle1.position.y += paddle1DirY
}

// Handles camera and lighting logic
function cameraPhysics () {
  // we can easily notice shadows if we dynamically move lights during the game
  spotLight.position.x = ball.position.x * 2
  spotLight.position.y = ball.position.y * 2

  // move to behind the player's paddle
  camera.position.x = paddle1.position.x - 100
  camera.position.y += (paddle1.position.y - camera.position.y) * 0.05
  camera.position.z = paddle1.position.z + 100 + 0.04 * (-ball.position.x + paddle1.position.x)

  // rotate to face towards the opponent
  camera.rotation.x = -0.01 * (ball.position.y) * Math.PI / 180
  camera.rotation.y = -60 * Math.PI / 180
  camera.rotation.z = -90 * Math.PI / 180
}

// Handles paddle collision logic
function paddlePhysics () {
  // PLAYER PADDLE LOGIC

  // if ball is aligned with paddle1 on x plane
  // remember the position is the CENTER of the object
  // we only check between the front and the middle of the paddle (one-way collision)
  if (ball.position.x <= paddle1.position.x + paddleWidth && ball.position.x >= paddle1.position.x) {
    // and if ball is aligned with paddle1 on y plane
    if (ball.position.y <= paddle1.position.y + paddleHeight / 2 && ball.position.y >= paddle1.position.y - paddleHeight / 2) {
      // and if ball is travelling towards player (-ve direction)
      if (ballDirX < 0) {
        // stretch the paddle to indicate a hit
        paddle1.scale.y = 15
        // switch direction of ball travel to create bounce
        ballDirX = -ballDirX
        // we impact ball angle when hitting it
        // this is not realistic physics, just spices up the gameplay
        // allows you to 'slice' the ball to beat the opponent
        ballDirY -= paddle1DirY * 0.7
      }
    }
  }

  // OPPONENT PADDLE LOGIC	

  // if ball is aligned with paddle2 on x plane
  // remember the position is the CENTER of the object
  // we only check between the front and the middle of the paddle (one-way collision)
  if (ball.position.x <= paddle2.position.x + paddleWidth && ball.position.x >= paddle2.position.x) {
    // and if ball is aligned with paddle2 on y plane
    if (ball.position.y <= paddle2.position.y + paddleHeight / 2 && ball.position.y >= paddle2.position.y - paddleHeight / 2) {
      // and if ball is travelling towards opponent (+ve direction)
      if (ballDirX > 0) {
        // stretch the paddle to indicate a hit
        paddle2.scale.y = 15
        // switch direction of ball travel to create bounce
        ballDirX = -ballDirX
        // we impact ball angle when hitting it
        // this is not realistic physics, just spices up the gameplay
        // allows you to 'slice' the ball to beat the opponent
        ballDirY -= paddle2DirY * 0.7
      }
    }
  }
}

function resetBall (loser) {
  // position the ball in the center of the table
  ball.position.x = 0
  ball.position.y = 0

  // if player lost the last point, we send the ball to opponent
  if (loser == 1) {
    ballDirX = -1
  }
  // else if opponent lost, we send ball to player
  else {
    ballDirX = 1
  }

  // set the ball to move +ve in y plane (towards left from the camera)
  ballDirY = 1
}

var bounceTime = 0
// checks if either player or opponent has reached 7 points
function matchScoreCheck () {
  // if player has 7 points
  if (score1 >= maxScore) {
    // stop the ball
    ballSpeed = 0
    // write to the banner
    document.getElementById('scores').innerHTML = 'Player wins!'
    document.getElementById('winnerBoard').innerHTML = 'Refresh to play again'
    // make paddle bounce up and down
    bounceTime++
    paddle1.position.z = Math.sin(bounceTime * 0.1) * 10
    // enlarge and squish paddle to emulate joy
    paddle1.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10
    paddle1.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10
  }
  // else if opponent has 7 points
  else if (score2 >= maxScore) {
    // stop the ball
    ballSpeed = 0
    // write to the banner
    document.getElementById('scores').innerHTML = 'CPU wins!'
    document.getElementById('winnerBoard').innerHTML = 'Refresh to play again'
    // make paddle bounce up and down
    bounceTime++
    paddle2.position.z = Math.sin(bounceTime * 0.1) * 10
    // enlarge and squish paddle to emulate joy
    paddle2.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10
    paddle2.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10
  }
}
