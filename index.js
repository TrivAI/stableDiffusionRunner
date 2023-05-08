import { convertPath } from "./utils/convertPath.js";
import { getFileName } from "./utils/getFileName.js"
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

import dotenv from 'dotenv';
dotenv.config();

let stableDiffPostBodyTXTtoIMG = {
    fn_index: 77,
    data: [
        "",               // task id from /run/progress route
        "",               // index 1 prompt for stable diffusion
        "",
        [],
        20,              // sampling steps
        "Euler a",      // sampling method
        false,          // restore faces
        false,          // tiling
        1,              // batch count
        2,              // batch size
        7,              // CFG Scale
        -1,             // seed
        -1,             // 
        0,
        0,
        0,
        false,
        512,            // width 
        512,            // height
        false,
        0.7,
        2,
        "Latent",
        0,
        0,
        0,
        [],
        "None",
        false,
        false,
        "positive",
        "comma",
        0,
        false,
        false,
        "",
        "Seed",
        "",
        "Nothing",
        "",
        "Nothing",
        "",
        true,
        false,
        false,
        false,
        0,
        [],
    ]
};
let stableDiffPostBodyIMGtoIMG = {
    "fn_index": 146,
    "data": [
        "task(oqn80r8gcfxxurc)",        // task id from /run/progress route
        0,
        "make a cartoon of the pokemon shellder",
        "",
        [],
        "",           // base 64 image
        null,
        null,
        null,
        null,
        null,
        null,
        20,
        "Euler a",
        4,
        0,
        "original",
        false,
        false,
        1,
        1,            // batch size 
        7,          // CFG Scale  
        1.5,
        0.75,
        -1,
        -1,
        0,
        0,
        0,
        false,
        512,
        512,
        "Just resize",
        "Whole picture",
        32,
        "Inpaint masked",
        "",
        "",
        "",
        [],
        "None",
        "<ul>\n<li><code>CFG Scale</code> should be 2 or lower.</li>\n</ul>\n",
        true,
        true,
        "",
        "",
        true,
        50,
        true,
        1,
        0,
        false,
        4,
        1,
        "None",
        "<p style=\"margin-bottom:0.75em\">Recommended settings: Sampling Steps: 80-100, Sampler: Euler a, Denoising strength: 0.8</p>",
        128,
        8,
        [
            "left",
            "right",
            "up",
            "down"
        ],
        1,
        0.05,
        128,
        4,
        "fill",
        [
            "left",
            "right",
            "up",
            "down"
        ],
        false,
        false,
        "positive",
        "comma",
        0,
        false,
        false,
        "",
        "<p style=\"margin-bottom:0.75em\">Will upscale the image by the selected scale factor; use width and height sliders to set tile size</p>",
        64,
        "None",
        2,
        "Seed",
        "",
        "Nothing",
        "",
        "Nothing",
        "",
        true,
        false,
        false,
        false,
        0,
        [],
        "",
        "",
        ""
    ],
    // "session_hash": "kiw79r7a2v"
}
// /run/predict/ route to change settings
let settingsPostBody = {
  fn_index: 202,
  data: [
        true,
        "png",
        "pokemon",          // filename pattern for images index 2
        true,
        true,
        "png",
        false,
        true,
        false,
        -1,
        true,
        false,
        false,
        false,
        false,
        80,
        true,
        4,
        4000,
        true,
        false,
        true,
        false,
        "",
        false,
        "",
        "outputs/txt2img-images",
        "outputs/img2img-images",
        "outputs/extras-images",
        "",
        "outputs/txt2img-grids",                    //30 index
        "outputs/img2img-grids",
        "log/images",
        true,
        true,
        false,
        "[date]",
        8,
        192,
        8,
        [
            "R-ESRGAN 4x+",
            "R-ESRGAN 4x+ Anime6B"
        ],
        null,
        100,
        false,
        192,
        8,
        "CodeFormer",
        0.5,
        false,
        false,
        8,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        "",
        " ",
        1,
        500,
        false,
        false,
        false,
        120,
        null,
        0,
        0,
        "Automatic",
        true,
        1,
        1,
        false,
        false,
        "#ffffff",
        false,
        true,
        true,
        20,
        1,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        1,
        24,
        48,
        1500,
        [],
        0.5,
        true,
        false,
        true,
        "",
        "cards",
        1,
        "None",
        "None",
        false,
        true,
        false,
        true,
        true,
        true,
        true,
        true,
        "",
        true,
        true,
        false,
        true,
        true,
        0.1,
        0.05,
        "sd_model_checkpoint",
        "inpaint, sampler, checkboxes, hires_fix, dimensions, cfg, seed, batch, override_settings, scripts",
        "",
        "None",
        false,
        false,
        false,
        -1,
        "Approx NN",
        "Prompt",
        0,
        [],
        0,
        1,
        "uniform",
        0,
        0,
        1,
        0,
        false,
        [],
        [],
        5,
        null,
        null
    ],
};
let chooseModelPromptPostBody = {
    "fn_index": 203,
    "data": [
        "model.ckpt [cc6cb27103]" // or "mdjrny-v4.ckpt [5d5ad06cc2]"
    ]
}
async function POSTSettings() {
  const res = await fetch(new URL("/run/predict", process.env.STABLE_DIFFUSION_URL), {
    method: "POST",
    headers: {
      "Content-Type" : "application/json",
    },
    body: JSON.stringify(settingsPostBody),
  });
  if (!res.ok) throw new Error("Stable diffusion rejected your request.");
  console.log("Post settings good");
  return await res.json();
}

