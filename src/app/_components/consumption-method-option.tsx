import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { consumptionMethodEnum } from "@/db/schema";

interface ConsumptionMethodOptionProps {
  slug: string;
  imageUrl: string;
  imageAlt: string;
  buttonText: string;
  option: (typeof consumptionMethodEnum.enumValues)[number];
}

const ConsumptionMethodOption = ({
  slug,
  imageUrl,
  imageAlt,
  buttonText,
  option,
}: ConsumptionMethodOptionProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-8 py-8">
        {/* aqui tem uma dica para fazer com que a imagem preencha todo o espaço da div sem perder tanta resolução. Basta passar o relative na div e a largura e altura. Na imagem passa o atributo fill pra preencher e a class object-contain */}
        <div className="relative h-[80px] w-[80px]">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-contain"
          />
        </div>

        {/* o asChild serve para que as estilizações do botão sejam aplicadas ao <Link/> porque não é interessante semanticamente ter um link dentro de um botão */}
        <Button variant={"secondary"} className="rounded-full" asChild>
          <Link href={`/${slug}/menu?consumptionMethod=${option}`}>
            {buttonText}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConsumptionMethodOption;
