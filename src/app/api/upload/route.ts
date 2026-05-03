import { createServerClient } from "@/lib/supabase-server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const merchantId = formData.get("merchant_id") as string | null;

  if (!file || !merchantId) {
    return Response.json(
      { error: "file and merchant_id are required" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop();
  const path = `${merchantId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, buffer, {
      contentType: file.type,
    });

  if (uploadError) {
    return Response.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);

  return Response.json({ url: urlData.publicUrl }, { status: 201 });
}
