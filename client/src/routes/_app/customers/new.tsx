import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { CustomersCreateForm } from "@/features/customers";

export const Route = createFileRoute('/_app/customers/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header>
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitcher />
        </div>
      </Header>
      <Main className="bg-muted/30">
        <div className="mb-6">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Link to="/customers" className="hover:text-foreground transition-colors">Khách hàng</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-foreground">Thêm mới</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Thêm khách hàng mới
          </h1>
          <p className="text-muted-foreground mt-1">
            Nhập thông tin chi tiết để thêm khách hàng mới vào hệ thống.
          </p>
        </div>
        <div className="max-w-3xl">
          <CustomersCreateForm />
        </div>
      </Main>
    </>
  )
}
