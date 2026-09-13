// GET /api/orders/:orderNumber → fetch order by its public number
import { NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/data-access";

export async function GET(_req: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      firstName: order.firstName,
      lastName: order.lastName,
      email: order.email,
      phone: order.phone,
      address: order.address,
      city: order.city,
      state: order.state,
      country: order.country,
      postalCode: order.postalCode,
      deliveryInstructions: order.deliveryInstructions,
      subtotal: order.subtotal,
      shipping: order.shipping,
      discount: order.discount,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paymentReference: order.paymentReference,
      orderStatus: order.orderStatus,
      items: order.items.map((i) => ({
        productId: i.productId,
        name: i.name,
        slug: i.slug,
        sku: i.sku,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
      })),
      createdAt: order.createdAt.toISOString(),
    },
  });
}
