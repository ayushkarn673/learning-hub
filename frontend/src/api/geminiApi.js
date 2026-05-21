import axios from "axios";

const API_KEY =
    import.meta.env.VITE_GEMINI_API_KEY;

export const generateRoadmap =
    async (skill) => {
        try {
            const response =
                await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
                    {
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `Create a learning roadmap for ${skill}.\nReturn ONLY topic names.\nRules:\n- One topic per line\n- Beginner to advanced\n- No numbering\n- No explanations\n- Max 10 topics`
                                    }
                                ]
                            }
                        ]
                    }
                );

            return response.data
                .candidates[0]
                .content.parts[0]
                .text;
        } catch (error) {
            console.error("Gemini API failed for Roadmap:", error);
            return `Introduction to ${skill}\nCore Concepts of ${skill}\nIntermediate ${skill} Techniques\nAdvanced ${skill} Patterns\nReal World ${skill} Projects`;
        }
    };

export const generateNoteContent =
    async (topic) => {
        try {
            const response =
                await axios.post(

                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,

                    {
                        contents: [
                            {
                                parts: [
                                    {
                                        text:
                                            `
Create highly concise, professional, and structured learning notes or study guide for the topic: "${topic}".
Include key bullet points, a quick code snippet or example if applicable, and best practices.
                                        `
                                    }
                                ]
                            }
                        ]
                    }
                );

            return response.data
                .candidates[0]
                .content.parts[0]
                .text;
        } catch (error) {
            console.warn("Gemini API Rate Limit or Error. Generating offline fallback study notes for: ", topic);
            return `
### 📝 Study Guide: ${topic}

* **Core Explanation**:
  - Understanding the key underlying mechanisms and theoretical architectures.
  - Helps to decouple complex operations into reusable, modular segments.

* **💻 Best Practice Example**:
\`\`\`javascript
// Keep logic simple, structured, and easy to maintain
const initializeTopic = (config) => {
  if (!config) return null;
  return { ...config, active: true };
};
\`\`\`

* **💡 Best Practices**:
  - Always clean up event listeners, resources, and connections.
  - Implement strong validation and type checks at every boundary.
            `.trim();
        }
    };