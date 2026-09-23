import { Client } from "@notionhq/client";
import { ConfirmButton } from "./ConfirmButton";
import {
  LESSON_STATUS,
  formatAmountDollars,
  formatLessonDateTime,
  lessonAmountCents,
  lessonTitle,
} from "@/lib/lessons";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Confirm your lesson",
  robots: { index: false, follow: false },
};

function plainText(prop: unknown): string {
  if (!prop || typeof prop !== "object") return "";
  const p = prop as {
    type?: string;
    title?: { plain_text: string }[];
    rich_text?: { plain_text: string }[];
  };
  if (p.type === "title") return (p.title ?? []).map((t) => t.plain_text).join("");
  if (p.type === "rich_text")
    return (p.rich_text ?? []).map((t) => t.plain_text).join("");
  return "";
}

type Proposal =
  | { state: "invalid" }
  | { state: "expired" }
  | { state: "passed" }
  | {
      state: "ok";
      title: string;
      dateLabel: string;
      location: string;
      durationMin: number;
      amountLabel: string;
      token: string;
    };

async function getProposal(token: string): Promise<Proposal> {
  const apiKey = process.env.NOTION_API_KEY?.trim();
  const dbId = process.env.NOTION_LEADS_DB_ID?.trim();
  if (!apiKey || !dbId) return { state: "invalid" };

  const notion = new Client({ auth: apiKey });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await notion.dataSources.query({
    data_source_id: dbId,
    filter: {
      and: [
        { property: "Confirm Token", rich_text: { equals: token } },
        { property: "Status", select: { equals: LESSON_STATUS.AWAITING_PLAYER } },
      ],
    },
    page_size: 1,
  });

  const page = res.results?.[0];
  if (!page) return { state: "invalid" };

  const props = page.properties as Record<string, unknown>;
  const confirmBy =
    (props["Confirm By"] as { date?: { start?: string } })?.date?.start ?? "";
  if (!confirmBy || new Date(confirmBy).getTime() < Date.now()) {
    return { state: "expired" };
  }

  const startIso =
    (props["Lesson Date"] as { date?: { start?: string } })?.date?.start ?? "";
  if (!startIso || new Date(startIso).getTime() <= Date.now()) {
    return { state: "passed" };
  }

  const name = plainText(props["Name"]) || "there";
  const interest = plainText(props["Interest"]);
  const extra = plainText(props["Additional Players"])
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);
  const durationMin =
    (props["Lesson Duration (min)"] as { number?: number })?.number ?? 60;

  return {
    state: "ok",
    title: lessonTitle(interest, [name, ...extra]),
    dateLabel: formatLessonDateTime(startIso),
    location: plainText(props["Lesson Location"]),
    durationMin,
    amountLabel: formatAmountDollars(lessonAmountCents(durationMin)),
    token,
  };
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="bg-navy-light glow-border rounded-xl p-8 w-full max-w-md space-y-5 text-center">
        {children}
      </div>
    </div>
  );
}

export default async function ConfirmLessonPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const proposal: Proposal = token
    ? await getProposal(token)
    : { state: "invalid" };

  if (proposal.state === "invalid") {
    return (
      <Card>
        <h1 className="font-heading font-bold text-2xl">Link not found</h1>
        <p className="text-text-muted text-sm">
          This confirm link isn&apos;t valid — it may have already been used.
          Reply to Sam&apos;s email and he&apos;ll sort it out.
        </p>
      </Card>
    );
  }

  if (proposal.state === "expired") {
    return (
      <Card>
        <h1 className="font-heading font-bold text-2xl">Link expired</h1>
        <p className="text-text-muted text-sm">
          This confirm link has expired. Reply to Sam&apos;s email to pick a
          new time.
        </p>
      </Card>
    );
  }

  if (proposal.state === "passed") {
    return (
      <Card>
        <h1 className="font-heading font-bold text-2xl">Time has passed</h1>
        <p className="text-text-muted text-sm">
          This lesson time has already passed. Reply to Sam&apos;s email to
          find a new one.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-text-muted text-xs font-mono uppercase tracking-wider">
        Confirm your lesson
      </p>
      <h1 className="font-heading font-bold text-2xl">{proposal.title}</h1>
      <div className="text-text-primary text-sm space-y-1">
        <p className="font-semibold">{proposal.dateLabel}</p>
        <p className="text-text-muted">
          {proposal.durationMin} min · {proposal.location}
        </p>
        <p className="text-text-muted">Invoice: {proposal.amountLabel}</p>
      </div>
      <p className="text-text-muted text-xs">
        Confirming locks in your spot. Your invoice and calendar invite follow
        right after.
      </p>
      <ConfirmButton token={proposal.token} />
    </Card>
  );
}
