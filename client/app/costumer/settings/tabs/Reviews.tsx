import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export default function Reviews() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4 flex gap-4">
            <Avatar>
              <AvatarImage src={`https://i.pravatar.cc/150?img=${i}`} />
              <AvatarFallback>C</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    size={14}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              <p className="text-sm mt-1">Excelente serviço, recomendo!</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
