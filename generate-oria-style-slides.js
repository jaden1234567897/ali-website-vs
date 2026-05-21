const fs = require('fs');
const sharp = require('sharp');

const createSvg = (width, height, content) => `<?xml version="1.0" encoding="UTF-8"?>\n<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title">\n  <title>Generated Oria-style business slide</title>\n  <defs>\n    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">\n      <stop offset="0%" stop-color="#1565c0"/>\n      <stop offset="100%" stop-color="#1e88e5"/>\n    </linearGradient>\n    <linearGradient id="softGradient" x1="0%" y1="0%" x2="100%" y2="100%">\n      <stop offset="0%" stop-color="#eef4fb"/>\n      <stop offset="100%" stop-color="#f8fbff"/>\n    </linearGradient>\n    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">\n      <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000" flood-opacity="0.12"/>\n    </filter>\n  </defs>\n  <rect width="100%" height="100%" fill="#ffffff"/>\n  ${content}\n</svg>`;

const slide4 = () => {
  const width = 2140;
  const height = 980;
  const title = `
  <text x="90" y="90" font-family="Inter, sans-serif" font-size="42" font-weight="700" fill="#111111">Customer Journey: Improvement Initiatives Across Each Step</text>
  <text x="90" y="130" font-family="Inter, sans-serif" font-size="20" fill="#4f5b6b">A high-level process illustration with faster handoffs, reduced friction, and aligned stakeholder activity across each phase.</text>
`;
  const cards = [];
  const labels = [
    {title: '1. Awareness &amp; Consideration', note: 'Complex eligibility and slow outreach.'},
    {title: '2. Application Start', note: 'Lengthy forms with poor clarity.'},
    {title: '3. Documentation &amp; Verification', note: 'Manual checks delay progress.'},
    {title: '4. Credit Assessment &amp; Approval', note: 'Multiple review cycles.'},
    {title: '5. Offer &amp; Signing', note: 'Approval waits slow decisioning.'},
    {title: '6. Disbursement', note: 'Funding takes extra days.'},
    {title: '7. Servicing &amp; Repayment', note: 'Support requests create friction.'},
  ];
  labels.forEach((item, index) => {
    const x = 90 + index * 240;
    const y = 160;
    cards.push(`
      <g transform="translate(${x}, ${y})">
        <rect x="0" y="0" width="220" height="560" rx="24" fill="#ffffff" stroke="#d9e4f7" stroke-width="1.4" filter="url(#softShadow)"/>
        <rect x="0" y="0" width="220" height="80" rx="24" fill="url(#blueGradient)"/>
        <text x="18" y="42" font-family="Inter, sans-serif" font-size="18" font-weight="700" fill="#ffffff">${item.title}</text>
        <g transform="translate(24, 102)">
          <rect width="160" height="130" rx="16" fill="#eef4fb" stroke="#cbdcf1" stroke-width="1.2"/>
          <circle cx="80" cy="60" r="28" fill="#ffffff" stroke="#1e88e5" stroke-width="4"/>
          <path d="M69 50 l22 22 M91 50 l-22 22" stroke="#1e88e5" stroke-width="4" stroke-linecap="round"/>
          <rect x="22" y="108" width="116" height="12" rx="6" fill="#dce9f8"/>
          <rect x="22" y="132" width="90" height="12" rx="6" fill="#dce9f8"/>
        </g>
        <text x="18" y="300" font-family="Inter, sans-serif" font-size="15" fill="#3f4c61">${item.note}</text>
        <rect x="18" y="334" width="184" height="178" rx="16" fill="#f8fbff" stroke="#e6eff9" stroke-width="1.2"/>
        <text x="28" y="366" font-family="Inter, sans-serif" font-size="13" fill="#5e6f8e">Initiatives:</text>
        <text x="28" y="392" font-family="Inter, sans-serif" font-size="13" fill="#5e6f8e">• Streamline intake</text>
        <text x="28" y="414" font-family="Inter, sans-serif" font-size="13" fill="#5e6f8e">• Add self-service visibility</text>
        <text x="28" y="436" font-family="Inter, sans-serif" font-size="13" fill="#5e6f8e">• Automate approvals</text>
      </g>
    `);
  });
  const summary = `
    <g transform="translate(1790, 160)" opacity="0"/>
    <g transform="translate(1780, 160)">
      <rect x="0" y="0" width="320" height="560" rx="28" fill="#f7faff" stroke="#d4e5fb" stroke-width="1.4" filter="url(#softShadow)"/>
      <text x="24" y="44" font-family="Inter, sans-serif" font-size="20" font-weight="700" fill="#0f3a72">SUMMARY</text>
      <text x="24" y="82" font-family="Inter, sans-serif" font-size="14" fill="#5f6f8e">- Reduced cycle time</text>
      <text x="24" y="108" font-family="Inter, sans-serif" font-size="14" fill="#5f6f8e">- More predictable delivery</text>
      <text x="24" y="134" font-family="Inter, sans-serif" font-size="14" fill="#5f6f8e">- Improved customer trust</text>
      <text x="24" y="178" font-family="Inter, sans-serif" font-size="14" fill="#5f6f8e">Critical watchouts:</text>
      <rect x="24" y="190" width="280" height="2" fill="#d9e4f7"/>
      <text x="24" y="220" font-family="Inter, sans-serif" font-size="13" fill="#455a7c">Ensure data handoff is automated between teams.</text>
      <text x="24" y="250" font-family="Inter, sans-serif" font-size="13" fill="#455a7c">Maintain alignment on intake KPIs.</text>
      <text x="24" y="280" font-family="Inter, sans-serif" font-size="13" fill="#455a7c">Avoid duplicate reviews at approvals.</text>
      <circle cx="290" cy="100" r="30" fill="#1e88e5" opacity="0.12"/>
    </g>
  `;
  return createSvg(width, height, title + cards.join('') + summary);
};

