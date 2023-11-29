/*
Taneim Miah
Creative Coding Final
*/
/*
Idea:
- Fishing game 
    - Start Screen (maybe I'll make the start screen the same as the aquarium)
    - Audio Slider (maybe)
    - Main area is aquarium
        - in the aquarium zone you get to see all of the fishes you caught swimming around
        - Button to move to different areas (this button will be shown in all locations)
    - Different areas
        - you can fish in the various locations
        - 1-3 fishes per location
        - Regular Lake
        - Magma
        - Clouds (sky)
    - Fishing mechanic 
        - sideview
        - You can see silhouettes of fishes as they swim around
        - You can shoot your fishing hook to the mouse position at the top of the water OR shoot the fishing hook based on how long the mouse is clicked, charge-based
        - the hook sinks down with gravity
        - hold left-click to reel in the hook
        - When a fish touches the hook, the minigame starts
            - the minigame is like how stardew valley works
            - there is a bar and the fish moves up and down the bar and you need to make your bar keep the fish inside the bar within the time limit. Left click to make your bar go up and don't click to let it fall.
            - Once the fish is inside the bar during the time limit, you end the minigame and capture the fish successfully!
*/
/*
Technical Goals
    At least one class with a constructor and a method (25 points total)
        Constructor (10 points) 
        Method (15 points)
        These must be used/incorporated into your project.
    Interactivity (25 points)
        In addition to other criteria in this project, interactivity will be graded on the following:
        Does it work?
        Does the interaction support the theme and/or 'make sense' in context of this project? 
    User Experience (10 points)
        Instructions for users must be displayed within the project (not the comments). Users should be able to understand how to interact with the piece by looking at the page/sketch.  
        Presentation of text and GUI objects (buttons, sliders, etc.) should be clear. Text should be legible. UI objects should be labeled.
    Style/Design (10 points)
        Do the style/design choices support the theme/goal of the project? Especially when needed, did the student discuss/contextualize their aesthetic choices?
        Points to consider: color choice, images/media that support the theme and/or "story", etc.
    Attention to Detail and Complexity (10 points)
        Project details will vary from project to project (ex. someone making a game will have very different goals from someone making a data visualization). However, for full points, projects should demonstrate some combination of attention to detail and complexity.
            For this category, attention to detail includes:
                Thoroughness (ex. Layering multiple functions of style for particular functions/classes and/or drawings)
                Creating a specific style for a particular condition that adds to the experience in a significant way (ex. Different sound effects and visual stylings based on an interaction)
            For this category, complexity includes:
                Having multiple stages of interactions (ex. stage 1...stage 2...stage 3...etc.)
                Having various conditions/possibilities for an interaction (ex. if else/else if/else if....nested if/else statements...etc.)
                Incorporating an external library/technology (ex. RiTaJS, ml5.js, etc.)
*/

class FishingRod{
    constructor(){

    }
    display(){
        
    }
}

class Fish {
    constructor(){

    }
    display(){
        
    }
}

class GameFish {
    constructor(){

    }
    display(){

    }
}

class Button {
    isHovering=false;
    isActive=false;
    constructor(x, y, w, h, func, text = "hi"){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.func = func;
        this.text = text;
        this.borderSize = 4;
    }
    display(){
        push();
        if(this.isActive){
            fill("#FF9800");
            rect(this.x-this.borderSize,
                this.y-this.borderSize,
                this.w+this.borderSize*2,
                this.h+this.borderSize*2, 20);
            fill("#3FAEC0");
            rect(this.x,
                    this.y,
                    this.w,
                    this.h, 20);
        } else if(mouseX > this.x && mouseX < this.x + this.w
            && mouseY > this.y && mouseY < this.y + this.h){
            this.isHovering = true;
            fill("#FF2667");
            rect(this.x-this.borderSize,
                this.y-this.borderSize,
                this.w+this.borderSize*2,
                this.h+this.borderSize*2, 20);
            fill("#2667ff");
            rect(this.x,
                this.y,
                this.w,
                this.h, 20);
            
        } else {
            this.isHovering = false;
            fill("#00133960");
            rect(this.x-this.borderSize,
                this.y-this.borderSize,
                this.w+this.borderSize*2,
                this.h+this.borderSize*2, 20);
            fill("#759fff");
            rect(this.x,
                this.y,
                this.w,
                this.h, 20);
                
        }
        fill("#FFFFFF");
        textSize(15);
        textAlign(CENTER, CENTER);
        text(this.text, this.x+this.w/2, this.y+this.h/2-2);
        if(this.isHovering && mouseIsPressed){
            this.func();
        }
        pop();
    }

}

//scenes
var current_scene = 1; //StartScene, Aquarium, Lake, Volcano, Sky

//minigame
var current_game_state = 0; //no fishing game, fishing game start, fishing game, fishing game end

//SCREEN UI alpha values to smoothly fade between scenes
var startAlpha = 0;
var sceneAlpha = 0;
var gameAlpha = 0;

//variables for the camera
var nextX = 0;
var nextY = 0;
var nextScale = 1;

//button variables
var AquariumButton, LakeButton, VolcanoButton, SkyButton;
var buttonWidth = 100;
var buttonSpacing = 20;
var startingX = 20;
var startingY = 20;
var col = "#030b1f";

//hold all of the fishes in a list
var aquariumFishies = [];
var lakeFishies = [];
var volcanoFishies = [];
var skyFishies = [];

