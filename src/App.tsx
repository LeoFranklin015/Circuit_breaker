import { useState } from "react";

import "./App.css";
import { Identity } from "@semaphore-protocol/identity";
// import { addMemberByApiKey, getGroup } from "@/utils/bandadaApi";
import { ApiSdk } from "@bandada/api-sdk";
import sindri from "sindri";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
function App() {
  const apiSdk = new ApiSdk();

  const [_identity, setIdentity] = useState<Identity>();
  const [email, setEmail] = useState("");
  const groupID = "80307533329187687257484089551323"; //change this for checking . available when u create grp in banada
  const API_KEY = "f6acbcb2-54a7-4544-ac02-8d05ff9d852f"; //change this for checking . available when u create grp in banada
  const createIdentity = async (email: string) => {
    sindri.authorize({
      apiKey: "sindri-IjDGLtsLoyz7YImxxcQSUtJp6ZgS5nSB-lEbB",
    });
    console.log("started");
    try {
      const msg_value = byt(email);

      const proof = await sindri.proveCircuit(
        "d4205533-cd52-4cff-a4a5-1511dd01bcb1",
        `{"msg": ${msg_value}}`
      );
      if (proof.proof) {
        const identity = new Identity(email);
        setIdentity(identity);
        console.log(identity);
      } else {
        alert("Your are not eligible to provide feedback");
      }
    } catch (error) {
      console.log(error);
    }

    console.log(_identity);
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
  const verify = async (emailid: string) => {
    sindri.authorize({
      apiKey: "sindri-IjDGLtsLoyz7YImxxcQSUtJp6ZgS5nSB-lEbB",
    });
    console.log("started");
    try {
      const msg_value = await byt(emailid);
      console.log(msg_value);
      const proof = await sindri.proveCircuit(
        "d4205533-cd52-4cff-a4a5-1511dd01bcb1",
        `{"msg": ${msg_value}}`
      );
      if (proof.proof) {
        console.log(proof.proof);
      }

      console.log("Verifying");
    } catch (error) {
      console.log(error);
    }
  };

  const joinBYApi = async () => {
    const groupId = "80307533329187687257484089551323";
    const memberId =
      "15880923679110155352090079129439758225025543685912606580611117184859223863833";
    const apiKey = "f6acbcb2-54a7-4544-ac02-8d05ff9d852f";
    const url = `https://api.bandada.pse.dev/groups/${groupId}/members/${memberId}`;

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        accept: "*/*",
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const byt = (email: string) => {
    const message = "leofranklin.25cs@licet.ac.in";
    const maxLength = 100;

    const encoder = new TextEncoder();
    const buffer = encoder.encode(email.padEnd(maxLength, "\0"));

    const charArray = Array.from(buffer).map((s) => s.toString());
    console.log(JSON.stringify(charArray));
    return JSON.stringify(charArray);
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
      <button onClick={joinBYApi}>joinBYApi</button>
      {/* <button onClick={verify}>Verify</button>
      <button onClick={byt}>bytes</button> */}
      <button onClick={joinBYApi}>joinBYApi</button>

      {/* <Layout /> */}
      {/* <Page /> */}

      {/* hello */}
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const decoded = jwtDecode(credentialResponse.credential!);
          console.log(decoded.email);
          setEmail(decoded.email);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </>
  );
}

export default App;
