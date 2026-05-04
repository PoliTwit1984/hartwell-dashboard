type Props = {
  context: {
    q2OtdMandate: string;
    driverShortage: string;
    acmeExpansion: string;
    serviceNowRollout: string;
    pittsburghLease: string;
  };
};

export function StrategicContext({ context }: Props) {
  const items = [
    { label: "Q2 OTD mandate", body: context.q2OtdMandate },
    { label: "Driver shortage", body: context.driverShortage },
    { label: "Acme expansion", body: context.acmeExpansion },
    { label: "ServiceNow rollout", body: context.serviceNowRollout },
    { label: "Pittsburgh lease", body: context.pittsburghLease },
  ];

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <h3 className="text-sm font-semibold text-zinc-900 mb-1">Strategic Context</h3>
      <p className="text-xs text-zinc-500 mb-4">
        The active operational pressures behind the numbers.
      </p>
      <div className="space-y-3">
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
