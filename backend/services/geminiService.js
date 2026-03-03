const { GoogleGenerativeAI } = require("@google/generative-ai");

// initialize once using environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generatePlan(data) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a professional fitness trainer and nutritionist.


User BMI: ${data.bmi}
Goal: ${data.goal}
Muscle: ${data.muscle}
Variation: ${data.variation}
Average Pressure: ${data.percentage}

Generate:
1. Best variation suggestion
2. Weekly workout split
3. Diet plan
4. Calories
5. Protein requirement

Return structured JSON.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { generatePlan };
