"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, UserPlus, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";
import { Role as AuthRole } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Role, type Department } from "@/types";
import { usersService, type CreateUserData } from "@/services/users.service";
import { rolesService } from "@/services/roles.service";
import { departmentsService } from "@/services/departments.service";

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
  roleId: z.string().min(1, "Role is required"),
  departmentId: z.string().optional(),
  phone: z.string().optional(),
  hireDate: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

const steps = [
  { id: 1, title: "Basic Information", description: "User details" },
  { id: 2, title: "Role & Department", description: "Assign role and department" },
  { id: 3, title: "Review", description: "Confirm details" },
];

export default function AddUserPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const formData = watch();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [rolesData, departmentsData] = await Promise.all([
          rolesService.getRoles(),
          departmentsService.getDepartments(),
        ]);
        setRoles(rolesData);
        setDepartments(departmentsData);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unable to load form data";
        toast.error(errorMessage);
      }
    }
    void fetchData();
  }, []);

  const validateStep = async (step: number): Promise<boolean> => {
    if (step === 1) {
      return await trigger(["username", "email", "password", "fullName"]);
    } else if (step === 2) {
      return await trigger(["roleId"]);
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      const userData: CreateUserData = {
        username: data.username,
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        roleId: Number(data.roleId),
        departmentId: data.departmentId ? Number(data.departmentId) : undefined,
        phone: data.phone ?? undefined,
        hireDate: data.hireDate ?? undefined,
      };
      await usersService.createUser(userData);
      toast.success("User created successfully");
      void router.push("/users");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unable to create user";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRole = roles.find((r) => String(r.id) === formData.roleId);
  const selectedDepartment = departments.find((d) => String(d.id) === formData.departmentId);

  return (
    <AuthGuard allowedRoles={[AuthRole.ADMIN]}>
      <div className="min-h-screen p-6 flex flex-col items-center justify-start">
        <div className="w-full max-w-3xl">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <PageHeader
            title="Create New User"
            description="Add a new user to the system"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Users", href: "/users" },
              { label: "Add User" },
            ]}
          />

          {/* Step Indicator */}
          <div className="mb-8 mt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                        currentStep >= step.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted bg-background text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p
                        className={`text-sm font-medium ${
                          currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-4 transition-colors ${
                        currentStep > step.id ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{steps[currentStep - 1]?.title ?? ""}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username *</Label>
                          <Input
                            id="username"
                            placeholder="johndoe"
                            {...register("username")}
                            className={errors.username ? "border-destructive" : ""}
                          />
                          {errors.username && (
                            <p className="text-xs text-destructive">{errors.username.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            {...register("email")}
                            className={errors.email ? "border-destructive" : ""}
                          />
                          {errors.email && (
                            <p className="text-xs text-destructive">{errors.email.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">Password *</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                            className={errors.password ? "border-destructive" : ""}
                          />
                          {errors.password && (
                            <p className="text-xs text-destructive">{errors.password.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            placeholder="John Doe"
                            {...register("fullName")}
                            className={errors.fullName ? "border-destructive" : ""}
                          />
                          {errors.fullName && (
                            <p className="text-xs text-destructive">{errors.fullName.message}</p>
                          )}
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="phone">Phone (Optional)</Label>
                          <Input
                            id="phone"
                            placeholder="+1 234 567 8900"
                            {...register("phone")}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="roleId">Role *</Label>
                        <Select onValueChange={(value) => setValue("roleId", value)}>
                          <SelectTrigger className={errors.roleId ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={String(role.id)}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.roleId && (
                          <p className="text-xs text-destructive">{errors.roleId.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="departmentId">Department (Optional)</Label>
                        <Select onValueChange={(value) => setValue("departmentId", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={String(dept.id)}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hireDate">Hire Date (Optional)</Label>
                        <Input
                          id="hireDate"
                          type="date"
                          {...register("hireDate")}
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Username:</span>
                          <span className="text-sm font-medium">{formData.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <span className="text-sm font-medium">{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Full Name:</span>
                          <span className="text-sm font-medium">{formData.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Role:</span>
                          <span className="text-sm font-medium">{selectedRole?.name ?? "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Department:</span>
                          <span className="text-sm font-medium">
                            {selectedDepartment?.name ?? "-"}
                          </span>
                        </div>
                        {formData.phone && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Phone:</span>
                            <span className="text-sm font-medium">{formData.phone ?? "-"}</span>
                          </div>
                        )}
                        {formData.hireDate && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Hire Date:</span>
                            <span className="text-sm font-medium">
                              {new Date(formData.hireDate ?? "").toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                <div className="flex justify-between pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  {currentStep < steps.length ? (
                    <Button type="button" onClick={handleNext}>
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Create User
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}

