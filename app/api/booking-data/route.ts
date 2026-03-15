import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const { data: variants, error: variantsError } = await supabase
    .from("service_variants")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: addons, error: addonsError } = await supabase
    .from("addons")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const { data: serviceAddons, error: serviceAddonsError } = await supabase
    .from("service_addons")
    .select("*");

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (
    servicesError ||
    variantsError ||
    addonsError ||
    serviceAddonsError ||
    categoriesError
  ) {
    return NextResponse.json(
      {
        error:
          servicesError?.message ||
          variantsError?.message ||
          addonsError?.message ||
          serviceAddonsError?.message ||
          categoriesError?.message ||
          "Failed to load booking data",
      },
      { status: 500 }
    );
  }

  const servicesWithRelations = (services ?? []).map((service: any) => {
    const serviceVariants = (variants ?? []).filter(
      (variant: any) => variant.service_id === service.id
    );

    const allowedAddonIds = (serviceAddons ?? [])
      .filter((item: any) => item.service_id === service.id)
      .map((item: any) => item.addon_id);

    return {
      ...service,
      variants: serviceVariants,
      allowedAddonIds,
    };
  });

  return NextResponse.json({
    services: servicesWithRelations,
    addons: addons ?? [],
    categories: categories ?? [],
  });
}