/** Function to return token from stable diffusion to track the task at hand */
async function getToken() {
  const res = await fetch(new URL('/token', process.env.STABLE_DIFFUSION_URL));
  if (!res.ok) throw new Error("Stable diffusion rejected your request.");
  // return await res.json();
  return res;
}

// console.log(await getToken().catch((error) => {throw new Error(error, "Network Error")}));

/** this function generates the stable diffusion image and returns the URL in a data object */
async function generateImageGetLocation() {
  const res = await fetch(new URL("/run/predict", process.env.STABLE_DIFFUSION_URL), {
    method: "POST",
    headers: {
      "Content-Type" : "application/json",
    },
    body: JSON.stringify(stableDiffPostBodyTXTtoIMG),
  });
  if (!res.ok) throw new Error("Stable diffusion rejected your request.");
  console.log("generateImageGetLocation good");
  return await res.json();
}

/** this function is actually what gets the image from the stable diff server */
async function getImageFromStableAPI(response) {
  console.log("this is from getImageFromStableAPI: ", response.data[0]);
  console.log(JSON.stringify(response.data[0]));
  let convertedPath = convertPath(response.data[0][0].name);
  let res = await fetch(new URL(`/file=${convertedPath}`, process.env.STABLE_DIFFUSION_URL));
  if (!res.ok) throw new Error("Failed to get image");
  return await res.arrayBuffer();
}

/**  this function creates an object that can be used to upload to google cloud storage, argument must be a date for when the image is due*/
async function imgForGoogle(datePath, category) {
  const response = await generateImageGetLocation().catch((error) => {throw new Error(error, "Network Error getting stable diffusion image path")});
  const imgArrayBuffer = await getImageFromStableAPI(response).catch((error) => {throw new Error(error, "Network Error getting stable diffusion image")});
  datePath = datePath.replace('/', '-').replace('/', '-');
  console.log("this is the datePath from imgForGoogle: ", datePath);
  return {
    buffer: Buffer.from(imgArrayBuffer),
    // the data object is an array of arrays, the first array is the image
    imgFileNameForCloud: `${datePath}/${category}/${getFileName(convertPath(response.data[0][0].name))}`,
  };
}

// const projectId = 'trivai-381102';
// const {Storage} = require('@google-cloud/storage');

// async function authenticateImplicitWithAdc() {
//   // This snippet demonstrates how to list buckets.
//   // NOTE: Replace the client created below with the client required for your application.
//   // Note that the credentials are not specified when constructing the client.
//   // The client library finds your credentials using ADC.
//   const storage = new Storage({
//     projectId,
//   });

