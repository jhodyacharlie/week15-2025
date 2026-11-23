import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const DAY = 24 * 60 * 60 * 1000;

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * DAY);
}

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.order.create({
    data: {
      storeName: "TechZone Official",
      storeLogo: "/images/pppenjual1.jpg",
      status: "gudang",
      createdAt: daysAgo(0),
      items: {
        create: [
          { name: "Earphone Bluetooth TWS", variant: "Hitam", price: 149000, qty: 1, image: "/images/tws.jpg" },
          { name: "Kabel USB-C 1m", variant: "Putih", price: 25000, qty: 2, image: "/images/kabelusb.jpg" },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      storeName: "Gadget Mart",
      storeLogo: "/images/pppenjual3.jpg",
      status: "disortir",
      createdAt: daysAgo(1),
      items: {
        create: [
          { name: "Mouse Wireless Slim", variant: "Abu-abu", price: 85000, qty: 1, image: "/images/mousewireless.webp" },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      storeName: "Kreasi Case ID",
      storeLogo: "/images/pppenjual4.jpg",
      status: "diantar",
      createdAt: daysAgo(2),
      items: {
        create: [
          { name: "Casing HP Anti Crack", variant: "Biru", price: 35000, qty: 2, image: "/images/casinghp.jpg" },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      storeName: "TechZone Official",
      storeLogo: "/images/pppenjual1.jpg",
      status: "sampai",
      createdAt: daysAgo(4),
      arrivedAt: daysAgo(1),
      reviewRating: 5,
      reviewComment: "Barang original, pengiriman cepat dan dikemas rapi.",
      reviewedAt: daysAgo(1),
      items: {
        create: [
          { name: "Power Bank 10000mAh", variant: "Hitam", price: 189000, qty: 1, image: "/images/powerbank10000mah.webp" },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      storeName: "Gadget Mart",
      storeLogo: "/images/pppenjual3.jpg",
      status: "sampai",
      createdAt: daysAgo(8),
      arrivedAt: daysAgo(5),
      items: {
        create: [
          { name: "Keyboard Mekanik", variant: "Blue Switch", price: 275000, qty: 1, image: "/images/keyboardmekanik.jpg" },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      storeName: "Kreasi Case ID",
      storeLogo: "/images/pppenjual4.jpg",
      status: "sampai",
      createdAt: daysAgo(10),
      arrivedAt: daysAgo(7),
      reviewRating: 4,
      reviewComment: "Casing pas dan kuat, warnanya sesuai foto.",
      reviewedAt: daysAgo(6),
      items: {
        create: [
          { name: "Casing HP Anti Crack", variant: "Hitam", price: 35000, qty: 1, image: "/images/casinghp.jpg" },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
