import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { PaymentAvatar } from "@/components/Payments";
import { bookingsMock } from "@/mocks/bookings";
import { IUser } from "@/types/interfaces";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import { verifyArrayDisponiblity } from "@/lib/utils";

export default function Reviews() {
  const context = useContext(UserContext);
  if (!context) return;
  const { user, setUser } = context;
  const [processing, setProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser>(user as IUser);

  if (!user) return;
  return (
    <div className="space-y-4">
      {verifyArrayDisponiblity(user.reviews) && user.reviews.length ? (
        <ul className="space-y-4">
          {user.reviews.map((r) => (
            <li key={r.id} className="rounded border p-3 flex flex-col gap-3">
              <i className="text-sm">" {r.comment} "</i>
              <div className="flex items-center gap-2">
                {Array.from({ length: r.rating }).map((item, idx) => (
                  <Star
                    key={idx}
                    fill="gold"
                    className="h-4 w-4 text-yellow-500"
                  />
                ))}{" "}
                {Array.from({ length: 5 - r.rating }).map((item, idx) => (
                  <Star key={idx} className="h-4 w-4 text-neutral-500" />
                ))}
              </div>
              <strong>Serviço</strong>
              <h1>{r.booking?.service.title}</h1>
              <small>{r.booking?.service.description}</small>
              <span className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: `${r.booking?.service.category.color}`,
                    }}
                  ></div>
                  <p>{r.booking?.service?.category.title}</p>
                </div>
                <small>
                  {String(r.booking?.service?.category?.description)}
                </small>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">Nenhuma avaliação registrada</p>
      )}
    </div>
  );
}