//   const [buckets] = await storage.getBuckets();
//   console.log('Buckets:');

//   for (const bucket of buckets) {
//     console.log(`- ${bucket.name}`);
//   }

//   console.log('Listed all storage buckets.');
// }

// authenticateImplicitWithAdc();

const options = { timeZone: "America/Los_Angeles" };
const theDate = new Date().toLocaleDateString("en-US", options);

/** get the due date with argument of how many days in advance */
function getDueDate(daysInAdvance) {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate() + daysInAdvance;
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// const bucketName = 'trivai-images';
const bucketName = process.env.GOOGLE_BUCKET_NAME;

// Imports the Google Cloud client library
import {Storage} from '@google-cloud/storage';

// Creates a client
const storage = new Storage();


// google function to upload from memory to cloud storage
async function uploadFromMemory( {buffer, imgFileNameForCloud} ) {
  await storage.bucket(bucketName).file(imgFileNameForCloud).save(buffer);
  console.log(`${imgFileNameForCloud} with contents png uploaded to ${bucketName}.`);
  return `https://storage.googleapis.com/${bucketName}/${imgFileNameForCloud}`;
}


import {Configuration, OpenAIApi} from "openai"


/** Function calls ChatGPT for answer and returns string */
async function callGPT3(systemRoleContent, userRoleContent ) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: systemRoleContent},
            {role: "user", content: userRoleContent}
        ],
    });
    return completion.data.choices[0].message.content;
}

async function goodOpenAIResponseArrayOrEmpty(category, basePrompt) {
    let systemRoleContent = `You are a helpful assistant that knows a lot about ${category}. That will give me only the data as unformatted, no newlines, single text-string of a LIST (where the list of data starts with one !) and separated by only a comma of each data item and ONLY THE NAME no other information`;
    let userRoleContent = `a list of ${basePrompt}`;
    let responseArray = [];
    let counter = 0;
    let response;
    while (counter < 5) {
      response = await callGPT3(systemRoleContent, userRoleContent);
      if (response.includes("Sorry") || response.includes("I apologize") || response.includes("as an AI language model") || response.includes("I'm sorry")) {
        counter++;
        writeToFile("openAI.txt", response + "\n");
        writeToFile("openAI.txt", "OpenAI is sorry" + "\n");
      } else {
        response = removeTextBeforeNewline(response).replace(".", "");
        responseArray = extractData(response);
        if (responseArray.length > 50) {
          return responseArray.slice(0, 50);
        } else {
          counter++;
          writeToFile("openAI.txt", response + "\n");
          writeToFile("openAI.txt", "Not enough data" + "\n");
        }
      }
    }
    writeToFile("openAI.txt", `ChatGPT Failed on ${category} and ${basePrompt} \n`);
    return [`ChatGPT Failed on ${category} and ${basePrompt}`];
}

// /** */
// async function goodOpenAIResponseArrayOrAbort(systemRoleContent, userRoleContent) {
//     let response = await getArrayFromOpenAI(systemRoleContent, userRoleContent);
//     if (response.includes("abort")) {
//         return false;
//     } else {
//         return response;
//     }
// }

import cron from "node-cron";
// var cron = require('node-cron');

// cron.schedule('0-59 * * * * *', () => {
//   console.log('running a task every minute');
// });


async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function extractData(thestring) {
  let data = thestring.split(",");
  data = data.map((item) => item.trim());
  return data;
}


function removeTextBeforeNewline(str) {
  return str.replace(/^.*[!\n]/s, '');
}