var fnt;//RALEWAY From google fonts

function preload(){
    fnt = loadFont("assets/Raleway-SemiBold.ttf");
}

function setup() {
    createCanvas(800, 600);
    noStroke();
    textFont(fnt);
    AquariumButton = new Button(startingX + buttonWidth*0 + buttonSpacing*0,startingY,buttonWidth,30,GoToAquarium, "aquarium");
    LakeButton = new Button(startingX + buttonWidth*1 + buttonSpacing*1,startingY,buttonWidth,30,GoToLake, "lake");
    VolcanoButton = new Button(startingX + buttonWidth*2 + buttonSpacing*2,startingY,buttonWidth,30,GoToVolcano, "volcano");
    SkyButton = new Button(startingX + buttonWidth*3 + buttonSpacing*3,startingY,buttonWidth,30,GoToSky, "clouds");

    AquariumButton.isActive = true;
}
  
function draw() {
    background(col);

    var hoveringButton = checkIfButtonIsHovered(); //so that an interaction doesn't happen by accident
    if(hoveringButton){
        cursor('pointer');
    } else {
        cursor(ARROW);
    }

    switch (current_scene) {
        case 0: // START SCENE
            scale(nextScale);
            translate(nextX, nextY);

            //say something like click anywhere to start then smooth transition to aquarium
            if (mouseIsPressed === true) {
                current_scene = 1;
            }

            break;
        case 1: // AQUARIUM
            drawAquariumBG();
            for(i = 0; i < lakeFishies.length; i++){
                aquariumFishies.display();
            }
            drawAquariumFG();
            //UI
            
            drawUIButtons();
            break;
        case 2: // LAKE
            
            
            drawLakeBG();
            drawFisher();
            for(i = 0; i < lakeFishies.length; i++){
                lakeFishies.display();
            }

            drawLakeFG();


            //UI
            
            drawUIButtons();
            break;
        case 3: // VOLCANO
            drawVolcanoBG();

            //UI
            
            drawUIButtons();
            break;
        case 4: // SKY
            drawSkyBG();

            //UI
            
            drawUIButtons();
            break;
        default:
            break;
    }

    switch (current_game_state) {
        case 0: //no fishing game
            
            break;
        case 1: //fishing game start
            
            break;
        case 2: //fishing game
            
            break;
        case 3: //fishing game end
            
            break;
        default:
            break;
    }

}

function drawUIButtons(){
    push();
    fill("#181e36");
    rect(-25,-15,width*1.5,90,20);
    fill("#494e73");
    rect(-20,-20,startingX+20+buttonWidth*4+buttonSpacing*4,90,20);
    AquariumButton.display();
    LakeButton.display();
    VolcanoButton.display();
    SkyButton.display();

    
    textAlign(LEFT,BOTTOM);
    textSize(34);
    fill("#31485a");
    text("travel locations",startingX+22+buttonWidth*4+buttonSpacing*4,70/2+15);
    fill("#FFFFFF");
    text("travel locations",startingX+20+buttonWidth*4+buttonSpacing*4,70/2 +17);
    textAlign(LEFT,TOP);
    textSize(15);
    fill("#ffffffa1");
    text("click a button on the left to travel",startingX+20+buttonWidth*4+buttonSpacing*4,70/2+14);

    if(AquariumButton.isActive){
        fill("#ffffff41");
        textAlign(RIGHT,TOP);
        textSize(12);
        text("you can fish in the lake, volcano, and clouds!",startingX-20+buttonWidth*4+buttonSpacing*4,70/2+19);
    }
    pop();
}

function checkIfButtonIsHovered(){ //checks if any button is hovered
    return AquariumButton.isHovering 
        || LakeButton.isHovering 
        || VolcanoButton.isHovering 
        || SkyButton.isHovering;
}
function disableAllButtonActive(){
    AquariumButton.isActive=false;
    LakeButton.isActive=false;
    VolcanoButton.isActive=false;
    SkyButton.isActive=false;
    AquariumButton.isHovering=false;
    LakeButton.isHovering=false;
    VolcanoButton.isHovering=false;
    SkyButton.isHovering=false;
    cursor(ARROW);
}
function sceneSwitchFunction(){

}

function GoToAquarium(){
    disableAllButtonActive()
    AquariumButton.isActive = true;
    current_scene = 1;
}
function GoToLake(){
    disableAllButtonActive()
    LakeButton.isActive = true;
    current_scene = 2;
}
function GoToVolcano(){
    disableAllButtonActive()
    VolcanoButton.isActive = true;
    current_scene = 3;
}
function GoToSky(){
    disableAllButtonActive()
    SkyButton.isActive = true;
    current_scene = 4;
}


function drawAquariumBG(){
    //function to draw the aquarium background
    background("#001339");
    fill("#020b11");
    rect(0,220,width,height);
    fill("#175982");
    rect(10,230,width-20,height-230-10,20);
}
function drawAquariumFG(){
    //function to draw the aquarium foreground
}

function drawFisher(){
    //fisher + hook
}

function drawLakeBG(){
    background("#87CEEB");
}
function drawLakeFG(){

}

function drawVolcanoBG(){
    background("#36130d");
}
function drawVolcanoFG(){

}

function drawSkyBG(){
    background("#d5fdf4");
}
function drawSkyFG(){

}

function keyPressed(){

}


