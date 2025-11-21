import express from "express";
import cors from "cors";
import os from "os";
import si from "systeminformation";

const app = express();
app.use(cors());

// Função para converter uptime em formato legível
function formatarUptime(segundos) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  return `${horas}h ${minutos}m`;
}

app.get("/info", async (req, res) => {
  try {
    // Coleta de informações básicas
    const [cpu, mem, osInfo, load] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.osInfo(),
      si.currentLoad(),
    ]);

    // Uptime do sistema
    const uptime = formatarUptime(os.uptime());

    // Memória (convertida em GB)
    const memoriaUsada = ((mem.total - mem.available) / 1024 / 1024 / 1024).toFixed(2);
    const memoriaTotal = (mem.total / 1024 / 1024 / 1024).toFixed(2);

    // Tenta buscar dados do Libre Hardware Monitor
    let temperaturaCPU = null;
    let temperaturaGPU = null;

    try {
      const resposta = await fetch("http://localhost:8085/data.json");
      const data = await resposta.json();

      if (data && data.Children) {
        const hardware = data.Children[0];

        for (const item of hardware.Children) {
          console.log("Verificando item:", item.Text);

          // Achar grupo Temperatures dentro de cada item
          const tempGroup = item.Children?.find((c) => c.Text === "Temperatures");
          if (!tempGroup) continue;

          const sensores = tempGroup.Children;

          // Detectar automaticamente temperatura da CPU
          if (sensores && sensores.length > 0) {
            const cpuTemp = sensores.find(s =>
              (
                s.Text.toLowerCase().includes("cpu") &&
                (
                s.Text.toLowerCase().includes("core") ||
                s.Text.toLowerCase().includes("package") ||
                s.Text.toLowerCase().includes("tctl") ||
                s.Text.toLowerCase().includes("tdie")
                )
              )
            );

            if (cpuTemp) {
              temperaturaCPU = parseFloat(cpuTemp.Value.replace(",", ".")).toFixed(1);
              console.log("Temp CPU:", temperaturaCPU);
            }
          }

          // Detectar automaticamente temperatura da GPU
          if (sensores && sensores.length > 0) {
            const gpuTemp = sensores.find(s =>
              (
                s.Text.toLowerCase().includes("gpu") &&
                (
                  s.Text.toLowerCase().includes("core") ||
                  s.Text.toLowerCase().includes("temperature") ||
                  s.Text.toLowerCase().includes("edge") ||
                  s.Text.toLowerCase().includes("hotspot")
                )
              )
            );

            if (gpuTemp) {
              temperaturaGPU = parseFloat(gpuTemp.Value.replace(",", ".")).toFixed(1);
              console.log("Temp GPU:", temperaturaGPU);
            }
          }
        }

      }

    } catch (erroLibre) {
      console.warn("⚠️ Não foi possível obter dados do Libre Hardware Monitor.");
    }

    res.json({
      temperaturaCPU: temperaturaCPU || "N/D",
      usoCPU: load.currentLoad.toFixed(1),
      temperaturaGPU: temperaturaGPU || "N/D",
      memoriaUsada,
      memoriaTotal,
      cpuModelo: cpu.brand,
      gpuModelo: (await si.graphics()).controllers[0]?.model || "N/D",
      sistemaOperacional: `${osInfo.distro} ${osInfo.arch}`,
      uptime,
    });
  } catch (err) {
    console.error("❌ Erro geral:", err);
    res.status(500).json({ erro: "Falha ao coletar informações" });
  }
});

app.listen(3000, () => {
  console.log("✅ Servidor rodando em http://localhost:3000");
});