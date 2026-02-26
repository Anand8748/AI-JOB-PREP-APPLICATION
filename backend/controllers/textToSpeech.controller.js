import { PollyClient, SynthesizeSpeechCommand, DescribeVoicesCommand } from "@aws-sdk/client-polly";

// Check if AWS credentials are available
const checkAwsCredentials = () => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || 'us-east-1';

  if (!accessKeyId || !secretAccessKey) {
    console.error('AWS credentials not found in environment variables');
    console.error('Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file');
    return false;
  }

  console.log('AWS Configuration:');
  console.log('- Access Key ID:', accessKeyId ? 'Set' : 'NOT SET');
  console.log('- Secret Access Key:', secretAccessKey ? 'Set' : 'NOT SET');
  console.log('- Region:', region);
  
  return true;
};

// Configure AWS Polly v3
const pollyClient = checkAwsCredentials() ? new PollyClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
}) : null;

const voiceCache = new Map();
const VOICE_CACHE_TTL_MS = 10 * 60 * 1000;

const escapeSsml = (text) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const buildSsml = (text, style) => {
  if (text.trim().startsWith("<speak>")) {
    return text;
  }

  const escaped = escapeSsml(text);
  const withPauses = escaped.replace(/([.!?])\s+/g, '$1 <break time="200ms"/> ');
  const domainTag = style ? `<amazon:domain name="${style}">` : "";
  const domainClose = style ? `</amazon:domain>` : "";

  return `<speak>${domainTag}<prosody rate="98%" pitch="+0%">${withPauses}</prosody>${domainClose}</speak>`;
};

const preferredVoicesByLanguage = {
  "en-US": ["Joanna", "Matthew", "Ivy", "Kendra", "Kimberly", "Salli", "Joey", "Justin"],
  "en-GB": ["Amy", "Emma", "Brian"],
  "en-AU": ["Nicole", "Russell"],
  "en-IN": ["Aditi", "Raveena"],
  "en-IE": ["Niamh"],
  "en-ZA": ["Ayanda"],
  "fr-FR": ["Lea", "Celine", "Mathieu"],
  "de-DE": ["Vicki", "Marlene", "Hans"],
  "es-ES": ["Lucia", "Enrique", "Conchita"],
  "it-IT": ["Bianca", "Adriano", "Carla"],
  "pt-BR": ["Camila", "Vitoria", "Ricardo"],
  "ja-JP": ["Takumi", "Mizuki"],
  "ko-KR": ["Seoyeon"]
};

const getCachedVoices = (languageCode) => {
  const cached = voiceCache.get(languageCode);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > VOICE_CACHE_TTL_MS) {
    voiceCache.delete(languageCode);
    return null;
  }
  return cached.voices;
};

const cacheVoices = (languageCode, voices) => {
  voiceCache.set(languageCode, { voices, timestamp: Date.now() });
};

const resolveBestVoice = async ({ voiceId, languageCode }) => {
  if (voiceId && voiceId !== "auto") {
    return voiceId;
  }

  // If Polly client is not available, return default voice
  if (!pollyClient) {
    return "Joanna";
  }

  const lang = languageCode || "en-US";
  const cachedVoices = getCachedVoices(lang);
  const voices = cachedVoices || await (async () => {
    const command = new DescribeVoicesCommand({
      Engine: "neural",
      LanguageCode: lang
    });
    const data = await pollyClient.send(command);
    const neuralVoices = (data?.Voices || []).map((voice) => voice.Id);
    cacheVoices(lang, neuralVoices);
    return neuralVoices;
  })();

  if (!voices.length) {
    return "Joanna";
  }

  const preferred = preferredVoicesByLanguage[lang] || [];
  const selected = preferred.find((name) => voices.includes(name));
  return selected || voices[0];
};

export async function textToSpeech(req, res) {
  try {
    // Check if AWS credentials are configured
    if (!pollyClient) {
      console.error('AWS Polly client not initialized - missing credentials');
      return res.status(500).json({ 
        error: "AWS credentials not configured",
        message: "Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file"
      });
    }

    const {
      text,
      voiceId = 'auto',
      outputFormat = 'mp3',
      textType = 'ssml',
      style = 'conversational',
      languageCode = 'en-US'
    } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required for text-to-speech conversion" });
    }

    const useSsml = textType === "ssml";
    const textPayload = useSsml ? buildSsml(text, style) : text;

    const selectedVoiceId = await resolveBestVoice({ voiceId, languageCode });

    const command = new SynthesizeSpeechCommand({
      Text: textPayload,
      TextType: useSsml ? "ssml" : "text",
      OutputFormat: outputFormat,
      VoiceId: selectedVoiceId,
      Engine: 'neural'
    });

    let data;
    try {
      data = await pollyClient.send(command);
    } catch (error) {
      if (useSsml && error.name === "InvalidSsmlException") {
        const fallbackCommand = new SynthesizeSpeechCommand({
          Text: text,
          TextType: "text",
          OutputFormat: outputFormat,
          VoiceId: selectedVoiceId,
          Engine: 'neural'
        });
        data = await pollyClient.send(fallbackCommand);
      } else {
        throw error;
      }
    }

    // Set appropriate headers for audio file
    res.setHeader('Content-Type', `audio/${outputFormat}`);
    res.setHeader('Content-Disposition', `inline; filename="speech.${outputFormat}"`);
    
    // Convert stream to buffer using async iterator
    const chunks = [];
    for await (const chunk of data.AudioStream) {
        chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);
    res.send(audioBuffer);

  } catch (error) {
    console.error("Text-to-speech error:", error);
    res.status(500).json({ error: "Error converting text to speech" });
  }
}

export async function getAvailableVoices(req, res) {
  try {
    // Check if AWS credentials are configured
    if (!pollyClient) {
      console.error('AWS Polly client not initialized - missing credentials');
      return res.status(500).json({ 
        error: "AWS credentials not configured",
        message: "Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file"
      });
    }

    const command = new DescribeVoicesCommand({
      Engine: 'neural' // Only get neural voices
    });
    
    const data = await pollyClient.send(command);
    
    // Format response
    const neuralVoices = data.Voices.map(voice => ({
      id: voice.Id,
      name: voice.Name,
      gender: voice.Gender,
      languageCode: voice.LanguageCode,
      languageName: voice.LanguageName
    }));

    res.json({
      success: true,
      voices: neuralVoices
    });
  } catch (error) {
    console.error("Error fetching voices:", error);
    res.status(500).json({ error: "Error fetching available voices" });
  }
}
