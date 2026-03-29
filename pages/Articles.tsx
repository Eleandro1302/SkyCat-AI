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
    },
    {
      id: 4,
      title: "Mudanças Climáticas e Eventos Extremos: O que Esperar?",
      date: "10 de Fevereiro, 2026",
      summary: "O aquecimento global não é apenas sobre o aumento das temperaturas. É sobre a frequência e intensidade de eventos climáticos extremos.",
      content: "Cientistas alertam que o aumento da temperatura global está carregando a atmosfera com mais energia e umidade. Isso resulta em furacões mais potentes, secas mais prolongadas e inundações repentinas devastadoras. Entender esses padrões é crucial para a adaptação urbana e a resiliência das comunidades. No SkyCast AI, acompanhamos tendências de longo prazo para ajudar você a entender não apenas o tempo de amanhã, mas o clima das próximas décadas."
    },
    {
      id: 5,
      title: "A Ciência por trás do El Niño e La Niña",
      date: "05 de Fevereiro, 2026",
      summary: "Entenda os fenômenos oceânicos que ditam o ritmo das chuvas e temperaturas em todo o globo terrestre.",
      content: "O El Niño Oscilação Sul (ENOS) é um padrão climático natural que envolve mudanças na temperatura das águas do Oceano Pacífico Tropical. O El Niño (fase quente) e a La Niña (fase fria) afetam drasticamente a circulação atmosférica global, alterando o regime de chuvas na América do Sul, as monções na Ásia e as tempestades de inverno na América do Norte. Monitorar essas oscilações é fundamental para a agricultura e a gestão de recursos hídricos."
    },
    {
      id: 6,
      title: "O Papel dos Satélites na Meteorologia Moderna",
      date: "01 de Fevereiro, 2026",
      summary: "Como os olhos no espaço transformaram nossa capacidade de prever tempestades e monitorar o clima global.",
      content: "Os satélites meteorológicos são ferramentas indispensáveis hoje em dia. Eles fornecem uma visão global contínua da atmosfera, permitindo rastrear furacões, monitorar a cobertura de nuvens e medir a temperatura da superfície do mar. Existem dois tipos principais: os geoestacionários, que ficam parados sobre um ponto fixo, e os de órbita polar, que varrem todo o globo. Sem esses dados espaciais, a precisão das previsões de longo prazo seria drasticamente reduzida."
    },
    {
      id: 7,
      title: "Entendendo a Umidade e seu Impacto na Saúde",
      date: "28 de Janeiro, 2026",
      summary: "A umidade relativa do ar afeta desde a nossa respiração até a sensação térmica. Saiba como se cuidar.",
      content: "A umidade é a quantidade de vapor de água no ar. Quando a umidade está muito baixa (abaixo de 30%), pode causar ressecamento das mucosas, problemas respiratórios e irritação nos olhos. Por outro lado, a umidade muito alta dificulta a evaporação do suor, aumentando a sensação de calor e favorecendo a proliferação de fungos e ácaros. Manter um ambiente equilibrado é chave para o bem-estar físico."
    },
    {
      id: 8,
      title: "A História da Previsão do Tempo: Dos Caldeus aos Supercomputadores",
      date: "20 de Janeiro, 2026",
      summary: "Uma jornada fascinante pela evolução da ciência meteorológica através dos séculos.",
      content: "Desde a antiguidade, o homem tenta prever o tempo observando as estrelas e o comportamento dos animais. Aristóteles escreveu o primeiro tratado sobre meteorologia em 350 a.C. No entanto, a ciência só deu um salto real com a invenção do barômetro e do termômetro no século XVII. Hoje, entramos na era da computação quântica e IA, onde bilhões de cálculos são feitos por segundo para nos dar a previsão mais precisa possível."
    },
    {
      id: 9,
      title: "Como Ler Mapas de Radar Meteorológico",
      date: "15 de Janeiro, 2026",
      summary: "Aprenda a interpretar as cores e padrões nos radares para saber exatamente quando a chuva vai chegar.",
      content: "Os mapas de radar meteorológico usam ondas de rádio para detectar a precipitação. As cores geralmente indicam a intensidade: verde para chuva leve, amarelo para moderada e vermelho/roxo para tempestades severas ou granizo. Entender o movimento dessas manchas coloridas permite que você preveja com precisão o tempo de chegada de uma tempestade em sua localização específica."
    },
    {
      id: 10,
      title: "A Influência das Montanhas no Clima Local",
      date: "10 de Janeiro, 2026",
      summary: "Entenda o efeito orográfico e como o relevo pode criar desertos ou florestas tropicais em curtas distâncias.",
      content: "Montanhas agem como barreiras físicas para as massas de ar. Quando o ar úmido encontra uma montanha, ele é forçado a subir, esfria e condensa, gerando chuva no lado de barlavento. Do outro lado (sotavento), o ar desce seco e quente, criando o que chamamos de 'sombra de chuva'. Esse fenômeno explica por que regiões próximas podem ter climas tão drasticamente diferentes."
    },
    {
      id: 11,
      title: "O Que é o Ponto de Orvalho e Por Que Ele Importa?",
      date: "05 de Janeiro, 2026",
      summary: "Mais do que a umidade relativa, o ponto de orvalho é a medida real do seu conforto térmico.",
      content: "O ponto de orvalho é a temperatura na qual o ar precisa ser resfriado para que o vapor de água se condense em líquido. Se o ponto de orvalho estiver acima de 20°C, você sentirá o ar 'pesado' e abafado, independentemente da temperatura. É a melhor medida para entender quão úmido o ar realmente está e como isso afetará sua capacidade de resfriamento através do suor."
    },
    {
      id: 12,
      title: "Energia Solar e Condições Climáticas",
      date: "01 de Janeiro, 2026",
      summary: "Como a cobertura de nuvens e a poluição atmosférica afetam a eficiência da geração de energia fotovoltaica.",
      content: "A produção de energia solar depende diretamente da irradiância solar. Nuvens espessas podem reduzir a produção em até 80%, mas curiosamente, painéis solares são mais eficientes em temperaturas mais frias. Partículas de poluição e poeira também podem bloquear a luz. O SkyCast AI ajuda proprietários de sistemas solares a preverem a geração baseando-se em previsões detalhadas de nebulosidade."
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
    },
    {
      id: 4,
      title: "Climate Change and Extreme Events: What to Expect?",
      date: "February 10, 2026",
      summary: "Global warming is not just about rising temperatures. It's about the frequency and intensity of extreme weather events.",
      content: "Scientists warn that rising global temperatures are charging the atmosphere with more energy and moisture. This results in more potent hurricanes, longer droughts, and devastating flash floods. Understanding these patterns is crucial for urban adaptation and community resilience. At SkyCast AI, we track long-term trends to help you understand not just tomorrow's weather, but the climate of the coming decades."
    },
    {
      id: 5,
      title: "The Science Behind El Niño and La Niña",
      date: "February 05, 2026",
      summary: "Understand the oceanic phenomena that dictate the rhythm of rainfall and temperatures across the globe.",
      content: "The El Niño Southern Oscillation (ENSO) is a natural climate pattern involving changes in the water temperature of the Tropical Pacific Ocean. El Niño (warm phase) and La Niña (cold phase) drastically affect global atmospheric circulation, altering rainfall patterns in South America, monsoons in Asia, and winter storms in North America. Monitoring these oscillations is fundamental for agriculture and water resource management."
    },
    {
      id: 6,
      title: "The Role of Satellites in Modern Meteorology",
      date: "February 01, 2026",
      summary: "How eyes in space have transformed our ability to predict storms and monitor the global climate.",
      content: "Meteorological satellites are indispensable tools today. They provide a continuous global view of the atmosphere, allowing us to track hurricanes, monitor cloud cover, and measure sea surface temperatures. There are two main types: geostationary, which stay fixed over one point, and polar-orbiting, which scan the entire globe. Without this space-based data, the accuracy of long-term forecasts would be drastically reduced."
    },
    {
      id: 7,
      title: "Understanding Humidity and Its Impact on Health",
      date: "January 28, 2026",
      summary: "Relative humidity affects everything from our breathing to thermal sensation. Learn how to take care of yourself.",
      content: "Humidity is the amount of water vapor in the air. When humidity is very low (below 30%), it can cause dryness of the mucous membranes, respiratory problems, and eye irritation. On the other hand, very high humidity makes it difficult for sweat to evaporate, increasing the sensation of heat and favoring the proliferation of fungi and mites. Maintaining a balanced environment is key to physical well-being."
    },
    {
      id: 8,
      title: "The History of Weather Forecasting: From Chaldeans to Supercomputers",
      date: "January 20, 2026",
      summary: "A fascinating journey through the evolution of meteorological science across the centuries.",
      content: "Since ancient times, humans have tried to predict the weather by observing the stars and animal behavior. Aristotle wrote the first treatise on meteorology in 350 BC. However, the science only took a real leap with the invention of the barometer and thermometer in the 17th century. Today, we enter the era of quantum computing and AI, where billions of calculations are made per second to give us the most accurate forecast possible."
    },
    {
      id: 9,
      title: "How to Read Weather Radar Maps",
      date: "January 15, 2026",
      summary: "Learn to interpret colors and patterns on radars to know exactly when the rain will arrive.",
      content: "Weather radar maps use radio waves to detect precipitation. Colors usually indicate intensity: green for light rain, yellow for moderate, and red/purple for severe storms or hail. Understanding the movement of these colored patches allows you to accurately predict the arrival time of a storm at your specific location."
    },
    {
      id: 10,
      title: "The Influence of Mountains on Local Climate",
      date: "January 10, 2026",
      summary: "Understand the orographic effect and how terrain can create deserts or rainforests over short distances.",
      content: "Mountains act as physical barriers to air masses. When moist air hits a mountain, it is forced upward, cools, and condenses, generating rain on the windward side. On the other side (leeward), the air descends dry and warm, creating what we call a 'rain shadow'. This phenomenon explains why nearby regions can have such drastically different climates."
    },
    {
      id: 11,
      title: "What is Dew Point and Why Does It Matter?",
      date: "January 05, 2026",
      summary: "More than relative humidity, the dew point is the true measure of your thermal comfort.",
      content: "The dew point is the temperature to which air must be cooled for water vapor to condense into liquid. If the dew point is above 20°C (68°F), you will feel the air is 'heavy' and muggy, regardless of the temperature. It is the best measure for understanding how humid the air really is and how it will affect your cooling capacity through sweat."
    },
    {
      id: 12,
      title: "Solar Energy and Weather Conditions",
      date: "January 01, 2026",
      summary: "How cloud cover and atmospheric pollution affect the efficiency of photovoltaic energy generation.",
      content: "Solar energy production directly depends on solar irradiance. Thick clouds can reduce production by up to 80%, but interestingly, solar panels are more efficient in cooler temperatures. Pollution particles and dust can also block light. SkyCast AI helps solar system owners predict generation based on detailed cloudiness forecasts."
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
