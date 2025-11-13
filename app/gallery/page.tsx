
// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { X } from "lucide-react";

// export default function GalleryPage() {
//   const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
//   const [isVideo, setIsVideo] = useState(false);
//   const [showAllPhotos, setShowAllPhotos] = useState(false);
//   const [showAllVideos, setShowAllVideos] = useState(false);

//   const photos = [
//     "/images/gallery/DJI_20250913175908_0788_D.jpg",
//     "/images/gallery/DJI_20250913175928_0789_D.jpg",
//     "/images/gallery/DJI_20250913175945_0790_D.jpg",
//     "/images/gallery/DJI_20250913180008_0791_D.jpg",
//     "/images/gallery/DJI_20250913180032_0792_D.jpg",
//     "/images/gallery/DJI_20250913180055_0794_D.jpg",
//     "/images/gallery/DSC_1305-Edit-2.jpg",
//     "/images/gallery/DSC_1311-HDR.jpg",
//     "/images/gallery/DSC_1314-HDR.jpg",
//     "/images/gallery/DSC_1317-HDR.jpg",
//     "/images/gallery/DSC_1320-HDR.jpg",
//     "/images/gallery/DSC_1326-HDR.jpg",
//     "/images/gallery/DSC_1330-Edit.jpg",
//     "/images/gallery/DSC_1332-HDR-3.jpg",
//     "/images/gallery/DSC_1332-HDR-3-Edit.jpg",
//     "/images/gallery/DSC_1338-HDR-2.jpg",
//     "/images/gallery/DSC_1344-HDR-2.jpg",
//     "/images/gallery/DSC_1363.jpg",
//     "/images/gallery/DSC_1364.jpg",
//     "/images/gallery/DSC_1365.jpg",
//     "/images/gallery/DSC_1380-HDR.jpg",
//     "/images/gallery/DSC_1383-HDR.jpg",
//     "/images/gallery/DSC_1386-HDR-2.jpg",
//     "/images/gallery/DSC_1389-HDR-2.jpg",
//     "/images/gallery/DSC_1392-HDR-2.jpg",
//     "/images/gallery/DSC_1410-HDR-2-Edit.jpg",
//     "/images/gallery/DSC_1434-Edit.jpg",
//     "/images/gallery/DSC_1444-Edit.jpg",
//     "/images/gallery/DSC_1456-Edit.jpg",
//     "/images/gallery/DSC_1480-HDR-2.jpg",
//     "/images/gallery/DSC_1486.jpg",
//     "/images/gallery/DSC_1489-HDR-2.jpg",
//     "/images/gallery/DSC_1492.jpg",
//     "/images/gallery/DSC_1501-HDR-2.jpg",
//     "/images/gallery/DSC_1504-HDR-2.jpg",
//     "/images/gallery/DSC_1510-HDR.jpg",
//     "/images/gallery/DSC_1530.jpg",
//   ];

// //   const videos = [
// //     "/videos/hotel-tour.mp4",
// //     "/videos/room-view.mp4",
// //     "/videos/pool-area.mp4",
// //     "/videos/restaurant.mp4",
// //     "/videos/hall-tour.mp4",
// //   ];

//   const handleOpen = (src: string, video = false) => {
//     setSelectedMedia(src);
//     setIsVideo(video);
//   };

//   const handleClose = () => {
//     setSelectedMedia(null);
//     setIsVideo(false);
//   };

//   const visiblePhotos = showAllPhotos ? photos : photos.slice(0, 8);
// //   const visibleVideos = showAllVideos ? videos : videos.slice(0, 3);

//   return (
//     <main className="min-h-screen bg-gray-50 pt-16 pb-16 px-4 sm:px-6 lg:px-20">
//       {/* Header */}
//       <div className="text-center mb-12">
//         <h1 className="text-4xl font-bold text-gray-900 mb-3">
//           Hotel Prince Diamond <span className="text-blue-600">Gallery</span>
//         </h1>
//         <p className="text-gray-600 max-w-2xl mx-auto">
//           Discover the elegance, comfort, and luxury of Hotel Prince Diamond
//           through our curated collection of photos and videos.
//         </p>
//       </div>

