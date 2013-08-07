class CraneController extends UTPlayerController;


var bool        isCutscenePlaying;
//this goes in below our class declaration
var TcpLinkClient mytcplink;


exec function LeftPressedTrue()
  {
	`Log("Left Pressed");
     mytcplink.SendText("LEFT");
	}

	exec function RightPressedTrue()
	{
	`Log("Right Pressed");
     mytcplink.SendText("RIGHT");
	}

	exec function LeftPressedFalse()
	{
	`Log("Left Pressed");
     mytcplink.SendText("LEFTOFF");
	}

	exec function RightPressedFalse()
	{
	`Log("Right Pressed");
     mytcplink.SendText("RIGHTOFF");
	}
	


	exec function UpPressedTrue()
	{
	`Log("Up Pressed");
     mytcplink.SendText("UP");
	}
	

	exec function DownPressedTrue()
	{
	`Log("Down Pressed");
     mytcplink.SendText("DOWN");
	}

		exec function TPressedTrue()
	{
	`Log("T Pressed");
     mytcplink.SendText("TRUCK");
	}

		exec function BPressedTrue()
	{
	`Log("B Pressed");
     mytcplink.SendText("BOAT");
	}

		exec function SpacebarPressedTrue()
	{
	`Log("Spacebar Pressed");
     mytcplink.SendText("MAGNET");
	}
	
	

exec function EnableCutscene()
	{
	  isCutscenePlaying = !isCutscenePlaying;
	}


simulated function PostBeginPlay()
{

	super.PostBeginPlay();

	//this goes in our PostBeingPlay() function
	mytcplink = Spawn(class'TcpLinkClient'); //spawn the class
	mytcplink.PC = self; //send it a reference to the player controller
	
	//hides the crosshair
	//bNoCrosshair = true;
}


DefaultProperties
{
	isCutscenePlaying = false
}
