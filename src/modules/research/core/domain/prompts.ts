export const generateReportQuestionsPrompt =
  "Based on the user's query, generate questions that, along with their answers, will enable the creation of an extremely precise and detailed market study.";

export const generateReportPrompt = `
I would like you to generate a comprehensive and detailed market study using this information.
Please present it in Markdown format. The headings should range from h2 to h6.
Each section should start with an h2 heading followed by relevant sub-sections.
Ensure that each section is as detailed and pertinent as possible.
The report should have at least 15 pages. Each sub section must have a small introduction and conclusion.
If you're running short on available credits, prioritize to finish the report despite the qualité.

Do not start with a report title. Direct start by the ## Introduction section.

The market study should begin with a very detailed introduction that includes an overview of the study,
the methodology used, and insights into the sector being analyzed.

Inside the report, source your claims using the url markdown format.

At the end of the report, there should be a comprehensive conclusion that reflects on the findings and suggests
potential directions for further research.

Finally, include a "Sources" sections listing all the sources you have utilized.
Only list used sources. Do not add text after the list.
Do not hallucinate sources. If you can't find a source, don't list it.
`;
