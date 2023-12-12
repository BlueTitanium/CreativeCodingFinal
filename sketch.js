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



//fisher class that handles the game code for the fishercat and the fishing hook
class Fisher{
    x = width-50; //translate x
    y = 220;    //translate y

    isReeling = false; //reeling state to check if fish allowed to collide with hook
    fisherSprite; //fishercat sprite object
    fishingHookSprite; //fishing hook sprite object
    hookStartPosX; //original hook pos x
    hookStartPosY; //original hook pos y
    fishingRodY; //the fishing rod line height

    fishingHookState = 0; //0 -> start pos, 1 -> charging, 2 -> launched, 3 -> in water (should be reeled in)

    maxCharge = 10; //the max charge time allowed
    curCharge = 0; //the current charge time

    nextRot = 0; //the next rotation value
    shakeAmt = 0; //the shake amount for the fisher cat

    constructor(){
        //initialize the sprite
        this.fisherSprite = new Sprite(0, 0, 50, 50, 'none');
        this.fisherSprite.image = 'assets/catfish2.png'; //drew this myself
        this.fisherSprite.scale = .12;
        //we want to manually draw and update so the order is correct
        this.fisherSprite.autoDraw = false;
        this.fisherSprite.autoUpdate = false;

        //hook and fishing rod starting positions
        this.hookStartPosX= -135;
        this.hookStartPosY= -60;
        this.fishingRodX = -135;
        this.fishingRodY = -70;
        //initializing the sprite
        this.fishingHookSprite = new Sprite(this.hookStartPosX,this.hookStartPosY,20,20);
        //don't want to collide
        this.fishingHookSprite.overlaps(allSprites);
        this.fishingHookSprite.image = 'assets/fishinghook.png'; //drew this myself
        //we want to manually draw and update so the order is correct
        this.fishingHookSprite.autoDraw = false;
        this.fishingHookSprite.autoUpdate = false;
    }

