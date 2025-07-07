import Image from "next/image";
import { notFound } from "next/navigation";

import { db } from "@/db/index";

import ConsumptionMethodOption from "./_components/consumption-method-option";

const RestaurantPage = async () => {
  const restaurant = await db.query.restaurant.findFirst();

  if (!restaurant) {
    return notFound();
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center px-6 pt-24">
      {/* Logo do restaurant */}
      <div className="flex flex-col items-center gap-2">
        <Image
          src={restaurant?.avatarImageUrl}
          alt={restaurant?.name}
          width={82}
          height={82}
        />

        <h2 className="font-semibold">{restaurant.name}</h2>
      </div>

      {/* Bem vindo */}
      <div className="space-y-2 pt-24 text-center">
        <h3 className="text-2xl font-semibold">Seja bem-vindo!</h3>

        <p className="opacity-55">
          Escolha como prefere aproveitar sua refeição. Estamos prontos para
          oferecer praticidade e sabor em cada detalhe!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-14">
        <ConsumptionMethodOption
          buttonText="Para comer aqui"
          imageAlt="Comer aqui"
          imageUrl="/dine_in.png"
          option="DINE_IN"
        />
        <ConsumptionMethodOption
          buttonText="Para levar"
          imageAlt="Para levar"
          imageUrl="/takeaway.png"
          option="TAKEAWAY"
        />
      </div>
    </div>
  );
};

export default RestaurantPage;
