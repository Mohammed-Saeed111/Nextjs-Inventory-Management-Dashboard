"use client";

import {
  ExpenseByCategorySummary,
  useGetExpensesByCategoryQuery,
} from "@/state/api";
import { useMemo, useState } from "react";
import Header from "@/app/(components)/Header";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { mockExpenses } from "@/state/mockData";

type AggregatedDataItem = {
  name: string;
  color?: string;
  amount: number;
};

type AggregatedData = {
  [category: string]: AggregatedDataItem;
};

// Fixed colors — no Math.random() to avoid hydration issues
const CATEGORY_COLORS: Record<string, string> = {
  Office: "#3B82F6",
  Salaries: "#10B981",
  Professional: "#F59E0B",
  Other: "#8B5CF6",
};
const getFallbackColor = (index: number) => {
  const fallbacks = ["#EF4444", "#EC4899", "#14B8A6", "#F97316"];
  return fallbacks[index % fallbacks.length];
};

const Expenses = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    data: expensesData,
    isLoading,
    isError,
  } = useGetExpensesByCategoryQuery();

  // Use mock data as fallback when API is unavailable
  const expenses = useMemo(
    () => (isError || !expensesData ? mockExpenses : expensesData),
    [expensesData, isError]
  );

  const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const aggregatedData: AggregatedDataItem[] = useMemo(() => {
    let colorIndex = 0;
    const filtered: AggregatedData = expenses
      .filter((data: ExpenseByCategorySummary) => {
        const matchesCategory =
          selectedCategory === "All" || data.category === selectedCategory;
        const dataDate = parseDate(data.date);
        const matchesDate =
          !startDate ||
          !endDate ||
          (dataDate >= startDate && dataDate <= endDate);
        return matchesCategory && matchesDate;
      })
      .reduce((acc: AggregatedData, data: ExpenseByCategorySummary) => {
        const amount = parseInt(data.amount);
        if (!acc[data.category]) {
          // Fix: use fixed color map instead of Math.random()
          acc[data.category] = {
            name: data.category,
            amount: 0,
            color:
              CATEGORY_COLORS[data.category] ||
              getFallbackColor(colorIndex++),
          };
        }
        acc[data.category].amount += amount;
        return acc;
      }, {});

    return Object.values(filtered);
  }, [expenses, selectedCategory, startDate, endDate]);

  const classNames = {
    label: "block text-sm font-medium text-gray-700",
    selectInput:
      "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
  };

  if (isLoading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="flex gap-4">
          <div className="w-1/3 h-64 bg-gray-100 rounded-lg"></div>
          <div className="flex-grow h-64 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-5">
        <Header name="Expenses" />
        <p className="text-sm text-gray-500">
          A visual representation of expenses over time.
        </p>
        {isError && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠ Backend offline — showing demo data
          </p>
        )}
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-1/3 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Filter by Category and Date
          </h3>
          <div className="space-y-4">
            {/* CATEGORY */}
            <div>
              <label htmlFor="category" className={classNames.label}>
                Category
              </label>
              <select
                id="category"
                name="category"
                className={classNames.selectInput}
                defaultValue="All"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>All</option>
                <option>Office</option>
                <option>Professional</option>
                <option>Salaries</option>
              </select>
            </div>
            {/* START DATE */}
            <div>
              <label htmlFor="start-date" className={classNames.label}>
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                name="start-date"
                className={classNames.selectInput}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            {/* END DATE */}
            <div>
              <label htmlFor="end-date" className={classNames.label}>
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                name="end-date"
                className={classNames.selectInput}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {/* SUMMARY */}
            {aggregatedData.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Summary</p>
                {aggregatedData.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm py-1">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      {item.name}
                    </span>
                    <span className="font-semibold">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* PIE CHART */}
        <div className="flex-grow bg-white shadow rounded-lg p-4 md:p-6">
          {aggregatedData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              No data for selected filters
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={aggregatedData}
                  cx="50%"
                  cy="50%"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="amount"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                >
                  {aggregatedData.map(
                    (entry: AggregatedDataItem, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === activeIndex ? "rgb(29, 78, 216)" : entry.color
                        }
                      />
                    )
                  )}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
