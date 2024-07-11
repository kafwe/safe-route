// import the playht SDK
import * as PlayHT from "playht";
import fs from "fs";
import { exit } from "process";
const userId = "OOXo1w0q1FUb7x2WHwyv9Wj5QrB2";
const secretKey = "6adec69ee40a468098d587cad52e4faa";


// Initialize PlayHT API with your credentials
PlayHT.init({
    apiKey: secretKey,
    userId: userId,
    defaultVoiceId: "s3://voice-cloning-zero-shot/65ccc48d-fc0b-479b-83ae-2e146e17f850/original/manifest.json",
    defaultVoiceEngine: 'PlayHT2.0',
});

// configure your stream
const streamingOptions = {
    // must use turbo for the best latency
    voiceEngine: "PlayHT2.0-turbo",
    // this voice id can be one of our prebuilt voices or your own voice clone id, refer to the`listVoices()` method for a list of supported voices.
    voiceId:
        "s3://voice-cloning-zero-shot/65ccc48d-fc0b-479b-83ae-2e146e17f850/original/manifest.json",
    // you can pass any value between 8000 and 48000, 24000 is default
    sampleRate: 44100,
    // the generated audio encoding, supports 'raw' | 'mp3' | 'wav' | 'ogg' | 'flac' | 'mulaw'
    outputFormat: 'mp3',
    // playback rate of generated speech
    speed: 0.9,
};

// start streaming!
const text = `"Recalculating route."
"You are on the fastest route."
"There is heavy traffic ahead."
"Accident reported ahead."
"You have arrived at your destination."
"Please make a U-turn when possible."
"Follow the detour signs."
"There is a road closure ahead."
"Turn right at the next intersection."
"Stay on the service road for 2 kilometers."`;

const stream = await PlayHT.stream(text, streamingOptions);

stream.on("data", (chunk) => {
    // Do whatever you want with the stream, you could save it to a file, stream it in realtime to the browser or app, or to a telephony system
    // write to mp3 file
    console.log(chunk);
    fs.appendFileSync("output.mp3", chunk);
    //close the file
    console.log("chunk written");
    // exit();
});

stream.on("end", () => {
    console.log("stream end");
});

stream.on("error", (error) => {
    console.error("stream error", error);
});

stream.on("close", () => {
    console.log("stream close");
});


