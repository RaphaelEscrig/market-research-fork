// eslint-disable-next-line func-style
export async function GET() {
  const response = await fetch(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/v1/configuration/frontend'
      : 'https://api.linkup.so/v1/configuration/frontend',
  ).then((res) => res.json());

  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
  });
}
