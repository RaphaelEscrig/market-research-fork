// eslint-disable-next-line func-style
export function GET(_request: Request) {
  throw new Error('API throw error test');

  return new Response('Error', {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
