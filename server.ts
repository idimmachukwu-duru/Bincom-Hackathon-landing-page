import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import "dotenv/config";

// Hardcoded static configuration matching the frontend for consistent email templates
const HACKATHON_STATIC_DETAILS = {
  name: "Bincom Hackathon September 2026",
  theme: "Hacking genAI",
  edition: "6.0",
  startDate: "Friday 18, September 2026",
  startTime: "6pm WAT",
  endDate: "Saturday 19, September 2026",
  endTime: "7pm WAT",
  registrationUrl: "bincom.net/hackathon",
  virtualUrl: "https://bincom.net/virtual-hackathon",
  whatsapp_link: "https://chat.whatsapp.com/BincomHackathon",
  slack_link: "https://bincom.net/bincomtechnetwork",
  kickoff_event_link: "https://bincom.net/hackathon"
};

const REGISTRATIONS_FILE_PATH = path.join(process.cwd(), "registrations.json");

// Resend API integration using native fetch
async function sendEmailViaResend(to: string, subject: string, html: string) {
  const apiKey = process.env.EMAIL_API_KEY;
  if (!apiKey) {
    console.warn("EMAIL_API_KEY is not defined in .env. Skipping email dispatch.");
    return { success: false, error: "EMAIL_API_KEY is missing in env." };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Bincom Hackathon <onboarding@resend.dev>",
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Resend API error response:", errText);
      return { success: false, error: errText };
    }

    const resData: any = await response.json();
    console.log(`Resend email sent successfully to ${to}. Message ID: ${resData.id}`);
    return { success: true, data: resData };
  } catch (error: any) {
    console.error("Resend fetch error:", error);
    return { success: false, error: error.message || String(error) };
  }
}

// Replacement helper to dynamically swap out placeholders with latest settings
function replaceEmailPlaceholders(template: string, recipient: { fullName: string; role: string; linkedinUrl?: string }) {
  if (!template) return "";
  let result = template;

  const placeholders: Record<string, string> = {
    "name": recipient.fullName,
    "role": recipient.role,
    "linkedinUrl": recipient.linkedinUrl || "",
    "linkedin_url": recipient.linkedinUrl || "",
    "whatsapp_link": HACKATHON_STATIC_DETAILS.whatsapp_link,
    "slack_link": HACKATHON_STATIC_DETAILS.slack_link,
    "kickoff_event_link": HACKATHON_STATIC_DETAILS.kickoff_event_link,
    "start_date": HACKATHON_STATIC_DETAILS.startDate,
    "end_date": HACKATHON_STATIC_DETAILS.endDate,
    "theme": HACKATHON_STATIC_DETAILS.theme,
  };

  for (const [key, val] of Object.entries(placeholders)) {
    // Replace {{key}}
    const regexDouble = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(regexDouble, val);
    // Also replace {key}
    const regexSingle = new RegExp(`{\\s*${key}\\s*}`, "g");
    result = result.replace(regexSingle, val);
  }

  return result;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Standard JSON and URL middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from the public folder
  app.use(express.static(path.join(process.cwd(), "public")));

  // API: Public registrations showcase
  app.get("/api/registrations", (req, res) => {
    try {
      let list: any[] = [];
      if (fs.existsSync(REGISTRATIONS_FILE_PATH)) {
        list = JSON.parse(fs.readFileSync(REGISTRATIONS_FILE_PATH, "utf-8"));
      }
      
      // Sort by registration date descending
      list.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
      
      res.json(list);
    } catch (err: any) {
      console.error("Error reading registrations catalog:", err);
      res.status(500).json({ error: "Failed to load registrations" });
    }
  });

  // API: User Registration
  app.post("/api/register", async (req, res) => {
    try {
      const { fullName, email, phone, role, linkedinUrl } = req.body;
      
      if (!fullName || !email || !phone || !role) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields (fullName, email, phone, role)",
        });
      }

      const regData = {
        fullName: String(fullName).trim(),
        email: String(email).trim(),
        phone: String(phone).trim(),
        role: String(role).trim(),
        linkedinUrl: String(linkedinUrl || "").trim(),
        registeredAt: new Date().toISOString(),
      };

      const docId = `reg_${Date.now()}`;

      // Save to local registrations catalog file
      let registrations = [];
      if (fs.existsSync(REGISTRATIONS_FILE_PATH)) {
        try {
          registrations = JSON.parse(fs.readFileSync(REGISTRATIONS_FILE_PATH, "utf-8"));
        } catch (e) {}
      }
      registrations.push({ id: docId, ...regData });
      fs.writeFileSync(REGISTRATIONS_FILE_PATH, JSON.stringify(registrations, null, 2), "utf-8");

      // Server-side forwarding to n8n webhook (prevents browser CORS / Safari DOMExceptions)
      try {
        await fetch("https://dev.automation.emigr8visa.com/webhook/hackathon-form", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: regData.fullName,
            email: regData.email,
            phone: regData.phone,
            role: regData.role,
            linkedinUrl: regData.linkedinUrl,
            "Full Name": regData.fullName,
            "Email": regData.email,
            "Phone": regData.phone,
            "Application Role": regData.role,
            "LinkedIn URL": regData.linkedinUrl,
          }),
        });
      } catch (webhookErr) {
        console.error("Server n8n webhook forwarding notice (non-fatal):", webhookErr);
      }

      // Custom static onboarding welcome template
      const welcomeSubject = `Welcome to the Bincom Hackathon! - ${regData.role}`;
      const welcomeTemplate = `<h2>Hello {{name}},</h2>
<p>Thank you for registering for the <strong>Bincom Hackathon</strong> as a <strong>{{role}}</strong>!</p>
<p>Here are your essential onboarding links:</p>
<ul>
  <li><strong>WhatsApp Group:</strong> <a href="{{whatsapp_link}}">{{whatsapp_link}}</a></li>
  <li><strong>Slack Channel:</strong> <a href="{{slack_link}}">{{slack_link}}</a></li>
  <li><strong>Kick-off Event:</strong> <a href="{{kickoff_event_link}}">{{kickoff_event_link}}</a></li>
</ul>
<p>The hackathon starts on <strong>{{start_date}}</strong> and ends on <strong>{{end_date}}</strong>.</p>
<p>Get ready to hack!</p>`;

      const personalizedSubject = replaceEmailPlaceholders(welcomeSubject, {
        fullName: regData.fullName,
        role: regData.role,
        linkedinUrl: regData.linkedinUrl
      });

      const personalizedBody = replaceEmailPlaceholders(welcomeTemplate, {
        fullName: regData.fullName,
        role: regData.role,
        linkedinUrl: regData.linkedinUrl
      });

      // Trigger transaction onboarding email via Resend
      const emailResult = await sendEmailViaResend(regData.email, personalizedSubject, personalizedBody);

      res.json({
        success: true,
        message: "Registration recorded successfully",
        registration: {
          id: docId,
          ...regData,
          registeredAt: new Date(regData.registeredAt).toLocaleString()
        },
        emailSent: emailResult.success,
        emailError: emailResult.success ? undefined : emailResult.error
      });
    } catch (error: any) {
      console.error("Registration route error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to process registration",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