    //reset function to bring all variables to the correct initial values
    reset(){
        this.nextRot = 0;
        this.shakeAmt = 0;
        this.fishingHookSprite.x = this.hookStartPosX;
        this.fishingHookSprite.y = this.hookStartPosY;
        this.fishingHookSprite.vel.x = 0;
        this.fishingHookSprite.vel.y = 0;
        this.isReeling = false;
        this.fishingHookState = 0;
        chargeSFX.stop();
    }
    //display function
    display(){
        push();
        //translate to the correct spot
        translate(this.x,this.y);
        switch (current_game_state) {//no fishing game, fishing game start, fishing game, fishing game end
            case 0: //no fishing game
                switch (fisher.fishingHookState) {//0 -> start pos, 1 -> charging, 2 -> launched, 3 -> in water (should be reeled in)
                    case 0: // start pos
                        //set all the values to the original positions smoothly
                        this.fishingHookSprite.x = lerp(this.fishingHookSprite.x, this.hookStartPosX,.1);
                        this.fishingHookSprite.y = lerp(this.fishingHookSprite.y, this.hookStartPosY,.1);
                        this.nextRot = lerp(this.nextRot, 0, .1);
                        this.shakeAmt = lerp(this.shakeAmt,0,.1);
                        this.fishingHookSprite.vel.x = 0;
                        this.fishingHookSprite.vel.y = 0;
                        this.isReeling = false;
                        //add text to the background showing how to play
                        var col = color('#0000006c');
                        fill(col);
                        textAlign(CENTER, TOP);
                        textSize(30);
                        text("hold left-click to charge", width/2-this.x, 100-this.y);
                        break;
                    case 1: //charging 
                        if(mouseIsPressed){
                            //charge the fishing rod till max charge
                            if(this.curCharge < this.maxCharge){
                                this.curCharge+=.1;
                                //console.log(this.curCharge);
                            } else {
                                this.curCharge = this.maxCharge;
                            }
                            //aesthetic changes to rotate and shake the cat
                            this.nextRot = map(this.curCharge, 0, this.maxCharge, 0, 10);
                            this.shakeAmt = map(this.curCharge, 0, this.maxCharge, 0, 2);
                            translate(random(-1,1)*this.shakeAmt,random(-1,1)*this.shakeAmt);
                            //have charging sfx get stronger the more you hold it
                            var chargeVol = map(this.curCharge, 0, this.maxCharge, 0.1, 0.3);
                            chargeSFX.volume(chargeVol);
                            //add text to the background showing how to play
                            var col = color('#0000006c');
                            fill(col);
                            textAlign(CENTER, TOP);
                            textSize(30);
                            text("let go of left-click to launch hook when ready", width/2-this.x, 100-this.y);
                        }
                        break;
                    case 2: //launched
                        //return the rotation back to normal
                        this.nextRot = lerp(this.nextRot, 0, .1);
                        //add a vertical force down to simulate gravity
                        this.fishingHookSprite.applyForce(0,4);
                        //once the fishing hook touches water, go to the next state
                        if(this.fishingHookSprite.y > waterHeight-this.y){
                            this.fishingHookSprite.vel.x = 0;
                            this.fishingHookState=3;
                            //play a sound effect
                            waterSFX.play();
                        }
                        //fun text
                        var col = color('#0000006c');
                        fill(col);
                        textAlign(CENTER, TOP);
                        textSize(30);
                        text("wheeeeeeeeeeeeeeeeeeeeeeeeeee", width/2-this.x, 100-this.y);
                        break;
                    case 3: //in the water 
                        if(mouseIsPressed){
                            //try to reel the hook back to the original position
                            this.fishingHookSprite.vel.y = 0;
                            this.fishingHookSprite.moveTo(this.hookStartPosX,this.hookStartPosY,2);
                            //shake the player when reeling back
                            this.shakeAmt = lerp(this.shakeAmt,1,.01);
                            translate(random(-1,1)*this.shakeAmt,random(-1,1)*this.shakeAmt);
                            //this.fishingHookSprite.x = lerp(this.fishingHookSprite.x, this.hookStartPosX,.01);
                            //this.fishingHookSprite.y = lerp(this.fishingHookSprite.y, this.hookStartPosY,.01);
                            //instructional text
                            var col = color('#0000006c');
                            fill(col);
                            textAlign(CENTER, TOP);
                            textSize(30);
                            text("try to make the fish touch your hook", width/2-this.x, 100-this.y);
                        }else{
                            //make the reel drop to the floor while not reeling
                            this.nextRot = lerp(this.nextRot, 0, .1);
                            this.shakeAmt = lerp(this.shakeAmt,0,.1);
                            this.fishingHookSprite.vel.x = 0;
                            if(this.fishingHookSprite.y > height - this.y){
                                this.fishingHookSprite.vel.y = 0;
                            } else {
                                this.fishingHookSprite.vel.y = 1;
                            }
                            //instructional text
                            var col = color('#0000006c');
                            fill(col);
                            textAlign(CENTER, TOP);
                            textSize(30);
                            text("hold left click to reel the hook in", width/2-this.x, 100-this.y);
                        }
                        //if the fishing hook is out of the water, go back to the original fishing hook state
                        if(this.fishingHookSprite.y < waterHeight-this.y){
                            this.fishingHookSprite.vel.x = 0;
                            this.fishingHookSprite.vel.y = 0;
                            this.fishingHookState = 0;
                            //stop the charging sfx
                            chargeSFX.stop();
                        }
                        break;
                    default:
                        break;
                }
                break;
            case 1: //fishing game start
                //dont move hook
                this.fishingHookSprite.vel.x = 0;
                this.fishingHookSprite.vel.y = 0;
                break;
            case 2: //fishing game
                //dont move hook
                this.fishingHookSprite.vel.x = 0;
                this.fishingHookSprite.vel.y = 0;
                break;
            case 3: //fishing game end
                //dont move hook
                this.fishingHookSprite.vel.x = 0;
                this.fishingHookSprite.vel.y = 0;
                break;
            default:
                break;
        }    
        //apply rotations
        rotate(this.nextRot);
        //show character in boat
        //show fishing hook, should be a line from fishing pole to hook
        this.fisherSprite.draw();
        this.fisherSprite.update();
         
        //show fishing line connecting fishing pole to hook
        fill('#FFFFFF');
        stroke('#FFFFFF');
        line(this.fishingHookSprite.x, this.fishingHookSprite.y, this.hookStartPosX,this.fishingRodY);
        
        //show fishing hook
        this.fishingHookSprite.draw();
        this.fishingHookSprite.update();

        pop();
    }
    launch(){
        //after finished charging
        //send the hook forward based on the charge
        this.fishingHookSprite.vel.x = map(this.curCharge, 0, this.maxCharge, 0, -6);
        this.fishingHookSprite.vel.y = map(this.curCharge, 0, this.maxCharge, 0, -5.5);
        //change states
        this.fishingHookState+=1;
        this.curCharge = 0;
        //play sfx
        launchSFX.play();
    }
}

