import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Budget Wise" },
    { name: "description", content: "An ERP for budget management" },
  ];
};

export default function Index() {
  return (
    <div>
      <h1>Budget Wise</h1>
    </div>
  );
}
