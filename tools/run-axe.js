const fs = require('fs');
const { JSDOM } = require('jsdom');
const axeCore = require('axe-core');

(async () => {
  try {
    const html = fs.readFileSync('index.html', 'utf8');
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
    const { window } = dom;
    // Inject axe source into the JSDOM window
    const scriptEl = window.document.createElement('script');
    scriptEl.textContent = axeCore.source;
    window.document.head.appendChild(scriptEl);

    // Wait a tick for axe to initialize
    await new Promise(r => setTimeout(r, 50));

    const results = await window.axe.run(window.document);
    console.log(JSON.stringify(results, null, 2));
  } catch (err) {
    console.error(err);
    process.exit(2);
  }
})();