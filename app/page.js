"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { firebaseApp, TARGET_COLLECTION_NAME, db } from "../libs/firebase";

export default function Home() {
  const [text, setText] = useState();
  const [currentUser, setCurrentUser] = useState("いけだ");
  const [chatList, setChatList] = useState([]);

  const onChangeText = (e) => {
    setText(e.target.value);
  };

  const onChangeUser = (e) => {
    setCurrentUser(e.target.value);
  };

  useEffect(() => {
    let data;
    let collectionMessages = [];
    onSnapshot(collection(db, TARGET_COLLECTION_NAME), (snapshot) => {
      collectionMessages = [];
      snapshot.forEach((doc) => {
        data = doc.data();
        collectionMessages.push(data);
      });
      const sortedMessages = collectionMessages.sort(function (a, b) {
        return a.createdAt - b.createdAt;
      });
      setChatList(sortedMessages);
    });
  }, []);

  const element = document.documentElement;
  const bottom = element.scrollHeight - element.clientHeight;
  window.scroll(0, bottom);

  const submitText = async () => {
    try {
      const db = getFirestore(firebaseApp);
      const col = collection(db, TARGET_COLLECTION_NAME);
      await addDoc(col, {
        user: currentUser,
        text: text,
        createdAt: new Date(),
      });
      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="bg-red-100 h-screen">
      <section className="sticky top-0 h-14 flex justify-between w-full bg-red-100 items-center">
        <div className="flex items-center">
          <Image src="arrow.svg" width={40} height={40} />
          <p className="font-semibold">山登り</p>
        </div>
        <div className="flex gap-3 pr-3">
          <Image src="search.svg" width={20} height={20} />
          <Image src="phone.svg" width={20} height={20} />
          <Image src="memo.svg" width={20} height={20} />
        </div>
      </section>
      <section className="pb-16 bg-red-100">
        {chatList.map(({ user, text }, index) => (
          <div
            key={index}
            className={`pl-3 pr-3 w-full ${
              user === currentUser ? " text-right" : ""
            }`}
          >
            <div
              className={`flex mt-3 ${
                user === currentUser ? " justify-end" : ""
              }`}
            >
              <Image
                className={`rounded-full ${
                  user === currentUser ? " order-last ml-2" : "mr-2"
                }`}
                src={
                  user === "しずや"
                    ? "/person.jpg"
                    : user === "いけだ"
                    ? "/person2.jpg"
                    : "/person3.jpg"
                }
                width={30}
                height={30}
              />
              <p className="">{user}</p>
            </div>
            <p
              className={`rounded-xl w-fit p-2 ml-5 break-words ${
                user === currentUser
                  ? "bg-sky-200 ml-auto mr-5"
                  : "bg-white ml-5"
              }`}
            >
              {text}
            </p>
          </div>
        ))}
      </section>
      <section className="fixed h-14 w-full bottom-0 flex items-center justify-center gap-2 bg-white p-3">
        <select onChange={onChangeUser}>
          <option value="いけだ" checked={currentUser === "いけだ"}>
            いけだ
          </option>
          <option value="しずや" checked={currentUser === "しずや"}>
            しずや
          </option>
          <option value="まつの" checked={currentUser === "まつの"}>
            まつの
          </option>
        </select>
        <input
          className="bg-slate-100 h-full rounded-full px-3"
          value={text}
          onChange={onChangeText}
        />
        <button onClick={submitText}>
          <Image src="/send.png" width={20} height={20} />
        </button>
      </section>
    </main>
  );
}
