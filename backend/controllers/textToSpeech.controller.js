import { PollyClient, SynthesizeSpeechCommand, DescribeVoicesCommand } from "@aws-sdk/client-polly";

// Configure AWS Polly v3
const pollyClient = new PollyClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

export async function textToSpeech(req, res) {
  try {
    const { text, voiceId = 'Joanna', outputFormat = 'mp3' } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required for text-to-speech conversion" });
    }

    // Validate voiceId
    const validVoices = [
      'Joanna', 'Matthew', 'Ivy', 'Justin', 'Kendra', 'Kimberly', 'Salli', 'Nicole',
      'Russell', 'Amy', 'Brian', 'Emma', 'Raveena', 'Aditi', 'Geraint', 'Gwyneth'
    ];

    if (!validVoices.includes(voiceId)) {
      return res.status(400).json({ 
        error: "Invalid voice ID. Valid options: " + validVoices.join(', ') 
      });
    }

    const command = new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: outputFormat,
      VoiceId: voiceId,
      Engine: 'neural' // Use neural engine for better quality
    });

    const data = await pollyClient.send(command);

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
