import React, { memo } from "react";
import "./contacts.css";
import Link from "next/link";
import Image from "next/image";

const Contacts = memo(function Contacts() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessag] = React.useState("");

  const sendMail = async () => {
    const data = { name, email, message };
    try {
      await fetch("/api", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="contacts">
      <div className="CONTRACTS">CONTACTS</div>
      <div className="infoContacts">
        <div className="Linke">
          <Link target="_blank" href={"https://vk.com/kypatz"}>
            <Image alt="vk" src={"/image/icon/vk.jpg"} height={50} width={50}               placeholder="blur"
              blurDataURL={"/image/icon/vk.jpg"} />
          </Link>
          <Link target="_blank" href={"https://github.com/LiiChar"}>
            <Image
              alt="github"
              src={"/image/icon/github.png"}
              height={50}
              width={50}
              placeholder="blur"
              blurDataURL={"/image/icon/github.png"}
            />
          </Link>
        </div>
        <div className="Message">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input nameInput"
            placeholder="Name"
            type="text"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input emailInput"
            placeholder="Enter email"
            type="text"
          />
          <textarea
            value={message}
            onChange={(e) => setMessag(e.target.value)}
            className="textaria messageInput"
            placeholder="Your message"
            type="text"
          />
          <button className="buttonEmail" onClick={() => sendMail()}>
            SUBMIT
          </button>
        </div>
        <div className="Linke">
          <Link target="_blank" href={"http://linkedin.com/"}>
            <Image
              alt="linkedIn"
              src={"/image/icon/linkedLn.png"}
              height={50}
              width={50}
              placeholder="blur"
              blurDataURL={"/image/icon/linkedLn.png"}
            />
          </Link>
          <Link target="_blank" href={"https://t.me/lLItaV"}>
            <Image
              alt="telegram"
              src={"/image/icon/telegram.png"}
              height={50}
              width={50}
              placeholder="blur"
              blurDataURL={"/image/icon/telegram.png"}
            />
          </Link>
        </div>
      </div>
      <div className="triangle_left"></div>
      <div className="triangle_rigth"></div>
      <div className="block"></div>
    </div>
  );
});

export default Contacts;
