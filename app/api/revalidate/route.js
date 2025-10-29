  import { revalidatePath } from 'next/cache';

  export async function POST(req) {
    // Check admin key
    const adminKey = req.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_KEY) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { path } = await req.json(); 
      revalidatePath(path);
      return Response.json({ revalidated: true, path });
    } catch (error) {
      return Response.json({ revalidated: false, error: error.message }, { status: 500 });
    }
  }