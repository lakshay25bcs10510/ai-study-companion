import { createContext, useEffect, useState, useContext } from "react";
import { db } from "../services/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { AuthContext } from "./AuthContext";

export const StudyContext = createContext();

export default function StudyProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [topics, setTopics] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
  if (!user) return;

  
  const topicQuery = query(
    collection(db, "topics"),
    where("userId", "==", user.uid)
  );

  const unsubscribeTopics = onSnapshot(topicQuery, (snapshot) => {
    setTopics(
      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    );
  });

  
  const taskQuery = query(
    collection(db, "tasks"),
    where("userId", "==", user.uid)
  );

  const unsubscribeTasks = onSnapshot(taskQuery, (snapshot) => {
    setTasks(
      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    );
  });

  
  return () => {
    unsubscribeTopics();
    unsubscribeTasks();
  };
}, [user]);

  return (
    <StudyContext.Provider value={{ topics, tasks }}>
      {children}
    </StudyContext.Provider>
  );
}