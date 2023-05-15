window.onload= function()
{
    var canvasWidth=900;
    var  canvasHeight =550;
    var blockSize =30;
    var ctx ;
    var canvas;
    var delay = 110 ;
    var snakee ;
    var applee;
    var widthInBlocks=canvasWidth/blockSize;
    var heightInBlocks=canvasHeight/blockSize;
    var score;
    var timeout;
    
   /* var background = new Image();
    background.src = "grass_34.png";*/
    init();
    function init()
    {

        canvas= document.createElement('canvas');
        canvas.width=canvasWidth;
        canvas.height=canvasHeight;
        canvas.style.border= "30px solid #140d07 ";
        canvas.style.margin="30 px auto";
        canvas.style.display="block";
        canvas.style.backgroundColor ="#8FBC8F"
        document.body.appendChild(canvas);
        ctx =canvas.getContext('2d');
        snakee=new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
         applee = new Apple([10,10]);
         score= 0;
        refreshCanvas();
    }
    
       

    function refreshCanvas ()
    {   
        snakee.advance();
        
        if(snakee.checkCollision())
        {

         // Game over 
         gameOver();

         }
        else
        {
            if(snakee.isEatingApple(applee))
            {
                score ++;
                snakee.ateAplee = true;
                do 
                {   
                    applee.setNewPosition();
                }
                while(applee.isOnSnake(snakee))
            
            }
            ctx.clearRect(0,0,canvas.width, canvas.height);
            snakee.draw();
            applee.draw();
            drawScore();
            timeout = setTimeout(refreshCanvas,delay);
        }
    }

    function gameOver()
    {
        ctx.save();
        ctx.font="bold 40px arial ";
        ctx.fillStyle="black"
        ctx.textAlign = "center"
        ctx.fillText(" Game Over", canvasWidth/2,canvasHeight/2);
        ctx.fillText("Appuyer sur la touche espace pour rejouer ", canvasWidth/2,(canvasHeight/2)+60);
        ctx.restore();
    }
    function restart () 
    {
        snakee=new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }

    function drawScore()
    {
        ctx.save();
        ctx.font="bold 40px arial ";
        ctx.fillStyle="black"
        ctx.fillText("Score: " +score.toString(), canvasWidth-250 , 50);
        ctx.restore();

    }
    function drawBlock( position)
    {
        var x=position[0]*blockSize;
        var y=position[1]*blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);

    }

    function Snake(body,direction)
    {
        this.body=body;
        this.direction=direction;
        this.ateAplee = false;
        this.draw=function()
        {
            ctx.save();
            ctx.fillStyle= "#03254c";
            for(var i=0; i<this.body.length;i++)
            {
                drawBlock( this.body[i]);

            }
            ctx.restore();
          


        };

        this.advance=function()
        {
            var nextPosition = this.body[0].slice();
            switch(this.direction)
            {
                case "left":
                    nextPosition[0]-=1;
                    break;
                case "right":
                    nextPosition[0]+=1;
                    break;
                case "down":
                    nextPosition[1]+=1;
                    break;
                case "up":
                    nextPosition[1]-=1;
                    break;
                default:
                    throw("Invalid Direction");



            }
            this.body.unshift(nextPosition);
            if(!this.ateAplee)
            {
                this.body.pop();
            }
            else
            {
                this.ateAplee = false;
            }

            };

            this.setDirections= function(newDirection)
            {
            var allowedDiretions;
            switch(this.direction)
                {
                    case "left":
                    case "right":
                    allowedDiretions =["up","down"];
                    break;
                     case "down" :
                     case "up":
                     allowedDiretions=["left","right"];
                     break;
                     default:
                         throw("Invalid Direction");
                }
                if(allowedDiretions.indexOf(newDirection)>-1)
                 {
                    this.direction =newDirection;

                }
            };
            this.checkCollision=function()
            {
                var wallcollision=false;
                var snakeCollision=false; 
                var head= this.body[0];
                var rest = this.body.slice(1);
                var snakeX=head[0];
                var snakeY= head[1];
                var minX=0;
                var minY=0;
                var maxX=widthInBlocks-1;
                var maxY=heightInBlocks-1;
                var isNotBetweenHorizontalsWalls = snakeX < minX || snakeX > maxX;
                var isNotBetweenVerticalsWalls= snakeY < minY | snakeY > maxY;
                if(isNotBetweenHorizontalsWalls || isNotBetweenVerticalsWalls)
                {
                    wallcollision=true;
                }
                for( var i=0; i<rest.length;i++)
                    {
                        if(snakeX==rest [i][0] && snakeY==rest[i][1])
                        {
                            snakeCollision=true;
                        }
                    }
                    return wallcollision || snakeCollision ;
            
                };
                this.isEatingApple = function(appleToEat)
                {
                    var head = this.body[0];
                    return(head[0]==appleToEat.position[0] && head[1]==appleToEat.position[1]);
                   
                }

        }
    
    function Apple(position)
    {
        
        this.position=position;
        this.draw=function()
        {
            ctx.save();
            ctx.fillStyle="#ff0000";
            ctx.beginPath();
            var radius =blockSize/2;
            var x=this.position[0]*blockSize+radius;
            var y=this.position[1]*blockSize+radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition= function()
        {
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position =[newX,newY];


        }

        this.isOnSnake = function(snakeTocheck)
        {
            var isOnSnake = false;
            for(var i= 0; i<snakeTocheck.body.length;i++)
            {
                
                if(this.position[0]==snakeTocheck.body[i][0] && this.position[1]==snakeTocheck.body[i][1])
                {
                    isOnSnake = true ;
                }
            }
            return isOnSnake;
        }
    }
        


     document.onkeydown=function handleKeyDown(e)
    {
        var key =e.keyCode;
         var newDirection;
        switch(key)
        {
            case 37:
                newDirection ="left";
                break;
            case 38 :
            newDirection ="up";
            break;

            case 39 :
            newDirection ="right";
                break;
            case 40 :
                newDirection ="down";
                break;
            case 32 :
                 restart();
                break;
            default:
                return;
            }
            snakee.setDirections(newDirection);


    }


}

    

    
