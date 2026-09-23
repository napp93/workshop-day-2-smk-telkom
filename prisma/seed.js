const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding data awal SEWA AJA...');

  // 1. Bersihkan data lama jika ada
  await prisma.rentalItem.deleteMany({});
  await prisma.rentalTransaction.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.customer.deleteMany({});

  // 2. Data Katalog Busana (Kebaya, Jas, Gaun, Beskap, Aksesoris)
  const itemsData = [
    {
      code: 'KBY-01',
      name: 'Kebaya Brokat Maroon Modern',
      category: 'Kebaya',
      size: 'M',
      rentalPrice: 150000,
      stock: 1,
      status: 'AVAILABLE',
      description: 'Bahan brokat premium warna maroon dengan furing katun adem, cocok untuk wisuda dan resepsi.'
    },
    {
      code: 'KBY-02',
      name: 'Kebaya Encim Kartini Hijau Sage',
      category: 'Kebaya',
      size: 'L',
      rentalPrice: 135000,
      stock: 1,
      status: 'AVAILABLE',
      description: 'Model kartini klasik warna hijau sage pastel, bordir tangan halus.'
    },
    {
      code: 'KBY-03',
      name: 'Kebaya Kutubaru Beludru Hitam Emas',
      category: 'Kebaya',
      size: 'All Size',
      rentalPrice: 175000,
      stock: 1,
      status: 'RENTED',
      description: 'Kutubaru beludru anggun berpadu aksen benang emas, ideal untuk seragam keluarga pengantin.'
    },
    {
      code: 'KBY-04',
      name: 'Kebaya Wisuda Payet Rose Gold',
      category: 'Kebaya',
      size: 'S',
      rentalPrice: 160000,
      stock: 1,
      status: 'AVAILABLE',
      description: 'Payet mewah warna rose gold dengan model cape pundak modern.'
    },
    {
      code: 'JAS-01',
      name: 'Jas Formal Pria Hitam Slim Fit',
      category: 'Jas Formal',
      size: 'L',
      rentalPrice: 150000,
      stock: 1,
      status: 'AVAILABLE',
      description: 'Setelan jas hitam bahan semi-wool berpadu celana formal, cocok untuk sidang skripsi dan wisuda.'
    },
    {
      code: 'JAS-02',
      name: 'Jas Tuxedo Navy Blue Satin Lapel',
      category: 'Jas Formal',
      size: 'XL',
      rentalPrice: 180000,
      stock: 1,
      status: 'RENTED',
      description: 'Tuxedo biru tua satin lapel mengkilap eksklusif untuk acara resepsi malam.'
    },
    {
      code: 'JAS-03',
      name: 'Jas Casual Abu-Abu Charcoal',
      category: 'Jas Formal',
      size: 'M',
      rentalPrice: 140000,
      stock: 1,
      status: 'AVAILABLE',
      description: 'Warna abu-abu charcoal netral, model modern 2 kancing.'
    },
    {
      code: 'GUN-01',
      name: 'Gaun Pengantin Ballgown Putih Mutiara',
      category: 'Gaun Pengantin',
      size: 'All Size',
      rentalPrice: 450000,
      stock: 1,
      status: 'AVAILABLE',
      description: 'Gaun pengantin mekar anggun dengan taburan mutiara swarovski dan ekor 1.5 meter.'
    },
    {
      code: 'GUN-02',
      name: 'Gaun Pesta A-Line Lilac Lavender',
      category: 'Gaun Pengantin',
      size: 'M',
      rentalPrice: 220000,
      stock: 1,
      status: 'AVAILABLE',
      description: 'Gaun pesta manis warna lilac dengan bahan tile lembut.'
    },
    {
      code: 'BSK-01',
      name: 'Beskap Sunda Putih Bordir Silver',
      category: 'Beskap Adat',
      size: 'L',
      rentalPrice: 160000,
      stock: 1,
      status: 'AVAILABLE',
      description: 'Setelan beskap Sunda putih lengkap dengan kain bendo dan sabuk boro.'
    },
    {
      code: 'BSK-02',
      name: 'Beskap Jawa Landung Hitam Beludru',
      category: 'Beskap Adat',
      size: 'XL',
      rentalPrice: 170000,
      stock: 1,
      status: 'AVAILABLE',
      description: 'Beskap adat Jawa corak kraton bahan beludru premium hitam legam.'
    },
    {
      code: 'AKS-01',
      name: 'Set Dasi Kupu & Pocket Square Emas',
      category: 'Aksesoris',
      size: 'All Size',
      rentalPrice: 25000,
      stock: 1,
      status: 'AVAILABLE',
      description: 'Aksesoris pelengkap jas formal warna emas satin.'
    }
  ];

  const createdItems = [];
  for (const item of itemsData) {
    const res = await prisma.item.create({ data: item });
    createdItems.push(res);
  }
  console.log(`✅ Berhasil menambahkan ${createdItems.length} koleksi busana.`);

  // 3. Data Pelanggan / Penyewa
  const c1 = await prisma.customer.create({
    data: {
      name: 'Siti Nurhaliza',
      phone: '0812-7890-1234',
      address: 'Jl. ZA Pagar Alam No. 45, Bandar Lampung',
      idCardNumber: '1871012345670001'
    }
  });

  const c2 = await prisma.customer.create({
    data: {
      name: 'Rizky Pratama',
      phone: '0821-8899-7711',
      address: 'Perum Beringin Raya Blok C, Natar',
      idCardNumber: '09234567812'
    }
  });

  const c3 = await prisma.customer.create({
    data: {
      name: 'Dewi Lestari',
      phone: '0857-1122-3344',
      address: 'Jl. Teuku Umar No. 12, Kedaton',
      idCardNumber: '1871029876540003'
    }
  });
  console.log('✅ Berhasil menambahkan 3 data pelanggan awal.');

  // 4. Data Transaksi Persewaan Acuan ("SE-82383" & "SE-82384")
  // Hitung tanggal: H-1, H, H+1 dari hari ini
  const today = new Date();
  const hMinus1 = new Date(today);
  hMinus1.setDate(today.getDate() - 1);
  const hariH = new Date(today);
  const hPlus1 = new Date(today);
  hPlus1.setDate(today.getDate() + 1);

  // Transaksi 1: Siti Nurhaliza (Kebaya Kutubaru)
  const itemKutubaru = createdItems.find(i => i.code === 'KBY-03');
  const trx1 = await prisma.rentalTransaction.create({
    data: {
      transactionCode: 'SE-82383',
      customerId: c1.id,
      cashierName: 'Seli (Kasir)',
      pickupDate: hMinus1,
      eventDate: hariH,
      returnDate: hPlus1,
      totalBasePrice: itemKutubaru.rentalPrice,
      additionalCharge: 0,
      discount: 0,
      finalPrice: itemKutubaru.rentalPrice,
      paidAmount: 100000,
      remainingAmount: itemKutubaru.rentalPrice - 100000,
      paymentType: 'DP',
      paymentMethod: 'TUNAI',
      rentalStatus: 'BOOKING',
      customerGuarantee: 'E-KTP',
      fittingNotes: 'Lengan kebaya tolong dikecilkan 2 cm di ujung pergelangan.',
      rentalItems: {
        create: [
          {
            itemId: itemKutubaru.id,
            priceAtRent: itemKutubaru.rentalPrice,
            itemCustomNote: 'Kancing depan nomor 2 dicek kembali kerapiannya.'
          }
        ]
      }
    }
  });

  // Transaksi 2: Rizky Pratama (Jas Tuxedo)
  const itemTuxedo = createdItems.find(i => i.code === 'JAS-02');
  const trx2 = await prisma.rentalTransaction.create({
    data: {
      transactionCode: 'SE-82384',
      customerId: c2.id,
      cashierName: 'Seli (Kasir)',
      pickupDate: hMinus1,
      eventDate: hariH,
      returnDate: hPlus1,
      totalBasePrice: itemTuxedo.rentalPrice,
      additionalCharge: 15000, // Charge dasi tambahan
      discount: 10000,
      finalPrice: itemTuxedo.rentalPrice + 15000 - 10000,
      paidAmount: itemTuxedo.rentalPrice + 15000 - 10000,
      remainingAmount: 0,
      paymentType: 'LUNAS',
      paymentMethod: 'TRANSFER',
      rentalStatus: 'DIAMBIL',
      customerGuarantee: 'SIM',
      fittingNotes: 'Celana panjang dipotong sementara lipat dalam 3 cm tanpa digunting.',
      rentalItems: {
        create: [
          {
            itemId: itemTuxedo.id,
            priceAtRent: itemTuxedo.rentalPrice,
            itemCustomNote: 'Termasuk hanger kayu dan sarung cover jas hitam.'
          }
        ]
      }
    }
  });

  console.log(`✅ Berhasil menambahkan 2 transaksi sewa aktif: ${trx1.transactionCode} & ${trx2.transactionCode}`);
  console.log('🎉 Seeding database selesai! Database siap digunakan.');
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
