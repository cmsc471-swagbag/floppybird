var textFile = "c:/memory.txt";
var file = new File(textFile);

function write(x, y, jump, doNothing){
	file.open("w");
	file.writeln(x + " " + y + " " + jump + " " + doNothing);
	file.close();
}

function read(){
	file.open("r");
	var items = [];
	while(!file.eof){
		items.push(file.readln());
	}
	file.close();
	return items;
}