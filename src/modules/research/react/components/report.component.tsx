'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, FileText, MessageSquarePlus, MoveUp } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';
import { Generate } from '@/modules/research/core/domain';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Markdown, { ExtraProps } from 'react-markdown';
import { ClassAttributes } from 'react';
import { AnchorHTMLAttributes } from 'react';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import DownloadPDFReport from './download-pdf-report.component';
import { capitalizeFirstLetter } from '@/modules/shared/core/utils';
import { cn } from '@/lib/utils';
import BetaTag from '@/modules/shared/react/components/beta-tag.component';

const Report: FC<{ report: Generate.Report; onGoBack: () => void }> = ({ report, onGoBack }) => {
  const t = useTranslations('generateReport');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [sections, setSections] = useState<string[]>([]);
  const cardContentAreaRef = useRef<HTMLDivElement>(null);

  const handleGoToTop = (): void => {
    if (cardContentAreaRef.current) {
      cardContentAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const LinkRenderer = (props: ClassAttributes<HTMLAnchorElement> & AnchorHTMLAttributes<HTMLAnchorElement> & ExtraProps) => {
    return (
      <a href={props.href} rel="noreferrer" target="_blank">
        {props.children}
      </a>
    );
  };

  const handleGoToSection = (title: string) => {
    const element = Array.from(document.getElementsByTagName('h2')).find(
      (el) => el.textContent?.toLowerCase().replace(/ /g, '-') === title.toLowerCase().replace(/ /g, '-'),
    );

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (report.done) {
      const sections = report.content.match(/^## .*/gm)?.map((section) => section.slice(3).toLowerCase().replace(/ /g, '-'));

      if (sections) {
        setSections(sections);
      }
    }
  }, [report]);

  return (
    <Card className="flex h-full w-full flex-col gap-4 overflow-y-auto px-6 py-4 lg:max-h-[90vh]" ref={cardContentAreaRef}>
      <CardHeader className="relative flex flex-col gap-4 p-0 lg:gap-2">
        <div className="flex justify-between">
          <Button
            className={`
              relative left-[-4px] items-center border-none bg-transparent p-0 text-primary
              hover:bg-transparent hover:text-gray-700
            `}
            onClick={onGoBack}
          >
            <ChevronLeft className="size-6" />
            <span className="hidden lg:flex">{t('goBackToForm')}</span>
          </Button>

          {report.done && <DownloadPDFReport report={report} />}
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden w-fit rounded-2xl bg-beige-50 p-4 lg:flex">
            <FileText className="size-6" />
          </div>

          <div className="flex w-full flex-col gap-2">
            <CardTitle className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{t('generatedReport')}</h1>
              <div className="lg:relative lg:top-[3px]">
                <BetaTag />
              </div>
            </CardTitle>
            <CardDescription className="flex justify-between">
              <p>{report.title}</p>

              <div>
                <a
                  className={`
                    fixed bottom-4 left-4 z-10 flex size-7 items-center justify-center rounded-3xl bg-gradient-to-b from-gray-700 to-black
                    hover:bg-primary/90 hover:text-foreground
                    lg:relative lg:left-0 lg:top-0 lg:size-fit lg:bg-transparent lg:from-inherit lg:pb-1 lg:text-muted-foreground
                    lg:underline
                  `}
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfPH7ErlTZOqSg5O87HwnOq7x60ke7TGsr9sOztBQLqzuhyBg/viewform?usp=header"
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageSquarePlus className="size-4 text-white lg:hidden" />
                  <span className="hidden lg:block">{t('giveUsAFeedback')}</span>
                </a>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn('relative flex flex-col p-0 lg:flex-row', sections.length > 0 && `gap-8`)}>
        {sections.length > 0 ? (
          <nav
            className={`
              flex h-full w-full flex-col gap-4 overflow-y-scroll rounded-2xl bg-beige-100 p-4
              lg:sticky lg:left-0 lg:top-0 lg:max-h-[calc(90vh-2rem-1rem)] lg:max-w-[300px]
            `}
          >
            {sections.map((section) => {
              return (
                <button
                  key={section}
                  className={`
                    w-full rounded-2xl bg-beige-50 px-3 py-2 text-left text-sm font-semibold text-primary transition-transform
                    hover:scale-[1.01]
                  `}
                  onClick={() => handleGoToSection(section)}
                >
                  {capitalizeFirstLetter(section.split('-').join(' '))}
                </button>
              );
            })}
          </nav>
        ) : (
          <div />
        )}

        <div className="w-full" ref={scrollAreaRef}>
          <div className="space-y-4 text-sm leading-relaxed">
            <Markdown className="markdown-viewer" components={{ a: LinkRenderer }} rehypePlugins={[rehypeSlug, rehypeHighlight]}>
              {report.content.replace(/(\*\*)([^*]+)(\*\*):/g, '$1$2:$3')}
            </Markdown>
          </div>

          <Button className="fixed bottom-4 right-4" size="icon" variant="roundedIcon" onClick={handleGoToTop}>
            <MoveUp className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Report;
