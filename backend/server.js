import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// Band SDK Mock Adapter has been removed in favor of real AI/ML API integration.

// Standard Express API Routes (if you need front-end interaction)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// SSE Clients array
let clients = [];

// SSE Endpoint
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); 

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

function broadcastEvent(message) {
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(message)}\n\n`);
  });
}

// Chat Endpoint (Smart Multilingual Mock Integration for Hackathon)
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });
  
  // Tell frontend we received the message and agents are "typing"
  res.json({ success: true, status: "processing" });

  const msgLower = message.toLowerCase();
  
  // Detect if input is likely English
  const isEnglish = msgLower.match(/\b(the|is|are|a|an|broken|road|street|trash|garbage|light|dark|water|flood|pothole|fix|help|please)\b/i) !== null;

  // Multilingual Strings Default
  let category = isEnglish ? "General / Open Report" : "Umum / Laporan Terbuka";
  let hazardLevel = isEnglish ? "Low" : "Rendah";
  let actionDetails = isEnglish ? "public facility maintenance" : "pemeliharaan fasilitas umum";
  let costEstimate = isEnglish ? "$100" : "Rp 1.000.000";
  
  let analysisText = isEnglish ? "Analysis: Citizen report regarding" : "Analisis: Laporan warga terkait";
  let verifiedText = isEnglish ? "has been verified. @OpenAI-Router please create a handling ticket immediately!" : "telah diverifikasi. @OpenAI-Router tolong segera buatkan nomor tiket penanganan!";
  let ticketCreated = isEnglish ? "Ticket Successfully Created" : "Tiket Berhasil Dibuat";
  let routedText = isEnglish ? "Task has been routed to the relevant department. Calling @Claude-Analyzer to calculate the detailed budget estimation for" : "Tugas telah di-routing ke dinas terkait. Memanggil @Claude-Analyzer untuk segera menghitung rincian estimasi anggaran untuk";
  let budgetTitle = isEnglish ? "Budget Analysis Completed" : "Analisis Anggaran Selesai";
  let budgetDetail = isEnglish ? "Based on the procurement database, the estimated cost for" : "Berdasarkan database pengadaan, estimasi biaya untuk";
  let isAround = isEnglish ? "is around" : "adalah sekitar";
  let statusText = isEnglish ? "Status: Report Closed & Forwarded to Finance." : "Status: Laporan Ditutup & Diteruskan ke Bendahara.";
  let classTitle = isEnglish ? "Classification Complete" : "Klasifikasi Selesai";
  let hazardTitle = isEnglish ? "Hazard Level" : "Tingkat Bahaya";
  let catTitle = isEnglish ? "Category" : "Kategori";

  if (msgLower.match(/\b(jalan|aspal|lubang|road|street|pothole|asphalt)\b/i)) {
    category = isEnglish ? "Infrastructure / Roadways" : "Infrastruktur / Jalan Raya";
    hazardLevel = isEnglish ? "High (Accident Risk)" : "Tinggi (Risiko Kecelakaan)";
    actionDetails = isEnglish ? "asphalt patching and road structure repair" : "penambalan aspal dan perbaikan struktur jalan";
    costEstimate = isEnglish ? "$550" : "Rp 8.500.000";
  } else if (msgLower.match(/\b(sampah|kotor|bau|trash|garbage|rubbish|dirty|smell)\b/i)) {
    category = isEnglish ? "Environment / Sanitation" : "Lingkungan / Kebersihan";
    hazardLevel = isEnglish ? "Medium" : "Menengah";
    actionDetails = isEnglish ? "deploying garbage trucks and area cleaning" : "pengerahan truk pengangkut sampah dan pembersihan area";
    costEstimate = isEnglish ? "$50" : "Rp 450.000";
  } else if (msgLower.match(/\b(lampu|gelap|listrik|light|dark|electricity|power|lamp)\b/i)) {
    category = isEnglish ? "Infrastructure / Street Lighting" : "Infrastruktur / Penerangan Jalan";
    hazardLevel = isEnglish ? "High (Crime Risk)" : "Tinggi (Rawan Kejahatan)";
    actionDetails = isEnglish ? "LED bulb replacement and cable repair" : "penggantian bohlam LED PJU dan perbaikan kabel";
    costEstimate = isEnglish ? "$150" : "Rp 2.500.000";
  } else if (msgLower.match(/\b(banjir|selokan|air|flood|water|drain)\b/i)) {
    category = isEnglish ? "Environment / Water Management" : "Lingkungan / Tata Air";
    hazardLevel = isEnglish ? "Critical (Disaster)" : "Kritis (Bencana)";
    actionDetails = isEnglish ? "water pumping, clearing drain blockages, and drainage repair" : "penyedotan air, pembersihan selokan dari sumbatan, dan perbaikan drainase";
    costEstimate = isEnglish ? "$1,000" : "Rp 15.000.000";
  }

  const randomTicket = Math.floor(1000 + Math.random() * 9000);
  const shortMsg = message.substring(0, 30) + "...";

  // 1. Simulate Llama Classifier
  setTimeout(() => {
    broadcastEvent({
      id: Date.now(),
      sender: 'Llama 3 (Classifier)',
      isAi: true,
      content: `🚨 **${classTitle}**\n${hazardTitle}: ${hazardLevel}\n${catTitle}: ${category}\n\n${analysisText} "${shortMsg}" ${verifiedText}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // 2. Simulate Mistral Router
    setTimeout(() => {
      broadcastEvent({
        id: Date.now() + 1,
        sender: 'Mistral (Router)',
        isAi: true,
        content: `✅ **${ticketCreated}: #CC-${randomTicket}**\n\n${routedText} ${actionDetails}.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // 3. Simulate Qwen Analyzer
      setTimeout(() => {
        broadcastEvent({
          id: Date.now() + 2,
          sender: 'Qwen 1.5 (Analyzer)',
          isAi: true,
          content: `💰 **${budgetTitle}**\n${budgetDetail} ${actionDetails} ${isAround} **${costEstimate}**.\n\n${statusText}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        
        // Notify frontend that all agents are done typing
        setTimeout(() => {
           broadcastEvent({ type: 'DONE' });
        }, 500);
        
      }, 3500); 
    }, 2500); 
  }, 1500); 
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
