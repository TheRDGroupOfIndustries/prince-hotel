import { MapPin } from "lucide-react";
import Image from "next/image";

interface PlaceCardProps {
  img: string;
  title: string;
  description: string;
  distance: string;
}
function PlaceCard({ img, title, description, distance }: PlaceCardProps) {
  return (
    <div className="border rounded-2xl p-4 shadow-md">
      <Image
        src={img}
        alt={title}
        width={600}
        height={400}
        className="w-full h-64 object-cover rounded-xl mb-4"
      />
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-lg leading-relaxed ml-8">{description}</p>
      <div className="flex gap-2 items-center">
        <MapPin />
        <p className="text-lg font-medium">{distance}</p>
      </div>
    </div>
  );
}

export default function PlacesToVisitPage() {
  const places = [
    {
      img: "/images/Kashi.png",
      title: "1. Kashi Vishwanath Temple",
      description:
        "Dedicated to Lord Shiva, this temple is one of the 12 Jyotirlingas. Early mornings are the best time for darshan. VIP Darshan available.",
      distance: "Approx. 6 km from Prince Diamond Hotel.",
    },
    {
      img: "/images/Dashashwamedh.png",
      title: "2. Dashashwamedh Ghat",
      description:
        "Famous for its evening Ganga Aarti — a breathtaking ritual of lights, chants, and devotion. Boat rides available for the best view.",
      distance: "Approx. 5 km from Prince Diamond Hotel.",
    },
    {
      img: "/images/assi-ghat.png",
      title: "3. Assi Ghat",
      description:
        "Perfect for morning walks, sunrise views, yoga, and peaceful boat rides.",
      distance: "Approx. 7 km from Prince Diamond Hotel.",
    },
    {
      img: "/images/sarnath.png",
      title: "4. Sarnath",
      description:
        "One of Buddhism’s most important sites with Dhamek Stupa, Ashokan Pillar, and Sarnath Museum.",
      distance: "Approx. 10 km from Prince Diamond Hotel.",
    },
    {
      img: "/images/manikarnika-ghat.png",
      title: "5. Manikarnika Ghat",
      description:
        "The sacred cremation ghat representing the Hindu belief in liberation (moksha).",
      distance: "Approx. 5.5 km from Prince Diamond Hotel.",
    },
    {
      img: "/images/bhu.png",
      title: "6. Banaras Hindu University (BHU)",
      description:
        "One of Asia’s largest universities, also home to the New Vishwanath Temple.",
      distance: "Approx. 8 km from Prince Diamond Hotel.",
    },
    {
      img: "/images/ramnagar-fort.png",
      title: "7. Ramnagar Fort",
      description:
        "A royal fort featuring vintage cars, manuscripts, and regal artifacts.",
      distance: "Approx. 12 km from Prince Diamond Hotel.",
    },
    {
      img: "/images/godowlia.png",
      title: "8. Godowlia Market",
      description:
        "Famous market for Banarasi sarees, handicrafts, brassware, and snacks.",
      distance: "Approx. 4 km from Prince Diamond Hotel.",
    },
    {
      img: "/images/tulsi-manas-mandir.png",
      title: "9. Tulsi Manas Mandir",
      description: "White marble temple with Ramcharitmanas inscriptions.",
      distance: "Approx. 8.5 km from Prince Diamond Hotel.",
    },
    {
      img: "/images/kaal-bhairav.png",
      title: "10. Kaal Bhairav Temple",
      description:
        "One of the oldest temples dedicated to Lord Kaal Bhairav — the fierce guardian of Kashi.",
      distance: "Approx. 5 km from Prince Diamond Hotel.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 md:p-12 lg:p-20">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center">
        Places to Visit in <span className="text-blue-500">Varanasi</span> - The Spiritual Heart of India
      </h1>

      <p className="text-lg leading-relaxed mb-8">
        Varanasi is one of the world’s oldest living cities — where spirituality
        meets centuries of culture, art, and devotion.
      </p>

      <p className="text-lg leading-relaxed mb-10">
        Here are the top 10 places you simply can’t miss during your visit!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {places.map((place, index) => (
          <PlaceCard key={index} {...place} />
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-100 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">
          Stay Close to the Soul of Varanasi
        </h2>
        <p className="text-lg leading-relaxed mb-2">
          Stay at Prince Diamond Hotel for a peaceful and convenient Varanasi
          experience.
        </p>
        <p className="text-lg leading-relaxed mb-2">
          Contact us and leave all your travel worries behind!
        </p>
        <p className="mt-3 text-lg font-medium">
          Address: 217/3 F, DLW Rd, Dakshini, Bajardih, Varanasi
        </p>
        <p className="mt-1 text-lg font-medium">Contact: +91 9695981555</p>
      </div>

      <p className="mt-10 text-lg leading-relaxed">
        Varanasi isn’t just a city — it’s an experience.
      </p>

      <p className="mt-4 text-lg font-semibold">
        Get ready to explore the magic of Varanasi — one ghat at a time.
      </p>
    </div>
  );
}
