import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

/**
 * WordPress webhook handler for content revalidation
 * Receives notifications from WordPress when content changes
 * and revalidates the entire site
 */

// The repo ships two incompatible plugin versions (plugin/next-revalidate
// sends { contentType, contentId }, wordpress/next-revalidate sends
// { type, data: { id, taxonomy, type } }) - normalize both shapes so
// revalidation works regardless of which one is installed on WordPress.
function normalizeWebhookPayload(
  body: Record<string, any>
): { contentType: string | undefined; contentId: string | number | undefined } {
  if (body.contentType) {
    return { contentType: body.contentType, contentId: body.contentId };
  }

  const { type, data } = body;

  if (type === "post") {
    return { contentType: data?.type, contentId: data?.id };
  }

  if (type === "term") {
    const taxonomy = data?.taxonomy;
    const taxonomyMap: Record<string, string> = {
      category: "category",
      post_tag: "tag",
    };
    return {
      contentType: taxonomyMap[taxonomy] ?? taxonomy,
      contentId: data?.id,
    };
  }

  if (type === "test") {
    return { contentType: "test", contentId: undefined };
  }

  return { contentType: undefined, contentId: undefined };
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const secret = request.headers.get("x-webhook-secret");

    if (secret !== process.env.WORDPRESS_WEBHOOK_SECRET) {
      console.error("Invalid webhook secret");
      return NextResponse.json(
        { message: "Invalid webhook secret" },
        { status: 401 }
      );
    }

    const { contentType, contentId } = normalizeWebhookPayload(requestBody);

    if (!contentType) {
      return NextResponse.json(
        { message: "Missing content type" },
        { status: 400 }
      );
    }

    try {
      console.log(
        `Revalidating content: ${contentType}${
          contentId ? ` (ID: ${contentId})` : ""
        }`
      );

      // Revalidate specific content type tags
      revalidateTag("wordpress", { expire: 0 });

      if (contentType === "post") {
        revalidateTag("posts", { expire: 0 });
        if (contentId) {
          revalidateTag(`post-${contentId}`, { expire: 0 });
        }
        // Clear all post pages when any post changes
        revalidateTag("posts-page-1", { expire: 0 });
      } else if (contentType === "category") {
        revalidateTag("categories", { expire: 0 });
        if (contentId) {
          revalidateTag(`posts-category-${contentId}`, { expire: 0 });
          revalidateTag(`category-${contentId}`, { expire: 0 });
        }
      } else if (contentType === "tag") {
        revalidateTag("tags", { expire: 0 });
        if (contentId) {
          revalidateTag(`posts-tag-${contentId}`, { expire: 0 });
          revalidateTag(`tag-${contentId}`, { expire: 0 });
        }
      } else if (contentType === "author" || contentType === "user") {
        revalidateTag("authors", { expire: 0 });
        if (contentId) {
          revalidateTag(`posts-author-${contentId}`, { expire: 0 });
          revalidateTag(`author-${contentId}`, { expire: 0 });
        }
      }
      // WooCommerce content types
      else if (contentType === "product") {
        revalidateTag("woocommerce", { expire: 0 });
        revalidateTag("products", { expire: 0 });
        if (contentId) {
          revalidateTag(`product-${contentId}`, { expire: 0 });
        }
        revalidateTag("products-page-1", { expire: 0 });
        revalidateTag("products-featured", { expire: 0 });
        revalidateTag("products-sale", { expire: 0 });
      } else if (contentType === "product_cat") {
        revalidateTag("woocommerce", { expire: 0 });
        revalidateTag("categories", { expire: 0 });
        if (contentId) {
          revalidateTag(`category-${contentId}`, { expire: 0 });
          revalidateTag(`products-category-${contentId}`, { expire: 0 });
        }
      } else if (contentType === "product_tag") {
        revalidateTag("woocommerce", { expire: 0 });
        revalidateTag("tags", { expire: 0 });
        if (contentId) {
          revalidateTag(`products-tag-${contentId}`, { expire: 0 });
        }
      } else if (contentType === "order") {
        revalidateTag("woocommerce", { expire: 0 });
        revalidateTag("orders", { expire: 0 });
        if (contentId) {
          revalidateTag(`order-${contentId}`, { expire: 0 });
        }
      } else if (contentType === "stock_update") {
        // Product stock was updated - revalidate product pages
        revalidateTag("woocommerce", { expire: 0 });
        revalidateTag("products", { expire: 0 });
        if (contentId) {
          revalidateTag(`product-${contentId}`, { expire: 0 });
        }
      }

      // Also revalidate the entire layout for safety
      revalidatePath("/", "layout");

      return NextResponse.json({
        revalidated: true,
        message: `Revalidated ${contentType}${
          contentId ? ` (ID: ${contentId})` : ""
        } and related content`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error revalidating path:", error);
      return NextResponse.json(
        {
          revalidated: false,
          message: "Failed to revalidate site",
          error: (error as Error).message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      {
        message: "Error revalidating content",
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
