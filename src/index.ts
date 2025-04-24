import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: path.join(__dirname, '..', '.env')});

const API_URL = process.env.API_URL;

const USER_AGENT = "application/json";

// Create server instance
const server = new McpServer({
  name: "opendata-rdw-license-check",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});


async function getVehicleData<T>(license: string): Promise<T | null> {
  const upperCaseLicense = license.toUpperCase();
  const licenseStripped = upperCaseLicense.replace(/-/g, "");
  const url = `${API_URL}?kenteken=${licenseStripped}`;
  if (!API_URL) {
    throw new Error("API_URL IS NOT SET");
  }

  const headers = {
    "User-Agent": USER_AGENT,
  };

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making NWS request:", error);
    return null;
  }
}

/*
function parsePredictions(predictions: any) {
  return predictions.map((predictions: any) => ({
    hometeam: predictions.teams.home.name,
    awayTeam: predictions.teams.away.name,
    winner: predictions.predictions.winner.name,
    winnercomment: predictions.predictions.winner.comment,
    winordraw: predictions.predictions.winordraw,
    goalshome: predictions.predictions.goals.home,
    goalsaway: predictions.predictions.goals.away,
    advice: predictions.predictions.advice,
    percenthome: predictions.predictions.percent.home,
    percentaway: predictions.predictions.percent.away,
    percentdraw: predictions.predictions.percent.draw,
  }));
}

function parseFixtures(fixtures: any) {
  return fixtures.map((fixture: any) => ({
    id: fixture.fixture.id,
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    goalsHome: fixture.goals.home,
    goalsAway: fixture.goals.away,
    scoreHalftime: fixture.score.halftime,
    scoreFulltime: fixture.score.fulltime,
    scoreExtraTime: fixture.score.extratime,
    scorePenalty: fixture.score.penalty,
    date: fixture.fixture.date,
    venue: fixture.fixture.venue.name,
  }));
}*/

server.tool(
  "get-vehicle-information-based-on-license",
  "Get vehicle information based on license plate",
  {
    license: z.string().describe("The dutch license plate"),
  },
  async ({ license }) => {
    const vehicle = await getVehicleData(license);
    if (!vehicle) {
      return {
        content: [
          {
            type: "text",
            text: "Error fetching injuries",
          },
        ],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(vehicle),
        },
      ],
    };
  }
)


async function main(){
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Error starting server:", error);
});
