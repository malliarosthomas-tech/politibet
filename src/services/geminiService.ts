import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Candidate } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const PROMPT = `Tu es un expert en politique française. Génère une liste JSON des candidats probables à l'élection présidentielle française de 2027.

Pour chaque candidat, fournis :
- id : identifiant court (slug, ex: "marine-le-pen")
- name : nom complet
- party : nom du parti
- imageUrl : URL Wikipedia de la photo officielle (format: https://upload.wikimedia.org/wikipedia/commons/...)
- participationOdds : cote de participation (nombre décimal, ex: 1.05 pour quasi-certain, 10.0 pour très improbable). Basé sur la probabilité 1/p.
- pollEstimate : estimation du score au 1er tour en % si l'élection avait lieu aujourd'hui (nombre décimal)
- politicalSpectrum : position sur l'axe gauche-droite de -10 (extrême gauche) à +10 (extrême droite)

Inclus au moins 10 candidats représentatifs du spectre politique.
Réponds UNIQUEMENT avec un tableau JSON valide, sans markdown, sans texte avant ou après.`;

async function fetchCandidates(): Promise<Candidate[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(PROMPT);
  const text = result.response.text().trim();

  // Nettoyer les éventuels backticks markdown
  const clean = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
  const data = JSON.parse(clean);

  if (!Array.isArray(data)) throw new Error('Format de réponse invalide');
  return data as Candidate[];
}

export async function fetchCandidatesWithRetry(retries = 3): Promise<Candidate[]> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchCandidates();
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error('Impossible de charger les candidats après plusieurs tentatives.');
}
