/**
 * Crea un restaurante y su usuario administrador desde consola.
 *
 * Uso:
 *   npm run create-business -- --business "Sabor Cafetero" --slug sabor-cafetero --email dueno@correo.com --password "Secreta123" --name "Nombre Dueño"
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function getArg(flag: string): string | undefined {
  const i = process.argv.indexOf(`--${flag}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const businessName = getArg("business");
  const slug = getArg("slug");
  const email = getArg("email")?.toLowerCase();
  const password = getArg("password");
  const name = getArg("name") ?? "Administrador";

  if (!businessName || !slug || !email || !password) {
    console.error("Faltan argumentos. Uso:");
    console.error('  npm run create-business -- --business "Mi Restaurante" --slug mi-restaurante --email dueno@correo.com --password "Secreta123" --name "Nombre Dueño"');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("La contraseña debe tener al menos 8 caracteres.");
    process.exit(1);
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.error(`Ya existe un usuario con el correo ${email}.`);
    process.exit(1);
  }

  const existingSlug = await prisma.business.findUnique({ where: { slug } });
  if (existingSlug) {
    console.error(`Ya existe un restaurante con el slug "${slug}".`);
    process.exit(1);
  }

  let business = await prisma.business.findFirst({
    where: { name: businessName, isDemo: false },
  });
  if (business) {
    console.log(`Negocio existente encontrado: "${business.name}". Se agregará el usuario.`);
  } else {
    business = await prisma.business.create({
      data: { name: businessName, slug },
    });
    console.log(`✔ Restaurante creado: "${business.name}" (slug: ${business.slug})`);
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await bcrypt.hash(password, 10),
      role: "ADMIN",
      businessId: business.id,
    },
  });

  console.log(`✔ Usuario creado: ${user.email} (${user.name})`);
  console.log(`  Menú público: /menu/${business.slug}`);
  console.log("Ya puede iniciar sesión en la app.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
