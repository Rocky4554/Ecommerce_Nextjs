import dbConnect from "../../../lib/mongoose";
import Product from "../../../lib/models/Product";
import imagekit from "../../../lib/imagekit";
import axios from "axios";
import { revalidatePath } from 'next/cache';

export async function GET(req) {
  await dbConnect();
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const filter = {};
  if (category) filter.category = category;

  const products = await Product.find(filter).sort({ lastUpdated: -1 }).lean();
  return new Response(JSON.stringify(products), { status: 200 });
}

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const adminKey = req.headers.get("x-admin-key");
//     if (adminKey !== process.env.ADMIN_KEY) {
//       return new Response(JSON.stringify({ error: "Unauthorized" }), {
//         status: 401,
//       });
//     }

//     // const body = await req.json();

//     let body;
//     if (typeof req.json === "function") {
//       body = await req.json();
//     } else {
//       body = req.body || {};
//     }

//     if (!body.name || !body.slug || body.price == null) {
//       return new Response(
//         JSON.stringify({ error: "Missing required fields" }),
//         { status: 400 }
//       );
//     }

//     const exists = await Product.findOne({ slug: body.slug });
//     if (exists) {
//       return new Response(JSON.stringify({ error: "Slug already exists" }), {
//         status: 409,
//       });
//     }

//     let finalImageUrl = "https://via.placeholder.com/400x300?text=No+Image";

//     if (body.image) {
//       try {
//         if (body.image.startsWith("data:image")) {
//           // Upload base64 image to ImageKit
//           const uploadRes = await imagekit.upload({
//             file: body.image,
//             fileName: `product-${Date.now()}.jpg`,
//             folder: "/Ecoomerce",
//           });

//           finalImageUrl = imagekit.url({
//             path: uploadRes.filePath,
//             transformation: [
//               {
//                 height: 400,
//                 width: 400,
//                 crop: "maintain_ratio",
//               },
//             ],
//           });
//         } else if (body.image.startsWith("http")) {
//           finalImageUrl = body.image;
//         }
//       } catch (err) {
//         console.error("ImageKit upload failed:", err);
//       }
//     }

//     const newProduct = new Product({
//       name: body.name,
//       slug: body.slug,
//       description: body.description || "",
//       price: Number(body.price),
//       category: body.category || "general",
//       inventory: Number(body.inventory) || 0,
//       image: finalImageUrl,
//       lastUpdated: new Date(),
//     });

//     await newProduct.save();

//     // on demand revalidation
//     if (process.env.NEXT_PUBLIC_BASE_URL) {
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/revalidate`,
//         { path: "/" },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "x-admin-key": process.env.ADMIN_KEY,
//           },
//         }
//       );
//       console.log("Revalidation triggered for /");
//     } catch (revalError) {
//       console.error("Failed to revalidate:", revalError.message);
//     }
//   }

//     return new Response(JSON.stringify(newProduct), { status: 201 });
//   } catch (error) {
//     console.error("Error creating product:", error);
//     return new Response(
//       JSON.stringify({
//         error:
//           "OOps Failed:Please check all field is filled correctly , Try again ",
//       }),
//       {
//         status: 500,
//       }
//     );
//   }
// }


export async function POST(req) {
  try {
    await dbConnect();

    const adminKey = req.headers.get("x-admin-key");
    if (adminKey !== process.env.ADMIN_KEY) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    let body;
    if (typeof req.json === "function") {
      body = await req.json();
    } else {
      body = req.body || {};
    }

    if (!body.name || !body.slug || body.price == null) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const exists = await Product.findOne({ slug: body.slug });
    if (exists) {
      return new Response(JSON.stringify({ error: "Slug already exists" }), {
        status: 409,
      });
    }

    let finalImageUrl = "https://via.placeholder.com/400x300?text=No+Image";

    if (body.image) {
      try {
        if (body.image.startsWith("data:image")) {
          const uploadRes = await imagekit.upload({
            file: body.image,
            fileName: `product-${Date.now()}.jpg`,
            folder: "/Ecoomerce",
          });

          finalImageUrl = imagekit.url({
            path: uploadRes.filePath,
            transformation: [
              {
                height: 400,
                width: 400,
                crop: "maintain_ratio",
              },
            ],
          });
        } else if (body.image.startsWith("http")) {
          finalImageUrl = body.image;
        }
      } catch (err) {
        console.error("ImageKit upload failed:", err);
      }
    }

    const newProduct = new Product({
      name: body.name,
      slug: body.slug,
      description: body.description || "",
      price: Number(body.price),
      category: body.category || "general",
      inventory: Number(body.inventory) || 0,
      image: finalImageUrl,
      lastUpdated: new Date(),
    });

    await newProduct.save();

    // ✅ Revalidate homepage and product page
    try {
      revalidatePath("/"); // Homepage
      revalidatePath(`/products/${newProduct.slug}`); // Individual product page
      console.log("Revalidation triggered for / and /products/" + newProduct.slug);
    } catch (revalError) {
      console.error("Failed to revalidate:", revalError.message);
    }

    return new Response(JSON.stringify(newProduct), { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return new Response(
      JSON.stringify({
        error: "OOps Failed:Please check all field is filled correctly, Try again",
      }),
      { status: 500 }
    );
  }
}
