// import classes from openai pacake. configuration is for API key, and openAIApi is for making API requests
import { Configuration, OpenAIApi } from "openai";

// passes API key from env
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
// creates instance of openAIApi using above configuration
const openai = new OpenAIApi(configuration);

// checks whether API key is set
export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const userInput = req.body.userInput || "";
  if (userInput.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Oops, you did not enter anything",
      },
    });
    return;
  }

  // sets the options for the API
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(userInput),
      temperature: 0,
      max_tokens: 300,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // error handling
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(userInput) {
  const capitalizedUserInput =
    userInput[0].toUpperCase() + userInput.slice(1).toLowerCase();
  return `you are playing the role of an AI therapy assistant. The assistant is helpful, friendly, can psycho-analyse (but not explicitly diagnose), and aims to discourage and provide solutions to irrational behavior. \n\n Assistant: How are you today? \n\n User: ${capitalizedUserInput} \n\n Assistant:`;
}
