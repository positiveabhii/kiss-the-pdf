import { siteConfig } from "@/config/site";
import { tools } from "@/config/tools";

const INDEXNOW_KEY = "4a8f9c1e2b3d4e5f6a7b8c9d0e1f2a3b";
const INDEXNOW_KEY_LOCATION = `${siteConfig.url}/4a8f9c1e2b3d4e5f6a7b8c9d0e1f2a3b.txt`;

export async function POST(request: Request) {
  try {
    let urlList: string[] = [];

    const body = await request.json().catch(() => ({}));
    if (Array.isArray(body.urls) && body.urls.length > 0) {
      urlList = body.urls;
    } else {
      // Default to core public landing & tool URLs
      urlList = [
        `${siteConfig.url}/`,
        `${siteConfig.url}/tools`,
        `${siteConfig.url}/docs`,
        `${siteConfig.url}/open-source`,
        ...tools.map((t) => `${siteConfig.url}${t.href}`),
      ];
    }

    const payload = {
      host: "www.kissthepdf.space",
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: urlList.slice(0, 10000),
    };

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    return Response.json({
      success: response.ok,
      status: response.status,
      submittedCount: payload.urlList.length,
      host: payload.host,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
