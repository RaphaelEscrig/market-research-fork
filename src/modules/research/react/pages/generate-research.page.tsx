'use client';
import { FC, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import GenerateResearchForm from '../components/generate-research-form.component';
import type { Generate } from '../../core/domain';
import useStreamResearchGeneration from '../hooks/use-stream-research-generation.hook';
import useGenerateStepper from '../hooks/use-generate-stepper.hook';
import useApiKey from '@/modules/shared/react/hooks/use-api-key.hook';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import GenerateReportStepper from '@/modules/research/react/components/generate-report-stepper.component';
import Report from '@/modules/research/react/components/report.component';
import BetaTag from '@/modules/shared/react/components/beta-tag.component';

const Error: FC = () => {
  const t = useTranslations('generateReport');

  return (
    <Card className="m-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="relative flex items-center gap-3">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <div className="absolute right-[-15px] top-[-15px] lg:relative lg:right-0 lg:top-[3px]">
            <BetaTag />
          </div>
        </CardTitle>
        <CardDescription />
      </CardHeader>

      <CardContent>
        <p>{t('error')}</p>
      </CardContent>
    </Card>
  );
};

const GenerateResearchPage = () => {
  const router = useRouter();
  const [state, setState] = useState<Generate.State>('user-input');
  const [_form, setForm] = useState<Generate.Form | null>(null);
  const { startStream, sections, report, events } = useStreamResearchGeneration();
  const { steps, addAnswers, addChapters } = useGenerateStepper();
  const { apiKey } = useApiKey();

  const handleReset = (): void => {
    setForm(null);
    setState('user-input');
  };

  const handleSubmit = (payload: Generate.Form): void => {
    if (!apiKey) return;

    startStream(payload, apiKey);
    setForm(payload);
    setState('resolving-questions');
  };

  // Redirect to sign-in page if the user is not authenticated
  useEffect(() => {
    if (apiKey === null) {
      router.push('/sign-in');
    }
  }, [router, apiKey]);

  // Listen for events and update the state accordingly
  useEffect(() => {
    if (events.at(-1) === 'outline-defined') {
      addChapters(sections);
    }
    if (events.at(-1) === 'answers-resolved') {
      addAnswers(sections);
      // setState('answers-resolved');
    }
    if (events.at(-1) === 'error') {
      setState('error');
    }
  }, [events, sections]);

  useEffect(() => {
    if (state === 'resolving-questions' && report.content.length > 0) {
      setState('answers-resolved');

      // Simulate a delay before the report is generated to show the user a success screen
      setTimeout(() => {
        setState('report');
      }, 2000);
    }
  }, [report.content]);

  return (
    <div
      className={`
        h-[100dvh] bg-beige-50 transition-colors duration-300
        lg:bg-logo lg:bg-[length:90%_90%] lg:bg-[-10vw_10vh] lg:bg-no-repeat
      `}
    >
      <div className="flex h-full justify-center overflow-y-scroll px-4 py-6">
        <div className="m-auto flex h-full w-full max-w-[1100px] flex-col ">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex h-full items-center"
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.1 }}
          >
            <AnimatePresence mode="sync">
              {state === 'user-input' && <GenerateResearchForm onSubmit={handleSubmit} />}
              {(state === 'resolving-questions' || state === 'answers-resolved') && (
                <GenerateReportStepper isDone={state === 'answers-resolved'} steps={steps} />
              )}
              {state === 'error' && <Error />}
              {state === 'report' && <Report report={report} onGoBack={handleReset} />}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GenerateResearchPage;