const slide5 = () => {
  const width = 1800;
  const height = 940;
  const title = `
  <text x="90" y="90" font-family="Inter, sans-serif" font-size="42" font-weight="700" fill="#111111">Workstream: Data Platform charter (example)</text>
  <text x="90" y="130" font-family="Inter, sans-serif" font-size="20" fill="#4f5b6b">Clear ownership, timelines, and risk watchpoints for platform delivery across the first half of the year.</text>
  <rect x="90" y="156" width="1200" height="80" rx="18" fill="#eef4fb"/>\n  <rect x="100" y="170" width="260" height="52" rx="12" fill="#1e88e5"/>\n  <text x="120" y="205" font-family="Inter, sans-serif" font-size="18" font-weight="700" fill="#ffffff">Sponsors</text>\n  <text x="390" y="205" font-family="Inter, sans-serif" font-size="18" fill="#0f3a72">Ops Director / CIO</text>\n  <rect x="690" y="170" width="320" height="52" rx="12" fill="#fdd835"/>\n  <text x="712" y="205" font-family="Inter, sans-serif" font-size="18" font-weight="700" fill="#1f2f3e">Critical watchouts</text>\n  <text x="1030" y="205" font-family="Inter, sans-serif" font-size="16" fill="#1f2f3e">Unclear ownership / Slow access &amp; data readiness</text>
`;
  const rows = [
    {label: 'A. Data Ingestion &amp; Lake setup', owner: 'JD', scope: 'Define schemas, set up pipelines, Config storage, Security'},
    {label: 'B. Data Processing &amp; Transformation', owner: 'SM', scope: 'ETL jobs, Data quality checks, Aggregation, Modeling'},
    {label: 'C. Analytics &amp; Reporting Tools', owner: 'KL', scope: 'Select BI tools, Develop dashboards, User training, Rollout'},
    {label: 'D. Governance &amp; Compliance', owner: 'RT', scope: 'Policy definition, Access controls, Auditing, GDPR compliance'},
    {label: 'E. Platform Maintenance &amp; Support', owner: 'AC', scope: 'Monitoring, Incident response, Performance tuning, Updates'},
  ];
  const rowY = 260;
  const rowHeight = 100;
  const content = [`
    <rect x="90" y="240" width="1410" height="520" rx="28" fill="#ffffff" stroke="#dfe7f2" stroke-width="1.4" filter="url(#softShadow)"/>
    <text x="116" y="292" font-family="Inter, sans-serif" font-size="16" font-weight="700" fill="#1e3a72">Workstream</text>
    <text x="516" y="292" font-family="Inter, sans-serif" font-size="16" font-weight="700" fill="#1e3a72">Owner</text>
    <text x="670" y="292" font-family="Inter, sans-serif" font-size="16" font-weight="700" fill="#1e3a72">Scope</text>
    <text x="1280" y="292" font-family="Inter, sans-serif" font-size="16" font-weight="700" fill="#1e3a72">Timeline</text>
  `];
  rows.forEach((row, idx) => {
    const y = rowY + idx * rowHeight;
    content.push(`
      <rect x="94" y="${y}" width="1402" height="86" rx="20" fill="${idx % 2 === 0 ? '#f8fbff' : '#ffffff'}"/>
      <text x="116" y="${y + 38}" font-family="Inter, sans-serif" font-size="15" fill="#1f2f3e">${row.label}</text>
      <text x="516" y="${y + 38}" font-family="Inter, sans-serif" font-size="15" fill="#1f2f3e" font-weight="700">${row.owner}</text>
      <text x="670" y="${y + 38}" font-family="Inter, sans-serif" font-size="14" fill="#4f5b6b">${row.scope}</text>
    `);
  });
  const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  months.forEach((month, index) => {
    const x = 1290 + index * 155;
    content.push(`
      <text x="${x + 12}" y="${rowY - 20}" font-family="Inter, sans-serif" font-size="13" fill="#4f5b6b">${month}</text>
      <rect x="${x}" y="${rowY - 10}" width="120" height="4" fill="#d7e1ee" rx="2"/>
    `);
  });
  const timelineBars = [
    {row: 0, x: 1290, width: 310, label: 'Budget signed off'},
    {row: 1, x: 1450, width: 260, label: 'First live release'},
    {row: 2, x: 1360, width: 170},
    {row: 3, x: 1290, width: 310},
    {row: 4, x: 1420, width: 240},
  ];
  timelineBars.forEach((bar) => {
    const y = rowY + bar.row * rowHeight + 42;
    content.push(`
      <rect x="${bar.x}" y="${y}" width="${bar.width}" height="18" rx="9" fill="#1e88e5" />
      ${bar.label ? `<polygon points="${bar.x + bar.width} ${y + 9} ${bar.x + bar.width + 18} ${y} ${bar.x + bar.width + 18} ${y + 18}" fill="#1e88e5"/>` : ''}
      ${bar.label ? `<text x="${bar.x + bar.width + 28}" y="${y + 14}" font-family="Inter, sans-serif" font-size="13" fill="#1f2f3e">${bar.label}</text>` : ''}
    `);
  });
  return createSvg(width, height, title + content.join(''));
};

const svg4 = slide4();
const svg5 = slide5();
fs.writeFileSync('slide-4-like.svg', svg4);
fs.writeFileSync('slide-5-like.svg', svg5);

Promise.all([
  sharp(Buffer.from(svg4)).png().toFile('slide-4-like.png'),
  sharp(Buffer.from(svg5)).png().toFile('slide-5-like.png'),
])
  .then(() => {
    console.log('Generated slide-4-like.svg, slide-4-like.png, slide-5-like.svg, and slide-5-like.png');
  })
  .catch((error) => {
    console.error('PNG generation failed:', error);
  });
