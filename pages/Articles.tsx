import React from 'react';
import { Navigation, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLocale } from '../utils/i18n';

const Articles: React.FC = () => {
  const locale = getLocale();
  const isPt = locale === 'pt';

  const articles = isPt ? [
    {
      id: 1,
      title: "Como a Inteligência Artificial Está Revolucionando a Previsão do Tempo",
      date: "01 de Março, 2026",
      summary: "A previsão meteorológica tradicional depende de modelos físicos complexos. Descubra como as redes neurais e modelos de linguagem como o Gemini estão mudando as regras do jogo.",
      content: "Durante décadas, os meteorologistas confiaram em supercomputadores para resolver equações termodinâmicas complexas. Hoje, a Inteligência Artificial (IA) está complementando esses modelos tradicionais. Ao analisar vastos conjuntos de dados históricos em segundos, a IA pode identificar padrões sutis que os modelos numéricos tradicionais podem perder. O SkyCast AI utiliza o Google Gemini para não apenas prever, mas também explicar o clima de forma humana e acessível, transformando dados brutos em insights práticos para o seu dia a dia."
    },
    {
      id: 2,
      title: "Entendendo o Índice UV e Como se Proteger",
      date: "25 de Fevereiro, 2026",
      summary: "O Índice Ultravioleta (UV) é crucial para a saúde da sua pele. Aprenda o que os números significam e como você pode se proteger dos raios solares nocivos.",
      content: "O Índice UV é uma medida internacional padrão da força da radiação ultravioleta do sol. Valores de 0 a 2 indicam baixo risco, enquanto valores acima de 11 representam risco extremo de danos por exposição ao sol. É importante lembrar que a radiação UV pode ser alta mesmo em dias nublados ou frios. O SkyCast AI monitora o Índice UV em tempo real para ajudar você a planejar suas atividades ao ar livre com segurança, sugerindo o uso de protetor solar, óculos escuros e roupas adequadas quando necessário."
    },
    {
      id: 3,
      title: "O Impacto da Qualidade do Ar na Saúde Pública",
      date: "15 de Fevereiro, 2026",
      summary: "A poluição do ar é um assassino invisível. Entenda o Índice de Qualidade do Ar (AQI) e como monitorar as condições locais pode salvar vidas.",
      content: "O Índice de Qualidade do Ar (AQI) mede poluentes como material particulado (PM2.5 e PM10), ozônio, dióxido de nitrogênio e monóxido de carbono. Níveis altos de PM2.5 são particularmente perigosos, pois essas partículas finas podem penetrar profundamente nos pulmões e até entrar na corrente sanguínea. Monitorar o AQI diariamente, assim como você verifica a temperatura, é essencial para pessoas com asma, idosos e crianças. Nossa plataforma integra dados de qualidade do ar em tempo real para que você saiba quando é seguro se exercitar ao ar livre."
    }
  ] : [
    {
      id: 1,
      title: "How Artificial Intelligence is Revolutionizing Weather Forecasting",
      date: "March 01, 2026",
      summary: "Traditional weather forecasting relies on complex physical models. Discover how neural networks and language models like Gemini are changing the game.",
      content: "For decades, meteorologists have relied on supercomputers to solve complex thermodynamic equations. Today, Artificial Intelligence (AI) is complementing these traditional models. By analyzing vast historical datasets in seconds, AI can identify subtle patterns that traditional numerical models might miss. SkyCast AI uses Google Gemini to not only predict but also explain the weather in a human and accessible way, transforming raw data into practical insights for your daily life."
    },
    {
      id: 2,
      title: "Understanding the UV Index and How to Protect Yourself",
      date: "February 25, 2026",
      summary: "The Ultraviolet (UV) Index is crucial for your skin's health. Learn what the numbers mean and how you can protect yourself from harmful sun rays.",
      content: "The UV Index is an international standard measurement of the strength of sunburn-producing ultraviolet radiation. Values from 0 to 2 indicate low risk, while values above 11 represent extreme risk of harm from unprotected sun exposure. It's important to remember that UV radiation can be high even on cloudy or cold days. SkyCast AI monitors the UV Index in real-time to help you plan your outdoor activities safely, suggesting the use of sunscreen, sunglasses, and appropriate clothing when necessary."
    },
    {
      id: 3,
      title: "The Impact of Air Quality on Public Health",
      date: "February 15, 2026",
      summary: "Air pollution is an invisible killer. Understand the Air Quality Index (AQI) and how monitoring local conditions can save lives.",
      content: "The Air Quality Index (AQI) measures pollutants like particulate matter (PM2.5 and PM10), ozone, nitrogen dioxide, and carbon monoxide. High levels of PM2.5 are particularly dangerous as these fine particles can penetrate deep into the lungs and even enter the bloodstream. Monitoring AQI daily, just as you check the temperature, is essential for people with asthma, the elderly, and children. Our platform integrates real-time air quality data so you know when it's safe to exercise outdoors."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 relative overflow-x-hidden">
      <header className="fixed top-0 w-full bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50 z-50 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 bg-slate-800 group-hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
             <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Back to App</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
             <Navigation className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">SkyCast AI</span>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl relative z-10">
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2rem] p-8 backdrop-blur-md text-slate-300">
          <h1 className="text-3xl font-bold text-white mb-4">
            {isPt ? 'Artigos e Notícias sobre o Clima' : 'Weather Articles & News'}
          </h1>
          <p className="text-slate-400 mb-8">
            {isPt 
              ? 'Aprofunde seus conhecimentos sobre meteorologia, mudanças climáticas e como a tecnologia está nos ajudando a entender melhor o nosso planeta.'
              : 'Deepen your knowledge about meteorology, climate change, and how technology is helping us better understand our planet.'}
          </p>

          <div className="grid gap-8">
            {articles.map((article) => (
              <article key={article.id} className="border-b border-slate-800/50 pb-8 last:border-0 last:pb-0">
                <h2 className="text-2xl font-bold text-sky-400 mb-2">{article.title}</h2>
                <time className="text-xs text-slate-500 uppercase tracking-widest block mb-4">{article.date}</time>
                <p className="text-lg text-slate-300 font-medium mb-4">{article.summary}</p>
                <p className="text-slate-400 leading-relaxed">{article.content}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Articles;
