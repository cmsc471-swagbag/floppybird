var pipe_gap = 90,
	flap_thresh = 0;

var vertical_dist_range = [0, 300];
var horizontal_dist_range = [0, 100];

var m_state = {"vertical_distance": 0, "horizontal_distance": 0};
var m_state_dash = {"vertical_distance": 0, "horizontal_distance": 0};
var Q;
var action_to_perform = "do_nothing";
var alpha_QL = 0.7;
var resolution = 4;
var min_diff = 9999;
var max_diff = -9999;
var reward = 0;
var writeArray = true;
var readArray = true;


function init()
{
	Q = new Array();
	for (var vert_dist = 0; vert_dist < (vertical_dist_range[1] - vertical_dist_range[0])/resolution; vert_dist++) {
		Q[vert_dist] = new Array();
		// Horizontal Distance
		for (var hori_dist = 0; hori_dist < (horizontal_dist_range[1] - horizontal_dist_range[0])/resolution; hori_dist++) {
			Q[vert_dist][hori_dist] = {"click": 0, "do_nothing": 0};
			}
		}
		console.log(Q);	
	}

//Clicks on the replay button and begins calling decide again
function replay(){
	$("#replay").click();
	setTimeout(flap, 2000)
}

function flap() {
	$(document).mousedown();
	$(document).trigger('touchstart');
}

//Where the bot decides what to do, and where it learns.
//For now only flaps, will hold majority of code
function tick(state, piperight, pipebottom, boxright, boxbottom) {
		var reward = 0;
	
	   if(state == "dead")
   		{
			setTimeout(replay, 1500);
			reward = -3000;
   		}
		else
		{
			reward = 1;
			
		}
		
		//Step 1: determine distances
		var horizontal_distance = 9999;
		var vertical_distance = 9999;

		if (piperight)
			horizontal_distance = piperight - boxright;
		if (pipebottom)
			vertical_distance = pipebottom - boxbottom;

		m_state_dash.vertical_distance = vertical_distance;
		m_state_dash.horizontal_distance = horizontal_distance;
		
		//console.log("boxleft: \t" + boxright);
		//console.log("piperight: \t" + piperight);
		console.log("--");
		console.log("Vertical: \t" + vertical_distance);
		console.log("Horizontal:\t" + horizontal_distance);
		console.log("--");

		//Step 3: Update Q(S, A)

		var state_bin_v = 
		Math.max( 
			Math.min ( 
				Math.floor((vertical_dist_range[1]-vertical_dist_range[0]-1)/resolution), 
				Math.floor( (m_state.vertical_distance - vertical_dist_range[0])/resolution)
			), 
			0
		);

		var state_bin_h = 
		Math.max( 
			Math.min ( 
				Math.floor((horizontal_dist_range[1]-horizontal_dist_range[0]-1)/resolution), 
				Math.floor((m_state.horizontal_distance - horizontal_dist_range[0])/resolution )
			), 
			0
		);


		var state_dash_bin_v = 
		Math.max( 
			Math.min ( 
				Math.floor((vertical_dist_range[1]-vertical_dist_range[0]-1)/resolution), 
				Math.floor((m_state_dash.vertical_distance - vertical_dist_range[0])/resolution )
			), 
			0
		);
		
		var state_dash_bin_h = 
		Math.max( 
			Math.min ( 
				Math.floor((horizontal_dist_range[1]-horizontal_dist_range[0]-1)/resolution), 
				Math.floor((m_state_dash.horizontal_distance - horizontal_dist_range[0])/resolution )
			), 
			0
		);

		console.log("S: V - " + state_bin_v + ", H - " + state_bin_h);
		console.log("S' V - " + state_dash_bin_v + ", H - " + state_dash_bin_h);
		console.log("---");

		var click_v = Q[state_dash_bin_v][state_dash_bin_h]["click"];
		var do_nothing_v = Q[state_dash_bin_v][state_dash_bin_h]["do_nothing"]
		var V_s_dash_a_dash = Math.max(click_v, do_nothing_v);

		var Q_s_a =  Q[state_bin_v][state_bin_h][action_to_perform];
		var pointsToAssign = Q_s_a + alpha_QL * (reward + V_s_dash_a_dash - Q_s_a);		
		console.log(pointsToAssign);
		Q[state_bin_v][state_bin_h][action_to_perform] = pointsToAssign;
		

		// Step 4: S <- S'
		m_state = clone(m_state_dash);

		// Step 5: Select and perform Action A
		var state_bin_v = 
		Math.max( 
			Math.min ( 
				Math.floor((vertical_dist_range[1]-vertical_dist_range[0]-1)/resolution), 
				Math.floor((m_state.vertical_distance - vertical_dist_range[0])/resolution )
			), 
			0
		);
			
		var state_bin_h = 
		Math.max( 
			Math.min ( 
				Math.floor((horizontal_dist_range[1]- horizontal_dist_range[0]-1)/resolution), 
				Math.floor( (m_state.horizontal_distance - horizontal_dist_range[0])/resolution )
			), 
			0
		);

		var click_v = Q[state_bin_v][state_bin_h]["click"];
		var do_nothing_v = Q[state_bin_v][state_bin_h]["do_nothing"]
		action_to_perform = click_v > do_nothing_v ? "click" : "do_nothing";

		//console.log("action performed: " + action_to_perform);

		if (action_to_perform == "click") {
			flap()
		}
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

init();