async function main() {
  let basePrompt;
  let sdPrompt;
  let keywordIDArray = [];

  // uploadFromMemory(await imgForGoogle());
  const activeCategories = await getLatestActiveCategories();
  console.log("there are the active categories: ");
  console.log(activeCategories);
  for (let i = 0; i < activeCategories.length; i++) {
    let answerArray = [];
    let questionArray = [];
    let questionDataModel = {
      category: "",
      correctAnswer: "",
    }
    questionDataModel.category = activeCategories[i].category;
    let { id, keyword } = await getLatestUnUsedKeyword(questionDataModel.category);
    if (id || keyword) {
      keywordIDArray.push(id);
      basePrompt = activeCategories[i].basePrompt.replace("_", keyword);
    } else {
      basePrompt = activeCategories[i].basePrompt.replace("_", "");
    }
    sdPrompt = activeCategories[i].sdPrompt;

    answerArray = await goodOpenAIResponseArrayOrEmpty(questionDataModel.category, basePrompt);
    if (answerArray.length === 1) {
      await createError({
        errorType: "GPT3-turbo",
        errorMessage: answerArray[0],
      });
      continue;
    }

    questionArray = answerArray.map((answer)=> {
      questionDataModel.correctAnswer = answer;
      return {...questionDataModel};
    });

    let questionDataResponse = await createManyQuestionData(questionArray);
    console.log("this is how many questions have been added: ", questionDataResponse);
    settingsPostBody.data[2] = questionDataModel.category;
    settingsPostBody.data[30] = `outputs\\${questionDataModel.category}`
    try {
      await POSTSettings();
    } 
    catch (err) {
      console.log("trying again to post settings");
      console.log(err);
      await POSTSettings();
    }
    await asyncForEach(questionArray, async (question, index) => {
      let answers;
      let answer1;
      let answer2;
      let answer3;
      let dateDue;
      let interval = 10;
      try {
        answers = await getRandomAnswersFromQuestionData(question.category);    
        // console.log("answers: ", answers); 
      }
      catch (err) {
        console.log(err);
      }
      try {
        if (answers.length < 3) {
          throw new Error("Not enough answers");
        }
        answer1 = answers[0].correctAnswer;
        answer2 = answers[1].correctAnswer;
        answer3 = answers[2].correctAnswer;          
      }
      catch (err) {
        console.log(err);
      }
      stableDiffPostBodyTXTtoIMG.data[1] = `${sdPrompt} ${question.correctAnswer}`;
      dateDue = getDueDate(Math.floor(index/interval) + 1);
      let image = await uploadFromMemory(await imgForGoogle(dateDue, question.category));

      Object.assign(question, {answer1, answer2, answer3, image, dateDue});  
    });

        
    writeToFile("log.txt", JSON.stringify(questionArray, null, 2));
    let questionResponse = await createManyQuestions(questionArray);
    console.log("this is how many questions have been added: ", questionResponse);
    console.log("");
  }
  // console.log("Number of keywords set isUsed to true:");
  // console.log(await updateManyKeywords(keywordIDArray));
}
main();

// let res = await uploadFromMemory(await imgForGoogle());
// console.log(res);

