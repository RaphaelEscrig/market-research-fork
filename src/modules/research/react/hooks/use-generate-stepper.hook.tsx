import { useEffect, useState } from 'react';
import { Generate } from '../../core/domain';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const useGenerateStepper = () => {
  const generateStepChildren = (status: Generate.Status, chapter: Generate.OutlineSection): JSX.Element => {
    let iconAnimation = '';
    let icon = '';
    let text = '';

    switch (status) {
      case 'success':
        iconAnimation = 'border-none';
        icon = 'size-9 fill-beige-300 text-white';
        text = 'text-neutral';
        break;
      case 'pending':
        iconAnimation = 'border-beige-500 text-neutral';
        icon = 'size-5 text-neutral';
        text = 'text-neutral';
        break;
      case 'error':
        iconAnimation = 'border-destructive text-destructive';
        icon = 'size-5 text-neutral';
        text = 'text-destructive';
        break;
      default:
        iconAnimation = 'border-beige-500 text-neutral';
        icon = 'size-5 text-neutral';
        text = 'text-neutral';
    }

    return (
      <div className="flex flex-col">
        <div className="flex items-center">
          <motion.div
            animate={status === 'pending' ? { scale: [1, 1.1, 1] } : { scale: [1.1] }}
            className={`
          mr-2 flex size-6 items-center justify-center rounded-full transition-colors duration-300
          ${iconAnimation}`}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <CheckCircle2 className={icon} />
          </motion.div>

          <p className={cn(text, 'text-sm')}>{chapter.title}</p>
        </div>

        {chapter.questions.length > 0 && (
          <div className="ml-5 mt-2">
            <ul className="list-inside list-none space-y-2">
              {chapter.questions.map((question) => (
                <li key={question} className="flex items-center gap-2">
                  <motion.div
                    animate={status === 'pending' ? { scale: [1, 1.1, 1] } : { scale: [1.1] }}
                    className={`
                      flex size-6 items-center justify-center rounded-full transition-colors duration-300
                      ${iconAnimation}`}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <CheckCircle2 className={cn(icon, 'size-4')} />
                  </motion.div>
                  <p className={cn(text, 'text-sm')}>{question}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const [steps, setSteps] = useState<Generate.StepperStep[]>([
    {
      status: 'pending',
      name: 'start',
      children: generateStepChildren('pending', {
        title: 'Analyse your request',
        questions: [],
        sources: [],
        answer: null,
      }),
    },
  ]);
  const [chapters, setChapters] = useState<Generate.OutlineSection[]>([]);
  const [answers, setAnswers] = useState<Generate.OutlineSection[]>([]);

  useEffect(() => {
    const MIN_DELAY_IN_MS = 2500;

    if (chapters.length > 0) {
      chapters.forEach((chapter, index) => {
        setTimeout(() => {
          const chapterStatus: Generate.Status = 'pending'; // Because all chapters are answered in parallel (not in sequence)
          const children = generateStepChildren(chapterStatus, chapter);

          if (index === 0) {
            // This is a hot fix to deploy in time, the 'prev' type should be Generate.StepperStep
            // and the code should be refactored to use the correct type
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setSteps((prev: any) => [
              {
                ...prev[0],
                status: 'success',
                children: generateStepChildren('success', {
                  title: 'Analyse your request',
                  questions: [],
                  sources: [],
                  answer: null,
                }),
              },
              {
                status: chapterStatus,
                name: chapter.title,
                children,
              },
            ]);
          } else {
            // This is a hot fix to deploy in time, the 'prev' type should be Generate.StepperStep
            // and the code should be refactored to use the correct type
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setSteps((prev: any) => [
              ...prev,
              {
                status: chapterStatus,
                name: chapter.title,
                children,
              },
            ]);
          }
        }, index * MIN_DELAY_IN_MS);
      });

      setTimeout(
        () => {
          // This is a hot fix to deploy in time, the 'prev' type should be Generate.StepperStep
          // and the code should be refactored to use the correct type
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setSteps((prev: any) => [
            ...prev,
            {
              status: 'idle',
              name: 'answers-resolved',
              children: generateStepChildren('idle', {
                title: 'Finalize your report',
                questions: [],
                sources: [],
                answer: null,
              }),
            },
          ]);
        },
        chapters.length * MIN_DELAY_IN_MS + 1000,
      );
    }
  }, [chapters]);

  useEffect(() => {
    const MIN_DELAY_IN_MS = 2500;

    if (answers.length > 0) {
      answers.forEach((item, index) => {
        setTimeout(() => {
          // This is a hot fix to deploy in time, the 'prev' type should be Generate.StepperStep
          // and the code should be refactored to use the correct type
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setSteps((prev: any) => {
            const copy = [...prev];
            const status = item.answer ? 'success' : 'error';

            if (copy.at(index + 1)) {
              copy.at(index + 1).status = status;
              copy.at(index + 1).children = generateStepChildren(status, {
                title: copy.at(index + 1).name,
                questions: item.questions,
                sources: [],
                answer: item.answer,
              });
            }

            return copy;
          });
        }, index * MIN_DELAY_IN_MS);
      });

      setTimeout(
        () => {
          // This is a hot fix to deploy in time, the 'prev' type should be Generate.StepperStep
          // and the code should be refactored to use the correct type
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setSteps((prev: any) => {
            const copy = [...prev];

            copy.at(-1).status = 'success';
            copy.at(-1).children = generateStepChildren('pending', {
              title: 'Finalize your report',
              questions: [],
              sources: [],
              answer: null,
            });

            return copy;
          });
        },
        answers.length * MIN_DELAY_IN_MS + 1000,
      );
    }
  }, [answers]);

  const addChapters = (items: Generate.OutlineSection[]) => {
    setChapters((prev) => [...prev, ...items]);
  };

  const addAnswers = (items: Generate.OutlineSection[]) => {
    setAnswers((prev) => [...prev, ...items]);
  };

  return {
    steps,
    addAnswers,
    addChapters,
  };
};

export default useGenerateStepper;
