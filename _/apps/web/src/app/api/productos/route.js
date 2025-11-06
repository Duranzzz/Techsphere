import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get("categoria");
    const marca = searchParams.get("marca");
    const search = searchParams.get("search");

    let query = `
      SELECT p.*, c.nombre as categoria_nombre, m.nombre as marca_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN marcas m ON p.marca_id = m.id
      WHERE p.activo = true
    `;
    const params = [];
    let paramCount = 0;

    if (categoria) {
      paramCount++;
      query += ` AND p.categoria_id = $${paramCount}`;
      params.push(categoria);
    }

    if (marca) {
      paramCount++;
      query += ` AND p.marca_id = $${paramCount}`;
      params.push(marca);
    }

    if (search) {
      paramCount++;
      query += ` AND (LOWER(p.nombre) LIKE LOWER($${paramCount}) OR LOWER(p.descripcion) LIKE LOWER($${paramCount}))`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY p.nombre`;

    const productos = await sql(query, params);
    return Response.json(productos);
  } catch (error) {
    console.error("Error fetching productos:", error);
    return Response.json(
      { error: "Error fetching productos" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      nombre,
      descripcion,
      precio,
      precio_costo,
      stock,
      stock_minimo,
      categoria_id,
      marca_id,
      sku,
    } = body;

    const result = await sql`
      INSERT INTO productos (nombre, descripcion, precio, precio_costo, stock, stock_minimo, categoria_id, marca_id, sku)
      VALUES (${nombre}, ${descripcion}, ${precio}, ${precio_costo}, ${stock}, ${stock_minimo}, ${categoria_id}, ${marca_id}, ${sku})
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error creating producto:", error);
    return Response.json({ error: "Error creating producto" }, { status: 500 });
  }
}
