/*
 * An example usage of the TcpLink class
 *  
 * By Michiel 'elmuerte' Hendriks for Epic Games, Inc.
 *  
 * You are free to use this example as you see fit, as long as you 
 * properly attribute the origin. 
 */ 
class TcpLinkClient extends TcpLink;

var PlayerController PC;
var string TargetHost;
var int TargetPort;

event PostBeginPlay()
{
    super.PostBeginPlay();
    // Start by resolving the hostname to an IP so we can connect to it
    // Note: the TcpLink modes have been set in the defaultproperties
    `Log("[TcpLinkClient] Resolving: "$TargetHost);
    resolve(TargetHost);
}

event Resolved( IpAddr Addr )
{
    // The hostname was resolved succefully
    `Log("[TcpLinkClient] "$TargetHost$" resolved to "$ IpAddrToString(Addr));
    
    // Make sure the correct remote port is set, resolving doesn't set
    // the port value of the IpAddr structure
    Addr.Port = TargetPort;
    
    `Log("[TcpLinkClient] Bound to port: "$ BindPort() );
    if (!Open(Addr))
    {
        `Log("[TcpLinkClient] Open failed");
    }
}

event ResolveFailed()
{
    `Log("[TcpLinkClient] Unable to resolve "$TargetHost);
    // You could retry resolving here if you have an alternative
    // remote host.
}

event Opened()
{
    // A connection was established
    `Log("[TcpLinkClient] event opened");
    `Log("[TcpLinkClient] Sending simple HTTP query");
    
    // The HTTP request
    SendText("GET / HTTP/1.0"$chr(13)$chr(10));
    SendText("Host: "$TargetHost$chr(13)$chr(10));
    SendText("Connection: Close"$chr(13)$chr(10));
    SendText(chr(13)$chr(10));
    
    `Log("[TcpLinkClient] end HTTP query");
}

event Closed()
{
    // In this case the remote client should have automatically closed
    // the connection, because we requested it in the HTTP request.
    `Log("[TcpLinkClient] event closed");
    
    // After the connection was closed we could establish a new
    // connection using the same TcpLink instance.
}


    event ReceivedText( string Text )
    {
        local int i;
        local Sequence GameSeq;
        local array<SequenceObject> AllSeqEvents;

        GameSeq = WorldInfo.GetGameSequence();
        if(GameSeq != None)
        {
            GameSeq.FindSeqObjectsByClass(class'SeqEvent_TcpGetData',true, AllSeqEvents);
            for(i=0; i<AllSeqEvents.Length; i++)
            {
                `log("[TcpLinkClient] received text = "$Text);
                SeqEvent_TcpGetData(AllSeqEvents[i]).receivedText = Text;
                SeqEvent_TcpGetData(AllSeqEvents[i]).receivedInt = int(Text);
                SeqEvent_TcpGetData(AllSeqEvents[i]).receivedFloat = float(Text);
               SeqEvent_TcpGetData(AllSeqEvents[i]).CheckActivate(WorldInfo, None);           
            }
        }
    }



defaultproperties
{
    TargetHost="awesomesauce.me" //target host Garrett gives me
    TargetPort=8124 //port number Garrett gives me

}
