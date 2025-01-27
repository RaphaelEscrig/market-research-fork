import mdToPdf from 'md-to-pdf';
import path from 'path';

// eslint-disable-next-line func-style
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const highlightPath = path.resolve(process.cwd(), 'node_modules/highlight.js/styles/github');

    const pdf = await mdToPdf(
      { content: body.content },
      {
        highlight_style: highlightPath,
        stylesheet: [],
        css: `
          body {
            font-family: Arial, sans-serif;
            margin: 2cm;
            max-width: none;
          }
          h1, h2, h3 { color: #333; }
          pre { background: #f5f5f5; padding: 1em; }
          ul li ul li, ol li ul li {
            line-height: 1.5;
            margin-bottom: 0;
          }
          ul > li, ol > li {
            margin-bottom: 12px;
          }
          `,
        pdf_options: {
          format: 'A4',
          margin: { top: '2cm', bottom: '3cm', left: '1.5cm', right: '1.5cm' },
          printBackground: true,
          displayHeaderFooter: true,
          headerTemplate: `<div />`,
          footerTemplate: `
            <style>
              section {
                margin: 0 auto;
                font-family: system-ui;
                font-size: 11px;
              }
            </style>
            <section>
              <div>
                <span>Linkup</span>
              </div>
            </section>`,
        },
        launch_options: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--no-first-run',
          ],
        },
      },
    );

    const base64Data = Buffer.from(pdf.content).toString('base64');

    return new Response(base64Data, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.log(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