function writeToFile(fileName, data) {
  fs.appendFile(fileName, data, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Data has been written to ${fileName}.`);
  });
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

async function getRandomAnswersFromQuestionData(category) {
  let firstQuestion = await prisma.questionData.findFirst({
      where: {
        category: category,
    },
    select: {
      id: true,
    },
  });
  let lastQuestion = await prisma.questionData.findFirst({
    where: {
      category: category,
    },
    select: {
      id: true,
    },
    take: -1,
  });
  let random1 = randomIntFromInterval(firstQuestion.id, lastQuestion.id);
  let random2 = randomIntFromInterval(firstQuestion.id, lastQuestion.id);
  let random3 = randomIntFromInterval(firstQuestion.id, lastQuestion.id);
  while (random1 == random2) {
    random2 = randomIntFromInterval(firstQuestion.id, lastQuestion.id);
  }
  while (random1 == random3 || random2 == random3) {
    random3 = randomIntFromInterval(firstQuestion.id, lastQuestion.id);
  }
  // writeToFile("randomAnswersLog.txt", `firstQuestion: ${firstQuestion.id}, lastQuestion: ${lastQuestion.id}, random1: ${random1}, random2: ${random2}, random3: ${random3}\n`);
  return await prisma.questionData.findMany({
    where: {
      category: category,
      id: {
        in: [random1, random2, random3],
      }
    },
    select: {
      correctAnswer: true,
    },
  });
}

//console.log(await getRandomAnswersFromQuestionData("horror"));

async function createError(errorObject) {
  return await prisma.error.create({
    data: errorObject,
  });
}

async function updateManyQuestionData(arrayOfIds) {
  return await prisma.questionData.updateMany({
    where: {
      id: {
        in: arrayOfIds,
      },
    },
    data: {
      isUsed: true,
    },
  });
}

async function updateManyKeywordsTrue(arrayOfIds) {
  return await prisma.keywordPrompt.updateMany({
    where: {
      id: {
        in: arrayOfIds,
      },
    },
    data: {
      isUsed: true,
    },
  });
}
async function updateManyKeywordsFalse(arrayOfIds) {
  return await prisma.keywordPrompt.updateMany({
    where: {
      id: {
        in: arrayOfIds,
      },
    },
    data: {
      isUsed: false,
    },
  });
}

/** Creates many rows of question data from array following QuestionData model */
async function createManyQuestionData(arrayOfData) {
  return await prisma.questionData.createMany({
    data: arrayOfData,
  });
}
let data = [
    {
      category: 'FILMS',
      correctAnswer: 'Halloween',
      answer1: 'The Babadook',
      answer2: 'The Witch',
      answer3: 'The Birds',
      image: 'https://storage.googleapis.com/trivai-images/5-4-2023/grid-0000.png',
      dateDue: '5/4/2023'
    },
    {
      category: 'FILMS',
      correctAnswer: 'The Shining',
      answer1: 'Let the Right One In',
      answer2: 'Children of the Corn',
      answer3: 'The Birds',
      image: 'https://storage.googleapis.com/trivai-images/5-4-2023/grid-0001.png',
      dateDue: '5/4/2023'
    },
    {
      category: 'FILMS',
      correctAnswer: 'Psycho',
      answer1: 'The Babadook',
      answer2: 'The Fly',
      answer3: '28 Days Later',
      image: 'https://storage.googleapis.com/trivai-images/5-4-2023/grid-0002.png',
      dateDue: '5/4/2023'
    }
  ];
/** Creates many rows of questions from array following Question model */
async function createManyQuestions(questionArray) {
  return await prisma.question.createMany({
    data: questionArray,
  });
}

async function createQuestion({category, correctAnswer, answer1, answer2, answer3, image, dateDue}) {
  return await prisma.question.create({
    data: {
      category: category,
      correctAnswer: correctAnswer,
      answer1: answer1,
      answer2: answer2,
      answer3: answer3,
      image: image,
      dateDue: dateDue,
    },
  });
}

async function getQuestionData(category) {
  let questionData = await prisma.questionData.findMany({
    where: {
      category: category,
      isUsed: false,
    },
  });
  return questionData;
}

async function addToAnswers(arrayOfAnswers) {
  await prisma.answer.createMany({
    data: arrayOfAnswers,
  });
}

async function getLatestActiveCategories() {
  let categories = await prisma.quizCategory.findMany({
    where: {
      isActive: true,
    }
  });
  return categories;
}

/** argument: string | return: object with only id and keyword */ 
async function getLatestUnUsedKeyword(category) {         
  let keywords = await prisma.keywordPrompt.findFirst({
    where: {
      isUsed: false,
      category: category,
    },
    select: {
      id: true,
      keyword: true,
    },
  });
  return keywords;
}


// data will be filled by GPT-3
let categoryDataForQuestions = {
  category: "FILMS",
  prompt: "Give me an unformatted, no newlines, single textstring of a list seperated by only a comma of 70 super cars of any year",
  data: ["Lamborghini Huracan", "Lamborghini Aventador", "Lamborghini Gallardo", "Lamborghini Murcielago", "Lamborghini Diablo", "Lamborghini Countach", "Lamborghini Miura", "Lamborghini Espada", "Lamborghini Jarama", "Lamborghini Urraco", "Lamborghini Silhouette", "Lamborghini Jalpa", "Lamborghini LM002", "Lamborghini 350 GT", "Lamborghini 400 GT", "Lamborghini 400 GT 2+2", "Lamborghini Islero", "Lamborghini Islero S", "Lamborghini Marzal" ],

}

