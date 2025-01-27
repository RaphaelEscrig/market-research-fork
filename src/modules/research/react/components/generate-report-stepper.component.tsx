import { Fragment, useEffect, useRef, useState, type FC } from 'react';
import { DotLoader } from 'react-spinners';
import { Generate } from '@/modules/research/core/domain';
import { useTranslations } from 'next-intl';
import confetti from 'canvas-confetti';
import CheckMark from '@/modules/research/react/assets/svgs/research-check-mark.svg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { reportLoaderSentences } from '../../core/domain/research.model';
import BetaTag from '@/modules/shared/react/components/beta-tag.component';

const GenerateReportStepper: FC<{ isDone: boolean; steps: Generate.StepperStep[] }> = ({ isDone, steps }) => {
  const t = useTranslations('generateReport');
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [steps]);

  return (
    <Card className="m-auto flex h-auto w-full max-w-[900px] flex-col border-none p-6">
      <CardHeader className="p-0">
        <CardTitle className="relative flex items-center gap-3">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <div className="absolute right-[-15px] top-[-15px] lg:relative lg:right-0 lg:top-[3px]">
            <BetaTag />
          </div>
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>

      <CardContent className="mt-4 h-full px-0 py-0 pb-2">
        {!isDone ? (
          <div className="flex h-full w-full flex-col gap-6">
            <Loader />

            <div className="flex max-h-[300px] flex-col gap-4 overflow-y-auto pr-6">
              {steps.map((step, index) => (
                <Fragment key={index}>{step.children}</Fragment>
              ))}

              <div ref={listEndRef} />
            </div>
          </div>
        ) : (
          <Success />
        )}
      </CardContent>
    </Card>
  );
};

const Loader = () => {
  const t = useTranslations('generateReport');
  const [sentence, setSentence] = useState<string>('scouringTheWeb');
  const [usedSentences, setUsedSentences] = useState<string[]>([]);

  useEffect(() => {
    if (sentence === '') {
      const newSentence = reportLoaderSentences[Math.floor(Math.random() * reportLoaderSentences.length)];

      setSentence(newSentence);
      setUsedSentences((prev) => [...prev, newSentence]);
    }

    const interval = setInterval(() => {
      let newSentence = reportLoaderSentences[Math.floor(Math.random() * reportLoaderSentences.length)];

      while (usedSentences.includes(newSentence)) {
        newSentence = reportLoaderSentences[Math.floor(Math.random() * reportLoaderSentences.length)];
      }

      setSentence(newSentence);
      setUsedSentences((prev) => [...prev, newSentence]);

      if (usedSentences.length === reportLoaderSentences.length) {
        setUsedSentences([newSentence]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [reportLoaderSentences, usedSentences]);

  return (
    <div className="flex items-center gap-4 rounded-lg bg-beige-100 p-3">
      <DotLoader size={20} />
      <p className="text-md font-semibold">
        {t.rich(sentence, {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>
    </div>
  );
};

const Success: React.FC = () => {
  const t = useTranslations('generateReport');
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };

  const fire = (particleRatio: number, opts: confetti.Options): void => {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      }),
    );
  };

  const showConfetti = (): void => {
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  useEffect(() => {
    showConfetti();
  }, []);

  return (
    <div className="m-auto flex h-full flex-col items-center justify-center gap-4 pb-8">
      <CheckMark />
      <p className="text-center text-lg font-bold">{t('success')}</p>
    </div>
  );
};

export default GenerateReportStepper;
