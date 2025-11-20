import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";

const metals = [
  { symbol: "XAGUSD", icon: "https://mmtto.pro/upload/default/52946924084400128/20250416/0/303008528861974528.png", basePrice: 47.575 },
  { symbol: "XPDUSD", icon: "https://mmtto.pro/upload/default/52946924084400128/20250416/0/303008678363750400.png", basePrice: 1401.686 },
  { symbol: "XPTUSD", icon: "https://mmtto.pro/upload/default/52946924084400128/20250416/0/303008606032977920.png", basePrice: 1587.488 },
  { symbol: "XAUUSD", icon: "https://mmtto.pro/upload/default/52946924084400128/20250416/0/303008127567745024.png", basePrice: 3941.851 },
];

const BlockchainSection = () => {
  const chartRefs = useRef([]);
  const maxCandles = 20;
  const [histories, setHistories] = useState(
    metals.map(m =>
      Array(maxCandles).fill({
        open: m.basePrice,
        close: m.basePrice,
        low: m.basePrice,
        high: m.basePrice,
      })
    )
  );

  // Состояние цвета цены
  const [priceColors, setPriceColors] = useState(metals.map(() => "black"));

  useEffect(() => {
    const interval = setInterval(() => {
      setHistories(prevHistories =>
        prevHistories.map((hist, i) => {
          const lastCandle = hist[hist.length - 1];
          const delta = (Math.random() - 0.5) * metals[i].basePrice * 0.01;
          const newClose = parseFloat((lastCandle.close + delta).toFixed(3));
          const newHigh = Math.max(lastCandle.close, newClose) + Math.random() * 0.05;
          const newLow = Math.min(lastCandle.close, newClose) - Math.random() * 0.05;
          const newCandle = {
            open: lastCandle.close,
            close: newClose,
            high: parseFloat(newHigh.toFixed(3)),
            low: parseFloat(newLow.toFixed(3)),
          };
          const newHist = [...hist.slice(-maxCandles + 1), newCandle];

          // Обновляем график
          if (chartRefs.current[i]) {
            chartRefs.current[i].getEchartsInstance().setOption({
              series: [
                {
                  data: newHist.map(c => [c.open, c.close, c.low, c.high]),
                },
              ],
            });
          }

          // Обновляем цвет цены
          setPriceColors(prev => {
            const newColors = [...prev];
            newColors[i] = newClose > lastCandle.close ? "green" : newClose < lastCandle.close ? "red" : "black";
            return newColors;
          });

          return newHist;
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 12,
        padding: 12,
      }}
    >
      {metals.map((m, i) => (
        <div
          key={m.symbol}
          style={{
            background: "#ffffff10",
            borderRadius: 8,
            padding: 12,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Верхняя часть: иконка и символ */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <img src={m.icon} alt={m.symbol} style={{ width: 25, height: 20 }} />
            <span style={{ fontWeight: 700, fontSize: 13,color:'white' }}>{m.symbol}</span>
          </div>

          {/* Текущая цена с динамическим цветом */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 6,
              color: priceColors[i],
              transition: "color 0.3s",
            }}
          >
            {histories[i][histories[i].length - 1].close.toFixed(3)}
          </div>

          {/* Свечная диаграмма */}
          <ReactECharts
            ref={el => (chartRefs.current[i] = el)}
            style={{ height: 100, width: "100%" }}
            option={{
              tooltip: { show: false }, // отключаем всплывающие окна
              xAxis: { type: "category", data: histories[i].map((_, idx) => idx), show: false },
              yAxis: { scale: true, splitLine: { show: false } },
              series: [
                {
                  type: "candlestick",
                  data: histories[i].map(c => [c.open, c.close, c.low, c.high]),
                  itemStyle: { color: "green", color0: "red", borderColor: "green", borderColor0: "red" },
                  animationDurationUpdate: 500,
                  animationEasingUpdate: "linear",
                },
              ],
              grid: { left: 2, right: 2, top: 2, bottom: 2 },
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default BlockchainSection;
