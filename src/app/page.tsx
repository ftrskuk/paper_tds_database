import { FilterSidebar } from "@/components/dashboard/filter-sidebar"
import { ResultsTable } from "@/components/dashboard/results-table"
import { SearchBar } from "@/components/dashboard/search-bar"
import { ComparisonCart } from "@/components/dashboard/comparison-cart"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <SearchBar />
      </div>
      <div className="flex gap-6 h-full overflow-hidden">
        <FilterSidebar />
        <div className="flex-1 overflow-auto">
          <ResultsTable />
        </div>
      </div>
      <ComparisonCart />
    </div>
  )
}
