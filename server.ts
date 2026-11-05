import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK with server-side API Key
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Endpoint: Generate questions based on indicators
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { indicators, theme } = req.body;

    if (!Array.isArray(indicators) || indicators.length === 0) {
      return res.status(400).json({ error: 'Daftar indikator diperlukan.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi di server.',
        fallback: true,
      });
    }

    const prompt = `Anda adalah tim penyusun soal resmi Pesta Siaga Kwarcab Kendal Tahun 2026.
Tugas Anda adalah membuat soal pilihan ganda (PG) untuk tingkatan Pramuka Siaga (anak SD umur 7-10 tahun).
Soal harus mendidik, komunikatif, ramah anak, dan sesuai dengan indikator kisi-kisi berikut.

Tema/Gaya paket yang diinginkan: "${theme || 'Standar Pesta Siaga Kwarcab Kendal 2026'}"
Catatan Khusus Kisi-Kisi:
- Untuk Indikator Nomor 7 (Materi Hari Pramuka 2026): Tema resmi Hari Pramuka ke-65 tahun 2026 adalah "Memantapkan Langkah Organisasi Mendukung Swasembada Pangan Menuju Indonesia Emas 2045".

Daftar Indikator yang harus dibuatkan soal:
${indicators
  .map(
    (item: any) =>
      `- Nomor ${item.no}: Elemen "${item.elemen}", Materi "${item.materi}", Indikator: "${item.indikator}"`
  )
  .join('\n')}

Formatkan output dalam JSON array objek yang berisi persis butir-butir soal untuk setiap indikator di atas:
- no (integer)
- elemen (string)
- materi (string)
- indikator (string)
- soal (string pertanyaan)
- pilihan (objek dengan properti A, B, C, D)
- kunci (salah satu dari 'A', 'B', 'C', atau 'D')
- pembahasan (string penjelasan mendidik untuk anak Siaga)
- visualBadge (string salah satu dari: 'none', 'tunas_kelapa', 'tanda_jabatan_sulung', 'tanda_jabatan_pinrung', 'tanda_jabatan_wapinrung', 'tku_mula', 'tku_bantu', 'tku_tata', 'kompas_8_arah', 'simbol_pancasila_1', 'simbol_pancasila_2', 'simbol_pancasila_3', 'simbol_pancasila_4', 'simbol_pancasila_5', 'tkk_merah_patriotisme', 'tkk_putih_kesehatan', 'tkk_wajib_berkemah', 'tkk_wajib_menabung', 'tkk_wajib_p3k', 'simpul_mati', 'simpul_hidup', 'simpul_anyam', 'simpul_pangkal', 'simpul_jangkar', 'sandi_angka')`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              no: { type: Type.INTEGER },
              elemen: { type: Type.STRING },
              materi: { type: Type.STRING },
              indikator: { type: Type.STRING },
              soal: { type: Type.STRING },
              pilihan: {
                type: Type.OBJECT,
                properties: {
                  A: { type: Type.STRING },
                  B: { type: Type.STRING },
                  C: { type: Type.STRING },
                  D: { type: Type.STRING },
                },
                required: ['A', 'B', 'C', 'D'],
              },
              kunci: { type: Type.STRING },
              pembahasan: { type: Type.STRING },
              visualBadge: { type: Type.STRING },
            },
            required: ['no', 'elemen', 'materi', 'indikator', 'soal', 'pilihan', 'kunci', 'pembahasan'],
          },
        },
      },
    });

    const text = response.text || '[]';
    const parsed = JSON.parse(text);
    return res.json({ success: true, questions: parsed });
  } catch (error: any) {
    console.error('Error generating questions with Gemini:', error);
    return res.status(500).json({
      error: error.message || 'Gagal memanggil layanan Gemini AI.',
      fallback: true,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const distDir = path.resolve(__dirname, 'dist');

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(distDir));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