//fish class for the lake, volcano, and clouds as they roam around
class Fish {
    //fish sprite
    fishSprite;
    //original height
    origY;
    //take a x,y pos, an id to determine the fish, lbound,rbound to determine how much it can roam, and spd value for speed
    constructor(x, y, id, lBound, rBound, spd = 3){
        //initialize  fishsprites to not have collisions
        this.fishSprite = new Sprite(x,y,90,40);
        this.fishSprite.overlaps(allSprites);
        //set id
        this.id = id;
        //set height
        this.origY = y;
        //if the fish is already captured, show the actual fish, otherwise show a silhouette
        if(fishiesCaptured[id]){
            this.fishSprite.image = actualFishies[id];
        } else {
            this.fishSprite.image = silhouetteFishies[id];
        }
        this.lBound = lBound; //to have a left limit
        this.rBound = rBound; //to have a right limit
        //manually draw the fish
        this.fishSprite.autoDraw = false;
        this.fishSprite.autoUpdate = false;
        //speed
        this.spd = spd;
        //determine a random direction to initially move in
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
        //draw and update fish logic
        this.fishSprite.draw();
        this.fishSprite.update();

        //if close to fishing hook position, move to that
        if(fisher.fishingHookState==3
        && (abs(fisher.fishingHookSprite.x+fisher.x - this.fishSprite.x) < 80
        && abs(fisher.fishingHookSprite.y+fisher.y - this.fishSprite.y) < 80)){
            this.fishSprite.moveTo(fisher.fishingHookSprite.x+fisher.x,fisher.fishingHookSprite.y+fisher.y,this.spd);
        } else {
            //otherwise move normally
            
            //if the speed is lower than normal, go back to a regular speed
            if(abs(this.fishSprite.vel.x) < abs(this.spd-.5)){
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
            //fill("#FFFFFF");
            //text(this.lBound, this.lBound,this.fishSprite.y);
            //text(this.rBound, this.rBound,this.fishSprite.y);
            
            
            //this.fishSprite.y = lerp(this.fishSprite.y,this.origY,.05);
            //if the fish sprite is not at the original height, return back to the original height
            if(this.fishSprite.y-this.origY>3){
                 this.fishSprite.vel.y = -1;
            } else if (this.fishSprite.y-this.origY<3){
                this.fishSprite.vel.y = 1;
            } else {
                this.fishSprite.vel.y = 0;
            }
        }

        //if touching a fishing hook, start minigame
        if(!fisher.isReeling && fisher.fishingHookState==3
            && (abs(fisher.fishingHookSprite.x+fisher.x - this.fishSprite.x) < 10
            && abs(fisher.fishingHookSprite.y+fisher.y - this.fishSprite.y) < 10)){
            //START
            gameFish.setID(this.id,this);
            current_game_state = 1;
            fisher.isReeling = true;
            allowGameClick = false;
            //allow a ui click after .5s to make sure no misclick
            setTimeout(function() { allowClick(); },500);
            //sound effect
            catchSFX.play();
        }
        //sprite mirroring depending on direction of fish
        if(this.fishSprite.vel.x < 0){
            this.fishSprite.mirror.x=false;
        } else {
            this.fishSprite.mirror.x=true;
        }
    }
}

//game fish class for the fishing minigame
class GameFish {
    //sprite for fish that moves up and down
    gameFishSprite;
    //sprite for fish that is displaying on a bigger scale
    fishSprite;
    //sprite for capturing square
    squareSprite;
    //id
    id;
    //current fish object
    obj;
    //top y value
    top;
    //bottom y value
    bot;
    //gravity
    accel = .2;
    //force to jump up with
    jumpForce = -4;
    //for fish movement
    randomTimeLeft = 0;
    spd = 1;
    constructor(id){
        
        //initialize fish sprite
        this.fishSprite = new Sprite((margin+fishingBoxWidth+gap)+(width-fishingBoxWidth-gap-margin*2)/2,
        (margin)+(height-margin*2)/2,
        90,40);
        //shouldnt have physics collisions
        this.fishSprite.overlaps(allSprites);
        //big sprite
        this.fishSprite.scale = 3;
        //manually draw
        this.fishSprite.autoDraw = false;
        this.fishSprite.autoUpdate = false;
        
        //square sprite
        this.squareSprite = new Sprite(margin+padding+(fishingBoxWidth-padding*2)/2,
        margin+padding+(height-margin*2-padding*2)/2,
        120,120);
        this.squareSprite.color = '#eb4034';
        //shouldnt have physics collisions
        this.squareSprite.overlaps(allSprites);
        //manually draw
        this.squareSprite.autoDraw = false;
        this.squareSprite.autoUpdate = false;

        //initialize game fish sprite
        this.gameFishSprite = new Sprite(margin+padding+(fishingBoxWidth-padding*2)/2,
        margin+padding+(height-margin*2-padding*2)/2,
        90,40);
        //shouldnt have physics collisions
        this.gameFishSprite.overlaps(allSprites);
        //manually draw
        this.gameFishSprite.autoDraw = false;
        this.gameFishSprite.autoUpdate = false;

        //call function to set id initially
        this.setID(id);
        //set the ceiling and floor for the game fish and square
        this.top = margin+padding;
        this.bot = margin+padding+height-margin*2-padding*2;
    }
    //set id and object value for the fish
    setID(id,obj){
        this.obj = obj;
        //resets values to be ready for a new game
        this.squareSprite.x = margin+padding+(fishingBoxWidth-padding*2)/2;
        this.squareSprite.y = margin+padding+(height-margin*2-padding*2)/2;
        this.gameFishSprite.x = margin+padding+(fishingBoxWidth-padding*2)/2;
        this.gameFishSprite.y = margin+padding+(height-margin*2-padding*2)/2;
        this.randomTimeLeft=0;

        //based on the fish id, if the fish is already capture it, show what it looks like, otherwise show the silhouette
        this.id = id;
        if(fishiesCaptured[id]){
            this.fishSprite.image = actualFishies[id];
            this.gameFishSprite.image = actualFishies[id];
        } else {
            this.fishSprite.image = silhouetteFishies[id];
            this.gameFishSprite.image = silhouetteFishies[id];
        }
    }
    //set just the image for the fish based on the id
    setIDImage(id){
        //based on the fish id, if the fish is already capture it, show what it looks like, otherwise show the silhouette
        this.id = id;
        if(fishiesCaptured[id]){
            this.fishSprite.image = actualFishies[id];
            this.gameFishSprite.image = actualFishies[id];
        } else {
            this.fishSprite.image = silhouetteFishies[id];
            this.gameFishSprite.image = silhouetteFishies[id];
        }
    }
    //jump function moves the square up using velocity and jumpforce
    jump(){
        this.squareSprite.vel.y = this.jumpForce;
    }
    //check capture function is run at the end of the minigame to check if the player won or failed
    checkCapture(){
        //if the gamefish is inside of the square sprite, that counts as a victory
        if(this.gameFishSprite.y < this.squareSprite.y + 60 &&
            this.gameFishSprite.y > this.squareSprite.y - 60){
                if(fishiesCaptured[this.id]){
                    //if already captured, set the game_results to that
                    game_results = 1;
                } else {
                    //if there is a new capture, set settings to reflect that
                    game_results = 0;
                    fishiesCaptured[this.id] = true;
                    this.setIDImage(this.id);
                }
                //if there is a fish associated with the game fish, remove it from the current scene (since you win the minigame)
                if(this.obj != null){
                    switch (current_scene) {
                        case 2://lake
                            var i = lakeFishies.indexOf(this.obj);
                            lakeFishies.splice(i,1);
                            
                            
                            break;
                        case 3://volcano
                            var i = volcanoFishies.indexOf(this.obj);
                            volcanoFishies.splice(i,1);
                            
                            
                            break;
                        case 4://sky
                            var i = skyFishies.indexOf(this.obj);
                            skyFishies.splice(i,1);

                            
                            break;
                        default:
                            break;
                    }
                }
                //victory sound effect
                victorySFX.play();
            } else {
                //otherwise, loss
                game_results = 2;
                //lose sound effect
                lossSFX.play();
            }
    }
    display(){
        //fade in and out based on overall minigame alpha
        tint(255,overallAlpha);
        var col = color('#eb4034');
        col.setAlpha(overallAlpha);
        this.squareSprite.color = col;
        //draw and update all sprites
        this.squareSprite.draw();
        this.squareSprite.update();
        this.fishSprite.draw();
        this.fishSprite.update();
        this.gameFishSprite.draw();
        this.gameFishSprite.update();
        
        if(current_game_state == 2){ //in game
            if(this.randomTimeLeft > 0){
                //decrement random time
                this.randomTimeLeft--; 
            } else {
                //if randomtime <= 0, choose a different randomtime which will determine how long the fish moves in a certain direction
                this.randomTimeLeft = random(1,5)*60;
                //move in a random direction
                var rand = random(0,1);
                if(rand < .5){
                    this.gameFishSprite.vel.y = this.spd;
                } else {
                    this.gameFishSprite.vel.y = -this.spd;
                }
            }

            //accelerate downwards with gravity
            this.squareSprite.vel.y += this.accel;
            //stop at floor
            if(this.squareSprite.y > this.bot-60){
                this.squareSprite.y = this.bot-61;
                this.squareSprite.vel.y = 0;
            }
            //stop at ceiling
            if(this.squareSprite.y < this.top+60){
                this.squareSprite.y = this.top+61;
            }
            //stop fish at floor
            if(this.gameFishSprite.y > this.bot-20){
                this.gameFishSprite.y = this.bot-20;
                this.gameFishSprite.vel.y = 0;
            }
            //stop fish at ceiling
            if(this.gameFishSprite.y < this.top+20){
                this.gameFishSprite.y = this.top+20;
                this.gameFishSprite.vel.y = 0;
            }
        } else { //not in game
            //set velocities to 0
            this.squareSprite.vel.y = 0;
            this.gameFishSprite.vel.y = 0;
        }
        //restore the tint
        tint(255,255);
    }
}

//for UI buttons at the top
class Button {
    //hovering state
    isHovering=false;
    //active state
    isActive=false;
    //constructor to set looks and text of the button
    constructor(x, y, w, h, func, text = "hi"){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        //set a function to the onclick event
        this.func = func;
        this.text = text;
        this.borderSize = 4;
    }
    display(){
        push();
        if(this.isActive){ //when already on the respective scene, it is active
            //draw active state
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
            && mouseY > this.y && mouseY < this.y + this.h
            && current_game_state == 0){ //when mouse hovering over inactive object
                //set hovering values and draw state
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
            
        } else { // when mouse not hovering over inactive object
            //set hovering values and draw state
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
        //draw text for button
        fill("#FFFFFF");
        textSize(15);
        textAlign(CENTER, CENTER);
        text(this.text, this.x+this.w/2, this.y+this.h/2-2);
        if(this.isHovering && mouseIsPressed 
            && current_game_state == 0){
            //if clicking on object, play sfx and call the function
            uiClickSFX.play();
            this.func();
        }
        pop();
    }

}

//fish images all drawn by me
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
//id based to track which fishes have been captured
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
var game_results = 2; //new fish, old fish, loss
var game_time = 10; // how long the game should last
var game_time_left = 0; // how long is left
var timerID; // the id for the timer callback to end the timer decrement function
var allowGameClick = true; //variable to allow the user to click on the game

//SCREEN UI alpha values to smoothly fade between game states
var overallAlpha = 0;
var startAlpha = 0;
var gameAlpha = 0;
var endAlpha = 0;

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

//game ui variables
var margin = 60;
var gap = 20;
var fishingBoxWidth = 180;
var padding = 20;
var gameFish;

//hold all of the fishes in a list
var aquariumFishies = [];
var lakeFishies = [];
var volcanoFishies = [];
var skyFishies = [];

var fnt;//RALEWAY From google fonts

var fisher;//fisherman object

//backgrounds and foregrounds all drawn by me
var aquariumBG, aquariumFG, lakeBG, volcanoBG, skyBG;


//SOUND AND SFX FILES
//song by peritune https://peritune.com/blog/2023/07/31/cafe_seaside/
var song = new Howl({ 
    src: ['assets/PerituneMaterial_Cafe_Seaside_loop.mp3'],
    loop: true,
    volume: 0.15
  });

//all sfx from Kenney https://www.kenney.nl/assets 
  //charge and reel are the same
var chargeSFX = new Howl({ 
    src: ['assets/sfx/charge.ogg'],
    loop: true,
    volume: 0.1
  });
var launchSFX = new Howl({ 
    src: ['assets/sfx/launch.ogg'],
    loop: false,
    volume: 0.3
  });
var waterSFX = new Howl({ 
    src: ['assets/sfx/water.ogg'],
    loop: false,
    volume: 0.5
  });
var uiClickSFX = new Howl({ 
    src: ['assets/sfx/uiclick.ogg'],
    loop: false,
    volume: 0.2
  });
var catchSFX = new Howl({ 
    src: ['assets/sfx/catch.ogg'],
    loop: false,
    volume: 0.3
  });
var clickSFX = new Howl({ 
    src: ['assets/sfx/click.ogg'],
    loop: false,
    volume: 0.3
  });
var victorySFX = new Howl({ 
    src: ['assets/sfx/win.ogg'],
    loop: false,
    volume: 0.3
  });
var lossSFX = new Howl({ 
    src: ['assets/sfx/lose.ogg'],
    loop: false,
    volume: 0.3
  });

//water height
var waterHeight= 230;


//preload function for fonts and images
function preload(){
    fnt = loadFont("assets/Raleway-SemiBold.ttf");
    aquariumBG = loadImage("assets/aquariumbg.png");
    aquariumFG = loadImage("assets/aquariumfg.png");
    lakeBG = loadImage("assets/lakebg.png");
    volcanoBG = loadImage("assets/volcanobg.png");
    skyBG = loadImage("assets/skybg.png");
}


//setup function
function setup() {
    createCanvas(800, 600);
    noStroke();
    textFont(fnt);
    //initialize the buttons with respective functions
    AquariumButton = new Button(startingX + buttonWidth*0 + buttonSpacing*0,startingY,buttonWidth,30,GoToAquarium, "aquarium");
    LakeButton = new Button(startingX + buttonWidth*1 + buttonSpacing*1,startingY,buttonWidth,30,GoToLake, "lake");
    VolcanoButton = new Button(startingX + buttonWidth*2 + buttonSpacing*2,startingY,buttonWidth,30,GoToVolcano, "volcano");
    SkyButton = new Button(startingX + buttonWidth*3 + buttonSpacing*3,startingY,buttonWidth,30,GoToSky, "clouds");

    AquariumButton.isActive = true;

    //create new fisher object
    fisher = new Fisher();
    //set minigame alpha to 0
    overallAlpha = 0;
    //create new gamefish object
    gameFish = new GameFish(0);
    //play background music
    song.play();
}

//draw function
function draw() {

    //initial background color
    background(col);

    //check if the button is hovered
    hoveringButton = checkIfButtonIsHovered();
    if(hoveringButton){
        //if hovered, change cursor type
        cursor('pointer');
    } else {
        //return to regular cursor type
        cursor(ARROW);
    }

    //switch for scene to display
    switch (current_scene) {
        case 0: // START SCENE
            //decided to not have a start scene as it would be redundant with the aquarium scene
            break;
        case 1: // AQUARIUM
            //draw aquarium background
            drawAquariumBG();
            //draw fishies in the aquarium
            for(i = 0; i < aquariumFishies.length; i++){
                aquariumFishies[i].display();
            }
            //draw the foreground for the aquarium
            drawAquariumFG();
            //UI
            fill('#ffffff6c')
            textAlign(CENTER, TOP);
            textSize(30);
            var s = " fishies in the aquarium";
            if(aquariumFishies.length==1){
                s = " fish in the aquarium";
            }
            text(aquariumFishies.length + s, width/2, 100);

            textAlign(RIGHT,BOTTOM);
            textSize(15);
            fill("#043161");
            text("a game by taneim miah",width-19,height-14);
            fill("#348ceb");
            text("a game by taneim miah",width-20,height-15);

            //draw buttons
            drawUIButtons();
            break;
        case 2: // LAKE
            
            //draw lake background
            drawLakeBG();
            //draw fisher cat object
            drawFisher();
            //draw all lake fishies
            for(i = 0; i < lakeFishies.length; i++){
                lakeFishies[i].display();
            }

            //UI
            drawUIButtons();
            break;
        case 3: // VOLCANO

            //draw volcano background
            drawVolcanoBG();
            //draw fisher cat object
            drawFisher();
            //draw all the volcano fishies
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

    //display all the fishing minigame functions
    DisplayFishingGameUIBox();
    DisplayFishingGameStart();
    DisplayFishingGameGame();
    DisplayFishingGameEnd();
    gameFish.display();

    //based on the current minigame state, change alphas
    switch (current_game_state) {
        case 0: //no fishing game
            //set all alphas to 0
            overallAlpha = lerp(overallAlpha, 0, .05);
            startAlpha = lerp(startAlpha, 0, .05);
            gameAlpha = lerp(gameAlpha, 0, .05);
            endAlpha = lerp(endAlpha, 0, .05);
            break;
        case 1: //fishing game start
            //set alphas
            
            overallAlpha = lerp(overallAlpha, 255, .05);
            if(allowGameClick){
                //show the start text when allowing game click
                startAlpha = lerp(startAlpha, 255, .05);
            }
            gameAlpha = lerp(gameAlpha, 0, .05);
            endAlpha = lerp(endAlpha, 0, .05);
            break;
        case 2: //fishing game
            //while in fishing game, if the game time left is finished, switch to the next game state
            if(game_time_left <= 0){
                current_game_state = 3;
                //check if the game fish was captured
                gameFish.checkCapture();
                //delay allow game click to prevent accidents
                allowGameClick = false;
                setTimeout(allowClick,500);
            }
            //set alphas
            overallAlpha = lerp(overallAlpha, 255, .05);
            startAlpha = lerp(startAlpha, 0, .05);
            gameAlpha = lerp(gameAlpha, 255, .05);
            endAlpha = lerp(endAlpha, 0, .05);
            break;
        case 3: //fishing game end
            //set alphas
                overallAlpha = lerp(overallAlpha, 255, .05);

                startAlpha = lerp(startAlpha, 0, .05);
                gameAlpha = lerp(gameAlpha, 0, .05);
            if(allowGameClick){
                //if allow game click, show end text
                endAlpha = lerp(endAlpha, 255, .05);
            }
            break;
        default:
            break;
    }

}

//function to display all of the UI buttons at the top
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

    
    //instructional text
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

    
    
    //subtle text to teach the player what the game is about
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

//reset all of the active button states
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

//display the fishing game ui box that is present in all fishing game states (other than 0)
function DisplayFishingGameUIBox(){
    push();
    //background tint
    var col = color('#000000');
    col.setAlpha(overallAlpha*.4);
    fill(col);
    rect(-50,-50,width+200,height+200);
    //border
    var col = color('#ff9100');
    col.setAlpha(overallAlpha);
    fill(col);
    rect(margin, margin, fishingBoxWidth,height-margin*2,20);
    
    //inner
    var col = color('#175982');
    col.setAlpha(overallAlpha);
    fill(col);
    rect(margin+padding, margin+padding, fishingBoxWidth-padding*2,height-margin*2-padding*2,20);

    //box 2
    var col = color('#ff9100');
    col.setAlpha(overallAlpha);
    fill(col);
    rect(margin+fishingBoxWidth+gap, margin, width-fishingBoxWidth-gap-margin*2,height-margin*2,20);


    //text
    var top = margin + padding;
    var col = color('#FFFFFF');
    col.setAlpha(overallAlpha);
    fill(col);
    textAlign(CENTER, TOP);
    textSize(50);
    text("fishing minigame", (margin+fishingBoxWidth+gap)+(width-fishingBoxWidth-gap-margin*2)/2, top);
    var col = color('#FFFFFF');
    col.setAlpha(overallAlpha*.7);
    fill(col);
    textSize(20);
    //instruction
    text("left click makes the red square jump up\nmake the fish stay in the red square\nby the end of the time limit", (margin+fishingBoxWidth+gap)+(width-fishingBoxWidth-gap-margin*2)/2, top+60);

    pop();
}
//ui that appears when ready to start
function DisplayFishingGameStart(){
    push();
    var bot = margin+padding+height-margin*2-padding*2;
    //text
    var col = color('#FFFFFF');
    col.setAlpha(startAlpha);
    fill(col);
    textAlign(CENTER, BOTTOM);
    textSize(50);
    text("CLICK TO START", (margin+fishingBoxWidth+gap)+(width-fishingBoxWidth-gap-margin*2)/2, bot);
    pop();
}
//game ui during the actual minigame
function DisplayFishingGameGame(){
    push();
    var bot = margin+padding+height-margin*2-padding*2;
    //text
    var col = color('#FFFFFF');
    col.setAlpha(gameAlpha);
    fill(col);
    textAlign(CENTER, BOTTOM);
    textSize(50);
    text("TIME LEFT: "+game_time_left, (margin+fishingBoxWidth+gap)+(width-fishingBoxWidth-gap-margin*2)/2, bot-50);
    pop();
}
//ui that appears when game is over
function DisplayFishingGameEnd(){
    push();
    var bot = margin+padding+height-margin*2-padding*2;
    //text
    var col = color('#FFFFFF');
    col.setAlpha(endAlpha);
    fill(col);
    textAlign(CENTER, BOTTOM);
    textSize(20);
    var s = "";
    //based on the game results, display a different text
    switch (game_results) {
        case 0: //new
            s = "CONGRATS! YOU CAUGHT A NEW FISH\n FOR YOUR AQUARIUM";
            break;
        case 1: //old
            s = "CONGRATS! THIS IS AN OLD FISH,\n SO YOU RELEASE IT"
            break;
        case 2: //loss
            s = "NICE TRY! YOU'll CATCH IT NEXT\n TIME FOR SURE!"
            break;
        default:
            break;
    }
    text(s, (margin+fishingBoxWidth+gap)+(width-fishingBoxWidth-gap-margin*2)/2, bot-70);
    textSize(50);
    text("CLICK TO END", (margin+fishingBoxWidth+gap)+(width-fishingBoxWidth-gap-margin*2)/2, bot);
    pop();
}

//function when you click aquarium button
function GoToAquarium(){
    //reset all values
    disableAllButtonActive()
    //set the scene and active button to aquarium
    AquariumButton.isActive = true;
    current_scene = 1;
    fisher.reset();
    //spawn all of the fishies in the aquarium
    spawnAquariumFishies();
}
//function to spawn the aquarium fishies
function spawnAquariumFishies(){
    //remove already existing fishies
    aquariumFishies.forEach(element => {
        element.fishSprite.remove();
    });
    //set empty array
    aquariumFishies = [];

    //create the lake fishies
    var startIndex = 0;
    for(i = startIndex; i < startIndex+3; i++){
        if(fishiesCaptured[i]){
            var variation = random(240,600);
            var randLBound = random(0,width-120-variation);
            var randX = random(randLBound,randLBound+variation);
            var randY = random(waterHeight+50,height);
            aquariumFishies.push(new Fish(randX,randY,i,randLBound,randLBound+variation,floor(random(1,2))/2));
        }
    }
    //create the volcano fishies
    var startIndex = 3;
    for(i = startIndex; i < startIndex+3; i++){
        if(fishiesCaptured[i]){
            var variation = random(240,600);
            var randLBound = random(0,width-120-variation);
            var randX = random(randLBound,randLBound+variation);
            var randY = random(waterHeight+50,height);
            aquariumFishies.push(new Fish(randX,randY,i,randLBound,randLBound+variation,floor(random(3,5))/2));
        }
    }
    //create the sky fishies
    var startIndex = 6;
    for(i = startIndex; i < startIndex+3; i++){
        if(fishiesCaptured[i]){
            var variation = random(240,600);
            var randLBound = random(0,width-120-variation);
            var randX = random(randLBound,randLBound+variation);
            var randY = random(waterHeight+50,height);
            aquariumFishies.push(new Fish(randX,randY,i,randLBound,randLBound+variation,floor(random(5,7))/2));
        }
    }
}

//function when you click the lake button
function GoToLake(){
    //reset values
    disableAllButtonActive()
    //set scene and button to lake and active
    LakeButton.isActive = true;
    current_scene = 2;
    //reset fisher
    fisher.reset();
    //spawn the lake fishies
    spawnLakeFishies();
}
//function that handles spawning of lake fishies
function spawnLakeFishies(){//IDS 0-2
    //remove already existing fish
    lakeFishies.forEach(element => {
        element.fishSprite.remove();
    });
    //set empty array
    lakeFishies = [];
    //spawn all of the lake fish based on the ids
    var startIndex = 0;
    for(i = startIndex; i < startIndex+3; i++){
        //each fish should be randomly spawned with some variation
        var variation = random(240,600);
        var randLBound = random(0,width-120-variation);
        var randX = random(randLBound,randLBound+variation);
        var randY = random(waterHeight+50,height);
        lakeFishies.push(new Fish(randX,randY,i,randLBound,randLBound+variation,floor(random(1,2))/2));
    }
}
//function when you click the volcano button
function GoToVolcano(){
    //reset values
    disableAllButtonActive()
    //set scene and button to volcano and active
    VolcanoButton.isActive = true;
    current_scene = 3;
    //reset fisher
    fisher.reset();
    //spawn the volcano fishies
    spawnVolcanoFishies();
}
//function that handles the spawning of the volcano fishies
function spawnVolcanoFishies(){//IDS 3-5
    //remove already existing fish
    volcanoFishies.forEach(element => {
        element.fishSprite.remove();
    });
    //set empty array
    volcanoFishies = [];
    //spawn all of the fish based on the ids
    var startIndex = 3;
    for(i = startIndex; i < startIndex+3; i++){
        //each fish should be randomly spawned with some variation
        var variation = random(240,600);
        var randLBound = random(0,width-120-variation);
        var randX = random(randLBound,randLBound+variation);
        var randY = random(waterHeight+50,height);
        volcanoFishies.push(new Fish(randX,randY,i,randLBound,randLBound+variation,floor(random(3,5))/2));
    }
}
//function when you click the sky button
function GoToSky(){
    //reset values
    disableAllButtonActive()
    //set scene and button to sky and active
    SkyButton.isActive = true;
    current_scene = 4;
    //reset fisher
    fisher.reset();
    //spawn the sky fishies
    spawnSkyFishies();
}
//function that handles the spawning of the sky fish
function spawnSkyFishies(){//IDS 6-8
    //remove already existing fish
    skyFishies.forEach(element => {
        element.fishSprite.remove();
    });
    //set empty array
    skyFishies = [];
    //spawn all of the fish based on the ids
    var startIndex = 6;
    for(i = startIndex; i < startIndex+3; i++){
        //each fish should be randomly spawned with some variation
        var variation = random(240,600);
        var randLBound = random(0,width-120-variation);
        var randX = random(randLBound,randLBound+variation);
        var randY = random(waterHeight+50,height);
        skyFishies.push(new Fish(randX,randY,i,randLBound,randLBound+variation,floor(random(5,7))/2));
    }
}

function drawAquariumBG(){
    //function to draw the aquarium background
    background("#001339");
    fill("#175982");
    rect(0,230,width,370);
    image(aquariumBG, 0,230);
}
function drawAquariumFG(){
    //function to draw the aquarium foreground
    image(aquariumFG, 0,230);
}

function drawFisher(){
    //fisher + hook
    fisher.display();
    
}

function drawLakeBG(){
    //function to draw lake background
    background("#87CEEB");
    fill("#175982");
    rect(0,waterHeight,width,height-waterHeight);
    image(lakeBG, 0,230);
}

function drawVolcanoBG(){
    //function to draw volcano background
    background("#793d33");
    fill("#ff441f");
    rect(0,waterHeight,width,height-waterHeight);
    image(volcanoBG, 0,230);
}
function drawSkyBG(){
    //function to draw sky background
    background("#9bb5c4");
    //fill("#9bb5c4");
    //rect(0,waterHeight,width,height-waterHeight);
    image(skyBG, 0,230);
}
//idea from this https://editor.p5js.org/denaplesk2/sketches/ryIBFP_lG
function timer(){
    //game timer decrements while game time left is above 0
    if(game_time_left > 0){
        game_time_left--;
    } else {
        //otherwise stop calling this function
        clearInterval(timerID);
    }
}
//function that allows the game click
function allowClick(){
    allowGameClick = true;
}

//handles mouse pressed events
function mousePressed(){
    if((current_scene!=0 && current_scene!=1) && !hoveringButton){
        switch (current_game_state) {//no fishing game, fishing game start, fishing game, fishing game end
            case 0: //no fishing game
                switch (fisher.fishingHookState) {//0 -> start pos, 1 -> charging, 2 -> launched, 3 -> in water (should be reeled in)
                    case 0: // start pos (ready to charge)
                        fisher.fishingHookState+=1;
                        //set initial charge sound effect values
                        chargeSFX.play();
                        chargeSFX.rate(.8);
                        chargeSFX.volume(0.1);
                        break;
                    case 1: //charging (the mouse should not be pressed while charging because it needs to be held)
                        
                        break;
                    case 2: //launched (the mouse click shouldn't do anything while it is traveling in the air)
                        
                        break;
                    case 3: //in the water (mouse click should bring the reel closer to the start position)
                        //reel sound effect
                        chargeSFX.play();
                        chargeSFX.volume(0.06);
                        chargeSFX.rate(1.5);
                        break;
                    default:
                        break;
                }
                break;
            case 1: //fishing game start
                if(allowGameClick){
                    //when the fishing game is actually started
                    current_game_state=2;
                    game_time_left = game_time;
                    //start timer interval to go down every second
                    timerID = setInterval(timer,1000);

                    //play sound effect
                    clickSFX.play();
                    clickSFX.rate(random(0.8,1.2)); //add variety
                }
                break;
            case 2: //fishing game
                //make the fish jump on click
                gameFish.jump();
                //play sound effect
                clickSFX.play();
                clickSFX.rate(random(0.8,1.2)); //add variety
                break;
            case 3: //fishing game end
                if(allowGameClick){
                    //when the fishing game is closed
                    fisher.reset();
                    current_game_state=0;
                    //play sound effect
                    clickSFX.play();
                    clickSFX.rate(random(0.8,1.2)); //add variety
                }
                break;
            default:
                break;
        }
        
    }
}

//when the player lets go of the mouse
function mouseReleased(){
    if(current_scene!=0 || current_scene!=1){
        switch (current_game_state) {//no fishing game, fishing game start, fishing game, fishing game end
            case 0: //no fishing game
                switch (fisher.fishingHookState) {//0 -> start pos, 1 -> charging, 2 -> launched, 3 -> in water (should be reeled in)
                    case 0: //start pos (wouldnt release at this point)

                        break;
                    case 1: //charging (when release, launch)
                        //stop the charging sound effect
                        chargeSFX.stop();
                        //launch the fishing hook
                        fisher.launch();
                        break;
                    case 2: //launched (the mouse click shouldn't do anything while it is traveling in the air)
                        
                        break;
                    case 3: //mouse release while reeling in the hook
                        //stop the reeling sfx
                        chargeSFX.stop();
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
