'use client';

import { useTranslations } from 'next-intl';
import type { Generate } from '@/modules/research/core/domain';
import { type FC } from 'react';
import { Button } from '@/components/ui/button';

const DownloadPDFReport: FC<{ report: Generate.Report }> = ({ report }) => {
  const t = useTranslations('generateReport');

  const handleDownload = async () => {
    try {
      const formData = new FormData();
      formData.append('markdown', `# ${report.title}\n\n${report.content}`.replace(/(\*\*)([^*]+)(\*\*):/g, '$1$2:$3'));
      formData.append(
        'css',
        `body {
  font-family: Arial, sans-serif;
  margin: 1cm;
  max-width: none;
  color: #24292e;
}

h1, h2, h3, h4, h5, h6 {
  color: #24292e;
}

h2 {
  font-size: 19px;
}

h3, h4, h5, h6 {
  font-size: 15px;
}

h3 {
  margin-bottom: 8px;
}

pre {
  background: #f5f5f5;
  padding: 1rem;
}

ol, ul {
  margin-top: 0;
}

li {
  list-style-type: none;
}

ul li ul li, ol li ul li {
  line-height: 1.3;
  margin-bottom: 0;
}

ul > li, ol > li {
  margin-bottom: 8px;
}

p, span, li {
  font-size: 14px;
}

p {
  line-height: 1.5;
}

li strong {
  font-weight: 600;
  font-size: 13px;
}

a {
text-decoration: underline;
}
`,
      );

      const response = await fetch('https://md-to-pdf.fly.dev/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? 'Failed to generate PDF');
      }

      const pdfBlob = await response.blob();
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.title}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button onClick={handleDownload}>{t('downloadPDF')}</Button>
    </div>
  );
};

export default DownloadPDFReport;
