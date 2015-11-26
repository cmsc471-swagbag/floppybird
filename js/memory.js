var textFile = "../floppybird/memory.txt";
var file = new File(textFile);

function write(array){
	file.open("w");
	for(var i = 0; i < array.length; i++){
		for(var j = 0; j < array[i].length; j++){
			file.writeln(array[i][j]["click"]);
			file.writeln(array[i][j]["do_nothing"]);
		}
	}
	file.close();
}

function read(){
	file.open("r");
	var array = new Array();
	for(var i = 0; i < 200; i++){
		array[i] = new Array();
		for(var j = 0; j < 44; j++){
			if(!file.eof){
				array[i][j] = {"click": file.readln, "do_nothing": file.readln};
			}
			else{
				array[i][j] = {"click": 0, "do_nothing": 0};
			}
		}
	}
	file.close();
	return array;
}