<div align="center">
  <img src="public/PDF.png" alt="Kiss the PDF Logo" width="120" />
  <h1>Kiss the PDF</h1>
  <p><strong>A free, open-source, privacy-first alternative to iLovePDF.</strong></p>
  <p>Kiss the PDF goodbye. Powerful document utilities right in your browser.</p>
</div>

---

## 🌟 Philosophy

Our core philosophy is simple: **Your files belong to you.**

*   **Free and Open Source**: Everyone should have access to high-quality document tools. No paywalls.
*   **Privacy-First**: No mandatory accounts, no selling user data, no tracking.
*   **Local Processing**: Whenever technically possible, processing happens directly in your browser using Web Workers and WebAssembly (WASM). Your files never touch our servers.
*   **Fast and Accessible**: A minimal, fast user experience built with modern web standards, focusing on accessibility and responsive design.

## 🚀 Current Status

This project is currently in **early-stage development**. We have established a robust, SEO-friendly application shell and a scalable architecture designed to support 100+ tools. 

Currently, the PDF processing engines for the tools are marked as *Planned* while we build out the local processing infrastructure.

## 🏗️ Architecture

Built on a modern stack:
* Next.js 14+ (App Router)
* TypeScript
* Tailwind CSS
* Lucide Icons

We strictly avoid unnecessary backend infrastructure. There is no database, Redis, or authentication layer. Everything is designed to be lightweight and frontend-first.

## 💻 Getting Started (Local Development)

```bash
# Clone the repository
git clone https://github.com/positiveabhii/kiss-the-pdf.git
cd kiss-the-pdf

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

We want to build 100+ document utilities! We welcome community contributions. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## 🛡️ Security

We take security seriously. Please review our [SECURITY.md](SECURITY.md) policy for reporting vulnerabilities.

## 👨‍💻 Maintainer

Built and maintained by **Abhi**.

<a href="https://github.com/positiveabhii">
  <img src="https://github.com/positiveabhii.png" alt="@positiveabhii" width="80" height="80" style="border-radius: 50%;" />
</a>

[@positiveabhii](https://github.com/positiveabhii)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
