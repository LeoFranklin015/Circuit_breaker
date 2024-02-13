import { useState } from "react";

import "./App.css";
import { Identity } from "@semaphore-protocol/identity";
// import { addMemberByApiKey, getGroup } from "@/utils/bandadaApi";
import { ApiSdk } from "@bandada/api-sdk";
function App() {
  const apiSdk = new ApiSdk();
  const [_identity, setIdentity] = useState<Identity>();
  const [email, setEmail] = useState("");
  const groupID = "80307533329187687257484089551323"; //change this for checking . available when u create grp in banada
  const API_KEY = "f6acbcb2-54a7-4544-ac02-8d05ff9d852f"; //change this for checking . available when u create grp in banada
  const createIdentity = async (email: string) => {
    const identity = new Identity(email);

    setIdentity(identity);

    console.log(identity);
    console.log("Your new Semaphore identity was just created 🎉");
  };

  const joinGroup = async () => {
    const groupId = groupID;
    const commitment = _identity?.commitment.toString();
    console.log(commitment);
    const apiKey = API_KEY;
    const isMember = await apiSdk.isGroupMember(groupId, commitment);
    console.log(isMember);
    if (!isMember) {
      try {
        await apiSdk.addMemberByApiKey(groupId, commitment, apiKey);
      } catch (error) {
        alert(error);
      }
    } else {
      alert("Already joined the group using this email");
    }

    console.log("Joined Successfully");
  };

  return (
    <>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)} // Update email state on input change
      />
      <button onClick={() => createIdentity(email)}>Create Identity</button>
      <button onClick={joinGroup}>Join</button>

      {/* hello */}
    </>
  );
}

export default App;
