import { useContext, useState } from "react";
import { StudyContext } from "../context/StudyContext";
import TopicForm from "../components/TopicForm";
import { db } from "../services/firebase";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { generateAIContent } from "../services/ai";

export default function Dashboard() {
  const { topics, tasks } = useContext(StudyContext);

  
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  
  const today = new Date().toDateString();

  const todaysTasks = tasks.filter(task =>
    new Date(task.date).toDateString() === today
  );

  
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;

  const progress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  
  const handleAI = async (topic) => {
    setAiLoading(true);
    setSelectedTopic(topic);
    setAiData("");

    const result = await generateAIContent(topic);

    setAiData(result);
    setAiLoading(false);
  };

  
  const markComplete = async (topic) => {
    await updateDoc(doc(db, "topics", topic.id), {
      completed: true,
    });

  
    await addDoc(collection(db, "tasks"), {
      topicId: topic.id,
      userId: topic.userId,
      type: "study",
      date: new Date().toISOString(),
      completed: false,
    });

  
    const intervals = [2, 5, 10];

    for (let days of intervals) {
      const date = new Date();
      date.setDate(date.getDate() + days);

      await addDoc(collection(db, "tasks"), {
        topicId: topic.id,
        userId: topic.userId,
        type: "revision",
        date: date.toISOString(),
        completed: false,
      });
    }
  };

  
  const markTaskDone = async (taskId) => {
    await updateDoc(doc(db, "tasks", taskId), {
      completed: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">

  
      <div className="bg-white shadow p-4 flex justify-between">
        <h1 className="font-bold text-xl">StudySync</h1>
        <span className="text-sm text-gray-500">AI Study Companion 🚀</span>
      </div>

      <div className="p-6 max-w-2xl mx-auto">

  
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-semibold mb-2">Progress</h2>

          <div className="w-full bg-gray-200 h-3 rounded">
            <div
              className="bg-blue-500 h-3 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm mt-2 text-gray-600">
            {progress}% completed
          </p>
        </div>

  
        <div className="mb-6">
          <TopicForm />
        </div>

  
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Today’s Work</h2>

          {todaysTasks.length === 0 ? (
            <div className="bg-white p-4 rounded text-center text-gray-500">
              🎉 Nothing scheduled today
            </div>
          ) : (
            todaysTasks.map(task => {
              const topic = topics.find(t => t.id === task.topicId);

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded mb-2 flex justify-between 
                  ${task.completed ? "bg-green-100" : "bg-yellow-100"}`}
                >
                  <div>
                    <p className="font-medium">{topic?.topic}</p>
                    <p className="text-sm">{task.type}</p>
                  </div>

                  {task.completed ? (
                    <span>✅</span>
                  ) : (
                    <button
                      className="bg-blue-500 text-white px-2 rounded"
                      onClick={() => markTaskDone(task.id)}
                    >
                      Done
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

  
        {aiLoading && (
          <div className="bg-white p-4 rounded shadow mb-6">
            ⏳ Generating AI response...
          </div>
        )}

        {aiData && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-semibold mb-2">
              AI Assistant – {selectedTopic}
            </h2>

            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {aiData}
            </pre>
          </div>
        )}

  
        <div>
          <h2 className="font-semibold mb-2">Your Topics</h2>

          {topics.map(t => (
            <div
              key={t.id}
              className="bg-white p-4 rounded shadow mb-2 flex justify-between"
            >
              <div>
                <p>{t.topic}</p>
                <p className="text-sm text-gray-500">{t.subject}</p>
              </div>

              <div className="flex gap-2">
                <button
                  className="bg-purple-500 text-white px-2 rounded"
                  onClick={() => handleAI(t.topic)}
                >
                  AI
                </button>

                {t.completed ? (
                  <span>✅</span>
                ) : (
                  <button
                    className="bg-green-500 text-white px-2 rounded"
                    onClick={() => markComplete(t)}
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
