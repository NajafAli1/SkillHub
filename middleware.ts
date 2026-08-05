import type { NextRequest } from "next/server";
import { updateSession } from '@/lib/supabase/middleware';

const middleware = async (request: NextRequest) => {
    return await updateSession(request);
}

const config = () => {
    matcher: [
    /*
     * Cocokkan semua rute KECUALI:
     * - _next/static, _next/image  (aset build)
     * - favicon.ico
     * - file gambar dan font
     *
     * Middleware harus tetap jalan di hampir semua rute supaya sesi
     * ter-refresh. Mempersempit matcher ke /student dan /client saja
     * adalah kesalahan umum: sesi tidak akan diperbarui saat user
     * membuka halaman publik, dan token akhirnya kedaluwarsa.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
}