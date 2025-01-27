import { ReactElement } from 'react';
import { z } from 'zod';

export type Form = Readonly<{
  query: string;
}>;

export const formSchema = z.object({
  query: z.string().min(1, { message: 'Query is required' }),
});

export type FormSchema = z.infer<typeof formSchema>;

export type State = 'user-input' | 'resolving-questions' | 'answers-resolved' | 'report' | 'error';

export type OutlineSection = {
  questions: string[];
  answer: string | null;
  sources: {
    name: string;
    url: string;
  }[];
  title: string;
};

export type Report = {
  title: string;
  content: string;
  done: boolean;
};

export type ReportGenerationCallbackStreamContent = { type: string | null; content: string | null };
export type ReportGenerationCallbackStream = (params: ReportGenerationCallbackStreamContent) => void;

export type Event =
  | 'start'
  | 'outline-defined'
  | 'answers-resolved'
  | 'report-generation'
  | 'report-title'
  | 'report-content-chunk'
  | 'report-generated'
  | 'error';
export type Status = 'idle' | 'pending' | 'success' | 'error';

export type StepperStep = Readonly<{ status: Status; name: Event; children: ReactElement }>;

export const reportLoaderSentences: string[] = [
  'scouringTheWeb',
  'tiptoeingLibraries',
  'grabCoffee',
  'consultingUncle',
  'codeNinjas',
  'quantumHamsters',
  'rummagingDigitalAttic',
  'makingWeekendPlans',
  'negotiatingDataFairies',
  'magic8Ball',
  'squeezeStretch',
  'summoningReportNinjas',
  'diggingGoogle',
  'thinkingDinner',
  'stuckTraffic',
  'addingSparkle',
];

export const reportQueryExamples = ['openingACoffeeShopInParis', 'groceryRetailMarketInEurope', 'renewableEnergyTrendsInThePacificIslands'];
