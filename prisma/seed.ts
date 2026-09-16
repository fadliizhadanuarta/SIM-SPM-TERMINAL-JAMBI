import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create Terminals
  const terminals = [
    {
      namaTerminal: 'Terminal Tipe A Alam Barajo',
      lokasi: 'Kota Jambi',
      koordinat: '-1.5895, 103.6200',
      status: true
    },
    {
      namaTerminal: 'Terminal Tipe A Sri Bulan',
      lokasi: 'Kabupaten Tanjung Jabung Barat',
      koordinat: '-1.4167, 103.4167',
      status: true
    },
    {
      namaTerminal: 'Terminal Tipe A Muara Bungo',
      lokasi: 'Kabupaten Bungo',
      koordinat: '-1.4956, 102.1167',
      status: true
    },
    {
      namaTerminal: 'Terminal Tipe A Bangko',
      lokasi: 'Kabupaten Merangin',
      koordinat: '-0.5167, 102.1333',
      status: true
    }
  ]

  for (const terminal of terminals) {
    await prisma.terminal.upsert({
      where: { namaTerminal: terminal.namaTerminal },
      update: {},
      create: terminal
    })
  }
  console.log(`✅ Created ${terminals.length} terminals`)

  const terminalData = await prisma.terminal.findMany()

  // Create Indicators
  const indicators = [
    {
      namaIndikator: 'Ketersediaan Fasilitas Kebersihan',
      kategori: 'Fasilitas Dasar',
      target: '100%',
      satuan: 'Persentase',
      keterangan: 'Tersedia dan berfungsi dengan baik'
    },
    {
      namaIndikator: 'Ketersediaan Toilet',
      kategori: 'Fasilitas Dasar',
      target: '100%',
      satuan: 'Unit',
      keterangan: 'Toilet yang bersih dan layak pakai'
    },
    {
      namaIndikator: 'Ketersediaan Musholla',
      kategori: 'Fasilitas Penunjang',
      target: '100%',
      satuan: 'Unit',
      keterangan: 'Musholla yang bersih dan nyaman'
    },
    {
      namaIndikator: 'Ketersediaan Area Parkir',
      kategori: 'Fasilitas Dasar',
      target: '100%',
      satuan: 'Meter Persegi',
      keterangan: 'Area parkir yang cukup dan tertib'
    },
    {
      namaIndikator: 'Ketersediaan Loket Tiket',
      kategori: 'Pelayanan',
      target: '100%',
      satuan: 'Unit',
      keterangan: 'Loket tiket yang beroperasi'
    },
    {
      namaIndikator: 'Ketersediaan Ruang Tunggu',
      kategori: 'Fasilitas Penunjang',
      target: '100%',
      satuan: 'Unit',
      keterangan: 'Ruang tunggu yang nyaman'
    },
    {
      namaIndikator: 'Ketersediaan Kantin',
      kategori: 'Fasilitas Penunjang',
      target: '100%',
      satuan: 'Unit',
      keterangan: 'Kantin yang memenuhi standar kebersihan'
    },
    {
      namaIndikator: 'Papan Informasi Jadwal',
      kategori: 'Informasi',
      target: '100%',
      satuan: 'Unit',
      keterangan: 'Papan informasi yang jelas dan terupdate'
    },
    {
      namaIndikator: 'Petugas Keamanan',
      kategori: 'SDM',
      target: '2 Orang',
      satuan: 'Orang',
      keterangan: 'Petugas keamanan yang beroperasi'
    },
    {
      namaIndikator: 'Petugas Administrasi',
      kategori: 'SDM',
      target: '2 Orang',
      satuan: 'Orang',
      keterangan: 'Petugas administrasi yang bertugas'
    }
  ]

  for (const indicator of indicators) {
    await prisma.indikatorSPM.upsert({
      where: { namaIndikator: indicator.namaIndikator },
      update: {},
      create: indicator
    })
  }
  console.log(`✅ Created ${indicators.length} indicators`)

  // Create Users with hashed passwords
  const hashedPassword = await bcrypt.hash('password123', 10)

  const usersData = [
    {
      namaLengkap: 'Administrator',
      nip: '198001012015011001',
      email: 'admin@bptdjambi.go.id',
      nomorHp: '081234567890',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN' as const,
      terminal: null,
      statusAkun: 'AKTIF' as const
    },
    {
      namaLengkap: 'Budi Santoso',
      nip: '199005122019031002',
      email: 'budi@bptdjambi.go.id',
      nomorHp: '081234567891',
      username: 'petugas1',
      password: hashedPassword,
      role: 'PETUGAS' as const,
      terminal: terminalData[0]?.id,
      statusAkun: 'AKTIF' as const
    },
    {
      namaLengkap: 'Siti Rahayu',
      nip: '199208172020122003',
      email: 'siti@bptdjambi.go.id',
      nomorHp: '081234567892',
      username: 'petugas2',
      password: hashedPassword,
      role: 'PETUGAS' as const,
      terminal: terminalData[1]?.id,
      statusAkun: 'AKTIF' as const
    },
    {
      namaLengkap: 'Ahmad Fauzi',
      nip: '198803122014011004',
      email: 'ahmad@bptdjambi.go.id',
      nomorHp: '081234567893',
      username: 'petugas3',
      password: hashedPassword,
      role: 'PETUGAS' as const,
      terminal: terminalData[2]?.id,
      statusAkun: 'AKTIF' as const
    },
    {
      namaLengkap: 'Dewi Kartika',
      nip: '199107012019022005',
      email: 'dewi@bptdjambi.go.id',
      nomorHp: '081234567894',
      username: 'petugas4',
      password: hashedPassword,
      role: 'PETUGAS' as const,
      terminal: terminalData[3]?.id,
      statusAkun: 'AKTIF' as const
    },
    {
      namaLengkap: 'Dr. H. M. Rusdi',
      nip: '197501012000031001',
      email: 'pimpinan@bptdjambi.go.id',
      nomorHp: '081234567895',
      username: 'pimpinan',
      password: hashedPassword,
      role: 'PIMPINAN' as const,
      terminal: null,
      statusAkun: 'AKTIF' as const
    }
  ]

  for (const userData of usersData) {
    await prisma.user.upsert({
      where: { username: userData.username },
      update: {},
      create: userData
    })
  }
  console.log(`✅ Created ${usersData.length} users`)

  const indicatorData = await prisma.indikatorSPM.findMany()
  const userData = await prisma.user.findMany({ where: { role: 'PETUGAS' } })

  // Create sample reports
  const months = [1, 2, 3, 4, 5]
  const years = [2025]

  for (const year of years) {
    for (const month of months) {
      for (const user of userData) {
        if (user.terminal) {
          for (let i = 0; i < 8; i++) {
            const indicator = indicatorData[i]
            if (indicator) {
              const memenuhi = Math.random() > 0.3
              await prisma.pelaporanSPM.create({
                data: {
                  idTerminal: user.terminal,
                  bulan: month,
                  tahun: year,
                  idIndikator: indicator.id,
                  statusPemenuhan: memenuhi ? 'MEMENUHI' : 'TIDAK_MEMENUHI',
                  nilaiRealisasi: memenuhi ? '100' : '70',
                  keterangan: memenuhi ? 'Sesuai standar' : 'Perlu perbaikan',
                  petugasInput: user.id,
                  statusVerifikasi: Math.random() > 0.2 ? 'APPROVED' : 'PENDING',
                  catatanVerifikasi: null,
                  verifiedBy: null,
                  verifiedAt: null
                }
              })
            }
          }
        }
      }
    }
  }
  console.log(`✅ Created sample reports`)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })