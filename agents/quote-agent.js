import Anthropic from '@anthropic-ai/sdk';
import { chromium } from 'playwright';
import { config } from 'dotenv';
config();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Carrier portals — update these URLs when your portals change
const CARRIERS = [
  {
    name: 'Progressive',
    portalUrl: 'https://www.progressiveagent.com/local-agent/oklahoma/oklahoma-city/okc-insurance-brokers/',
    quoteUrl: process.env.PROGRESSIVE_QUOTE_URL || 'https://www.progressiveagent.com',
    coverages: ['auto', 'home', 'renters'],
    color: '#0066CC',
  },
  {
    name: 'GEICO',
    portalUrl: process.env.GEICO_PORTAL_URL || 'https://www.geico.com/auto-insurance/states/ok/',
    quoteUrl: process.env.GEICO_QUOTE_URL || 'https://www.geico.com/auto-insurance/states/ok/',
    coverages: ['auto', 'home', 'renters'],
    color: '#00843D',
  },
  {
    name: 'Mercury',
    portalUrl: 'https://www.mercuryinsurance.com/agents/oklahoma/okc-insurance-broker-0350514.html',
    quoteUrl: process.env.MERCURY_QUOTE_URL || 'https://www.mercuryinsurance.com/agents/oklahoma/okc-insurance-broker-0350514.html',
    coverages: ['auto', 'home'],
    color: '#C8202F',
  },
  {
    name: 'Root',
    portalUrl: 'https://www.joinroot.com/agents/',
    quoteUrl: process.env.ROOT_QUOTE_URL || 'https://www.joinroot.com/quote/',
    coverages: ['auto'],
    color: '#FF5733',
  },
  {
    name: 'Liberty Mutual',
    portalUrl: 'https://agents.libertymutual.com/find-an-agent/state/oklahoma/oklahoma-city/okc-insurance-broker_pl_3205990432',
    quoteUrl: process.env.LM_QUOTE_URL || 'https://agents.libertymutual.com',
    coverages: ['auto', 'home'],
    color: '#003DA5',
  },
];

/**
 * Main agent entry point.
 * @param {object} formData - Data from the OKCIB quote form
 * @param {function} emit - Callback for real-time status events
 */
export async function runQuoteAgent(formData, emit) {
  emit({ type: 'start', message: `Starting quote agent for ${formData.name || 'customer'}` });

  const browser = await chromium.launch({
    headless: false, // visible so broker can monitor / intervene
    args: ['--start-maximized'],
  });

  try {
    for (const carrier of CARRIERS) {
      // Only quote if the carrier supports the requested coverage type
      const coverageType = formData.coverageType || 'auto';
      if (!carrier.coverages.includes(coverageType) && coverageType !== 'auto') {
        emit({ type: 'skip', carrier: carrier.name, message: `Skipped — does not offer ${coverageType}` });
        continue;
      }

      emit({ type: 'progress', carrier: carrier.name, message: `Opening ${carrier.name} portal...` });

      try {
        const result = await quoteOneCarrier(browser, carrier, formData, emit);
        emit({ type: 'quote', carrier: carrier.name, color: carrier.color, ...result });
      } catch (err) {
        emit({ type: 'quote', carrier: carrier.name, color: carrier.color, success: false, error: err.message });
      }
    }
  } finally {
    await browser.close();
  }

  emit({ type: 'done', message: 'All carriers completed' });
}

/**
 * Agent loop for a single carrier portal.
 */
async function quoteOneCarrier(browser, carrier, formData, emit) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto(carrier.quoteUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const messages = [
      {
        role: 'user',
        content: buildSystemPrompt(carrier, formData),
      },
    ];

    // Agent loop — up to 25 steps
    for (let step = 0; step < 25; step++) {
      await page.waitForTimeout(1200);

      const screenshot = await page.screenshot({ type: 'jpeg', quality: 75 });
      const base64 = screenshot.toString('base64');
      const currentUrl = page.url();

      messages.push({
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: base64 },
          },
          {
            type: 'text',
            text: `Step ${step + 1}. Current URL: ${currentUrl}\n\nWhat is on screen? What is the next action? Respond with valid JSON only.`,
          },
        ],
      });

      const response = await client.messages.create({
        model: 'claude-opus-4-7',
        max_tokens: 512,
        system: AGENT_SYSTEM_PROMPT,
        messages,
      });

      const rawText = response.content[0].text.trim();
      let instruction;
      try {
        // Strip markdown code fences if present
        const jsonStr = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
        instruction = JSON.parse(jsonStr);
      } catch {
        emit({ type: 'progress', carrier: carrier.name, message: `Step ${step + 1}: parse error, retrying...` });
        messages.push({ role: 'assistant', content: rawText });
        continue;
      }

      messages.push({ role: 'assistant', content: rawText });

      emit({
        type: 'progress',
        carrier: carrier.name,
        step: step + 1,
        message: instruction.description || instruction.action,
      });

      if (instruction.action === 'done') {
        await context.close();
        return { success: true, quote: instruction.quote, notes: instruction.notes };
      }

      if (instruction.action === 'error') {
        await context.close();
        return { success: false, error: instruction.description };
      }

      if (instruction.action === 'needs_login') {
        await context.close();
        return {
          success: false,
          error: 'Portal requires login credentials',
          notes: `Please set ${carrier.name.toUpperCase().replace(' ', '_')}_QUOTE_URL in your .env file with a post-login URL`,
          loginUrl: carrier.portalUrl,
        };
      }

      // Execute the instruction
      await executeAction(page, instruction);
    }

    await context.close();
    return { success: false, error: 'Max steps reached without completing quote' };
  } catch (err) {
    await context.close();
    throw err;
  }
}

