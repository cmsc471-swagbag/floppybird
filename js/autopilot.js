
var verticalMax = 300, 
horiziontalMax = 100,
prev_state = {"verticalDistance": 0, "horizontalDistance": 0},	//previous state, 1 tick behind
curr_state = {"verticalDistance": 0, "horizontalDistance": 0},	//state we're in now
Q,	//Q Array holding learned knowledge
actionToPerform = "do_nothing",	//What should the bird do?
alpha_QL = 0.7,	//Learning Rate
scale = 4,	//Used to scale down pixel values for faster learning
reward = 0;	//reward for action

//Initalizes Q 2-D Array at runtime
function init()
{
	Q = new Array();
	for (var vert_dist = 0; vert_dist < verticalMax/scale; vert_dist++) {
		Q[vert_dist] = new Array();
		// Horizontal Distance
		for (var hori_dist = 0; hori_dist < horiziontalMax/scale; hori_dist++) {
			Q[vert_dist][hori_dist] = {"click": 0, "do_nothing": 0};
			}
	}
	console.log(Q);	
}

//Clicks on the replay button and performs the initial flap needed
function replay(){
	$("#replay").click();
	setTimeout(flap, 2000)
}

//Performs a jump
function flap() {
	$(document).mousedown();
	$(document).trigger('touchstart');
}

//Where the bot decides what to do, and where it learns.
//Called by Main.js during every cycle of game loop
function tick(deadOrAlive, piperight, pipebottom, boxright, boxbottom) {
		var reward = 0;
	
	   if(deadOrAlive == "dead")
   		{
			setTimeout(replay, 1500);
			reward = -3000;
   		}
		else
		{
			reward = 1;
			
		}
		
		//Step 1: determine distances

		if (piperight)
			var horizontalDistance = piperight - boxright;
		if (pipebottom)
			var verticalDistance = pipebottom - boxbottom;

		curr_state.verticalDistance = verticalDistance;
		curr_state.horizontalDistance = horizontalDistance;
		

		//console.log("BirdX: \t" + boxright);
		//console.log("PipeX: \t" + piperight);
		//console.log("BirdY: \t" + boxbottom);
		//console.log("PipeY: \t" + pipebottom);
		//console.log("--");

		//console.log("Vertical: \t" + verticalDistance);
		//console.log("Horizontal:\t" + horizontalDistance);
		//console.log("--");

		//Step 2: Update Q(S, A)

		var prev_state_v = 
		Math.max( 
			Math.min ( 
				Math.floor((verticalMax-1)/scale), 
				Math.floor(prev_state.verticalDistance/scale)
			), 
			0
		);

		var prev_state_h = 
		Math.max( 
			Math.min ( 
				Math.floor((horiziontalMax-1)/scale), 
				Math.floor(prev_state.horizontalDistance/scale)
			), 
			0
		);


		var curr_state_v = 
		Math.max( 
			Math.min ( 
				Math.floor((verticalMax-1)/scale), 
				Math.floor(curr_state.verticalDistance/scale)
			), 
			0
		);
		
		var curr_state_h = 
		Math.max( 
			Math.min ( 
				Math.floor((horiziontalMax-1)/scale), 
				Math.floor(curr_state.horizontalDistance/scale)
			), 
			0
		);

		//console.log("S: V - " + prev_state_v + ", H - " + prev_state_h);
		//console.log("S' V - " + curr_state_v + ", H - " + curr_state_h);
		//console.log("---");

		var clickValue = Q[curr_state_v][curr_state_h]["click"],
		doNothingValue = Q[curr_state_v][curr_state_h]["do_nothing"],
		greaterValue = Math.max(clickValue, doNothingValue),


		//determine points to assign for the action we took during last tick
		Qsa =  Q[prev_state_v][prev_state_h][actionToPerform],
		pointsToAssign = Qsa + alpha_QL * (reward + greaterValue - Qsa);		

		//console.log("Assinging points: " + pointsToAssign);
		Q[prev_state_v][prev_state_h][actionToPerform] = pointsToAssign;
	
	
		//Step 3: Determine action to take
		actionToPerform = clickValue > doNothingValue ? "click" : "do_nothing";

		//console.log("action performed: " + actionToPerform);

		if (actionToPerform == "click") {
			flap()
		}

		// Step 4: Set Previous state equal to current state in preparation for call end
		prev_state = clone(curr_state);
}


//Clones an object and it's proerties
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

init();


