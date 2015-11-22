var pipe_gap = 90,
	flap_thresh = 0;


function targetHeight() {
	var p = pipes[0];
	if (p === undefined) {
		return ($('#ceiling').offset().top + $('#land').offset().top) / 2;
	}
	p = p.children('.pipe_upper');
	var result = ((p.offset().top + p.height())) + pipe_gap / 2;
	result += pipe_gap / 8;
	return result;
}

function currentHeight() {
	return $('#player').offset().top + $('#player').height() / 2;
}

//Clicks on the replay button and begins calling decide again
function replay(){
	$("#replay").click();
	decideRepeat = window.setInterval(decide, 20);
}

function flap() {
	$(document).mousedown();
	$(document).trigger('touchstart');
}

//Where the bot decides what to do, and where it learns.
//For now only flaps, will hold majority of code
function decide() {
	   if(dead)
   		{
   			//stop calling this function and after 5 seconds call replay
   			clearInterval(decideRepeat)
			setTimeout(replay, 5000);
			return
   		}
		flap();
}

var decideRepeat = window.setInterval(decide, 20)