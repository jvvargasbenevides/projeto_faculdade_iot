---

# 📌 **README.md — Sistema de Monitoramento de Hardware (Node.js + Libre Hardware Monitor)**

Este projeto é um servidor Node.js que coleta informações do sistema em tempo real, incluindo uso de CPU, memória, detalhes do sistema operacional e temperaturas da CPU e GPU.
Para obter dados de temperatura, o projeto integra-se com o **Libre Hardware Monitor**, que disponibiliza sensores via HTTP.

---

## 🚀 **Funcionalidades**

* 📊 Uso da CPU em tempo real
* 🔥 Temperatura da CPU (AMD/Intel)
* 🎮 Temperatura da GPU (NVIDIA/AMD/Intel)
* 🧠 Memória usada e total
* 🖥 Modelo da CPU e GPU
* 🧩 Sistema operacional
* ⏱ Uptime do sistema
* 🌐 API REST em `http://localhost:3000/info`

---

## 🛠 **Tecnologias Utilizadas**

* **Node.js** + Express
* **systeminformation (si)** – Dados gerais do sistema
* **Libre Hardware Monitor** – Captura de sensores (temperatura GPU/CPU)
* **CORS**

---

## 📦 **Instalação**

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Inicie o servidor

```bash
node server.js
```

Servidor rodará em:

```
http://localhost:3000/info
```

---

## 🔥 **Ativando temperaturas com Libre Hardware Monitor**

Para obter as temperaturas de CPU e GPU, é necessário que o **Libre Hardware Monitor** esteja rodando.

### 📥 Baixe aqui:

[https://github.com/LibreHardwareMonitor/LibreHardwareMonitor/releases](https://github.com/LibreHardwareMonitor/LibreHardwareMonitor/releases)

### ✔ Como ativar o servidor de sensores

1. Abra o Libre Hardware Monitor
2. Vá em **Options → Remote Web Server**
3. Marque **Enable**
4. Deixe a porta padrão: **8085**

Será possível acessar:

```
http://localhost:8085/data.json
```

---

## 💡 **Compatibilidade**

O projeto funciona na MAIORIA dos computadores Windows, mas há limitações:

### ✔ Funciona em:

* PCs Windows com Libre Hardware Monitor ativado
* CPUs AMD e Intel
* GPUs NVIDIA, AMD e Intel
* Qualquer sistema operacional para dados gerais (systeminformation)

### ⚠ Pode não funcionar se:

* O Libre Hardware Monitor não estiver aberto
* O servidor web não estiver habilitado
* A estrutura do JSON de sensores for diferente do esperado
* O PC não fornecer sensores específicos (muito comum em notebooks)

---

## 🧩 **Como o código detecta temperaturas**

### CPU

O filtro busca sensores como:

* `CPU Core`
* `CPU Package`
* `Tctl`
* `Tdie`
* `CCD1`, `CCD2` (Ryzen)

### GPU

O filtro busca sensores contendo:

* `GPU Core`
* `GPU Temperature`
* `Edge`
* `Hotspot`
* `Junction`

Isso garante compatibilidade com:

* NVIDIA (Core, Hotspot)
* AMD (Edge, Junction)
* Intel (GPU Temperature)

---

## 🧪 **Exemplo de resposta da API**

```json
{
  "temperaturaCPU": "52.4",
  "usoCPU": "18.3",
  "temperaturaGPU": "47.1",
  "memoriaUsada": "6.12",
  "memoriaTotal": "15.92",
  "cpuModelo": "AMD Ryzen 5 5600X",
  "gpuModelo": "NVIDIA GeForce RTX 3060",
  "sistemaOperacional": "Windows 10 x64",
  "uptime": "3h 22m"
}
```

---

## 📁 **Estrutura básica do projeto**

```
/
│ server.js
│ package.json
│ README.md
```

---

## 🐞 Tratamento de erros

Caso o Libre Hardware Monitor não esteja acessível, a API retorna:

* `temperaturaCPU: "N/D"`
* `temperaturaGPU: "N/D"`

E o console mostra:

```
⚠️ Não foi possível obter dados do Libre Hardware Monitor.
```

---

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas!
Sinta-se livre para abrir uma *issue* ou enviar um *pull request*.

---

## 📜 Licença

Este projeto está sob a licença MIT.
Use livremente!

---
