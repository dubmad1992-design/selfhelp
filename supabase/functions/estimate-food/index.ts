import Anthropic from "npm:@anthropic-ai/sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Structured-output schema: Claude's response is guaranteed to match this shape.
const estimateSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "Short name of the food item" },
          calories: { type: "integer" },
          protein_g: { type: "number" },
          carbs_g: { type: "number" },
          fat_g: { type: "number" }
        },
        required: ["name", "calories", "protein_g", "carbs_g", "fat_g"],
        additionalProperties: false
      }
    },
    assumptions: {
      type: "string",
      description: "One short sentence on portion assumptions made, e.g. 'Assumed a medium banana and two slices of white bread.'"
    }
  },
  required: ["items", "assumptions"],
  additionalProperties: false
} as const;

const SYSTEM_PROMPT = `You are a nutrition estimator inside a fitness tracking app. The user describes what they ate in plain language; you estimate calories and macros per item.

- Assume typical UK portion sizes unless quantities are given.
- Round calories to the nearest 5, macros to the nearest gram.
- Split the description into separate items so the user can sanity-check each one.
- If a description is too vague to estimate (e.g. "food"), make the most common interpretation and say so in assumptions.
- Estimates should be realistic mid-range values, not best-case ones.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description } = await req.json();

    if (typeof description !== "string" || description.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Describe what you ate first." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (description.length > 500) {
      return new Response(JSON.stringify({ error: "Keep the description under 500 characters." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const client = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: estimateSchema }
      },
      messages: [{ role: "user", content: description }]
    });

    if (response.stop_reason === "refusal") {
      return new Response(JSON.stringify({ error: "Couldn't estimate that one — try rephrasing." }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const text = response.content.find((block) => block.type === "text");
    if (!text || text.type !== "text") {
      throw new Error("No text block in model response");
    }

    return new Response(text.text, {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("estimate-food failed:", error);
    return new Response(JSON.stringify({ error: "Estimation is unavailable right now — enter the numbers manually." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