async function executeAction(page, instruction) {
  const { action, selector, value, text, url } = instruction;

  try {
    switch (action) {
      case 'navigate':
        await page.goto(url || value, { waitUntil: 'domcontentloaded', timeout: 20000 });
        break;

      case 'click':
        if (selector) {
          await page.click(selector, { timeout: 8000 });
        } else if (text) {
          await page.getByText(text, { exact: false }).first().click({ timeout: 8000 });
        }
        break;

      case 'type':
        if (selector) {
          await page.fill(selector, value || '', { timeout: 8000 });
        } else if (text) {
          await page.getByLabel(text, { exact: false }).first().fill(value || '');
        }
        break;

      case 'select':
        if (selector) {
          await page.selectOption(selector, value || '', { timeout: 8000 });
        }
        break;

      case 'press':
        await page.keyboard.press(value || 'Tab');
        break;

      case 'scroll':
        await page.evaluate(() => window.scrollBy(0, 400));
        break;

      case 'wait':
        await page.waitForTimeout(parseInt(value) || 2000);
        break;

      default:
        break;
    }
  } catch {
    // Non-fatal — agent will see the result in the next screenshot
  }
}

function buildSystemPrompt(carrier, formData) {
  const d = formData;
  return `You are filling out an auto insurance quote in the ${carrier.name} agent portal for OKC Insurance Brokers.

CUSTOMER DATA:
- Name: ${d.name || `${d.firstName || ''} ${d.lastName || ''}`.trim()}
- DOB: ${d.dob || ''}
- Gender: ${d.gender || ''}
- Marital Status: ${d.maritalStatus || ''}
- Address: ${d.address || ''}, ${d.city || ''}, OK ${d.zip || ''}
- Phone: ${d.phone || ''}
- Email: ${d.email || ''}

VEHICLE:
- ${d.year || ''} ${d.make || ''} ${d.model || ''}
- VIN: ${d.vin || 'not provided'}
- Primary use: ${d.vehicleUse || 'commute'}

COVERAGE REQUESTED:
- Type: ${d.coverageType || 'full'}
- Deductible preference: $${d.deductible || '500'}
- Prior incidents (3 yr): ${d.incidents || 'None'}
- Current carrier: ${d.currentCarrier || 'none'}

GOAL: Get the best available auto insurance quote for this customer from ${carrier.name}.
If the portal requires login and you see a login page, respond with action "needs_login".
When you have successfully obtained a quote amount, respond with action "done" and include the quote.`;
}

const AGENT_SYSTEM_PROMPT = `You are a browser automation agent filling out insurance quotes in agent portals.

Analyze the screenshot and respond with ONLY a valid JSON object — no markdown, no explanation:

{
  "action": "click | type | select | press | scroll | navigate | wait | done | error | needs_login",
  "selector": "CSS selector (optional)",
  "text": "visible text label to target (optional)",
  "value": "value to enter or key to press",
  "url": "URL to navigate to (for navigate action)",
  "description": "brief description of what you're doing",
  "quote": "monthly premium if action is done, e.g. $127/mo",
  "notes": "any relevant notes about the quote"
}

Rules:
- If you see a login/sign-in page, use action "needs_login"
- If you see a CAPTCHA, use action "error" with description "CAPTCHA required"
- If a quote is displayed on screen, use action "done" with the quote amount
- Prefer filling required fields before clicking Next/Continue
- Use clear, reliable selectors (id, name, aria-label)
- Keep descriptions short and informative for the broker`;
