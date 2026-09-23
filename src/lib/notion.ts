import { Client } from "@notionhq/client";

/**
 * Resolve the Website Leads database's DATA SOURCE id.
 *
 * The @notionhq/client v5 `dataSources` API requires the data source id —
 * passing the database id returns 404 "Could not find data_source".
 * The database id is the stable value we store in env; the data source
 * id is derived at runtime.
 */
export async function getLeadsDataSourceId(
  notion: Client,
  databaseId: string
): Promise<string> {
  const db = (await notion.databases.retrieve({
    database_id: databaseId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })) as any;
  const dataSourceId: string | undefined = db?.data_sources?.[0]?.id;
  if (!dataSourceId) {
    throw new Error("Leads database has no data source");
  }
  return dataSourceId;
}

/**
 * Query the Website Leads database. Resolves the data source id on each
 * call — for hot loops, resolve once with getLeadsDataSourceId and call
 * notion.dataSources.query directly.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function queryLeads(notion: Client, databaseId: string, args: any): Promise<any> {
  const dataSourceId = await getLeadsDataSourceId(notion, databaseId);
  return notion.dataSources.query({ data_source_id: dataSourceId, ...args });
}
