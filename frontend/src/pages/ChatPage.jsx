import { useParams } from "react-router";
import { useState, useEffect } from 'react';
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { chatId:targetUserId } = useParams();
  
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data:tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser // this will only run when authUser is available
  });

useEffect(() => {
  let client;

  const initChat = async () => {
    if (!tokenData?.token || !authUser) return;

    try {
      // Disconnect previous client if it exists
      if (chatClient) {
        await chatClient.disconnectUser();
        setChatClient(null);
        setChannel(null);
      }

      client = StreamChat.getInstance(STREAM_API_KEY);

      await client.connectUser(
        {
          id: authUser._id,
          name: authUser.username,
          image: authUser.profilePic,
        },
        tokenData.token
      );

      const channelId = [authUser._id, targetUserId].sort().join('-');
      const currChannel = client.channel("messaging", channelId, {
        members: [authUser._id, targetUserId]
      });

      await currChannel.watch();
      setChatClient(client);
      setChannel(currChannel);
    } catch (error) {
      console.error("Error initializing chat:", error);
      toast.error("Could not connect to chatClient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  initChat();

  // Cleanup: disconnect client and clear state
  return () => {
    if (client) {
      client.disconnectUser();
      setChatClient(null);
      setChannel(null);
    }
  };
}, [tokenData, authUser, targetUserId]);

const handleVideoCall = () => {
  if(channel) {
    const callUrl = `${window.location.origin}/call/${channel.id}`;

    channel.sendMessage({
      text: `I have started a video call. Join me here: ${callUrl}`,
    })
    toast.success("Video call link sent successfully!")
  }
};

  if(loading || !chatClient || !channel) return <ChatLoader />

return (
  <div className="h-[93vh]">
    <Chat client={chatClient}>
      <Channel channel={channel}>
        <div className="w-full relative">
          <CallButton handleVideoCall={handleVideoCall} />
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput focus />
          </Window>
        </div>
        <Thread />
      </Channel>
    </Chat>
  </div>
)
}
export default ChatPage;
