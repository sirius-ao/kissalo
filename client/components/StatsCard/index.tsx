"use client";

import { ChartBar, TrendingDown, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../ui/card";

export interface IStats {
  title: string;
  value: number;
  oldValue: number;
  label: string;
  isCoin: boolean;
}

export function StarsCard({ data }: { data: IStats }) {
  const color = data?.value >= data.oldValue ? "text-green-500" : "text-red-500";
  return (
    <Card className="shadow-none rounded-sm p-3 gap-4">
      <header className="flex justify-between items-center ">
        <CardTitle>{data.title}</CardTitle>
        <ChartBar />
      </header>
      <h1 className="scroll-m-20  text-2xl font-extrabold tracking-tight text-balance text-start">
        {data.isCoin
          ? Number(data.value ?? 0).toLocaleString("pt") + ".00  kz"
          : data.value ?? 0}
      </h1>
      <CardContent className="p-0 flex justify-between">
        <span className=" flex gap-3">
          <div className="flex gap-2">
            <p className={`${color}`}>
              {color == "text-red-500" ? "-" : "+"}{" "}
              {data.isCoin
                ? Number(data.oldValue ?? 0).toLocaleString("pt") + ".00 kz"
                : data.oldValue ?? 0}{" "}
            </p>
            <p>nas últimas semanas</p>
          </div>
          {color == "text-green-500" ? (
            <TrendingUp className={`${color}`} />
          ) : (
            <TrendingDown className={`${color}`} />
          )}
        </span>
      </CardContent>
      <CardFooter className="p-0">
        <CardDescription>{data.label}</CardDescription>
      </CardFooter>
    </Card>
  );
}
