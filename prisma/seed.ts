import { PrismaClient, BookingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // -----------------------------------------------------
  // MANAGER
  // -----------------------------------------------------

  const hashedPassword = await bcrypt.hash("ManagerSecure2026!", 10);

  const manager = await prisma.manager.upsert({
    where: {
      email: "manager@artistdomain.com",
    },
    update: {},
    create: {
      email: "manager@artistdomain.com",
      name: "Lead Artist Manager",
      passwordHash: hashedPassword,
    },
  });

  console.log("✓ Manager created:", manager.email);

  // -----------------------------------------------------
  // ARTIST
  // -----------------------------------------------------

  const artist = await prisma.artist.upsert({
    where: {
      id: "demo-artist-nixon",
    },
    update: {},
    create: {
      id: "demo-artist-nixon",
      artistName: "Nixon Muribe",
      stageName: "Nixon",
      shortBio:
        "An emerging artist bringing a modern sound, authentic storytelling and energetic performances to contemporary African music.",
      biography:
        "Nixon is an emerging artist focused on creating music that connects authentic African influences with a modern sound. His work combines storytelling, rhythm and contemporary production to create music designed for both personal listening and live performance.",
      genre: "Afro Pop",
      location: "Kenya",
      profileImage: "https://picsum.photos/seed/artist-profile/800/800",
      heroImage: "https://picsum.photos/seed/artist-hero/1600/900",
    },
  });

  console.log("✓ Artist created:", artist.stageName);

  // -----------------------------------------------------
  // SOCIAL LINKS
  // -----------------------------------------------------

  const socialLinks = [
    {
      platform: "Instagram",
      label: "Instagram",
      url: "https://instagram.com/",
      icon: "instagram",
      displayOrder: 1,
    },
    {
      platform: "TikTok",
      label: "TikTok",
      url: "https://tiktok.com/",
      icon: "music",
      displayOrder: 2,
    },
    {
      platform: "YouTube",
      label: "YouTube",
      url: "https://youtube.com/",
      icon: "youtube",
      displayOrder: 3,
    },
    {
      platform: "Spotify",
      label: "Spotify",
      url: "https://spotify.com/",
      icon: "music",
      displayOrder: 4,
    },
  ];

  for (const link of socialLinks) {
    await prisma.socialLink.upsert({
      where: {
        id: `social-${link.platform.toLowerCase()}`,
      },
      update: link,
      create: {
        id: `social-${link.platform.toLowerCase()}`,
        ...link,
        active: true,
      },
    });
  }

  console.log("✓ Social links created");

  // -----------------------------------------------------
  // MUSIC
  // -----------------------------------------------------

  const song1 = await prisma.music.create({
    data: {
      title: "New Beginnings",
      duration: "03:42",
      coverArt: "https://picsum.photos/seed/music-cover-1/800/800",
      audioUrl: null,
      published: true,
    },
  });

  const song2 = await prisma.music.create({
    data: {
      title: "African Nights",
      duration: "04:08",
      coverArt: "https://picsum.photos/seed/music-cover-2/800/800",
      audioUrl: null,
      published: true,
    },
  });

  const song3 = await prisma.music.create({
    data: {
      title: "On My Way",
      duration: "03:28",
      coverArt: "https://picsum.photos/seed/music-cover-3/800/800",
      audioUrl: null,
      published: true,
    },
  });

  console.log("✓ Music created");

  // -----------------------------------------------------
  // EXTERNAL MUSIC LINKS
  // -----------------------------------------------------

  await prisma.externalMusicLink.createMany({
    data: [
      {
        musicId: song1.id,
        platform: "Spotify",
        url: "https://open.spotify.com/",
      },
      {
        musicId: song1.id,
        platform: "YouTube Music",
        url: "https://music.youtube.com/",
      },
      {
        musicId: song2.id,
        platform: "Spotify",
        url: "https://open.spotify.com/",
      },
      {
        musicId: song3.id,
        platform: "Apple Music",
        url: "https://music.apple.com/",
      },
    ],
  });

  // -----------------------------------------------------
  // ALBUM
  // -----------------------------------------------------

  const album = await prisma.album.create({
    data: {
      title: "The Beginning",
      releaseDate: new Date("2026-10-15"),
      coverArt: "https://picsum.photos/seed/album-cover/1000/1000",
      description:
        "A collection of contemporary African sounds, personal stories and modern production.",
      published: true,
    },
  });

  await prisma.albumSong.createMany({
    data: [
      {
        albumId: album.id,
        musicId: song1.id,
        trackNo: 1,
      },
      {
        albumId: album.id,
        musicId: song2.id,
        trackNo: 2,
      },
      {
        albumId: album.id,
        musicId: song3.id,
        trackNo: 3,
      },
    ],
  });

  console.log("✓ Album created");

  // -----------------------------------------------------
  // VIDEOS
  // -----------------------------------------------------

  await prisma.video.createMany({
    data: [
      {
        title: "New Beginnings — Official Video",
        description:
          "The official visual experience for New Beginnings.",
        thumbnail: "https://picsum.photos/seed/video-1/1280/720",
        externalVideoUrl: "https://www.youtube.com/",
        featured: true,
        published: true,
      },
      {
        title: "Behind the Music",
        description:
          "A behind-the-scenes look at the creative process.",
        thumbnail: "https://picsum.photos/seed/video-2/1280/720",
        externalVideoUrl: "https://www.youtube.com/",
        featured: false,
        published: true,
      },
    ],
  });

  console.log("✓ Videos created");

  // -----------------------------------------------------
  // GALLERY
  // -----------------------------------------------------

  const gallery = await prisma.galleryAlbum.create({
    data: {
      title: "Live & Behind the Scenes",
      description:
        "Selected moments from performances, recording sessions and creative work.",
      coverImage: "https://picsum.photos/seed/gallery-cover/1200/800",
    },
  });

  await prisma.galleryImage.createMany({
    data: [
      {
        albumId: gallery.id,
        imageUrl: "https://picsum.photos/seed/gallery-1/1200/800",
        caption: "Live performance",
        order: 1,
      },
      {
        albumId: gallery.id,
        imageUrl: "https://picsum.photos/seed/gallery-2/1200/800",
        caption: "Studio session",
        order: 2,
      },
      {
        albumId: gallery.id,
        imageUrl: "https://picsum.photos/seed/gallery-3/1200/800",
        caption: "Behind the scenes",
        order: 3,
      },
      {
        albumId: gallery.id,
        imageUrl: "https://picsum.photos/seed/gallery-4/1200/800",
        caption: "Live event",
        order: 4,
      },
    ],
  });

  console.log("✓ Gallery created");

  // -----------------------------------------------------
  // EVENTS
  // -----------------------------------------------------

  await prisma.event.createMany({
    data: [
      {
        title: "Nairobi Live Session",
        description:
          "A live performance featuring new music and selected fan favourites.",
        eventDate: new Date("2026-10-20T19:00:00"),
        venue: "KICC",
        location: "Nairobi, Kenya",
        image: "https://picsum.photos/seed/event-1/1200/700",
        ticketUrl: null,
        published: true,
      },
      {
        title: "Acoustic Night",
        description:
          "An intimate acoustic performance and storytelling session.",
        eventDate: new Date("2026-11-14T18:30:00"),
        venue: "Nairobi Theatre",
        location: "Nairobi, Kenya",
        image: "https://picsum.photos/seed/event-2/1200/700",
        ticketUrl: null,
        published: true,
      },
    ],
  });

  console.log("✓ Events created");

  // -----------------------------------------------------
  // NEWS
  // -----------------------------------------------------

  await prisma.newsArticle.createMany({
    data: [
      {
        title: "A New Chapter Begins",
        slug: "a-new-chapter-begins",
        excerpt:
          "A new chapter of music, performances and creative projects begins.",
        content:
          "This marks the beginning of an exciting new chapter. New music, performances and creative projects are being prepared for audiences both locally and internationally.",
        featuredImage: "https://picsum.photos/seed/news-1/1200/700",
        published: true,
        publishedAt: new Date(),
      },
      {
        title: "New Music Coming Soon",
        slug: "new-music-coming-soon",
        excerpt:
          "New music is currently being prepared for release.",
        content:
          "New material is currently being developed and prepared for release. Follow the official channels for announcements and release updates.",
        featuredImage: "https://picsum.photos/seed/news-2/1200/700",
        published: true,
        publishedAt: new Date(),
      },
    ],
  });

  console.log("✓ News articles created");

  // -----------------------------------------------------
  // SAMPLE BOOKING REQUEST
  // -----------------------------------------------------

  await prisma.bookingRequest.create({
    data: {
      name: "Demo Client",
      email: "client@example.com",
      phone: "+254700000000",
      eventType: "Live Performance",
      eventDate: new Date("2026-12-10T18:00:00"),
      location: "Nairobi, Kenya",
      message:
        "This is a development booking request used to test the booking management interface.",
      status: BookingStatus.NEW,
    },
  });

  console.log("✓ Booking request created");

  console.log("");
  console.log("🎉 Database seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });