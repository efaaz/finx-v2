"use client";
import {
  Card,
  CardDescription,
  CardTitle,
  CardAction,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from "@/lib/api/auth";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: user, isPending, isError } = useCurrentUser();
  const router = useRouter();
      const handleLogout = () => {
      logout();
      router.replace("/login");
      }

  if (false) {
    return (
      <section>
        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Card className="w-full max-w-xs">
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full" />
            </CardContent>
          </Card>
          <Card className="w-full max-w-xs">
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full" />
            </CardContent>
          </Card>
          <Card className="w-full max-w-xs">
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full" />
            </CardContent>
          </Card>
          <Card className="w-full max-w-xs">
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full" />
            </CardContent>
          </Card>
          <Card className="w-full max-w-xs">
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full" />
            </CardContent>
          </Card>
          <Card className="w-full max-w-xs">
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full" />
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (false) {
    return <><h1 className="">Error</h1></>;
  }

  return (
    <main>
      <div className="flex items-center px-6 justify-between">
        <h1>Welcome, {user?.name ?? "User"}</h1>
        <Button
          onClick={() => handleLogout()}
          variant="destructive"
          className="hover:cursor-pointer"
        >
          Logout
        </Button>
      </div>
      <main className="flex-1">
        <div className="space-y-6 p-4 md:p-6">
          {/* Header */}
          <div>
            <h1 className="font-heading text-3xl">Overview</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Here's your financial overview for today.
            </p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {/* Total Balance */}
            <Card className="border-border/80 transition-colors hover:border-primary/30">
              <CardHeader>
                <CardDescription>Total Balance</CardDescription>

                <CardTitle className="font-sans text-2xl font-semibold tabular-nums">
                  ৳125,000.00
                </CardTitle>

                <CardAction>
                  <Badge variant="outline" className="gap-1">
                    <TrendingUp className="size-3.5" />
                    +12.5%
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardFooter className="flex-col bg-card items-start gap-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  Trending up this month
                  <TrendingUp className="size-4 text-success" />
                </div>

                <div className="text-sm text-muted-foreground">
                  Compared with last month
                </div>
              </CardFooter>
            </Card>

            {/* Total Expense */}
            <Card className="border-border/80 bg-card transition-colors hover:border-primary/30">
              <CardHeader>
                <CardDescription>Total Expense</CardDescription>

                <CardTitle className="font-sans text-2xl font-semibold tabular-nums">
                  ৳42,350.00
                </CardTitle>

                <CardAction>
                  <Badge variant="outline" className="gap-1">
                    <TrendingDown className="size-3.5" />
                    -8.2%
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardFooter className="flex-col bg-card items-start gap-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  Spending decreased
                  <TrendingDown className="size-4 text-success" />
                </div>

                <div className="text-sm text-muted-foreground">
                  Compared with last month
                </div>
              </CardFooter>
            </Card>

            {/* Today's Income */}
            <Card className="border-border/80 bg-card transition-colors hover:border-primary/30">
              <CardHeader>
                <CardDescription>Today's Income</CardDescription>

                <CardTitle className="font-sans text-2xl font-semibold tabular-nums">
                  ৳8,500.00
                </CardTitle>

                <CardAction>
                  <Badge variant="outline" className="gap-1">
                    <TrendingUp className="size-3.5" />
                    +12.5%
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardFooter className="flex-col bg-card items-start gap-1">
                <div className="text-sm font-medium">
                  Strong income this month
                </div>

                <div className="text-sm text-muted-foreground">
                  Compared with your daily average
                </div>
              </CardFooter>
            </Card>

            {/* Today's Expense */}
            <Card className="border-border/80 bg-card transition-colors hover:border-primary/30">
              <CardHeader>
                <CardDescription>Today's Expense</CardDescription>

                <CardTitle className="font-sans text-2xl font-semibold tabular-nums">
                  ৳2,450.00
                </CardTitle>

                <CardAction>
                  <Badge variant="outline" className="gap-1">
                    <TrendingDown className="size-3.5" />
                    -4.5%
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardFooter className="flex-col bg-card items-start gap-1">
                <div className="text-sm font-medium">
                  Spending is under control
                </div>

                <div className="text-sm text-muted-foreground">
                  Compared with yesterday
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </main>
  );
}
