import OpenAI from "openai";

const aimlApi = new OpenAI({
  apiKey: "6151375b3c737ec2b95ed6fb24302f3b",
  baseURL: "https://api.aimlapi.com/v1",
});

async function testModels() {
  const modelsToTest = [
    "meta-llama/Meta-Llama-3-8B-Instruct",
    "meta-llama/Llama-3-8b-chat-hf",
    "mistralai/Mistral-7B-Instruct-v0.2",
    "Qwen/Qwen2-72B-Instruct",
    "gpt-3.5-turbo"
  ];

  for (const m of modelsToTest) {
    try {
      await aimlApi.chat.completions.create({
        model: m,
        messages: [{ role: "user", content: "test" }],
        max_tokens: 5
      });
      console.log(`✅ ${m} works`);
    } catch (e) {
      console.log(`❌ ${m} failed: ${e.message}`);
    }
  }
}

testModels();
