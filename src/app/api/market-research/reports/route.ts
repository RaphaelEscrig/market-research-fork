import { Generate } from '@/modules/research/core/domain';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { LinkupClient, SourcedAnswer } from 'linkup-sdk';
import { generateReportPrompt, generateReportQuestionsPrompt } from '@/modules/research/core/domain/prompts';
import * as Sentry from '@sentry/nextjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // This is required to enable streaming

const ReportSchema = z.object({
  outline: z.array(
    z.object({
      title: z.string(),
      questions: z.array(z.string()),
    }),
  ),
});

const generateReportPlan = async (query: string): Promise<Generate.OutlineSection[] | null> => {
  const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const plan = await openAi.beta.chat.completions
    .parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `${generateReportQuestionsPrompt} Query: ${query}`,
        },
      ],
      response_format: zodResponseFormat(ReportSchema, 'report'),
    })
    .then((res) => res.choices[0].message.parsed)
    .catch((err) => {
      Sentry.captureException(err);
      return null;
    });

  return plan?.outline.map((section) => ({ ...section, answer: null, sources: [] })) ?? null;
};

const askLinkup = async (query: string, apiKey: string): Promise<SourcedAnswer> => {
  return new LinkupClient({
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/v1' : 'https://api.linkup.so/v1',
    apiKey,
  })
    .search({
      query,
      depth: 'deep',
      outputType: 'sourcedAnswer',
    })
    .catch((err) => {
      Sentry.captureException(err);
      throw err;
    });
};

const answerQuestions = async ({
  outline,
  apiKey,
}: {
  outline: Generate.OutlineSection[];
  apiKey: string;
}): Promise<Generate.OutlineSection[]> => {
  const maxTokens = 120000;
  const nbQuestions = outline.map((section) => section.questions).flat().length;
  const maxTokensPerAnswer = maxTokens / nbQuestions;
  const sectionPromises = outline.map(async (section) => {
    const questionPromises = section.questions.map((question) =>
      askLinkup(
        `Give a detailed answer to the following question: ${question}.
        Don't forget you're an expert and you need to be the most accurate and detailed as possible.
        The response must be shorter then ${maxTokensPerAnswer} tokens.`,
        apiKey,
      ),
    );

    const questionsResults = await Promise.all(questionPromises).catch(() => {
      return [
        {
          answer: '',
          sources: [],
        },
      ];
    });
    const answer = questionsResults.map((result) => result.answer).join(' ');
    const sources = questionsResults
      .map((result) => result.sources)
      .flat()
      .map((source) => ({ name: source.name, url: source.url }));

    return {
      title: section.title,
      questions: section.questions,
      sources,
      answer: answer ?? null,
    };
  });

  return await Promise.all(sectionPromises);
};

const generateReportTitle = async (query: string): Promise<string> => {
  const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const defaultTitle = `linkup_report_${new Date().toISOString()}`;

  return openAi.beta.chat.completions
    .parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Given the query: ${query}, generate a title for a market research report.`,
        },
      ],
      response_format: zodResponseFormat(z.object({ title: z.string() }), 'reportTitle'),
    })
    .then((res) => res.choices[0].message.parsed)
    .then((res) => (res ? res.title : defaultTitle))
    .catch((err) => {
      Sentry.captureException(err);
      return defaultTitle;
    });
};

const generateReport = async (outlines: Generate.OutlineSection[], callback: Generate.ReportGenerationCallbackStream): Promise<void> => {
  const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const stream = await openAi.chat.completions.create({
    model: 'o1-mini',
    messages: [
      {
        role: 'user',
        content: `${generateReportPrompt} Data: ${JSON.stringify(outlines)})`,
      },
    ],
    max_completion_tokens: 35000,
    stream: true,
  });

  for await (const chunk of stream) {
    try {
      callback({
        type: chunk.choices[0].finish_reason,
        content: chunk.choices[0].delta?.content ?? '',
      });
    } catch (error) {
      Sentry.captureException(error);
    }
  }
};

// eslint-disable-next-line func-style
export async function GET(req: Request) {
  const url = new URL(req.url as string);
  const query = url.searchParams.get('query');
  const apiKey = url.searchParams.get('apiKey');
  const encoder = new TextEncoder();

  if (!query || !apiKey) {
    return new Response('Missing required parameter query', { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const sendMessage = (event: Generate.Event, data: unknown): void => {
        if (controller.desiredSize === null) {
          return;
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event, data })}\n\n`));
      };
      const sendError = (error: string): void => {
        if (controller.desiredSize === null) {
          return;
        }
        sendMessage('error', { error });
      };
      const sendReportChunk = (payload: Generate.ReportGenerationCallbackStreamContent): void => {
        if (controller.desiredSize === null) {
          return;
        }
        if (payload.type === null && payload.content) {
          sendMessage('report-content-chunk', { content: payload.content });
        }
      };

      (async function () {
        sendMessage('start', {
          params: { query },
        });

        const outline = await generateReportPlan(query);

        // DEV
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        // const outline = mockOutline;

        if (!outline) {
          sendError('GENERATE_PLAN_ERROR');
          controller.close();
          return;
        }

        sendMessage('outline-defined', outline);

        // DEV
        // await new Promise((resolve) => setTimeout(resolve, 2000));

        const answers = await answerQuestions({ outline, apiKey });

        await new Promise((resolve) => setTimeout(resolve, 2000));
        sendMessage('answers-resolved', answers);

        // DEV
        // await new Promise((resolve) => setTimeout(resolve, 2000));

        await generateReportTitle(query).then((res) => {
          sendMessage('report-title', { content: res });
        });

        // DEV
        //  await new Promise((resolve) => setTimeout(resolve, 2000));

        await generateReport(answers, sendReportChunk)
          .then(() => {
            sendMessage('report-generated', '');
          })
          .catch((err) => {
            console.log(err);
            sendError('GENERATE_REPORT_ERROR');
          });

        controller.close();
      })();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
