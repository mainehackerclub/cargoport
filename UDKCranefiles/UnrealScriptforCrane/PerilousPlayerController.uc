class PerilousPlayerController extends UTPlayerController;


var TcpLinkClient mytcplink; //links the playercontroller to the tcplink

//all the functions to be sent to the server with button presses in the interface. 
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
	


simulated function PostBeginPlay()
{

	super.PostBeginPlay();

	//this goes in our PostBeingPlay() function
	mytcplink = Spawn(class'TcpLinkClient'); //spawn the class
	mytcplink.PC = self; //send it a reference to the player controller
	
}


DefaultProperties
{

}
