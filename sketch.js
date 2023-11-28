/*
Taneim Miah
Creative Coding Final
*/
/*
Idea:
- Fishing game 
    - Start Screen
    - Audio Slider (maybe)
    - Main area is aquarium
        - in the aquarium zone you get to see all of the fishes you caught swimming around
        - Button to move to different areas (this button will be shown in all locations)
    - Different areas
        - you can fish in the various locations
        - 3 fishes per location
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
    constructor(x, y, w, h, func){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.func = func;
    }
    display(){
        push();
        
        if(mouseX > this.x && mouseX < this.x + this.w
            && mouseY > this.y && mouseY < this.y + this.h){
            this.isHovering = true;
            fill("#2667ff");
            rect(this.x,
                this.y,
                this.w,
                this.h, 20);
        } else {
            this.isHovering = false;
            fill("#759fff");
            rect(this.x,
                this.y,
                this.w,
                this.h, 20);
        }

        if(this.isHovering && mouseIsPressed){
            this.func();
        }
        pop();
    }

}

//scenes
var current_scene = 2; //StartScene, Aquarium, Lake, Volcano, Sky

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
var sceneSwitchButton;
var AquariumButton, LakeButton, VolcanoButton, SkyButton;

var col = "#030b1f";

//hold all of the fishes in a list
var aquariumFishies = [];
var lakeFishies = [];
var volcanoFishies = [];
var skyFishies = [];

function setup() {
    createCanvas(800, 600);
    noStroke();
    sceneSwitchButton
     = new Button(width-20-60,20,60,30,sceneSwitchFunction);
}
  
function draw() {
    background(col);

    var hoveringButton = checkIfButtonIsHovered(); //so that an interaction doesn't happen by accident
    

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
            sceneSwitchButton.display();
            break;
        case 2: // LAKE
            
            
            drawLakeBG();
            drawFisher();
            for(i = 0; i < lakeFishies.length; i++){
                lakeFishies.display();
            }

            drawLakeFG();


            //UI
            sceneSwitchButton.display();
            break;
        case 3: // VOLCANO


            //UI
            sceneSwitchButton.display();
            
            break;
        case 4: // SKY


            //UI
            sceneSwitchButton.display();
            
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

function checkIfButtonIsHovered(){ //checks if any button is hovered
    return sceneSwitchButton.isHovering 
        || AquariumButton.isHovering 
        || LakeButton.isHovering 
        || VolcanoButton.isHovering 
        || SkyButton.isHovering;
}

function sceneSwitchFunction(){

}

function drawAquariumBG(){
    //function to draw the aquarium background
    background()
}
function drawAquariumFG(){
    //function to draw the aquarium foreground
}

function drawFisher(){
    //fisher + hook
}

function drawLakeBG(){

}
function drawLakeFG(){

}

function keyPressed(){

}


