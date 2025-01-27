import { useCallback, useState } from 'react';
import { Generate } from '@/modules/research/core/domain';

const useStreamResearchGeneration = () => {
  const [sections, setSections] = useState<Generate.OutlineSection[]>([]);
  const [report, setReport] = useState<Generate.Report>({
    title: '',
    content: '',
    done: false,
  });
  const [events, setEvents] = useState<Generate.Event[]>([]);

  let tmpReportContent = '';

  const handleEvent = (event: Generate.Event, data: Generate.OutlineSection[] | Generate.Report | { content: string | null }): void => {
    setEvents((prev) => [...prev, event]);

    switch (event) {
      case 'outline-defined':
        setSections(
          (data as Generate.OutlineSection[]).map((item) => {
            return {
              questions: item.questions,
              answer: null,
              sources: [],
              title: item.title,
            };
          }),
        );
        break;

      case 'answers-resolved':
        setSections((prev) =>
          prev.map((section) => {
            const result = (data as Generate.OutlineSection[]).find((item: Generate.OutlineSection) => item.title === section.title);

            if (result) {
              return {
                ...section,
                answer: result.answer,
              };
            }
            return section;
          }),
        );
        break;

      case 'report-title':
        setReport((current) => ({ ...current, title: (data as { content: string | null }).content ?? '' }));
        break;

      case 'report-content-chunk':
        tmpReportContent += (data as { content: string | null }).content;

        setReport((current) => ({ ...current, content: tmpReportContent }));
        break;

      case 'report-generated':
        setReport((current) => ({ ...current, done: true }));
        break;

      default:
        break;
    }
  };

  const startStream = useCallback(({ query }: Generate.Form, apiKey: string) => {
    const eventSource = new EventSource(`/api/market-research/reports?query=${query}&apiKey=${apiKey}`);

    eventSource.onmessage = (event) => {
      const parsedEvent = JSON.parse(event.data);
      const data = parsedEvent.data;

      if (data.error) {
        handleEvent('error', data);
        eventSource.close();
        return;
      }

      handleEvent(parsedEvent.event, data);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };
  }, []);

  return {
    events,
    sections,
    report,
    startStream,
  };
};

export default useStreamResearchGeneration;
