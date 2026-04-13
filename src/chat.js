import { model } from "./firebase-init.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore";
import { app } from "./firebase-init.js";

const db = getFirestore(app);

// 💬 বেসিক চ্যাট (Single Turn)
export async function sendMessage(userMessage) {
  try {
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "দুঃখিত, এখনই উত্তর দিতে পারছি না। পরে আবার চেষ্টা করুন। 🙏";
  }
}

// 🌊 স্ট্রিমিং চ্যাট (টাইপিং ইফেক্ট)
export async function sendMessageStream(userMessage, onChunk) {
  try {
    const result = await model.generateContentStream(userMessage);
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (onChunk) onChunk(chunkText);
    }
    
    const fullResponse = await result.response;
    return fullResponse.text();
  } catch (error) {
    console.error("Streaming Error:", error);
    return "এরর হয়েছে!";
  }
}

// 💾 চ্যাট হিস্টোরি সংরক্ষণ
export async function saveMessage(userId, role, content) {
  try {
    await addDoc(collection(db, "chats"), {
      userId,
      role, // 'user' or 'assistant'
      content,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Save error:", error);
  }
}

// 📜 রিসেন্ট হিস্টোরি লোড
export async function getRecentHistory(userId, limitCount = 5) {
  try {
    const q = query(
      collection(db, "chats"),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const messages = [];
    snapshot.forEach(doc => messages.unshift(doc.data()));
    return messages;
  } catch (error) {
    console.error("Load history error:", error);
    return [];
  }
}

// 🔄 কন্টেক্সট সহ চ্যাট
export async function chatWithContext(userId, userMessage) {
  const history = await getRecentHistory(userId);
  
  let prompt = `পূর্বের কথোপকথন মনে রেখে উত্তর দাও:\n\n`;
  history.forEach(msg => {
    const role = msg.role === 'user' ? 'ইউজার' : 'নস্তোবাবা';
    prompt += `${role}: ${msg.content}\n`;
  });
  prompt += `\nইউজার: ${userMessage}\nনস্তোবাবা:`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const aiResponse = response.text();
  
  await saveMessage(userId, 'user', userMessage);
  await saveMessage(userId, 'assistant', aiResponse);
  
  return aiResponse;
}
