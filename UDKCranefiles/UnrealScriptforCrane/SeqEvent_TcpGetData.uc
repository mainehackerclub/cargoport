class SeqEvent_TcpGetData extends SequenceEvent;

//this is the code for the custom kismet node to receive incoming tcp data and do somethign with it. Gotten from, http://sharewithraymond.blogspot.com/2012_02_01_archive.html

 var int receivedInt;
var float receivedFloat;
var string receivedText;

event Activated(){
	//`log("[SeqEvent_TcpGetData] event activated.");
}
 


defaultproperties
{
	ObjName="TcpGetDataEvent"
	ObjCategory="MyCustomEvents"
	bPlayerOnly=false

	MaxTriggerCount=0

//	acceptDuplicate = true

	VariableLinks(0)=(ExpectedType=class'SeqVar_Int', LinkDesc="return Int", bWriteable=false, PropertyName=retInt)
	VariableLinks(1)=(ExpectedType=class'SeqVar_Float', LinkDesc="return Float", bWriteable=false, PropertyName=retFloat)
	VariableLinks(2)=(ExpectedType=class'SeqVar_String', LinkDesc="return String", bWriteable=false, PropertyName=retString)
//	VariableLinks(3)=(ExpectedType=class'SeqVar_Bool', LinkDesc="acceptDuplicate", bWriteable=true, PropertyName=acceptDuplicate)
}