//       {/* Videos Section */}
//       {/* <section className="max-w-6xl mx-auto mb-16">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
//           Our Videos
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {visibleVideos.map((src, index) => (
//             <div
//               key={index}
//               onClick={() => handleOpen(src, true)}
//               className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer"
//             >
//               <video
//                 src={src}
//                 muted
//                 loop
//                 playsInline
//                 preload="none"
//                 className="object-cover w-full h-64 group-hover:scale-110 transition-transform duration-300"
//               />
//               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm font-medium">
//                 ▶ Play Video
//               </div>
//             </div>
//           ))}
//         </div>

//         {!showAllVideos && videos.length > 3 && (
//           <div className="text-center mt-8">
//             <button
//               onClick={() => setShowAllVideos(true)}
//               className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
//             >
//               Show More Videos
//             </button>
//           </div>
//         )}
//       </section> */}

//       {/* Photos Section */}
//       <section className="max-w-6xl mx-auto">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
//           Our Photos
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {visiblePhotos.map((src, index) => (
//             <div
//               key={index}
//               onClick={() => handleOpen(src)}
//               className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer"
//             >
//               <Image
//                 src={src}
//                 alt={`Hotel Prince Diamond photo ${index + 1}`}
//                 width={600}
//                 height={400}
//                 className="object-cover w-full h-64 group-hover:scale-110 transition-transform duration-300"
//               />
//               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm font-medium">
//                 View Photo
//               </div>
//             </div>
//           ))}
//         </div>

//         {!showAllPhotos && photos.length > 8 && (
//           <div className="text-center mt-8">
//             <button
//               onClick={() => setShowAllPhotos(true)}
//               className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
//             >
//               Show More Photos
//             </button>
//           </div>
//         )}
//       </section>

//       {/* Lightbox (Fullscreen View) */}
//       {selectedMedia && (
//         <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
//           <button
//             onClick={handleClose}
//             className="absolute top-6 right-6 text-white bg-black/40 p-2 rounded-full hover:bg-black/70 transition"
//           >
//             <X className="w-6 h-6" />
//           </button>

//           <div className="max-w-6xl w-full flex justify-center items-center">
//             {isVideo ? (
//               <video
//                 src={selectedMedia}
//                 controls
//                 autoPlay
//                 className="max-h-[90vh] rounded-xl shadow-lg"
//               />
//             ) : (
//               <Image
//                 src={selectedMedia}
//                 alt="Enlarged media"
//                 width={1000}
//                 height={700}
//                 className="rounded-xl object-contain max-h-[90vh]"
//               />
//             )}
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }



"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function GalleryPage() {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  const photos = useMemo(
    () => [
      // "/images/gallery/DJI_20250913175908_0788_D.jpg",
      // "/images/gallery/DJI_20250913175928_0789_D.jpg",
      // "/images/gallery/DJI_20250913175945_0790_D.jpg",
      // "/images/gallery/DJI_20250913180008_0791_D.jpg",
      // "/images/gallery/DJI_20250913180032_0792_D.jpg",
      // "/images/gallery/DJI_20250913180055_0794_D.jpg",
      "/images/gallery/DSC_1305-Edit-2.jpg",
      "/images/gallery/DSC_1311-HDR.jpg",
      "/images/gallery/DSC_1314-HDR.jpg",
      "/images/gallery/DSC_1317-HDR.jpg",
      "/images/gallery/DSC_1320-HDR.jpg",
      "/images/gallery/DSC_1326-HDR.jpg",
      "/images/gallery/DSC_1330-Edit.jpg",
      "/images/gallery/DSC_1332-HDR-3.jpg",
      "/images/gallery/DSC_1338-HDR-2.jpg",
      "/images/gallery/DSC_1344-HDR-2.jpg",
      "/images/gallery/DSC_1363.jpg",
      "/images/gallery/DSC_1364.jpg",
      "/images/gallery/DSC_1365.jpg",
      "/images/gallery/DSC_1380-HDR.jpg",
      "/images/gallery/DSC_1383-HDR.jpg",
      "/images/gallery/DSC_1386-HDR-2.jpg",
      "/images/gallery/DSC_1389-HDR-2.jpg",
      "/images/gallery/DSC_1392-HDR-2.jpg",
      "/images/gallery/DSC_1410-HDR-2-Edit.jpg",
      "/images/gallery/DSC_1434-Edit.jpg",
      "/images/gallery/DSC_1444-Edit.jpg",
      "/images/gallery/DSC_1456-Edit.jpg",
      "/images/gallery/DSC_1480-HDR-2.jpg",
      "/images/gallery/DSC_1486.jpg",
      "/images/gallery/DSC_1489-HDR-2.jpg",
      "/images/gallery/DSC_1492.jpg",
      "/images/gallery/DSC_1501-HDR-2.jpg",
      "/images/gallery/DSC_1504-HDR-2.jpg",
      "/images/gallery/DSC_1510-HDR.jpg",
      "/images/gallery/DSC_1530.jpg",
    ],
    []
  );

  const visiblePhotos = photos.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, photos.length));
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-10 pb-16 px-4 sm:px-6 lg:px-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Hotel Prince Diamond <span className="text-blue-600">Gallery</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the elegance, comfort, and luxury of Hotel Prince Diamond
          through our curated collection of photos.
        </p>
      </div>

      {/* Photos Section */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Our Photos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {visiblePhotos.map((src, index) => (
            <div
              key={src}
              onClick={() => setSelectedMedia(src)}
              className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer"
            >
              <Image
                src={src}
                alt={`Hotel Prince Diamond photo ${index + 1}`}
                width={600}
                height={400}
                loading="lazy"
                className="object-cover w-full h-64 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm font-medium">
                View Photo
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {visibleCount < photos.length && (
          <div className="text-center mt-10">
            <button
              onClick={handleShowMore}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Show More Photos
            </button>
          </div>
        )}
      </section>

      {/* Lightbox (Fullscreen View) */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 text-white bg-black/40 p-2 rounded-full hover:bg-black/70 transition"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-6xl w-full flex justify-center items-center">
            <Image
              src={selectedMedia}
              alt="Enlarged media"
              width={1000}
              height={700}
              className="rounded-xl object-contain max-h-[90vh]"
              priority
            />
          </div>
        </div>
      )}
    </main>
  );
}
