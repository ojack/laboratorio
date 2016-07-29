var canvas, context, width, height, socket;
 var mouse = { 
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };
   
window.onload = function(){
	 // get canvas element and create context
   canvas  = document.getElementById('drawing');
   context = canvas.getContext('2d');
   width   = window.innerWidth;
   height  = window.innerHeight;
   socket  = io.connect();

   // set canvas to full browser width/height
   canvas.width = width;
   canvas.height = height;

    // register mouse event handlers
   canvas.onmousedown = function(e){ mouse.click = true; };
   canvas.onmouseup = function(e){ mouse.click = false; };

   canvas.onmousemove = function(e) {
      // normalize mouse position to range 0.0 - 1.0
      mouse.pos.x = e.clientX / width;
      mouse.pos.y = e.clientY / height;
      mouse.move = true;
   };


   socket.on('draw_event', function (data) {
   		//if(data.type == "drawLine"){
   		console.log(data);
   		window[data.type].apply(this, data.args);
   		//}
   });

   mainLoop();
}
  
   

   //draw line given start and end points
   function drawLine(start, end){
   		context.beginPath();
     	context.moveTo(start.x * width, start.y * height);
     	context.lineTo(end.x * width, end.y * height);
     	context.stroke();
   }

  
   // main loop, running every 25ms
   function mainLoop() {
      // check if the user is drawing
      if (mouse.click && mouse.move && mouse.pos_prev) {
         // send line to to the server
         //socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ] });

         console.log("emitting draw evet");
         drawLine(mouse.pos_prev, mouse.pos);
         socket.emit('draw_event', { type: "drawLine", args: [mouse.pos_prev, mouse.pos]});
         mouse.move = false;
      }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(mainLoop, 25);
   }
   
