import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const ventas = await sql`
      SELECT v.*, c.nombre as cliente_nombre, c.apellido as cliente_apellido,
             e.nombre as empleado_nombre, e.apellido as empleado_apellido
      FROM ventas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      LEFT JOIN empleados e ON v.empleado_id = e.id
      ORDER BY v.fecha DESC
    `;
    return Response.json(ventas);
  } catch (error) {
    console.error("Error fetching ventas:", error);
    return Response.json({ error: "Error fetching ventas" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { cliente_id, empleado_id, productos, metodo_pago } = body;

    // Calcular totales
    let subtotal = 0;
    for (const item of productos) {
      subtotal += item.cantidad * item.precio_unitario - (item.descuento || 0);
    }

    const impuestos = subtotal * 0.16; // 16% IVA
    const total = subtotal + impuestos;

    // Crear venta y detalles en transacción
    const [ventaResult] = await sql.transaction([
      sql`
        INSERT INTO ventas (cliente_id, empleado_id, subtotal, impuestos, total, metodo_pago)
        VALUES (${cliente_id}, ${empleado_id}, ${subtotal}, ${impuestos}, ${total}, ${metodo_pago})
        RETURNING *
      `,
    ]);

    const venta = ventaResult[0];

    // Insertar detalles de venta
    for (const item of productos) {
      await sql`
        INSERT INTO detalles_venta (venta_id, producto_id, cantidad, precio_unitario, descuento)
        VALUES (${venta.id}, ${item.producto_id}, ${item.cantidad}, ${item.precio_unitario}, ${item.descuento || 0})
      `;

      // Actualizar stock
      await sql`
        UPDATE productos 
        SET stock = stock - ${item.cantidad}
        WHERE id = ${item.producto_id}
      `;
    }

    return Response.json(venta);
  } catch (error) {
    console.error("Error creating venta:", error);
    return Response.json({ error: "Error creating venta" }, { status: 500 });
  }
}
