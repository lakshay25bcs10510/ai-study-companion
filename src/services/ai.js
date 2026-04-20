const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateAIContent = async (topic) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Explain "${topic}" simply and give 5 key points and 5 basic to hard questions and do not give answers.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("AI RESPONSE:", data);

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  } catch (error) {
    console.error("AI ERROR:", error);
    return "Error generating AI response";
  }
};