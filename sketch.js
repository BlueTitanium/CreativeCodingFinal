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

https://howlerjs.com/ maybe use this as a sound library
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




class Fisher{
    x = width-50;
    y = 220;

    fisherSprite;
    fishingHookSprite;
    hookStartPosX;
    hookStartPosY;
    fishingRodY;

    fishingHookState = 0; //0 -> start pos, 1 -> charging, 2 -> launched, 3 -> in water (should be reeled in)

    maxCharge = 10;
    curCharge = 0;

    nextRot = 0;
    shakeAmt = 0;

    constructor(){
        this.fisherSprite = new Sprite(0, 0, 50, 50, 'none');
        this.fisherSprite.image = 'assets/catfish2.png'; //drew this myself
        this.fisherSprite.scale = .12;
        this.fisherSprite.autoDraw = false;
        this.fisherSprite.autoUpdate = false;

        this.hookStartPosX= -135;
        this.hookStartPosY= -60;
        this.fishingRodX = -135;
        this.fishingRodY = -70;
        this.fishingHookSprite = new Sprite(this.hookStartPosX,this.hookStartPosY,20,20);
        this.fishingHookSprite.overlaps(allSprites);
        this.fishingHookSprite.image = 'assets/fishinghook.png'; //drew this myself
        this.fishingHookSprite.autoDraw = false;
        this.fishingHookSprite.autoUpdate = false;
    }
    reset(){
        this.nextRot = 0;
        this.shakeAmt = 0;
        this.fishingHookSprite.x = this.hookStartPosX;
        this.fishingHookSprite.y = this.hookStartPosY;
        this.fishingHookSprite.vel.x = 0;
        this.fishingHookSprite.vel.y = 0;
        this.fishingHookState = 0;
    }
    display(){
        push();
        translate(this.x,this.y);
        switch (current_game_state) {//no fishing game, fishing game start, fishing game, fishing game end
            case 0: //no fishing game
                switch (fisher.fishingHookState) {//0 -> start pos, 1 -> charging, 2 -> launched, 3 -> in water (should be reeled in)
                    case 0: // start pos
                        this.fishingHookSprite.x = lerp(this.fishingHookSprite.x, this.hookStartPosX,.1);
                        this.fishingHookSprite.y = lerp(this.fishingHookSprite.y, this.hookStartPosY,.1);
                        this.nextRot = lerp(this.nextRot, 0, .1);
                        this.shakeAmt = lerp(this.shakeAmt,0,.1);
                        break;
                    case 1: //charging 
                        if(mouseIsPressed){
                            if(this.curCharge < this.maxCharge){
                                this.curCharge+=.1;
                                console.log(this.curCharge);
                            } else {
                                this.curCharge = this.maxCharge;
                            }
                            this.nextRot = map(this.curCharge, 0, this.maxCharge, 0, 10);
                            this.shakeAmt = map(this.curCharge, 0, this.maxCharge, 0, 2);
                            translate(random(-1,1)*this.shakeAmt,random(-1,1)*this.shakeAmt);
                        }
                        break;
                    case 2: //launched 
                        this.nextRot = lerp(this.nextRot, 0, .1);
                        this.fishingHookSprite.applyForce(0,4);
                        if(this.fishingHookSprite.y > waterHeight-this.y){
                            this.fishingHookSprite.vel.x = 0;
                            this.fishingHookState=3;
                        }
                        break;
                    case 3: //in the water 
                        if(mouseIsPressed){
                            this.fishingHookSprite.vel.y = 0;
                            this.fishingHookSprite.moveTo(this.hookStartPosX,this.hookStartPosY,2);
                            this.shakeAmt = lerp(this.shakeAmt,1,.01);
                            translate(random(-1,1)*this.shakeAmt,random(-1,1)*this.shakeAmt);
                            //this.fishingHookSprite.x = lerp(this.fishingHookSprite.x, this.hookStartPosX,.01);
                            //this.fishingHookSprite.y = lerp(this.fishingHookSprite.y, this.hookStartPosY,.01);
                        }else{
                            this.nextRot = lerp(this.nextRot, 0, .1);
                            this.shakeAmt = lerp(this.shakeAmt,0,.1);
                            this.fishingHookSprite.vel.x = 0;
                            if(this.fishingHookSprite.y > height - this.y){
                                this.fishingHookSprite.vel.y = 0;
                            } else {
                                this.fishingHookSprite.vel.y = 1;
                            }
                            
                        }
                        if(this.fishingHookSprite.y < waterHeight-this.y){
                            this.fishingHookSprite.vel.x = 0;
                            this.fishingHookSprite.vel.y = 0;
                            this.fishingHookState = 0;
                        }
                        break;
                    default:
                        break;
                }
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
        
        rotate(this.nextRot);
        //show character in boat
        //show fishing hook, should be a line from fishing pole to hook
        this.fisherSprite.draw();
        this.fisherSprite.update();
        
        fill('#FFFFFF');
        stroke('#FFFFFF');
        line(this.fishingHookSprite.x, this.fishingHookSprite.y, this.hookStartPosX,this.fishingRodY);
        
        this.fishingHookSprite.draw();
        this.fishingHookSprite.update();

        pop();
    }
    launch(){
        this.fishingHookSprite.vel.x = map(this.curCharge, 0, this.maxCharge, 0, -6);
        this.fishingHookSprite.vel.y = map(this.curCharge, 0, this.maxCharge, 0, -5.5);
        this.fishingHookState+=1;
        this.curCharge = 0;
    }
}

class Fish {
    fishSprite;
    origY;
    constructor(x, y, id, lBound, rBound, spd = 3){
        this.fishSprite = new Sprite(x,y,90,40,'kinematic');
        this.id = id;
        this.origY = y;
        if(fishiesCaptured[id]){
            this.fishSprite.image = actualFishies[id];
        } else {
            this.fishSprite.image = silhouetteFishies[id];
        }
        this.lBound = lBound; //to have a left limit
        this.rBound = rBound; //to have a right limit
        this.fishSprite.autoDraw = false;
        this.fishSprite.autoUpdate = false;
        this.spd = spd;
        var rand = random(0,1);
        if(rand < .5){
            this.fishSprite.vel.x = spd;
            this.fishSprite.mirror.x=true;
        } else {
            this.fishSprite.vel.x = -spd;
            this.fishSprite.mirror.x=false;
        }
    }
    display(){
        this.fishSprite.draw();
        this.fishSprite.update();

        //if close to fishing hook position, move to that
        if(fisher.fishingHookState==3
        && (abs(fisher.fishingHookSprite.x+fisher.x - this.fishSprite.x) < 80
        && abs(fisher.fishingHookSprite.y+fisher.y - this.fishSprite.y) < 80)){
            this.fishSprite.moveTo(fisher.fishingHookSprite.x+fisher.x,fisher.fishingHookSprite.y+fisher.y,this.spd);
        } else {
            if(abs(this.fishSprite.vel.x) <this.spd){
                var rand = random(0,1);
                if(rand < .5){
                    this.fishSprite.vel.x = this.spd;
                } else {
                    this.fishSprite.vel.x = -this.spd;
                }
            }
            //move left and right 
            if(this.fishSprite.x < this.lBound){
                this.fishSprite.vel.x = this.spd;
            }
            if(this.fishSprite.x > this.rBound){
                this.fishSprite.vel.x = -this.spd;
            }
            this.fishSprite.vel.y = 0;
            
            //this.fishSprite.y = lerp(this.fishSprite.y,this.origY,.05);
            this.fishSprite.moveTo(this.fishSprite.x,this.origY,this.spd)
        }

        //if touching a fishing hook, start minigame
        if(fisher.fishingHookState==3
            && (abs(fisher.fishingHookSprite.x+fisher.x - this.fishSprite.x) < 10
            && abs(fisher.fishingHookSprite.y+fisher.y - this.fishSprite.y) < 10)){
            //START
            
        }
        
        if(this.fishSprite.vel.x < 0){
            this.fishSprite.mirror.x=false;
        } else {
            this.fishSprite.mirror.x=true;
        }
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

//fish images
var silhouetteFishies = [
    "assets/FISH/S_Fish1.png",
    "assets/FISH/S_Fish2.png",
    "assets/FISH/S_Fish3.png",
    "assets/FISH/S_Fish1Lava.png",
    "assets/FISH/S_Fish2Lava.png",
    "assets/FISH/S_Fish3Lava.png",
    "assets/FISH/S_Fish1Sky.png",
    "assets/FISH/S_Fish2Sky.png",
    "assets/FISH/S_Fish3Sky.png"
]
var actualFishies = [
    "assets/FISH/Fish1.png",
    "assets/FISH/Fish2.png",
    "assets/FISH/Fish3.png",
    "assets/FISH/Fish1Lava.png",
    "assets/FISH/Fish2Lava.png",
    "assets/FISH/Fish3Lava.png",
    "assets/FISH/Fish1Sky.png",
    "assets/FISH/Fish2Sky.png",
    "assets/FISH/Fish3Sky.png"
]
//id based
var fishiesCaptured = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
]


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
var hoveringButton = false;

//hold all of the fishes in a list
var aquariumFishies = [];
var lakeFishies = [];
var volcanoFishies = [];
var skyFishies = [];

var fnt;//RALEWAY From google fonts

var fisher;//fisherman object



var waterHeight= 230;

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

