import { prisma } from './src/lib/prisma';

async function main() {
  try {
    const provider = await prisma.provider.update({
      where: { id: 2 },
      data: {
        name: "ss",
        address: "sss",
        about: "ssss",
        phone: "ssss",
        lat: 32.22014905744012,
        lng: -7.9401845238100925,
        skills: "ssss",
        certifications: "sss",
        businessHours: "sss",
        email: "sss@gm.ss",
        avatarUrl: "https://frofcdwtwihmyejciqyx.supabase.co/storage/v1/object/public/provider_avatars/1784330679949-mqvga3.jpg",
        bannerUrl: "https://frofcdwtwihmyejciqyx.supabase.co/storage/v1/object/public/provider_avatars/banner-1784391082822-54zvuv.png"
      }
    });
    console.log("Success:", provider);
  } catch (e) {
    console.error("Prisma error:", e);
  }
}
main();
