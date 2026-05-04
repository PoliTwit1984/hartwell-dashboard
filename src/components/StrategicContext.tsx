import type { DataSource } from "../data/hartwell";
import { WidgetHeader } from "./WidgetHeader";

type Props = {
  context: {
    q2OtdMandate: string;
    driverShortage: string;
    acmeExpansion: string;
    serviceNowRollout: string;
    pittsburghLease: string;
  };
  source?: DataSource;
  filterCustomer?: string | null;
};

export function StrategicContext({ context, source, filterCustomer }: Props) {
  const allItems = [
    { label: "Q2 OTD mandate", body: context.q2OtdMandate, customers: ["all"] },
    { label: "Driver shortage", body: context.driverShortage, customers: ["all", "Carbon Forge Industrial"] },
    { label: "Acme expansion", body: context.acmeExpansion, customers: ["all", "Acme Manufacturing"] },
    { label: "ServiceNow rollout", body: context.serviceNowRollout, customers: ["all"] },
    { label: "Pittsburgh lease", body: context.pittsburghLease, customers: ["all", "Threadway Apparel"] },
  ];
  const items = filterCustomer
    ? allItems.filter((i) => i.customers.includes(filterCustomer) || i.customers.includes("all-with-filter"))
    : allItems;

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <WidgetHeader
        title="Strategic Context"
        subtitle="Active operational pressures"
        source={source}
        filterLabel={filterCustomer}
      />
      <div className="space-y-3 mt-3">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-0.5">
              {item.label}
            </p>
            <p className="text-sm text-zinc-700 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