    fisher = new Fisher();
}
  
function draw() {
    background(col);

    hoveringButton = checkIfButtonIsHovered();
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
            for(i = 0; i < aquariumFishies.length; i++){
                aquariumFishies[i].display();
            }
            drawAquariumFG();
            //UI
            
            drawUIButtons();
            break;
        case 2: // LAKE
            
            
            drawLakeBG();
            drawFisher();
            for(i = 0; i < lakeFishies.length; i++){
                lakeFishies[i].display();
            }

            drawLakeFG();
            //UI
            
            drawUIButtons();
            break;
        case 3: // VOLCANO
            drawVolcanoBG();
            drawFisher();
            for(i = 0; i < volcanoFishies.length; i++){
                volcanoFishies[i].display();
            }


            //UI
            
            drawUIButtons();
            break;
        case 4: // SKY
            drawSkyBG();
            drawFisher();
            for(i = 0; i < skyFishies.length; i++){
                skyFishies[i].display();
            }
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
    fisher.reset();
}
function GoToLake(){
    disableAllButtonActive()
    LakeButton.isActive = true;
    current_scene = 2;
    fisher.reset();
    spawnLakeFishies();
}
function spawnLakeFishies(){//IDS 0-2
    lakeFishies.forEach(element => {
        element.fishSprite.remove();
    });
    lakeFishies = [];
    var startIndex = 0;
    for(i = startIndex; i < startIndex+3; i++){
        var variation = random(240,600);
        var randLBound = random(0,width-120-variation);
        var randX = random(randLBound,randLBound+variation);
        var randY = random(waterHeight+50,height);
        lakeFishies.push(new Fish(randX,randY,i,randLBound,randLBound+variation,random(.5,1)));
    }
}

function GoToVolcano(){
    disableAllButtonActive()
    VolcanoButton.isActive = true;
    current_scene = 3;
    fisher.reset();
    spawnVolcanoFishies();
}
function spawnVolcanoFishies(){//IDS 3-5
    volcanoFishies.forEach(element => {
        element.fishSprite.remove();
    });
    volcanoFishies = [];
    var startIndex = 3;
    for(i = startIndex; i < startIndex+3; i++){
        var variation = random(240,600);
        var randLBound = random(0,width-120-variation);
        var randX = random(randLBound,randLBound+variation);
        var randY = random(waterHeight+50,height);
        volcanoFishies.push(new Fish(randX,randY,i,randLBound,randLBound+variation,random(1.5,2.5)));
    }
}

function GoToSky(){
    disableAllButtonActive()
    SkyButton.isActive = true;
    current_scene = 4;
    fisher.reset();
    spawnSkyFishies();
}
function spawnSkyFishies(){//IDS 6-8
    skyFishies.forEach(element => {
        element.fishSprite.remove();
    });
    skyFishies = [];
    var startIndex = 6;
    for(i = startIndex; i < startIndex+3; i++){
        var variation = random(240,600);
        var randLBound = random(0,width-120-variation);
        var randX = random(randLBound,randLBound+variation);
        var randY = random(waterHeight+50,height);
        skyFishies.push(new Fish(randX,randY,i,randLBound,randLBound+variation,random(2.5,3.5)));
    }
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
    fisher.display();
}

function drawLakeBG(){
    background("#87CEEB");
    fill("#175982");
    rect(0,waterHeight,width,height-waterHeight);
}
function drawLakeFG(){
}

function drawVolcanoBG(){
    background("#793d33");
    fill("#ff441f");
    rect(0,waterHeight,width,height-waterHeight);
}
function drawVolcanoFG(){

}

function drawSkyBG(){
    background("#c1ded0");
    //TODO CHANGE 
    fill("#9bb5c4");
    rect(0,waterHeight,width,height-waterHeight);
}
function drawSkyFG(){

}

function mousePressed(){
    if((current_scene!=0 && current_scene!=1) && !hoveringButton){
        switch (current_game_state) {//no fishing game, fishing game start, fishing game, fishing game end
            case 0: //no fishing game
                switch (fisher.fishingHookState) {//0 -> start pos, 1 -> charging, 2 -> launched, 3 -> in water (should be reeled in)
                    case 0: // start pos (ready to charge)
                        fisher.fishingHookState+=1;
                        break;
                    case 1: //charging (the mouse should not be pressed while charging because it needs to be held)
                        
                        break;
                    case 2: //launched (the mouse click shouldn't do anything while it is traveling in the air)
                        
                        break;
                    case 3: //in the water (mouse click should bring the reel closer to the start position)
                        fisher.isReeling = true;
                        break;
                    default:
                        break;
                }
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
}

function mouseReleased(){
    if(current_scene!=0 || current_scene!=1){
        switch (current_game_state) {//no fishing game, fishing game start, fishing game, fishing game end
            case 0: //no fishing game
                switch (fisher.fishingHookState) {//0 -> start pos, 1 -> charging, 2 -> launched, 3 -> in water (should be reeled in)
                    case 0: //start pos (wouldnt release at this point)

                        break;
                    case 1: //charging (when release, launch)
                        fisher.launch();
                        break;
                    case 2: //launched (the mouse click shouldn't do anything while it is traveling in the air)
                        
                        break;
                    case 3: //mouse release doesn't do anything while reeling in the hook
                        
                        break;
                    default:
                        break;
                }
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
}

