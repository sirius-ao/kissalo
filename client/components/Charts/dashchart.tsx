"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type ServiceStat = {
  slug: string;
  name: string;
  total: number;
};

type TimelineStat = {
  date: string;
  values: Record<string, number>;
};

type DashboardStatsResponse = {
  range: "LAST_7_DAYS" | "LAST_30_DAYS" | "LAST_90_DAYS";
  services: ServiceStat[];
  timeline: TimelineStat[];
};

const services = [
  { slug: "canalizacao", name: "Canalização" },
  { slug: "eletricidade", name: "Eletricidade" },
  { slug: "beleza", name: "Beleza" },
  { slug: "limpeza", name: "Limpeza" },
  { slug: "manutencao", name: "Manutenção" },
];

const serviceRanges: Record<string, [number, number]> = {
  canalizacao: [20, 60],
  eletricidade: [15, 50],
  beleza: [10, 45],
  limpeza: [18, 55],
  manutencao: [12, 48],
};

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateDates = (days: number) =>
  Array.from({ length: days }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().split("T")[0];
  });

const generateTimeline = (days: number): TimelineStat[] => {
  return generateDates(days).map((date) => {
    const values: Record<string, number> = {};

    services.forEach((service) => {
      const [min, max] = serviceRanges[service.slug];
      values[service.slug] = randomBetween(min, max);
    });

    return { date, values };
  });
};

const calculateTotals = (timeline: TimelineStat[]): ServiceStat[] => {
  const totals: Record<string, number> = {};

  timeline.forEach((day) => {
    Object.entries(day.values).forEach(([slug, value]) => {
      totals[slug] = (totals[slug] || 0) + value;
    });
  });

  return services.map((service) => ({
    slug: service.slug,
    name: service.name,
    total: totals[service.slug] || 0,
  }));
};

const createDashboardMock = (
  range: DashboardStatsResponse["range"],
  days: number
): DashboardStatsResponse => {
  const timeline = generateTimeline(days);

  return {
    range,
    services: calculateTotals(timeline),
    timeline,
  };
};

const dashboardMocks = {
  LAST_7_DAYS: createDashboardMock("LAST_7_DAYS", 7),
  LAST_30_DAYS: createDashboardMock("LAST_30_DAYS", 30),
  LAST_90_DAYS: createDashboardMock("LAST_90_DAYS", 90),
};

/* =====================================================
   COMPONENTE
===================================================== */
export default function DashBoardProfissional() {
  const [range, setRange] =
    useState<keyof typeof dashboardMocks>("LAST_30_DAYS");

  const dashboardData = dashboardMocks[range];
  const chartData = dashboardData.timeline.map((item) => ({
    date: item.date,
    ...item.values,
  }));
  const softHslColors = [
    "rgba(99, 102, 241, 0.2)", // indigo
    "rgba(34, 197, 94, 0.2)", // green
    "rgba(168, 85, 247, 0.2)", // purple
    "rgba(249, 115, 22, 0.2)", // orange
    "rgba(239, 68, 68, 0.2)",
  ];

  const chartConfig: ChartConfig = dashboardData.services.reduce(
    (acc, service, index) => {
      acc[service.slug] = {
        label: service.name,
        color: softHslColors[index % softHslColors.length],
      };
      return acc;
    },
    {} as ChartConfig
  );

  return (
    <section className="space-y-4">
      <Card className="rounded-sm shadow-none">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Estatísticas de Serviços</CardTitle>
            <CardDescription>
              Quantidade de serviços prestados por período
            </CardDescription>
          </div>

          <Select value={range} onValueChange={(v) => setRange(v as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LAST_7_DAYS">Últimos 7 dias</SelectItem>
              <SelectItem value="LAST_30_DAYS">Últimos 30 dias</SelectItem>
              <SelectItem value="LAST_90_DAYS">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="pt-4">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <AreaChart data={chartData}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })
                }
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />

              {dashboardData.services.map((service) => (
                <Area
                  key={service.slug}
                  dataKey={service.slug}
                  type="natural"
                  stackId="a"
                  stroke={`var(--color-${service.slug})`}
                  fill={`var(--color-${service.slug})`}
                />
              ))}

              <ChartLegend content={<ChartLegendContent payload={[]} />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
}
